window.GREAT_BOOKS_DATA = {
  app: {
    name: "The Great Books Semantic Engine",
    tagline:
      "A comparative philosophy search system for surfacing semantically parallel passages across Western and Eastern canonical texts.",
    defaultQuery:
      "Show me all passages in the Western canon that discuss self-overcoming, and surface their Eastern counterparts.",
    defaultFocus: "western",
    defaultDepth: 4
  },

  heroStats: [
    { value: "18", label: "Curated study passages" },
    { value: "12", label: "Concept axes" },
    { value: "4", label: "Eastern source texts" },
    { value: "2", label: "Language layers kept visible" }
  ],

  signalStrip: [
    {
      title: "Wenyan in view",
      body: "Original Chinese snippets remain visible inside retrieval, not hidden behind translation."
    },
    {
      title: "Counterpart pairing",
      body: "Each primary result automatically seeds a nearest-neighbor search in the opposite canon."
    },
    {
      title: "Auditable matches",
      body: "The model shows which concept clusters activated a result instead of returning a black-box answer."
    }
  ],

  features: [
    {
      eyebrow: "Semantic retrieval",
      title: "Ask conceptual questions, not just keyword queries",
      body:
        "A researcher can ask about self-overcoming, desire, ritual, or grace even when the target texts use radically different vocabularies."
    },
    {
      eyebrow: "Mandarin integration",
      title: "Treat Classical Chinese as first-class data",
      body:
        "The engine keeps Wenyan phrases visible alongside English glosses so conceptual distinctions like 禮, 仁, and 道 are not flattened away."
    },
    {
      eyebrow: "Knowledge graph",
      title: "See who clusters near which ideas",
      body:
        "Author neighborhoods, concept hubs, and counterpart scores make the graph legible enough for actual research decisions."
    },
    {
      eyebrow: "LLM orchestration",
      title: "Use language models to explain, not replace, the texts",
      body:
        "The production design uses LLMs for comparative notes, gloss generation, and query expansion while keeping source provenance central."
    }
  ],

  architecture: [
    {
      eyebrow: "Ingestion",
      title: "Passage segmentation",
      body:
        "Canonical works are split into short, citable units with author, work, section, tradition, and language metadata."
    },
    {
      eyebrow: "Embeddings",
      title: "Shared concept space",
      body:
        "Multilingual embeddings map English research questions and Wenyan passages into a common vector layer."
    },
    {
      eyebrow: "Ranking",
      title: "Hybrid retrieval",
      body:
        "Primary results combine semantic similarity, lexical evidence, and direct author or work mentions."
    },
    {
      eyebrow: "Matching",
      title: "Counterpart engine",
      body:
        "Top passages from one canon seed a nearest-neighbor search across the other canon to surface strong parallels."
    },
    {
      eyebrow: "Explanation",
      title: "Provenance-aware notes",
      body:
        "LLM summaries remain subordinate to the sources and cite which concepts and passages drove the pairing."
    }
  ],

  workflow: [
    {
      step: "01",
      title: "Ingest",
      body: "Segment texts and keep source metadata attached to every passage."
    },
    {
      step: "02",
      title: "Expand",
      body: "Map the research question into a concept lattice with multilingual terms."
    },
    {
      step: "03",
      title: "Rank",
      body: "Score passages in the chosen canon for semantic and lexical relevance."
    },
    {
      step: "04",
      title: "Pair",
      body: "Retrieve the nearest counterpart from the opposite tradition."
    },
    {
      step: "05",
      title: "Inspect",
      body: "Read the passages, shared concepts, and graph neighborhoods side by side."
    }
  ],

  useCases: [
    {
      eyebrow: "Dissertation scouting",
      title: "Map a comparative chapter quickly",
      body:
        "A scholar can move from a large conceptual prompt to an initial passage set for deeper close reading."
    },
    {
      eyebrow: "Translation audit",
      title: "Check what translation is hiding",
      body:
        "Surface Wenyan snippets and see where a seemingly simple English gloss actually spans multiple conceptual traditions."
    },
    {
      eyebrow: "Seminar design",
      title: "Build cross-canon reading lists",
      body:
        "Instructors can assemble paired passages for philosophy, theology, ethics, and digital humanities courses."
    },
    {
      eyebrow: "Research infrastructure",
      title: "Support annotation and export workflows",
      body:
        "The product can grow into a larger graph-backed workspace with scholar notes, saved queries, and passage clusters."
    }
  ],

  corpusIndex: [
    {
      id: "plato",
      tradition: "western",
      author: "Plato",
      work: "Republic + Gorgias",
      focus: "Soul-turning, disciplined desire, and the ascent toward what is most real.",
      languages: "Ancient Greek -> English study layer",
      note:
        "Prototype passages emphasize conversion, self-rule, and the moral contrast between order and appetite."
    },
    {
      id: "aristotle",
      tradition: "western",
      author: "Aristotle",
      work: "Nicomachean Ethics + Politics",
      focus: "Habit, virtue, civic life, and the good life as a shared human end.",
      languages: "Ancient Greek -> English study layer",
      note:
        "Aristotle anchors the virtue and governance portions of the concept graph."
    },
    {
      id: "augustine",
      tradition: "western",
      author: "Augustine",
      work: "Confessions + City of God",
      focus: "Restlessness, ordered love, peace, and the orientation of desire.",
      languages: "Latin -> English study layer",
      note:
        "Augustine links interior longing to civic and theological order."
    },
    {
      id: "aquinas",
      tradition: "western",
      author: "Aquinas",
      work: "Summa Theologiae + De Regno",
      focus: "Grace, nature, common good, and just rule ordered toward flourishing.",
      languages: "Latin -> English study layer",
      note:
        "Aquinas strengthens the grace, reason, and common-good portions of the model."
    },
    {
      id: "kant",
      tradition: "western",
      author: "Kant",
      work: "Groundwork + Critique of Practical Reason",
      focus: "Freedom, autonomy, duty, and the disciplining force of the moral law.",
      languages: "German -> English study layer",
      note:
        "Kant is the strongest rational-law cluster in the current prototype."
    },
    {
      id: "confucius",
      tradition: "eastern",
      author: "Confucius",
      work: "Analects",
      focus: "Humaneness, ritual return, and social formation through disciplined conduct.",
      languages: "Wenyan + English gloss",
      note:
        "The engine keeps 禮 and 仁 visible instead of flattening both into generic virtue language."
    },
    {
      id: "laozi",
      tradition: "eastern",
      author: "Laozi",
      work: "Tao Te Ching",
      focus: "Self-mastery, diminution, the Way, and non-coercive alignment.",
      languages: "Wenyan + English gloss",
      note:
        "Laozi supplies the clearest detachment and Way-oriented counterparts to Western self-rule."
    },
    {
      id: "dhammapada",
      tradition: "eastern",
      author: "Dhammapada",
      work: "Dhammapada",
      focus: "Purification of mind, non-hatred, moral practice, and release from harmful states.",
      languages: "Chinese transmission layer + English gloss",
      note:
        "The prototype uses sinographic Buddhist formulations to keep the Mandarin-aware interaction legible."
    },
    {
      id: "huineng",
      tradition: "eastern",
      author: "Huineng",
      work: "Platform Sutra",
      focus: "Awakening, emptiness, sudden insight, and the transformation of mind.",
      languages: "Wenyan + English gloss",
      note:
        "Huineng provides the most direct awakening cluster in the Eastern side of the graph."
    }
  ],

  presets: [
    {
      title: "Self-overcoming",
      focus: "western",
      query:
        "Show me all passages in the Western canon that discuss self-overcoming, and surface their Eastern counterparts."
    },
    {
      title: "Ritual and governance",
      focus: "western",
      query:
        "Find Western passages about ritual, law, and political order, then match Eastern parallels in the Analects and Tao Te Ching."
    },
    {
      title: "Desire and detachment",
      focus: "all",
      query:
        "Compare treatments of desire, discipline, and release across Augustine, Kant, Laozi, and the Dhammapada."
    },
    {
      title: "Awakening and mind",
      focus: "all",
      query:
        "Surface passages on awakening, purification of mind, and inner freedom across Plato and the Platform Sutra."
    },
    {
      title: "Grace and nature",
      focus: "western",
      query:
        "Which Western passages about grace perfecting nature resonate most closely with Eastern discussions of cultivation and the Way?"
    }
  ],

  phraseBoosts: [
    {
      match: "self-overcoming",
      weights: {
        self_cultivation: 1.2,
        inner_freedom: 0.8,
        desire_detachment: 0.5
      }
    },
    {
      match: "self overcoming",
      weights: {
        self_cultivation: 1.2,
        inner_freedom: 0.8,
        desire_detachment: 0.5
      }
    },
    {
      match: "common good",
      weights: {
        common_good: 1.2,
        governance: 0.8,
        virtue: 0.4
      }
    },
    {
      match: "ritual",
      weights: {
        ritual_order: 1.1,
        virtue: 0.4,
        governance: 0.2
      }
    },
    {
      match: "awakening",
      weights: {
        awakening: 1.2,
        inner_freedom: 0.5,
        ultimate_reality: 0.4
      }
    },
    {
      match: "grace",
      weights: {
        grace_nature: 1.2,
        virtue: 0.25,
        ultimate_reality: 0.3
      }
    },
    {
      match: "desire",
      weights: {
        desire_detachment: 1.05,
        self_cultivation: 0.35
      }
    },
    {
      match: "law",
      weights: {
        reason_law: 0.95,
        governance: 0.35
      }
    },
    {
      match: "way",
      weights: {
        ultimate_reality: 0.8,
        desire_detachment: 0.4
      }
    }
  ],

  concepts: [
    {
      id: "self_cultivation",
      label: "Self-cultivation",
      color: "#1f7a72",
      description: "Practices of self-mastery, reform, discipline, and inward training.",
      terms: [
        "self-overcoming",
        "self overcoming",
        "self-mastery",
        "discipline",
        "cultivation",
        "moral formation",
        "training",
        "conquer the self",
        "master the self",
        "克己",
        "修身",
        "自勝"
      ]
    },
    {
      id: "virtue",
      label: "Virtue",
      color: "#c19441",
      description: "Excellence, humaneness, moral goodness, and practiced character.",
      terms: ["virtue", "goodness", "humaneness", "仁", "德", "excellent", "just", "good"]
    },
    {
      id: "ritual_order",
      label: "Ritual & order",
      color: "#9f5e34",
      description: "Propriety, rite, ceremonial form, and ordered conduct.",
      terms: ["ritual", "rites", "rite", "order", "propriety", "li", "禮", "ceremony"]
    },
    {
      id: "governance",
      label: "Governance",
      color: "#326c83",
      description: "Political rule, civic order, the state, and just administration.",
      terms: [
        "governance",
        "government",
        "rule",
        "ruler",
        "state",
        "polis",
        "political",
        "king",
        "commonwealth"
      ]
    },
    {
      id: "desire_detachment",
      label: "Desire & detachment",
      color: "#8e4f44",
      description: "Appetite, attachment, release, reduction, and non-coercive desire.",
      terms: [
        "desire",
        "appetite",
        "attachment",
        "detachment",
        "nonattachment",
        "release",
        "inclination",
        "restless",
        "diminish",
        "損"
      ]
    },
    {
      id: "reason_law",
      label: "Reason & law",
      color: "#36598a",
      description: "Rational norm, moral law, judgment, duty, and principled action.",
      terms: [
        "reason",
        "law",
        "duty",
        "rational",
        "moral law",
        "judgment",
        "imperative",
        "autonomy",
        "norm"
      ]
    },
    {
      id: "compassion",
      label: "Compassion",
      color: "#b35c47",
      description: "Mercy, non-hatred, benevolence, forgiveness, and care for others.",
      terms: [
        "compassion",
        "mercy",
        "forgiveness",
        "love",
        "care",
        "benevolence",
        "hatred",
        "suffering"
      ]
    },
    {
      id: "awakening",
      label: "Awakening",
      color: "#2f8a66",
      description: "Illumination, purification of mind, insight, and transformed seeing.",
      terms: [
        "awakening",
        "enlightenment",
        "illumination",
        "purify",
        "mind",
        "insight",
        "悟",
        "菩提",
        "truth"
      ]
    },
    {
      id: "grace_nature",
      label: "Grace & nature",
      color: "#7a6250",
      description: "Gift, perfection, beatitude, and the relation between nature and transcendence.",
      terms: ["grace", "nature", "gift", "beatitude", "rest", "sin", "perfects"]
    },
    {
      id: "inner_freedom",
      label: "Inner freedom",
      color: "#227d86",
      description: "Autonomy, self-rule, release, mastery, and unconstrained inward action.",
      terms: [
        "freedom",
        "liberty",
        "self-rule",
        "self rule",
        "inner freedom",
        "autonomy",
        "release",
        "strong"
      ]
    },
    {
      id: "common_good",
      label: "Common good",
      color: "#c89a4d",
      description: "Shared flourishing, civic peace, friendship, and community-directed ends.",
      terms: [
        "common good",
        "peace",
        "community",
        "friendship",
        "good life",
        "flourishing",
        "shared"
      ]
    },
    {
      id: "ultimate_reality",
      label: "Ultimate reality",
      color: "#5f6d75",
      description: "Being, the Way, emptiness, highest good, and ultimate metaphysical orientation.",
      terms: [
        "being",
        "way",
        "dao",
        "道",
        "highest",
        "ultimate",
        "emptiness",
        "reality",
        "good"
      ]
    }
  ],

  passages: [
    {
      id: "plato-republic-turning",
      tradition: "western",
      author: "Plato",
      work: "Republic VII",
      section: "Education and turning",
      language: "Ancient Greek -> English gloss",
      translation: "Education is the turning of the soul away from shadows toward what is most real.",
      note:
        "This passage clusters around conversion, truth, and the disciplined reorientation of perception.",
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
      translation:
        "The better soul is not enslaved by appetite but brought into order through discipline.",
      note:
        "Useful for self-overcoming prompts because it contrasts inner order with tyrannical desire.",
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
      note:
        "Aristotle's habit-based account is a major anchor for virtue, practice, and formation.",
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
      note:
        "Strong governance result when the query asks about politics, civic order, or shared flourishing.",
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
      note:
        "This result joins desire, rest, transcendence, and the theological orientation of the self.",
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
      translation:
        "Peace is the tranquility of order, and order depends on loves rightly arranged.",
      note:
        "A strong bridge between interior moral orientation and the shape of civic peace.",
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
      note:
        "This passage becomes central whenever the query invokes grace, perfection, or beatitude.",
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
      translation:
        "Government is just when it is ordered toward the common good rather than private appetite.",
      note:
        "Aquinas gives the prototype its strongest joint signal for governance and common good.",
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
      note:
        "Kant dominates queries about duty, autonomy, and rational self-legislation.",
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
      note:
        "Useful when the query sits between law, desire, and the disciplining of appetite.",
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
      note:
        "One of the clearest Eastern parallels for Western self-rule and moral formation.",
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
      note:
        "This passage helps the engine connect virtue to social relation and ethical formation.",
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
      note:
        "A major Eastern counterpart for self-overcoming, inner freedom, and non-coercive strength.",
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
      note:
        "This is the engine's strongest detachment and Way-oriented passage in the Daoist set.",
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
      note:
        "A strong bridge between virtue, disciplined practice, and purification of mind.",
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
      note:
        "This passage strengthens the compassion cluster and the release from reactive desire.",
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
      translation:
        "Bodhi has no tree, the bright mirror has no stand, and originally there is not a single thing.",
      note:
        "A strong awakening and emptiness passage that pairs well with Western metaphysical ascent prompts.",
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
      note:
        "Useful for queries about transformed mind, instant reorientation, and inward freedom.",
      keywords: ["thought", "awakened", "mind", "ordinary", "Buddha"],
      vector: {
        awakening: 0.92,
        inner_freedom: 0.76,
        self_cultivation: 0.58,
        ultimate_reality: 0.41
      }
    }
  ]
};
