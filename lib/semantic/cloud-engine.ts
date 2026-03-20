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

      const best = candidates.sort((a, b) => b.score - a.score)[0];
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
  const response = await fetch("https://api.together.xyz/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${appConfig.togetherApiKey}`
    },
    body: JSON.stringify({
      model: appConfig.togetherChatModel,
      temperature: 0.2,
      messages: [
        {
          role: "system",
          content:
            "You are a comparative philosophy research engine. Return strict JSON only. Keep explanations concise, source-grounded, and avoid claiming traditions are identical."
        },
        {
          role: "user",
          content: JSON.stringify({
            prompt,
            pairs: pairs.map((pair) => ({
              key: `${pair.primary.id}::${pair.counterpart.id}`,
              westernLike: pair.primary.tradition === "western" ? pair.primary : pair.counterpart,
              easternLike: pair.primary.tradition === "eastern" ? pair.primary : pair.counterpart,
              sharedConcepts: pair.sharedConcepts.map((concept) => concept.label)
            })),
            metrics: metrics.map((metric) => ({
              id: metric.id,
              label: metric.label,
              percentage: metric.percentage
            })),
            format: {
              summary: "string",
              pairExplanations: {
                "<pairKey>": "one short paragraph"
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
