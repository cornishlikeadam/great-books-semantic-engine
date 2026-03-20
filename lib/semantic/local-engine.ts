import {
  conceptDefinitions,
  corpusIndex,
  metricDefinitions,
  passages
} from "@/lib/semantic/data";
import type {
  AnalysisResult,
  ConceptDefinition,
  Focus,
  GraphEdge,
  GraphNode,
  InternalConceptId,
  MetricDefinition,
  MetricResult,
  PairingResult,
  PassageRecord,
  Vector
} from "@/lib/semantic/types";

const STOP_WORDS = new Set([
  "a",
  "all",
  "an",
  "and",
  "are",
  "as",
  "at",
  "across",
  "about",
  "canon",
  "compare",
  "counterparts",
  "discuss",
  "find",
  "for",
  "in",
  "is",
  "its",
  "me",
  "most",
  "of",
  "on",
  "or",
  "show",
  "surface",
  "their",
  "the",
  "then",
  "to",
  "which",
  "with"
]);

const phraseBoosts: Array<{ match: string; weights: Vector }> = [
  {
    match: "self-overcoming",
    weights: { self_cultivation: 1.2, inner_freedom: 0.8, desire_detachment: 0.5 }
  },
  {
    match: "self overcoming",
    weights: { self_cultivation: 1.2, inner_freedom: 0.8, desire_detachment: 0.5 }
  },
  {
    match: "common good",
    weights: { common_good: 1.2, governance: 0.8, virtue: 0.4 }
  },
  {
    match: "ritual",
    weights: { ritual_order: 1.1, virtue: 0.4, governance: 0.2 }
  },
  {
    match: "awakening",
    weights: { awakening: 1.2, inner_freedom: 0.5, ultimate_reality: 0.4 }
  },
  {
    match: "grace",
    weights: { grace_nature: 1.2, ultimate_reality: 0.3 }
  },
  {
    match: "desire",
    weights: { desire_detachment: 1.05, self_cultivation: 0.35 }
  },
  {
    match: "law",
    weights: { reason_law: 0.95, governance: 0.35 }
  },
  {
    match: "way",
    weights: { ultimate_reality: 0.8, desire_detachment: 0.4 }
  },
  {
    match: "compassion",
    weights: { compassion: 1.1, common_good: 0.2 }
  }
];

export interface QueryState {
  vector: Vector;
  evidence: Record<string, string[]>;
  tokens: string[];
}

export function buildLocalAnalysis(prompt: string, focus: Focus, depth: number): AnalysisResult {
  const queryState = buildQueryVector(prompt);
  const primaryPool =
    focus === "all" ? passages : passages.filter((passage) => passage.tradition === focus);

  const rankedPrimary = primaryPool
    .map((passage) => ({
      passage,
      score: scorePassage(passage, queryState)
    }))
    .sort((left, right) => right.score - left.score)
    .slice(0, depth);

  const pairs: PairingResult[] = rankedPrimary.map((entry) => {
    const counterpartPool = passages.filter(
      (passage) => passage.tradition !== entry.passage.tradition
    );

    const counterpart = counterpartPool
      .map((passage) => ({
        passage,
        score: clamp(
          cosineSimilarity(entry.passage.vector, passage.vector) * 0.64 +
            scorePassage(passage, queryState) * 0.36,
          0,
          0.99
        )
      }))
      .sort((left, right) => right.score - left.score)[0];

    const sharedConcepts = getSharedConcepts(entry.passage.vector, counterpart.passage.vector);

    return {
      primary: entry.passage,
      primaryScore: entry.score,
      counterpart: counterpart.passage,
      counterpartScore: counterpart.score,
      sharedConcepts,
      explanation: buildDeterministicPairExplanation(
        entry.passage,
        counterpart.passage,
        sharedConcepts
      )
    };
  });

  const metrics = buildMetricResults(queryState.vector, pairs);
  const graph = buildGraph(metrics, pairs);

  return {
    prompt,
    focus,
    depth,
    pairs,
    metrics,
    summary: buildSummary(prompt, focus, pairs, metrics),
    graph,
    provider: {
      mode: "demo",
      chatModel: null,
      embedModel: null
    },
    usage: {
      promptTokens: estimateTokenCount(prompt),
      completionTokens: estimateCompletionTokens(pairs, metrics),
      totalTokens: estimateTokenCount(prompt) + estimateCompletionTokens(pairs, metrics),
      remainingFreeQueries: null,
      plan: "demo"
    }
  };
}

export function buildQueryVector(prompt: string): QueryState {
  const vector = emptyVector();
  const evidence: Record<string, string[]> = {};
  const normalized = normalize(prompt);

  phraseBoosts.forEach((boost) => {
    if (normalized.includes(boost.match)) {
      mergeWeights(vector, boost.weights, 1, boost.match, evidence);
    }
  });

  conceptDefinitions.forEach((concept) => {
    concept.terms.forEach((term) => {
      if (normalized.includes(normalize(term))) {
        const weight = term.includes(" ") || /[\u3400-\u9fff]/.test(term) ? 0.55 : 0.32;
        vector[concept.id] = (vector[concept.id] || 0) + weight;
        pushEvidence(evidence, concept.id, term);
      }
    });
  });

  corpusIndex.forEach((record) => {
    if (normalized.includes(record.author.toLowerCase()) || normalized.includes(record.work.toLowerCase())) {
      const authorVector = averageVectors(
        passages.filter((passage) => passage.author === record.author).map((passage) => passage.vector)
      );
      mergeWeights(vector, authorVector, 0.34, record.author, evidence);
    }
  });

  const tokens = extractTokens(prompt);

  if (vectorMagnitude(vector) === 0) {
    passages
      .map((passage) => ({ passage, lexical: lexicalHitCount(tokens, passage) }))
      .filter((entry) => entry.lexical > 0)
      .sort((left, right) => right.lexical - left.lexical)
      .slice(0, 3)
      .forEach((entry) => {
        mergeWeights(vector, entry.passage.vector, 0.2, entry.passage.author, evidence);
      });
  }

  if (vectorMagnitude(vector) === 0) {
    mergeWeights(
      vector,
      {
        self_cultivation: 0.5,
        virtue: 0.38,
        awakening: 0.32
      },
      1,
      "default research seed",
      evidence
    );
  }

  return {
    vector,
    evidence,
    tokens
  };
}

export function scorePassage(passage: PassageRecord, queryState: QueryState): number {
  const semantic = cosineSimilarity(queryState.vector, passage.vector);
  const lexical = Math.min(0.26, lexicalHitCount(queryState.tokens, passage) * 0.055);
  return clamp(semantic * 0.8 + lexical, 0, 0.99);
}

export function getSharedConcepts(leftVector: Vector, rightVector: Vector): ConceptDefinition[] {
  return conceptDefinitions
    .map((concept) => ({
      concept,
      left: getWeight(leftVector, concept.id),
      right: getWeight(rightVector, concept.id)
    }))
    .filter((entry) => entry.left > 0.24 && entry.right > 0.24)
    .sort((a, b) => b.left + b.right - (a.left + a.right))
    .slice(0, 3)
    .map((entry) => entry.concept);
}

export function buildMetricResults(queryVector: Vector, pairs: PairingResult[]): MetricResult[] {
  const aggregate = emptyVector();

  Object.entries(queryVector).forEach(([key, value]) => {
    aggregate[key as InternalConceptId] = (aggregate[key as InternalConceptId] || 0) + value * 0.8;
  });

  pairs.forEach((pair) => {
    addToAggregate(aggregate, pair.primary.vector, 0.85);
    addToAggregate(aggregate, pair.counterpart.vector, 0.85);
  });

  const raw = metricDefinitions.map((metric) => ({
    metric,
    value: metric.sourceConcepts.reduce(
      (sum, source) => sum + getWeight(aggregate, source.conceptId) * source.weight,
      0
    )
  }));

  const total = raw.reduce((sum, entry) => sum + entry.value, 0) || 1;
  const rounded = raw.map((entry) => Math.round((entry.value / total) * 100));
  const delta = 100 - rounded.reduce((sum, value) => sum + value, 0);
  if (rounded.length) rounded[0] += delta;

  return raw.map((entry, index) => ({
    id: entry.metric.id,
    label: entry.metric.label,
    description: entry.metric.description,
    percentage: rounded[index] || 0,
    color: entry.metric.color,
    explanation: buildMetricExplanation(entry.metric, rounded[index] || 0, pairs)
  }));
}

export function buildGraph(
  metrics: MetricResult[],
  pairs: PairingResult[]
): { nodes: GraphNode[]; edges: GraphEdge[] } {
  const authorMap = new Map<string, { tradition: "western" | "eastern"; weight: number }>();

  pairs.forEach((pair) => {
    authorMap.set(pair.primary.author, {
      tradition: pair.primary.tradition,
      weight: Math.max(pair.primaryScore, authorMap.get(pair.primary.author)?.weight || 0)
    });
    authorMap.set(pair.counterpart.author, {
      tradition: pair.counterpart.tradition,
      weight: Math.max(pair.counterpartScore, authorMap.get(pair.counterpart.author)?.weight || 0)
    });
  });

  const westernAuthors = [...authorMap.entries()].filter((entry) => entry[1].tradition === "western");
  const easternAuthors = [...authorMap.entries()].filter((entry) => entry[1].tradition === "eastern");

  const authorNodes: GraphNode[] = [
    ...westernAuthors.map(([label, value], index) => ({
      id: `author-${label}`,
      label,
      kind: "author" as const,
      tradition: value.tradition,
      color: "#9f5e34",
      x: 110,
      y: spreadY(index, westernAuthors.length, 120, 520),
      weight: value.weight
    })),
    ...easternAuthors.map(([label, value], index) => ({
      id: `author-${label}`,
      label,
      kind: "author" as const,
      tradition: value.tradition,
      color: "#1f7a72",
      x: 890,
      y: spreadY(index, easternAuthors.length, 140, 500),
      weight: value.weight
    }))
  ];

  const metricNodes: GraphNode[] = metrics.map((metric, index) => ({
    id: `metric-${metric.id}`,
    label: metric.label,
    kind: "metric",
    color: metric.color,
    x: [350, 500, 650, 350, 500, 650][index] || 500,
    y: [160, 160, 160, 420, 420, 420][index] || 300,
    weight: metric.percentage / 100
  }));

  const edges: GraphEdge[] = [];

  authorNodes.forEach((authorNode) => {
    const relatedPairs = pairs.filter(
      (pair) => pair.primary.author === authorNode.label || pair.counterpart.author === authorNode.label
    );
    const combinedVector = emptyVector();
    relatedPairs.forEach((pair) => {
      const passage =
        pair.primary.author === authorNode.label ? pair.primary.vector : pair.counterpart.vector;
      addToAggregate(combinedVector, passage, 1);
    });

    metrics.forEach((metric) => {
      const definition = metricDefinitions.find((item) => item.id === metric.id);
      if (!definition) return;

      const weight = definition.sourceConcepts.reduce(
        (sum, source) => sum + getWeight(combinedVector, source.conceptId) * source.weight,
        0
      );

      if (weight < 0.18) return;

      edges.push({
        id: `${authorNode.id}-${metric.id}`,
        source: authorNode.id,
        target: `metric-${metric.id}`,
        weight: clamp(weight, 0, 1),
        color: metric.color
      });
    });
  });

  return { nodes: [...authorNodes, ...metricNodes], edges };
}

function buildSummary(prompt: string, focus: Focus, pairs: PairingResult[], metrics: MetricResult[]): string {
  const topMetrics = metrics
    .slice()
    .sort((left, right) => right.percentage - left.percentage)
    .slice(0, 3)
    .map((metric) => metric.label.toLowerCase());

  const authors = [...new Set(pairs.flatMap((pair) => [pair.primary.author, pair.counterpart.author]))];

  return `For the prompt "${prompt}", the ${focus} search emphasized ${joinLabels(
    topMetrics
  )}. The engine surfaced ${pairs.length} primary/counterpart pairs across ${authors.length} authors.`;
}

function buildDeterministicPairExplanation(
  primary: PassageRecord,
  counterpart: PassageRecord,
  sharedConcepts: ConceptDefinition[]
): string {
  const labels = sharedConcepts.map((concept) => concept.label.toLowerCase());
  if (!labels.length) {
    return `${primary.author} and ${counterpart.author} occupy adjacent conceptual terrain even when the overlap is diffuse.`;
  }

  return `${primary.author} and ${counterpart.author} cluster around ${joinLabels(
    labels
  )}. The pairing stays legible because both passages frame transformation or order through closely related conceptual pressure points.`;
}

function buildMetricExplanation(metric: MetricDefinition, percentage: number, pairs: PairingResult[]): string {
  const labels = pairs
    .filter((pair) =>
      metric.sourceConcepts.some(
        (source) =>
          getWeight(pair.primary.vector, source.conceptId) > 0.35 ||
          getWeight(pair.counterpart.vector, source.conceptId) > 0.35
      )
    )
    .slice(0, 2)
    .map((pair) => `${pair.primary.author}/${pair.counterpart.author}`);

  const intensity =
    percentage >= 24
      ? "dominant"
      : percentage >= 16
        ? "strong"
        : percentage >= 10
          ? "present"
          : "secondary";

  return `${metric.label} is ${intensity} in this run because the retrieved pairs repeatedly activate ${
    metric.description.toLowerCase()
  }${labels.length ? `, especially in ${joinLabels(labels)}.` : "."}`;
}

function estimateTokenCount(text: string): number {
  return Math.max(20, Math.round(text.split(/\s+/).length * 1.4));
}

function estimateCompletionTokens(pairs: PairingResult[], metrics: MetricResult[]): number {
  const pairWords = pairs.reduce(
    (sum, pair) => sum + pair.explanation.split(/\s+/).length + pair.primary.translation.split(/\s+/).length,
    0
  );
  const metricWords = metrics.reduce((sum, metric) => sum + metric.explanation.split(/\s+/).length, 0);
  return Math.round((pairWords + metricWords) * 1.2);
}

function lexicalHitCount(tokens: string[], passage: PassageRecord): number {
  const haystack = normalize(
    [
      passage.author,
      passage.work,
      passage.section,
      passage.translation,
      passage.original || "",
      passage.note,
      passage.keywords.join(" ")
    ].join(" ")
  );

  return tokens.reduce((count, token) => count + (haystack.includes(token) ? 1 : 0), 0);
}

function extractTokens(text: string): string[] {
  const normalized = normalize(text);
  const latin = normalized
    .replace(/[^a-z0-9\s-]/g, " ")
    .split(/\s+/)
    .filter((token) => token && token.length > 2 && !STOP_WORDS.has(token));
  const han = normalized.match(/[\u3400-\u9fff]+/g) || [];
  return [...new Set([...latin, ...han])];
}

function normalize(text: string): string {
  return String(text || "").toLowerCase();
}

function mergeWeights(
  target: Vector,
  source: Vector,
  scale: number,
  reason: string,
  evidence: Record<string, string[]>
) {
  Object.entries(source).forEach(([key, value]) => {
    const conceptId = key as InternalConceptId;
    target[conceptId] = (target[conceptId] || 0) + (value || 0) * scale;
    pushEvidence(evidence, conceptId, reason);
  });
}

function pushEvidence(evidence: Record<string, string[]>, key: string, value: string) {
  if (!evidence[key]) evidence[key] = [];
  if (!evidence[key].includes(value)) evidence[key].push(value);
}

function addToAggregate(target: Vector, source: Vector, scale: number) {
  Object.entries(source).forEach(([key, value]) => {
    const conceptId = key as InternalConceptId;
    target[conceptId] = (target[conceptId] || 0) + (value || 0) * scale;
  });
}

function emptyVector(): Vector {
  return conceptDefinitions.reduce((accumulator, concept) => {
    accumulator[concept.id] = 0;
    return accumulator;
  }, {} as Vector);
}

function vectorMagnitude(vector: Vector): number {
  return Math.sqrt(
    conceptDefinitions.reduce((sum, concept) => sum + getWeight(vector, concept.id) ** 2, 0)
  );
}

function cosineSimilarity(leftVector: Vector, rightVector: Vector): number {
  const leftMagnitude = vectorMagnitude(leftVector);
  const rightMagnitude = vectorMagnitude(rightVector);

  if (!leftMagnitude || !rightMagnitude) return 0;

  const dotProduct = conceptDefinitions.reduce(
    (sum, concept) => sum + getWeight(leftVector, concept.id) * getWeight(rightVector, concept.id),
    0
  );

  return dotProduct / (leftMagnitude * rightMagnitude);
}

function averageVectors(vectors: Vector[]): Vector {
  const total = emptyVector();
  vectors.forEach((vector) => addToAggregate(total, vector, 1));

  conceptDefinitions.forEach((concept) => {
    total[concept.id] = (total[concept.id] || 0) / Math.max(vectors.length, 1);
  });

  return total;
}

function getWeight(vector: Vector, key: InternalConceptId): number {
  return vector[key] || 0;
}

function spreadY(index: number, total: number, top: number, bottom: number): number {
  if (total <= 1) return (top + bottom) / 2;
  return top + ((bottom - top) * index) / (total - 1);
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

function joinLabels(items: string[]): string {
  if (!items.length) return "";
  if (items.length === 1) return items[0];
  if (items.length === 2) return `${items[0]} and ${items[1]}`;
  return `${items.slice(0, -1).join(", ")}, and ${items[items.length - 1]}`;
}
