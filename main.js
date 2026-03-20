const data = window.GREAT_BOOKS_DATA;

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

let revealObserver;

function init() {
  if (!data) return;

  renderStaticSections();
  setYear();
  setupNav();
  setupReveal();
  setupQueryLab();
}

function renderStaticSections() {
  renderCollection("hero-stats", data.heroStats, (item) => `
    <article class="stat-card reveal">
      <strong>${item.value}</strong>
      <span>${item.label}</span>
    </article>
  `);

  renderCollection("signal-strip", data.signalStrip, (item) => `
    <article class="signal-tile reveal">
      <strong>${item.title}</strong>
      <span>${item.body}</span>
    </article>
  `);

  renderCollection("feature-grid", data.features, (item) => `
    <article class="feature-card reveal">
      <p class="eyebrow">${item.eyebrow}</p>
      <h3>${item.title}</h3>
      <p>${item.body}</p>
    </article>
  `);

  renderCollection("architecture-grid", data.architecture, (item) => `
    <article class="feature-card reveal">
      <p class="eyebrow">${item.eyebrow}</p>
      <h3>${item.title}</h3>
      <p>${item.body}</p>
    </article>
  `);

  renderCollection("workflow-strip", data.workflow, (item) => `
    <article class="workflow-card reveal">
      <strong>${item.step}</strong>
      <h3>${item.title}</h3>
      <p>${item.body}</p>
    </article>
  `);

  renderCollection("use-case-grid", data.useCases, (item) => `
    <article class="feature-card reveal">
      <p class="eyebrow">${item.eyebrow}</p>
      <h3>${item.title}</h3>
      <p>${item.body}</p>
    </article>
  `);

  renderCollection(
    "western-corpus",
    data.corpusIndex.filter((item) => item.tradition === "western"),
    renderCorpusCard
  );

  renderCollection(
    "eastern-corpus",
    data.corpusIndex.filter((item) => item.tradition === "eastern"),
    renderCorpusCard
  );
}

function renderCorpusCard(item) {
  return `
    <article class="corpus-card reveal">
      <div class="card-topline">
        <span class="pill tradition-${item.tradition}">${item.tradition}</span>
        <span class="tiny-label">${item.languages}</span>
      </div>
      <h3>${item.author}</h3>
      <p><strong>${item.work}</strong></p>
      <p>${item.focus}</p>
      <p>${item.note}</p>
    </article>
  `;
}

function renderCollection(id, items, template) {
  const node = document.getElementById(id);
  if (!node) return;
  node.innerHTML = items.map(template).join("");
}

function setYear() {
  document.querySelectorAll("[data-year]").forEach((node) => {
    node.textContent = String(new Date().getFullYear());
  });
}

function setupNav() {
  const toggle = document.querySelector("[data-nav-toggle]");
  const menu = document.querySelector("[data-nav-menu]");

  if (!toggle || !menu) return;

  toggle.addEventListener("click", () => {
    const expanded = toggle.getAttribute("aria-expanded") === "true";
    toggle.setAttribute("aria-expanded", String(!expanded));
    menu.classList.toggle("is-open");
  });

  menu.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      toggle.setAttribute("aria-expanded", "false");
      menu.classList.remove("is-open");
    });
  });
}

function setupReveal() {
  revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );

  observeReveals();
}

function observeReveals(root = document) {
  if (!revealObserver) return;
  root.querySelectorAll(".reveal:not([data-observed])").forEach((element) => {
    element.dataset.observed = "true";
    revealObserver.observe(element);
  });
}

function setupQueryLab() {
  const form = document.getElementById("query-form");
  const queryInput = document.getElementById("query-input");
  const focusSelect = document.getElementById("focus-select");
  const depthSelect = document.getElementById("depth-select");
  const presetRow = document.getElementById("preset-row");
  const randomPresetButton = document.getElementById("random-preset");

  if (!form || !queryInput || !focusSelect || !depthSelect || !presetRow) return;

  queryInput.value = data.app.defaultQuery;
  focusSelect.value = data.app.defaultFocus;
  depthSelect.value = String(data.app.defaultDepth);

  let activePresetTitle = data.presets[0]?.title || "";

  function markActivePreset(title) {
    activePresetTitle = title;
    presetRow.querySelectorAll(".preset-button").forEach((button) => {
      button.classList.toggle("is-active", button.dataset.title === title);
    });
  }

  function runSearch() {
    const model = buildResultModel(
      queryInput.value.trim() || data.app.defaultQuery,
      focusSelect.value,
      Number(depthSelect.value)
    );

    renderResultSummary(model);
    renderConceptInsights(model);
    renderPairGrid(model);
    renderGraph(model);
    observeReveals(document.getElementById("pair-grid") || document);
  }

  presetRow.innerHTML = data.presets
    .map(
      (preset) => `
        <button
          class="preset-button ${preset.title === activePresetTitle ? "is-active" : ""}"
          type="button"
          data-title="${preset.title}"
        >
          ${preset.title}
        </button>
      `
    )
    .join("");

  presetRow.querySelectorAll(".preset-button").forEach((button) => {
    button.addEventListener("click", () => {
      const preset = data.presets.find((item) => item.title === button.dataset.title);
      if (!preset) return;
      queryInput.value = preset.query;
      focusSelect.value = preset.focus;
      markActivePreset(preset.title);
      runSearch();
    });
  });

  if (randomPresetButton) {
    randomPresetButton.addEventListener("click", () => {
      const options = data.presets.filter((preset) => preset.title !== activePresetTitle);
      const next = options[Math.floor(Math.random() * options.length)] || data.presets[0];
      if (!next) return;
      queryInput.value = next.query;
      focusSelect.value = next.focus;
      markActivePreset(next.title);
      runSearch();
    });
  }

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const exactPreset = data.presets.find((preset) => preset.query === queryInput.value.trim());
    markActivePreset(exactPreset ? exactPreset.title : "");
    runSearch();
  });

  focusSelect.addEventListener("change", runSearch);
  depthSelect.addEventListener("change", runSearch);

  runSearch();
}

function buildResultModel(query, focus, depth) {
  const queryState = buildQueryVector(query);
  const primaryPool =
    focus === "all"
      ? data.passages
      : data.passages.filter((passage) => passage.tradition === focus);

  const rankedPrimary = primaryPool
    .map((passage) => ({
      passage,
      score: scorePassage(passage, queryState.vector, queryState.tokens, query)
    }))
    .sort((left, right) => right.score - left.score)
    .slice(0, depth);

  const pairs = rankedPrimary.map((entry) => {
    const counterpartPool = data.passages.filter(
      (passage) => passage.tradition !== entry.passage.tradition
    );

    const rankedCounterparts = counterpartPool
      .map((passage) => ({
        passage,
        score: clamp(
          cosineSimilarity(entry.passage.vector, passage.vector) * 0.64 +
            scorePassage(passage, queryState.vector, queryState.tokens, query) * 0.36,
          0,
          0.99
        )
      }))
      .sort((left, right) => right.score - left.score);

    const bestCounterpart = rankedCounterparts[0];
    const alternates = rankedCounterparts.slice(1, 3);
    const sharedConcepts = getSharedConcepts(
      entry.passage.vector,
      bestCounterpart?.passage?.vector || {},
      queryState.vector,
      3
    );

    return {
      primary: entry.passage,
      primaryScore: entry.score,
      counterpart: bestCounterpart?.passage || null,
      counterpartScore: bestCounterpart?.score || 0,
      alternates,
      sharedConcepts
    };
  });

  const authors = new Set();
  pairs.forEach((pair) => {
    authors.add(pair.primary.author);
    if (pair.counterpart) authors.add(pair.counterpart.author);
  });

  const topConcepts = getTopConcepts(queryState.vector, 4);
  const averageFit =
    pairs.reduce((sum, pair) => sum + pair.counterpartScore, 0) / Math.max(pairs.length, 1);

  return {
    query,
    focus,
    depth,
    pairs,
    topConcepts,
    averageFit,
    queryEvidence: queryState.evidence,
    authors: [...authors]
  };
}

function buildQueryVector(query) {
  const vector = emptyVector();
  const evidence = {};
  const normalized = normalizeText(query);

  data.phraseBoosts.forEach((boost) => {
    if (normalized.includes(boost.match)) {
      mergeWeights(vector, boost.weights, 1, boost.match, evidence);
    }
  });

  data.concepts.forEach((concept) => {
    concept.terms.forEach((term) => {
      if (normalized.includes(normalizeText(term))) {
        const weight = term.includes(" ") || /[\u3400-\u9fff]/.test(term) ? 0.55 : 0.32;
        vector[concept.id] += weight;
        pushEvidence(evidence, concept.id, term);
      }
    });
  });

  const authorProfiles = getAuthorProfiles();
  authorProfiles.forEach((profile) => {
    const authorHit =
      normalized.includes(profile.author.toLowerCase()) ||
      normalized.includes(profile.work.toLowerCase());

    if (authorHit) {
      mergeWeights(vector, profile.vector, 0.34, profile.author, evidence);
    }
  });

  const tokens = extractTokens(query);

  if (vectorMagnitude(vector) === 0) {
    data.passages
      .map((passage) => ({
        passage,
        lexical: lexicalHitCount(tokens, passage)
      }))
      .filter((entry) => entry.lexical > 0)
      .sort((left, right) => right.lexical - left.lexical)
      .slice(0, 3)
      .forEach((entry) => {
        mergeWeights(vector, entry.passage.vector, 0.22, entry.passage.author, evidence);
      });
  }

  if (vectorMagnitude(vector) === 0) {
    mergeWeights(
      vector,
      {
        self_cultivation: 0.5,
        virtue: 0.36,
        awakening: 0.3
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

function scorePassage(passage, queryVector, tokens, queryText) {
  const semantic = cosineSimilarity(queryVector, passage.vector);
  const lexical = Math.min(0.26, lexicalHitCount(tokens, passage) * 0.055);
  const normalizedQuery = normalizeText(queryText);
  const mentionBoost =
    normalizedQuery.includes(passage.author.toLowerCase()) ||
    normalizedQuery.includes(passage.work.toLowerCase())
      ? 0.12
      : 0;

  return clamp(semantic * 0.8 + lexical + mentionBoost, 0, 0.99);
}

function lexicalHitCount(tokens, passage) {
  const haystack = normalizeText(
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

function renderResultSummary(model) {
  const target = document.getElementById("result-summary");
  if (!target) return;

  const conceptLabels = model.topConcepts.map((concept) => concept.label);
  const readableList = joinLabels(conceptLabels);

  target.innerHTML = `
    <div class="summary-copy">
      <p class="eyebrow">Semantic reading</p>
      <h2>${readableList}</h2>
      <p>
        Primary search ran over ${focusLabel(model.focus)}, then each result was paired against the
        opposite canon. The strongest activated concepts were ${readableList.toLowerCase()}.
      </p>
    </div>
    <div class="summary-stats">
      <div>
        <strong>${model.pairs.length}</strong>
        <span>primary passages</span>
      </div>
      <div>
        <strong>${model.authors.length}</strong>
        <span>authors touched</span>
      </div>
      <div>
        <strong>${formatPercent(model.averageFit)}</strong>
        <span>avg counterpart fit</span>
      </div>
    </div>
  `;
}

function renderConceptInsights(model) {
  const target = document.getElementById("concept-insights");
  if (!target) return;

  target.innerHTML = model.topConcepts
    .map((concept) => {
      const evidence = model.queryEvidence[concept.id] || [];
      return `
        <article class="insight-card" style="border-top: 4px solid ${concept.color}">
          <span class="pill" style="background: ${hexToRgba(concept.color, 0.12)}; color: ${concept.color}">
            ${concept.label}
          </span>
          <strong>${formatPercent(concept.weight)} activation</strong>
          <p>${concept.description}</p>
          <p>${evidence.length ? `Triggered by ${joinLabels(evidence)}.` : "Triggered by semantic proximity."}</p>
        </article>
      `;
    })
    .join("");
}

function renderPairGrid(model) {
  const target = document.getElementById("pair-grid");
  if (!target) return;

  target.innerHTML = model.pairs
    .map((pair, index) => {
      const shared = pair.sharedConcepts.map((concept) => concept.label);
      const sharedLabel = shared.length ? joinLabels(shared) : "Cross-tradition semantic overlap";
      const alternates = pair.alternates
        .map((entry) => `${entry.passage.author} ${entry.passage.work} (${formatPercent(entry.score)})`)
        .join(" · ");

      return `
        <article class="pair-card reveal">
          <div class="pair-head">
            <div>
              <p class="eyebrow">Pair ${String(index + 1).padStart(2, "0")}</p>
              <h3>${sharedLabel}</h3>
            </div>
            <span class="score-chip">${formatPercent(pair.counterpartScore)} fit</span>
          </div>
          <p class="pair-meta">
            Shared semantic neighborhood: ${sharedLabel.toLowerCase()}.
          </p>
          <div class="pair-columns">
            ${renderPassageCard(pair.primary, "primary", pair.primaryScore, [])}
            ${renderPassageCard(pair.counterpart, "counterpart", pair.counterpartScore, alternates)}
          </div>
          <p class="pair-rationale">
            Why this pair: ${buildPairRationale(pair)}
          </p>
        </article>
      `;
    })
    .join("");
}

function renderPassageCard(passage, role, score, alternates) {
  if (!passage) return "";

  const dominantConcepts = topPassageConcepts(passage.vector, 3);
  const roleLabel = role === "primary" ? "primary" : "counterpart";

  return `
    <article class="passage-card tradition-${passage.tradition}">
      <div class="passage-head">
        <span class="pill tradition-${passage.tradition}">
          ${capitalize(passage.tradition)} ${roleLabel}
        </span>
        <span class="score-chip">${formatPercent(score)}</span>
      </div>
      <h4>${passage.author} <span>${passage.work}</span></h4>
      <p class="passage-meta">${passage.section} · ${passage.language}</p>
      ${passage.original ? `<p class="passage-original">${passage.original}</p>` : ""}
      <p class="passage-translation">${passage.translation}</p>
      <p class="passage-note">${passage.note}</p>
      <div class="tag-row">
        ${dominantConcepts.map((concept) => `<span class="tag">${concept.label}</span>`).join("")}
      </div>
      ${role === "counterpart" && alternates ? `<p class="alt-note">Also nearby: ${alternates}</p>` : ""}
    </article>
  `;
}

function buildPairRationale(pair) {
  const shared = pair.sharedConcepts.map((concept) => concept.label.toLowerCase());
  if (!shared.length) {
    return "both passages occupy adjacent conceptual terrain even without a single dominant shared label.";
  }

  const joined = joinLabels(shared);
  const easternHint = pair.counterpart.original
    ? "The Eastern result preserves original Chinese while extending the same concept cluster."
    : "The counterpart stays close in semantic space across traditions.";

  return `both passages cluster around ${joined}, and ${easternHint.toLowerCase()}`;
}

function renderGraph(model) {
  const graph = document.getElementById("knowledge-graph");
  const legend = document.getElementById("graph-legend");

  if (!graph || !legend) return;

  const activeConcepts = new Set(model.topConcepts.map((concept) => concept.id));
  const activeAuthors = new Set(model.authors);
  const authorProfiles = getAuthorProfiles();
  const westernAuthors = authorProfiles.filter((profile) => profile.tradition === "western");
  const easternAuthors = authorProfiles.filter((profile) => profile.tradition === "eastern");
  const conceptPositions = [
    { x: 390, y: 110 },
    { x: 610, y: 110 },
    { x: 320, y: 210 },
    { x: 500, y: 210 },
    { x: 680, y: 210 },
    { x: 390, y: 320 },
    { x: 610, y: 320 },
    { x: 320, y: 430 },
    { x: 500, y: 430 },
    { x: 680, y: 430 },
    { x: 390, y: 540 },
    { x: 610, y: 540 }
  ];

  const westernNodes = westernAuthors.map((profile, index) => ({
    ...profile,
    x: 130,
    y: spreadY(index, westernAuthors.length, 110, 530)
  }));

  const easternNodes = easternAuthors.map((profile, index) => ({
    ...profile,
    x: 870,
    y: spreadY(index, easternAuthors.length, 140, 500)
  }));

  const authorNodes = [...westernNodes, ...easternNodes];

  const edgeMarkup = authorNodes
    .flatMap((node) =>
      data.concepts
        .map((concept, index) => {
          const conceptPosition = conceptPositions[index];
          const weight = getWeight(node.vector, concept.id);

          if (weight < 0.42) return "";

          const active = activeAuthors.has(node.author) || activeConcepts.has(concept.id);
          const stroke = active ? concept.color : "rgba(95, 109, 117, 0.22)";
          const opacity = active ? 0.72 : Math.max(0.18, weight * 0.32);

          return `
            <line
              class="graph-edge ${active ? "is-active" : ""}"
              x1="${node.x}"
              y1="${node.y}"
              x2="${conceptPosition.x}"
              y2="${conceptPosition.y}"
              style="stroke:${stroke};opacity:${opacity}"
            ></line>
          `;
        })
        .filter(Boolean)
    )
    .join("");

  const conceptMarkup = data.concepts
    .map((concept, index) => {
      const position = conceptPositions[index];
      const active = activeConcepts.has(concept.id);

      return `
        <g>
          <circle
            class="graph-node-circle concept ${active ? "is-active" : ""}"
            cx="${position.x}"
            cy="${position.y}"
            r="${active ? 22 : 18}"
            style="fill:${active ? hexToRgba(concept.color, 0.9) : "rgba(255,255,255,0.9)"}; stroke:${concept.color}"
          ></circle>
          <text class="graph-label" x="${position.x}" y="${position.y + 40}">
            ${concept.label}
          </text>
        </g>
      `;
    })
    .join("");

  const authorMarkup = authorNodes
    .map((node) => {
      const isActive = activeAuthors.has(node.author);
      const activeClass = isActive ? `active-${node.tradition}` : "";

      return `
        <g>
          <circle
            class="graph-node-circle author ${activeClass}"
            cx="${node.x}"
            cy="${node.y}"
            r="${isActive ? 28 : 24}"
          ></circle>
          <text class="graph-label" x="${node.x}" y="${node.y + 42}">
            ${node.author}
          </text>
        </g>
      `;
    })
    .join("");

  graph.innerHTML = `
    <text class="graph-side-label" x="80" y="42">WESTERN</text>
    <text class="graph-side-label" x="802" y="42">EASTERN</text>
    ${edgeMarkup}
    ${conceptMarkup}
    ${authorMarkup}
  `;

  legend.innerHTML = model.topConcepts
    .map(
      (concept) => `
        <span class="legend-item">
          <span class="legend-swatch" style="background:${concept.color}"></span>
          ${concept.label}
        </span>
      `
    )
    .join("");
}

function getAuthorProfiles() {
  return data.corpusIndex.map((entry) => {
    const passages = data.passages.filter((passage) => passage.author === entry.author);
    return {
      author: entry.author,
      work: entry.work,
      tradition: entry.tradition,
      vector: averageVectors(passages.map((passage) => passage.vector))
    };
  });
}

function averageVectors(vectors) {
  const total = emptyVector();

  vectors.forEach((vector) => {
    data.concepts.forEach((concept) => {
      total[concept.id] += getWeight(vector, concept.id);
    });
  });

  data.concepts.forEach((concept) => {
    total[concept.id] /= Math.max(vectors.length, 1);
  });

  return total;
}

function topPassageConcepts(vector, limit) {
  return getTopConcepts(vector, limit);
}

function getTopConcepts(vector, limit) {
  return data.concepts
    .map((concept) => ({
      ...concept,
      weight: getWeight(vector, concept.id)
    }))
    .filter((concept) => concept.weight > 0)
    .sort((left, right) => right.weight - left.weight)
    .slice(0, limit);
}

function getSharedConcepts(leftVector, rightVector, queryVector, limit) {
  return data.concepts
    .map((concept) => {
      const left = getWeight(leftVector, concept.id);
      const right = getWeight(rightVector, concept.id);
      const query = getWeight(queryVector, concept.id);
      return {
        ...concept,
        weight: left + right + query * 0.6,
        left,
        right
      };
    })
    .filter((concept) => concept.left > 0.26 && concept.right > 0.26)
    .sort((a, b) => b.weight - a.weight)
    .slice(0, limit);
}

function emptyVector() {
  return data.concepts.reduce((accumulator, concept) => {
    accumulator[concept.id] = 0;
    return accumulator;
  }, {});
}

function mergeWeights(target, source, scale, reason, evidence) {
  Object.entries(source).forEach(([key, value]) => {
    target[key] += value * scale;
    pushEvidence(evidence, key, reason);
  });
}

function pushEvidence(evidence, key, value) {
  if (!value) return;
  if (!evidence[key]) evidence[key] = [];
  if (!evidence[key].includes(value)) evidence[key].push(value);
}

function vectorMagnitude(vector) {
  return Math.sqrt(
    data.concepts.reduce((sum, concept) => sum + getWeight(vector, concept.id) ** 2, 0)
  );
}

function cosineSimilarity(leftVector, rightVector) {
  const leftMagnitude = vectorMagnitude(leftVector);
  const rightMagnitude = vectorMagnitude(rightVector);

  if (!leftMagnitude || !rightMagnitude) return 0;

  const dotProduct = data.concepts.reduce(
    (sum, concept) => sum + getWeight(leftVector, concept.id) * getWeight(rightVector, concept.id),
    0
  );

  return dotProduct / (leftMagnitude * rightMagnitude);
}

function extractTokens(text) {
  const normalized = normalizeText(text);
  const latin = normalized
    .replace(/[^a-z0-9\s-]/g, " ")
    .split(/\s+/)
    .filter((token) => token && token.length > 2 && !STOP_WORDS.has(token));
  const han = normalized.match(/[\u3400-\u9fff]+/g) || [];

  return [...new Set([...latin, ...han])];
}

function normalizeText(text) {
  return String(text || "").toLowerCase();
}

function getWeight(vector, key) {
  return vector[key] || 0;
}

function formatPercent(value) {
  return `${Math.round(clamp(value, 0, 0.99) * 100)}%`;
}

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function spreadY(index, total, top, bottom) {
  if (total <= 1) return (top + bottom) / 2;
  return top + ((bottom - top) * index) / (total - 1);
}

function focusLabel(focus) {
  if (focus === "western") return "the Western canon";
  if (focus === "eastern") return "the Eastern canon";
  return "both canons";
}

function joinLabels(items) {
  if (!items.length) return "";
  if (items.length === 1) return items[0];
  if (items.length === 2) return `${items[0]} and ${items[1]}`;
  return `${items.slice(0, -1).join(", ")}, and ${items[items.length - 1]}`;
}

function capitalize(value) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

function hexToRgba(hex, alpha) {
  const normalized = hex.replace("#", "");
  const safeHex = normalized.length === 3
    ? normalized
        .split("")
        .map((char) => char + char)
        .join("")
    : normalized;
  const number = parseInt(safeHex, 16);
  const red = (number >> 16) & 255;
  const green = (number >> 8) & 255;
  const blue = number & 255;
  return `rgba(${red}, ${green}, ${blue}, ${alpha})`;
}

init();
