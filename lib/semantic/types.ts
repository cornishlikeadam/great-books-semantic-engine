export type Focus = "western" | "eastern" | "all";

export type InternalConceptId =
  | "self_cultivation"
  | "virtue"
  | "ritual_order"
  | "governance"
  | "desire_detachment"
  | "reason_law"
  | "compassion"
  | "awakening"
  | "grace_nature"
  | "inner_freedom"
  | "common_good"
  | "ultimate_reality";

export type MetricId =
  | "selfCultivation"
  | "ultimateReality"
  | "grace"
  | "compassion"
  | "nature"
  | "virtue";

export type Vector = Partial<Record<InternalConceptId, number>>;

export interface HeroStat {
  value: string;
  label: string;
}

export interface LandingCard {
  eyebrow: string;
  title: string;
  body: string;
}

export interface PricingPlan {
  id: "free" | "scholar" | "lab";
  title: string;
  price: string;
  note: string;
  bullets: string[];
  cta: string;
}

export interface PresetPrompt {
  title: string;
  focus: Focus;
  query: string;
}

export interface ConceptDefinition {
  id: InternalConceptId;
  label: string;
  color: string;
  description: string;
  terms: string[];
}

export interface MetricDefinition {
  id: MetricId;
  label: string;
  description: string;
  prompt: string;
  color: string;
  sourceConcepts: Array<{ conceptId: InternalConceptId; weight: number }>;
}

export interface CorpusRecord {
  id: string;
  tradition: "western" | "eastern";
  author: string;
  work: string;
  focus: string;
  languages: string;
  note: string;
}

export interface PassageRecord {
  id: string;
  tradition: "western" | "eastern";
  author: string;
  work: string;
  section: string;
  language: string;
  translation: string;
  note: string;
  original?: string;
  keywords: string[];
  vector: Vector;
}

export interface PairingResult {
  primary: PassageRecord;
  primaryScore: number;
  counterpart: PassageRecord;
  counterpartScore: number;
  sharedConcepts: ConceptDefinition[];
  explanation: string;
}

export interface MetricResult {
  id: MetricId;
  label: string;
  description: string;
  percentage: number;
  color: string;
  explanation: string;
}

export interface GraphNode {
  id: string;
  label: string;
  kind: "author" | "metric";
  tradition?: "western" | "eastern";
  color: string;
  x: number;
  y: number;
  weight: number;
}

export interface GraphEdge {
  id: string;
  source: string;
  target: string;
  weight: number;
  color: string;
}

export interface AnalysisUsage {
  promptTokens: number;
  completionTokens: number;
  totalTokens: number;
  remainingFreeQueries: number | null;
  plan: string;
}

export interface AnalysisResult {
  prompt: string;
  focus: Focus;
  depth: number;
  pairs: PairingResult[];
  metrics: MetricResult[];
  summary: string;
  graph: {
    nodes: GraphNode[];
    edges: GraphEdge[];
  };
  provider: {
    mode: "demo" | "together";
    chatModel: string | null;
    embedModel: string | null;
  };
  usage: AnalysisUsage;
}
