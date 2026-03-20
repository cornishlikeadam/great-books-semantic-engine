import type {
  ConceptDefinition,
  CorpusRecord,
  HeroStat,
  LandingCard,
  MetricDefinition,
  PassageRecord,
  PresetPrompt,
  PricingPlan
} from "@/lib/semantic/types";

export const appMeta = {
  name: "The Great Books Semantic Engine",
  tagline:
    "Cloud-backed comparative philosophy search with multilingual retrieval, auditable pairings, and graph-based concept analysis.",
  subtagline:
    "Ask for self-overcoming, grace, ritual, or awakening. The engine returns 1-5 Western/Eastern pairs, concept percentages, explanations, and a graph of the exact analysis.",
  defaultPrompt:
    "Show me all passages in the Western canon that discuss self-overcoming, and surface their Eastern counterparts.",
  defaultDepth: 4
};

export const heroStats: HeroStat[] = [
  { value: "18", label: "Curated seed passages" },
  { value: "6", label: "Core concept percentages" },
  { value: "3", label: "Free analyses after signup" },
  { value: "2", label: "Cloud models in the stack" }
];

export const productCards: LandingCard[] = [
  {
    eyebrow: "Cloud inference",
    title: "Hosted open-weight models",
    body:
      "Use a hosted Llama-class model for explanations and multilingual embeddings for retrieval without asking scholars to run GPUs themselves."
  },
  {
    eyebrow: "Research workflow",
    title: "Prompt to pairs, percentages, and graph",
    body:
      "Each analysis returns 1-5 matched pairs, six concept percentages, exact explanations, and a graph payload for visual inspection."
  },
  {
    eyebrow: "Mandarin-aware",
    title: "Original-language visibility stays intact",
    body:
      "Wenyan passages remain visible in the result set so translation does not erase conceptual nuance."
  },
  {
    eyebrow: "SaaS controls",
    title: "Login, metering, and billing hooks",
    body:
      "Supabase handles accounts and usage records while Stripe gates plans after the free analysis allowance is exhausted."
  }
];

export const pricingPlans: PricingPlan[] = [
  {
    id: "free",
    title: "Free",
    price: "$0",
    note: "Best for first contact with the engine.",
    bullets: [
      "3 cloud analyses after signup",
      "1-3 paired results per run",
      "Usage dashboard",
      "Demo fallback when provider keys are absent"
    ],
    cta: "Start free"
  },
  {
    id: "scholar",
    title: "Scholar",
    price: "Stripe price",
    note: "Good for solo researchers and thesis work.",
    bullets: [
      "Expanded monthly analysis credits",
      "1-5 paired results per run",
      "Graph payload export",
      "Customer portal access"
    ],
    cta: "Upgrade to Scholar"
  },
  {
    id: "lab",
    title: "Lab",
    price: "Stripe price",
    note: "For teams, seminars, and lab workflows.",
    bullets: [
      "Higher monthly credit ceiling",
      "Priority analysis queue",
      "Collaboration-ready billing base",
      "Same retrieval engine with larger allowance"
    ],
    cta: "Upgrade to Lab"
  }
];

export const presets: PresetPrompt[] = [
  {
    title: "Self-overcoming",
    focus: "western",
    query:
      "Show me all passages in the Western canon that discuss self-overcoming, and surface their Eastern counterparts."
  },
  {
    title: "Grace and nature",
    focus: "western",
    query:
      "Which Western passages on grace and nature resonate most closely with Eastern cultivation and the Way?"
  },
  {
    title: "Ritual and governance",
    focus: "western",
    query:
      "Find Western passages about ritual, law, and political order, then match Eastern parallels in the Analects and Tao Te Ching."
  },
  {
    title: "Compassion and release",
    focus: "all",
    query:
      "Compare compassion, non-hatred, and release from desire across Augustine, the Dhammapada, and Laozi."
  },
  {
    title: "Awakening and ultimate reality",
    focus: "all",
    query:
      "Surface passages on awakening, purification of mind, and ultimate reality across Plato and the Platform Sutra."
  }
];

export const conceptDefinitions: ConceptDefinition[] = [
  {
    id: "self_cultivation",
    label: "Self-cultivation",
    color: "#1f7a72",
    description: "Self-mastery, moral formation, and inward training.",
    terms: [
      "self-overcoming",
      "self overcoming",
      "self-mastery",
      "discipline",
      "cultivation",
      "moral formation",
      "training",
      "克己",
      "修身",
      "自勝"
    ]
  },
  {
    id: "virtue",
    label: "Virtue",
    color: "#c19441",
    description: "Excellence, humaneness, and practiced character.",
    terms: ["virtue", "goodness", "humaneness", "仁", "德", "excellent", "just", "good"]
  },
  {
    id: "ritual_order",
    label: "Ritual & order",
    color: "#9f5e34",
    description: "Rite, ceremony, propriety, and ordered conduct.",
    terms: ["ritual", "rites", "order", "propriety", "禮", "ceremony"]
  },
  {
    id: "governance",
    label: "Governance",
    color: "#326c83",
    description: "Political rule, the state, and civic administration.",
    terms: ["governance", "government", "rule", "ruler", "state", "polis", "political", "king"]
  },
  {
    id: "desire_detachment",
    label: "Desire & detachment",
    color: "#8e4f44",
    description: "Appetite, release, diminution, and nonattachment.",
    terms: [
      "desire",
      "appetite",
      "attachment",
      "detachment",
      "nonattachment",
      "release",
      "inclination",
      "restless",
      "損"
    ]
  },
  {
    id: "reason_law",
    label: "Reason & law",
    color: "#36598a",
    description: "Moral law, rational norm, and principled action.",
    terms: ["reason", "law", "duty", "rational", "moral law", "imperative", "autonomy"]
  },
  {
    id: "compassion",
    label: "Compassion",
    color: "#b35c47",
    description: "Mercy, non-hatred, benevolence, and care.",
    terms: ["compassion", "mercy", "forgiveness", "love", "benevolence", "hatred", "care"]
  },
  {
    id: "awakening",
    label: "Awakening",
    color: "#2f8a66",
    description: "Illumination, purified mind, insight, and transformed vision.",
    terms: ["awakening", "enlightenment", "illumination", "purify", "mind", "悟", "菩提"]
  },
  {
    id: "grace_nature",
    label: "Grace & nature",
    color: "#7a6250",
    description: "Gift, perfection, beatitude, and the relation of nature to transcendence.",
    terms: ["grace", "nature", "gift", "beatitude", "perfects", "rest"]
  },
  {
    id: "inner_freedom",
    label: "Inner freedom",
    color: "#227d86",
    description: "Autonomy, self-rule, release, and unconstrained inward action.",
    terms: ["freedom", "liberty", "self-rule", "self rule", "inner freedom", "autonomy"]
  },
  {
    id: "common_good",
    label: "Common good",
    color: "#c89a4d",
    description: "Shared flourishing, civic peace, and communal ends.",
    terms: ["common good", "peace", "community", "friendship", "flourishing", "shared"]
  },
  {
    id: "ultimate_reality",
    label: "Ultimate reality",
    color: "#5f6d75",
    description: "Being, the Way, emptiness, and ultimate metaphysical orientation.",
    terms: ["being", "way", "dao", "道", "highest", "ultimate", "emptiness", "reality"]
  }
];

export const metricDefinitions: MetricDefinition[] = [
  {
    id: "selfCultivation",
    label: "Self-cultivation",
    description: "How strongly the analysis centers on discipline, self-mastery, and moral formation.",
    prompt: "self-cultivation, self-mastery, disciplined moral formation, inward training",
    color: "#1f7a72",
    sourceConcepts: [
      { conceptId: "self_cultivation", weight: 1 },
      { conceptId: "inner_freedom", weight: 0.25 },
      { conceptId: "virtue", weight: 0.18 }
    ]
  },
  {
    id: "ultimateReality",
    label: "Ultimate reality",
    description: "How strongly the analysis reaches toward transcendence, the Way, or metaphysical ultimacy.",
    prompt: "ultimate reality, transcendence, the way, metaphysical orientation, highest good",
    color: "#5f6d75",
    sourceConcepts: [
      { conceptId: "ultimate_reality", weight: 1 },
      { conceptId: "awakening", weight: 0.22 },
      { conceptId: "grace_nature", weight: 0.18 }
    ]
  },
  {
    id: "grace",
    label: "Grace",
    description: "How strongly the analysis centers on gift, perfection, and grace-language.",
    prompt: "grace, gift, beatitude, perfection, aid beyond mere effort",
    color: "#7a6250",
    sourceConcepts: [
      { conceptId: "grace_nature", weight: 1 },
      { conceptId: "compassion", weight: 0.18 }
    ]
  },
  {
    id: "compassion",
    label: "Compassion",
    description: "How strongly mercy, forgiveness, benevolence, and non-hatred structure the analysis.",
    prompt: "compassion, mercy, benevolence, non-hatred, forgiveness, care",
    color: "#b35c47",
    sourceConcepts: [
      { conceptId: "compassion", weight: 1 },
      { conceptId: "common_good", weight: 0.15 }
    ]
  },
  {
    id: "nature",
    label: "Nature",
    description: "How strongly the analysis invokes natural order, flourishing, or the perfection of what a being is.",
    prompt: "nature, natural order, flourishing, what a being is, perfection of nature",
    color: "#6b8151",
    sourceConcepts: [
      { conceptId: "grace_nature", weight: 0.74 },
      { conceptId: "virtue", weight: 0.18 },
      { conceptId: "common_good", weight: 0.12 }
    ]
  },
  {
    id: "virtue",
    label: "Virtue",
    description: "How strongly practiced excellence, humaneness, and good character shape the analysis.",
    prompt: "virtue, excellence, humaneness, moral goodness, practiced character",
    color: "#c19441",
    sourceConcepts: [
      { conceptId: "virtue", weight: 1 },
      { conceptId: "self_cultivation", weight: 0.2 }
    ]
  }
];

export const corpusIndex: CorpusRecord[] = [
  {
    id: "plato",
    tradition: "western",
    author: "Plato",
    work: "Republic + Gorgias",
    focus: "Soul-turning, disciplined desire, and ascent toward what is most real.",
    languages: "Ancient Greek -> English study layer",
    note: "Plato anchors self-overcoming, awakened perception, and ordered desire."
  },
  {
    id: "aristotle",
    tradition: "western",
    author: "Aristotle",
    work: "Nicomachean Ethics + Politics",
    focus: "Virtue, habit, the polis, and the good life.",
    languages: "Ancient Greek -> English study layer",
    note: "Aristotle anchors virtue, practice, and civic flourishing."
  },
  {
    id: "augustine",
    tradition: "western",
    author: "Augustine",
    work: "Confessions + City of God",
    focus: "Restlessness, ordered love, and peace oriented toward the highest good.",
    languages: "Latin -> English study layer",
    note: "Augustine brings desire, grace, and ordered peace into the graph."
  },
  {
    id: "aquinas",
    tradition: "western",
    author: "Aquinas",
    work: "Summa Theologiae + De Regno",
    focus: "Grace, nature, common good, and just rule.",
    languages: "Latin -> English study layer",
    note: "Aquinas is the clearest grace-and-nature cluster in the seed corpus."
  },
  {
    id: "kant",
    tradition: "western",
    author: "Kant",
    work: "Groundwork + Critique of Practical Reason",
    focus: "Autonomy, duty, moral law, and disciplined freedom.",
    languages: "German -> English study layer",
    note: "Kant anchors law, rational norm, and self-legislation."
  },
  {
    id: "confucius",
    tradition: "eastern",
    author: "Confucius",
    work: "Analects",
    focus: "Humaneness, ritual return, and cultivated conduct.",
    languages: "Wenyan + English gloss",
    note: "Confucius supplies the clearest ritual and humaneness counterparts."
  },
  {
    id: "laozi",
    tradition: "eastern",
    author: "Laozi",
    work: "Tao Te Ching",
    focus: "The Way, diminution, and non-coercive alignment.",
    languages: "Wenyan + English gloss",
    note: "Laozi strengthens self-mastery, detachment, and ultimate orientation."
  },
  {
    id: "dhammapada",
    tradition: "eastern",
    author: "Dhammapada",
    work: "Dhammapada",
    focus: "Purification of mind, non-hatred, and release from harmful states.",
    languages: "Sinographic Buddhist gloss + English",
    note: "The Dhammapada brings compassion and purified mind into the retrieval space."
  },
  {
    id: "huineng",
    tradition: "eastern",
    author: "Huineng",
    work: "Platform Sutra",
    focus: "Awakening, emptiness, and sudden transformation of mind.",
    languages: "Wenyan + English gloss",
    note: "Huineng anchors awakening and ultimate reality pairings."
  }
];

export const passages: PassageRecord[] = [
  {
    id: "plato-republic-turning",
    tradition: "western",
    author: "Plato",
    work: "Republic VII",
    section: "Education and turning",
    language: "Ancient Greek -> English gloss",
    translation: "Education is the turning of the soul away from shadows toward what is most real.",
    note: "A core ascent and transformation passage.",
    keywords: ["education", "soul", "turning", "truth", "shadows", "forms"],
    vector: {
      self_cultivation: 0.86,
      awakening: 0.79,
      ultimate_reality: 0.84,
      inner_freedom: 0.44,
      reason_law: 0.28
    }
  },
  {
    id: "plato-gorgias-order",
    tradition: "western",
    author: "Plato",
    work: "Gorgias",
    section: "Order over appetite",
    language: "Ancient Greek -> English gloss",
    translation: "The better soul is not enslaved by appetite but brought into order through discipline.",
    note: "Strong for self-overcoming and detachment.",
    keywords: ["appetite", "discipline", "order", "soul", "tyrant"],
    vector: {
      self_cultivation: 0.82,
      desire_detachment: 0.72,
      inner_freedom: 0.63,
      virtue: 0.54,
      governance: 0.24
    }
  },
  {
    id: "aristotle-ethics-virtue",
    tradition: "western",
    author: "Aristotle",
    work: "Nicomachean Ethics II",
    section: "Habit and virtue",
    language: "Ancient Greek -> English gloss",
    translation: "We become just by doing just things and temperate by doing temperate things.",
    note: "A signature virtue-formation passage.",
    keywords: ["virtue", "habit", "just", "temperate", "practice"],
    vector: {
      virtue: 0.89,
      self_cultivation: 0.78,
      common_good: 0.49,
      reason_law: 0.41
    }
  },
  {
    id: "aristotle-politics-good-life",
    tradition: "western",
    author: "Aristotle",
    work: "Politics I",
    section: "Polis and flourishing",
    language: "Ancient Greek -> English gloss",
    translation: "The polis exists not merely for life but for the sake of living well.",
    note: "Strong for governance and shared flourishing.",
    keywords: ["polis", "living well", "politics", "community", "flourishing"],
    vector: {
      governance: 0.88,
      common_good: 0.9,
      virtue: 0.55,
      ritual_order: 0.2
    }
  },
  {
    id: "augustine-confessions-restless",
    tradition: "western",
    author: "Augustine",
    work: "Confessions I",
    section: "Restless heart",
    language: "Latin -> English gloss",
    translation: "The heart is restless until it finds rest in the highest good.",
    note: "Joins desire, rest, and transcendence.",
    keywords: ["rest", "restless", "heart", "highest good", "desire"],
    vector: {
      grace_nature: 0.84,
      desire_detachment: 0.67,
      ultimate_reality: 0.79,
      self_cultivation: 0.31
    }
  },
  {
    id: "augustine-city-ordered-love",
    tradition: "western",
    author: "Augustine",
    work: "City of God XIX",
    section: "Ordered love and peace",
    language: "Latin -> English gloss",
    translation: "Peace is the tranquility of order, and order depends on loves rightly arranged.",
    note: "Links civic peace to rightly ordered desire.",
    keywords: ["peace", "order", "love", "city", "tranquility"],
    vector: {
      common_good: 0.73,
      grace_nature: 0.66,
      governance: 0.48,
      compassion: 0.42,
      ritual_order: 0.37
    }
  },
  {
    id: "aquinas-summa-grace",
    tradition: "western",
    author: "Aquinas",
    work: "Summa Theologiae",
    section: "Grace perfects nature",
    language: "Latin -> English gloss",
    translation: "Grace does not destroy nature but perfects it.",
    note: "Primary grace-and-nature result.",
    keywords: ["grace", "nature", "perfect", "beatitude", "gift"],
    vector: {
      grace_nature: 0.96,
      virtue: 0.42,
      ultimate_reality: 0.52,
      common_good: 0.26
    }
  },
  {
    id: "aquinas-regno-common-good",
    tradition: "western",
    author: "Aquinas",
    work: "De Regno",
    section: "Just rule and common good",
    language: "Latin -> English gloss",
    translation: "Government is just when it is ordered toward the common good rather than private appetite.",
    note: "Aquinas on rule, justice, and shared flourishing.",
    keywords: ["government", "common good", "justice", "rule", "order"],
    vector: {
      governance: 0.86,
      common_good: 0.92,
      virtue: 0.48,
      reason_law: 0.31
    }
  },
  {
    id: "kant-groundwork-freedom",
    tradition: "western",
    author: "Kant",
    work: "Groundwork",
    section: "Autonomy and law",
    language: "German -> English gloss",
    translation: "Freedom appears when the will obeys the law that reason gives to itself.",
    note: "Strong for law, autonomy, and inner freedom.",
    keywords: ["freedom", "will", "law", "reason", "autonomy"],
    vector: {
      reason_law: 0.96,
      inner_freedom: 0.85,
      self_cultivation: 0.34,
      virtue: 0.39
    }
  },
  {
    id: "kant-practical-reason",
    tradition: "western",
    author: "Kant",
    work: "Critique of Practical Reason",
    section: "Law against inclination",
    language: "German -> English gloss",
    translation: "Respect for the moral law humbles inclination and resists the tyranny of desire.",
    note: "A law-versus-desire bridge passage.",
    keywords: ["moral law", "inclination", "desire", "respect", "discipline"],
    vector: {
      reason_law: 0.9,
      desire_detachment: 0.71,
      inner_freedom: 0.63,
      virtue: 0.44
    }
  },
  {
    id: "analects-ritual-humaneness",
    tradition: "eastern",
    author: "Confucius",
    work: "Analects 12.1",
    section: "克己復禮為仁",
    language: "Wenyan + English gloss",
    original: "克己復禮為仁。",
    translation: "To master the self and return to ritual is humaneness.",
    note: "One of the strongest counterparts for moral formation and ritual order.",
    keywords: ["ritual", "humaneness", "self-mastery", "return", "discipline"],
    vector: {
      self_cultivation: 0.95,
      ritual_order: 0.91,
      virtue: 0.84,
      inner_freedom: 0.42
    }
  },
  {
    id: "analects-root-humaneness",
    tradition: "eastern",
    author: "Confucius",
    work: "Analects 1.2",
    section: "仁之本",
    language: "Wenyan + English gloss",
    original: "孝弟也者，其為仁之本與。",
    translation: "Filial and fraternal devotion are the root of humaneness.",
    note: "Humaneness grounded in relational formation.",
    keywords: ["humaneness", "filial", "fraternal", "root", "relation"],
    vector: {
      virtue: 0.79,
      ritual_order: 0.67,
      compassion: 0.49,
      common_good: 0.52,
      governance: 0.22
    }
  },
  {
    id: "tao-self-mastery",
    tradition: "eastern",
    author: "Laozi",
    work: "Tao Te Ching 33",
    section: "自勝者強",
    language: "Wenyan + English gloss",
    original: "知人者智，自知者明；勝人者有力，自勝者強。",
    translation: "Knowing others is intelligence; mastering yourself is strength.",
    note: "A direct self-overcoming counterpart.",
    keywords: ["self-mastery", "strength", "knowing", "self", "freedom"],
    vector: {
      self_cultivation: 0.9,
      inner_freedom: 0.8,
      awakening: 0.4,
      desire_detachment: 0.43
    }
  },
  {
    id: "tao-diminishing",
    tradition: "eastern",
    author: "Laozi",
    work: "Tao Te Ching 48",
    section: "為道日損",
    language: "Wenyan + English gloss",
    original: "為學日益，為道日損。",
    translation: "In learning one accumulates; in the Way one diminishes daily.",
    note: "Useful for detachment and ultimate orientation.",
    keywords: ["way", "diminish", "learning", "release", "detachment"],
    vector: {
      desire_detachment: 0.89,
      ultimate_reality: 0.78,
      awakening: 0.67,
      inner_freedom: 0.58,
      self_cultivation: 0.39
    }
  },
  {
    id: "dhammapada-purify",
    tradition: "eastern",
    author: "Dhammapada",
    work: "Dhammapada 183",
    section: "自淨其意",
    language: "Sinographic Buddhist gloss + English",
    original: "諸惡莫作，眾善奉行，自淨其意。",
    translation: "Do no evil, cultivate the good, and purify the mind.",
    note: "High on awakening, cultivation, and virtue.",
    keywords: ["purify", "mind", "good", "evil", "cultivate"],
    vector: {
      awakening: 0.88,
      self_cultivation: 0.74,
      virtue: 0.72,
      compassion: 0.54,
      desire_detachment: 0.36
    }
  },
  {
    id: "dhammapada-non-hatred",
    tradition: "eastern",
    author: "Dhammapada",
    work: "Dhammapada 5",
    section: "止怨",
    language: "Sinographic Buddhist gloss + English",
    original: "怨憎弗能止怨，惟忍能止怨。",
    translation: "Hatred is never stilled by hatred; only by non-hatred is hatred stilled.",
    note: "The compassion anchor in the Eastern set.",
    keywords: ["hatred", "non-hatred", "compassion", "release", "suffering"],
    vector: {
      compassion: 0.94,
      desire_detachment: 0.56,
      inner_freedom: 0.4,
      virtue: 0.37
    }
  },
  {
    id: "platform-no-thing",
    tradition: "eastern",
    author: "Huineng",
    work: "Platform Sutra",
    section: "本來無一物",
    language: "Wenyan + English gloss",
    original: "菩提本無樹，明鏡亦非臺；本來無一物。",
    translation: "Bodhi has no tree, the bright mirror has no stand, and originally there is not a single thing.",
    note: "The strongest awakening-plus-ultimate-reality passage in the seed set.",
    keywords: ["bodhi", "emptiness", "mirror", "awakening", "nothing"],
    vector: {
      awakening: 0.96,
      ultimate_reality: 0.84,
      desire_detachment: 0.71,
      inner_freedom: 0.67
    }
  },
  {
    id: "platform-awakened-thought",
    tradition: "eastern",
    author: "Huineng",
    work: "Platform Sutra",
    section: "後念悟即佛",
    language: "Wenyan + English gloss",
    original: "前念迷即凡，後念悟即佛。",
    translation: "A deluded thought is ordinary; an awakened thought is Buddha.",
    note: "A transformed-mind and inner-freedom passage.",
    keywords: ["thought", "awakened", "mind", "ordinary", "Buddha"],
    vector: {
      awakening: 0.92,
      inner_freedom: 0.76,
      self_cultivation: 0.58,
      ultimate_reality: 0.41
    }
  }
];
