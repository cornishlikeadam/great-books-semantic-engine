import { appConfig, featureFlags } from "@/lib/config";
import { metricDefinitions, passages } from "@/lib/semantic/data";
import { buildGraph, buildLocalAnalysis, buildMetricResults } from "@/lib/semantic/local-engine";
import type {
  AnalysisResult,
  Focus,
  MetricResult,
  PairingResult,
  PassageRecord
} from "@/lib/semantic/types";

const embeddingCache = new Map<string, number[]>();

interface TogetherUsage {
  prompt_tokens?: number;
  completion_tokens?: number;
  total_tokens?: number;
}

interface TogetherChatResult {
  summary: string;
  pairExplanations: Record<string, string>;
  metricExplanations: Record<string, string>;
  usage: TogetherUsage;
}

export async function buildAnalysis(prompt: string, focus: Focus, depth: number): Promise<AnalysisResult> {
  const fallback = buildLocalAnalysis(prompt, focus, depth);

  if (!featureFlags.togetherEnabled) {
    return fallback;
  }

  try {
    const queryEmbedding = await getEmbedding(prompt);
    const primaryPool =
      focus === "all" ? passages : passages.filter((passage) => passage.tradition === focus);

    const rankedPrimary = await Promise.all(
      primaryPool.map(async (passage) => ({
        passage,
        embedding: await getPassageEmbedding(passage),
        score: cosineSimilarity(queryEmbedding, await getPassageEmbedding(passage))
      }))
    );

    const primary = rankedPrimary.sort((a, b) => b.score - a.score).slice(0, depth);

    const usedCounterpartIds = new Set<string>();
    const pairs: PairingResult[] = [];
    for (const entry of primary) {
      const candidatePool = passages.filter((passage) => passage.tradition !== entry.passage.tradition);
      const candidates = await Promise.all(
        candidatePool.map(async (candidate) => {
          const candidateEmbedding = await getPassageEmbedding(candidate);
          return {
            passage: candidate,
            score:
              cosineSimilarity(entry.embedding, candidateEmbedding) * 0.7 +
              cosineSimilarity(queryEmbedding, candidateEmbedding) * 0.3
          };
        })
      );

      const rankedCandidates = candidates.sort((a, b) => b.score - a.score);
      const best =
        rankedCandidates.find((candidate) => !usedCounterpartIds.has(candidate.passage.id)) ||
        rankedCandidates[0];
      usedCounterpartIds.add(best.passage.id);

      pairs.push({
        primary: entry.passage,
        primaryScore: clamp(entry.score, 0, 0.99),
        counterpart: best.passage,
        counterpartScore: clamp(best.score, 0, 0.99),
        sharedConcepts: fallback.pairs.find((pair) => pair.primary.id === entry.passage.id)?.sharedConcepts || [],
        explanation: fallback.pairs.find((pair) => pair.primary.id === entry.passage.id)?.explanation || ""
      });
    }

    const metricEmbeddingResults = await buildMetricPercentages(queryEmbedding, pairs);
    const graph = buildGraph(metricEmbeddingResults, pairs);
    const chatResult = await getStructuredExplanations(prompt, pairs, metricEmbeddingResults);

    const metrics: MetricResult[] = metricEmbeddingResults.map((metric) => ({
      ...metric,
      explanation: chatResult.metricExplanations[metric.id] || metric.explanation
    }));

    const enrichedPairs = pairs.map((pair) => ({
      ...pair,
      explanation:
        chatResult.pairExplanations[`${pair.primary.id}::${pair.counterpart.id}`] || pair.explanation
    }));

    const promptTokens = chatResult.usage.prompt_tokens || fallback.usage.promptTokens;
    const completionTokens = chatResult.usage.completion_tokens || fallback.usage.completionTokens;
    const totalTokens =
      chatResult.usage.total_tokens || promptTokens + completionTokens || fallback.usage.totalTokens;

    return {
      prompt,
      focus,
      depth,
      pairs: enrichedPairs,
      metrics,
      summary: chatResult.summary || fallback.summary,
      graph,
      provider: {
        mode: "together",
        chatModel: appConfig.togetherChatModel,
        embedModel: appConfig.togetherEmbedModel
      },
      usage: {
        promptTokens,
        completionTokens,
        totalTokens,
        remainingFreeQueries: null,
        plan: "cloud"
      }
    };
  } catch {
    return fallback;
  }
}

async function buildMetricPercentages(
  queryEmbedding: number[],
  pairs: PairingResult[]
): Promise<MetricResult[]> {
  const pairEmbeddings = await Promise.all(
    pairs.flatMap((pair) => [getPassageEmbedding(pair.primary), getPassageEmbedding(pair.counterpart)])
  );
  const aggregate = averageEmbeddings([queryEmbedding, ...pairEmbeddings]);

  const raw = await Promise.all(
    metricDefinitions.map(async (metric) => ({
      metric,
      value: cosineSimilarity(aggregate, await getMetricEmbedding(metric.prompt))
    }))
  );

  const total = raw.reduce((sum, entry) => sum + Math.max(entry.value, 0.0001), 0) || 1;
  const percentages = raw.map((entry) => Math.round((Math.max(entry.value, 0.0001) / total) * 100));
  const delta = 100 - percentages.reduce((sum, value) => sum + value, 0);
  if (percentages.length) percentages[0] += delta;

  const localMetricFallback = buildMetricResults({}, pairs);

  return raw.map((entry, index) => ({
    id: entry.metric.id,
    label: entry.metric.label,
    description: entry.metric.description,
    percentage: percentages[index] || 0,
    color: entry.metric.color,
    explanation: localMetricFallback.find((metric) => metric.id === entry.metric.id)?.explanation || ""
  }));
}

async function getStructuredExplanations(
  prompt: string,
  pairs: PairingResult[],
  metrics: MetricResult[]
): Promise<TogetherChatResult> {
  const promptSignals = extractPromptSignals(prompt);
  const authorSet = [...new Set(pairs.flatMap((pair) => [pair.primary.author, pair.counterpart.author]))];

  const response = await fetch("https://api.together.xyz/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${appConfig.togetherApiKey}`
    },
    body: JSON.stringify({
      model: appConfig.togetherChatModel,
      temperature: 0.45,
      top_p: 0.9,
      messages: [
        {
          role: "system",
          content: [
            "You are a comparative philosophy research engine writing for academic researchers.",
            "Return strict JSON only, with no markdown fences or commentary.",
            "Every pair explanation must sound distinct from the others and must remain grounded in the supplied passages only.",
            "For each pair explanation, write exactly two sentences: sentence one names the precise conceptual hinge; sentence two names a tension, asymmetry, or limit so the traditions are not collapsed into identity.",
            "Vary sentence openings across pairs.",
            "Forbidden phrases: 'cluster around', 'pairing stays legible', 'conceptual pressure points', 'both traditions say', 'similar in many ways'.",
            "The summary must be two sentences and should restate the user's exact question in a more precise way before naming the most interesting bridge or divergence in the retrieved set.",
            "Each metric explanation must be one sentence that ties the percentage to named authors or works from this exact retrieval run."
          ].join(" ")
        },
        {
          role: "user",
          content: JSON.stringify({
            prompt,
            promptSignals,
            retrievedAuthors: authorSet,
            pairs: pairs.map((pair) => ({
              key: `${pair.primary.id}::${pair.counterpart.id}`,
              primary: {
                author: pair.primary.author,
                work: pair.primary.work,
                section: pair.primary.section,
                tradition: pair.primary.tradition,
                original: pair.primary.original || null,
                translation: pair.primary.translation,
                note: pair.primary.note,
                keywords: pair.primary.keywords
              },
              counterpart: {
                author: pair.counterpart.author,
                work: pair.counterpart.work,
                section: pair.counterpart.section,
                tradition: pair.counterpart.tradition,
                original: pair.counterpart.original || null,
                translation: pair.counterpart.translation,
                note: pair.counterpart.note,
                keywords: pair.counterpart.keywords
              },
              primaryScore: Number(pair.primaryScore.toFixed(3)),
              counterpartScore: Number(pair.counterpartScore.toFixed(3)),
              sharedConcepts: pair.sharedConcepts.map((concept) => concept.label),
              fallbackSeed: pair.explanation
            })),
            metrics: metrics.map((metric) => ({
              id: metric.id,
              label: metric.label,
              percentage: metric.percentage,
              description: metric.description
            })),
            format: {
              summary: "two sentences",
              pairExplanations: {
                "<pairKey>": "two sentences"
              },
              metricExplanations: {
                "<metricId>": "one sentence"
              }
            }
          })
        }
      ]
    })
  });

  if (!response.ok) throw new Error(`Together chat failed with ${response.status}`);
  const payload = await response.json();
  const text = payload.choices?.[0]?.message?.content || "{}";
  const usage: TogetherUsage = payload.usage || {};
  const parsed = parseJsonObject(text);

  return {
    summary: parsed.summary || "",
    pairExplanations: parsed.pairExplanations || {},
    metricExplanations: parsed.metricExplanations || {},
    usage
  };
}

async function getPassageEmbedding(passage: PassageRecord) {
  return getEmbedding(
    [passage.author, passage.work, passage.section, passage.translation, passage.original || "", passage.note].join(
      " "
    )
  );
}

async function getMetricEmbedding(text: string) {
  return getEmbedding(text);
}

async function getEmbedding(text: string): Promise<number[]> {
  const cacheKey = `${appConfig.togetherEmbedModel}:${text}`;
  const cached = embeddingCache.get(cacheKey);
  if (cached) return cached;

  const response = await fetch("https://api.together.xyz/v1/embeddings", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${appConfig.togetherApiKey}`
    },
    body: JSON.stringify({
      model: appConfig.togetherEmbedModel,
      input: text
    })
  });

  if (!response.ok) throw new Error(`Together embeddings failed with ${response.status}`);
  const payload = await response.json();
  const embedding = payload.data?.[0]?.embedding;
  if (!Array.isArray(embedding)) throw new Error("Together embeddings response missing embedding");

  embeddingCache.set(cacheKey, embedding);
  return embedding;
}

function averageEmbeddings(vectors: number[][]) {
  if (!vectors.length) return [];
  const length = vectors[0].length;
  const output = new Array<number>(length).fill(0);

  vectors.forEach((vector) => {
    for (let index = 0; index < length; index += 1) {
      output[index] += vector[index] || 0;
    }
  });

  return output.map((value) => value / vectors.length);
}

function cosineSimilarity(left: number[], right: number[]) {
  if (!left.length || !right.length || left.length !== right.length) return 0;
  let dot = 0;
  let leftMagnitude = 0;
  let rightMagnitude = 0;

  for (let index = 0; index < left.length; index += 1) {
    dot += left[index] * right[index];
    leftMagnitude += left[index] * left[index];
    rightMagnitude += right[index] * right[index];
  }

  if (!leftMagnitude || !rightMagnitude) return 0;
  return dot / (Math.sqrt(leftMagnitude) * Math.sqrt(rightMagnitude));
}

function parseJsonObject(text: string): Record<string, any> {
  try {
    return JSON.parse(text);
  } catch {
    const match = text.match(/\{[\s\S]*\}/);
    if (!match) return {};
    try {
      return JSON.parse(match[0]);
    } catch {
      return {};
    }
  }
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function extractPromptSignals(prompt: string) {
  return Array.from(
    new Set(
      prompt
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, " ")
        .split(/\s+/)
        .filter((token) => token.length > 3)
    )
  ).slice(0, 8);
}
