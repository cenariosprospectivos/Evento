
const BRASIL_BOUNDS = window.CONFIG_VISUAL?.mapas?.brasilBounds || [[-34.8, -74.5], [6.0, -32.0]];

function $(id) {
  return document.getElementById(id);
}

function formatDateBR(iso) {
  if (!iso) return "";
  const [year, month, day] = iso.split("-");
  return `${day}/${month}/${year}`;
}

function formatNumber(value) {
  if (value === null || value === undefined || Number.isNaN(value)) return "—";
  return new Intl.NumberFormat("pt-BR").format(value);
}

function setText(id, text) {
  const el = $(id);
  if (el) el.textContent = text || "";
}

function initHeader() {
  const abertura = window.TEXTO_ABERTURA || {};
  const config = window.STORYTELLING_CONFIG || {};

  setText("heroTitle", abertura.titulo || config.titulo);
  setText("heroSubtitle", abertura.subtitulo || config.subtitulo);
  setText("heroHypothesis", abertura.hipotese || config.hipotese);
}

function styleFaixa() {
  return {
    color: "#254f7a",
    weight: 2,
    opacity: 0.9,
    fillColor: "#8fd3ff",
    fillOpacity: 0.22,
    dashArray: "6 6"
  };
}

function styleOrcrimPin(feature, latlng) {
  const id = feature?.properties?.id || "ORC";
  const icon = L.divIcon({
    className: "pin-wrapper",
    html: `<div class="pin-icon"><span>${id.replace("ORC-", "")}</span></div>`,
    iconSize: [46, 46],
    iconAnchor: [23, 46],
    popupAnchor: [0, -42]
  });
  return L.marker(latlng, { icon });
}

function popupFeature(feature) {
  const p = feature.properties || {};
  const fields = [
    ["Facção de maior influência", p.faccao_maior_influencia],
    ["Organizações / dinâmica", p.organizacoes],
    ["Tipo de influência", p.tipo_influencia],
    ["País relacionado", p.pais_relacionado],
    ["Latitude", p.lat],
    ["Longitude", p.lon],
    ["Confiabilidade", p.confiabilidade],
    ["Fonte", p.fonte]
  ].filter(([, value]) => value !== undefined && value !== "");

  return `
    <article class="popup-card">
      <strong>${p.id || ""} — ${p.nome || "Ponto"}</strong>
      <p>${p.descricao || ""}</p>
      ${fields.map(([k, v]) => `<p><b>${k}:</b> ${v}</p>`).join("")}
    </article>
  `;
}

function initMapFaixa() {
  if (!window.L || !$("mapFaixa")) return;
  const map = L.map("mapFaixa", { scrollWheelZoom: false }).fitBounds(BRASIL_BOUNDS);
  addTiles(map);
  const layer = L.geoJSON(window.GEO_FAIXA_FRONTEIRA, {
    style: styleFaixa,
    onEachFeature: (feature, lyr) => {
      const p = feature.properties || {};
      lyr.bindPopup(`<strong>${p.nome || "Faixa de fronteira"}</strong><p>${p.descricao || ""}</p><p><b>Fonte conceitual:</b> ${p.fonte_conceitual || ""}</p>`);
    }
  }).addTo(map);
  try {
    const bounds = layer.getBounds();
    if (bounds.isValid()) map.fitBounds(bounds, { padding: [22,22] });
  } catch (e) {}
  setTimeout(() => map.invalidateSize(true), 300);
}

function initMapOrcrim() {
  if (!window.L || !$("mapOrcrim")) return;
  const map = L.map("mapOrcrim", { scrollWheelZoom: false }).fitBounds(BRASIL_BOUNDS);
  addTiles(map);
  const layer = L.geoJSON(window.GEO_ORCRIM_PINS, {
    pointToLayer: styleOrcrimPin,
    onEachFeature: (feature, lyr) => lyr.bindPopup(popupFeature(feature))
  }).addTo(map);
  try {
    const bounds = layer.getBounds();
    if (bounds.isValid()) map.fitBounds(bounds, { padding: [30,30] });
  } catch (e) {}
  setTimeout(() => map.invalidateSize(true), 300);
}

function addTiles(map) {
  L.tileLayer("https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png", {
    subdomains: "abcd",
    maxZoom: 20,
    attribution: "&copy; OpenStreetMap contributors &copy; CARTO"
  }).addTo(map);
}

function renderTextSections() {
  const faixa = window.TEXTO_FAIXA_FRONTEIRA || {};
  setText("faixaTitle", faixa.titulo);
  setText("faixaText", faixa.texto);
  $("faixaObservation").innerHTML = faixa.observacao || "";

  const orcrim = window.TEXTO_ORCRIM_ATUACAO || {};
  setText("orcrimTitle", orcrim.titulo);
  setText("orcrimText", orcrim.texto);
  $("orcrimObservation").innerHTML = orcrim.observacao || "";

  const timeline = window.TEXTO_TIMELINE || {};
  setText("timelineTitle", timeline.titulo);
  setText("timelineText", timeline.texto);
  $("timelineObservation").innerHTML = timeline.observacao || "";

  const santos = window.TEXTO_APREENSAO_SANTOS || {};
  setText("santosTextTitle", santos.titulo);
  setText("santosText", santos.texto);
  $("santosObservation").innerHTML = santos.observacao || "";

  const cone = window.TEXTO_APREENSAO_CONE_NORTE || {};
  setText("coneTextTitle", cone.titulo);
  setText("coneText", cone.texto);
  $("coneObservation").innerHTML = cone.observacao || "";

  const conclusao = window.TEXTO_CONCLUSAO || {};
  setText("conclusionTitle", conclusao.titulo);
  setText("conclusionText", conclusao.texto);
  $("conclusionObservation").innerHTML = conclusao.observacao || "";

  $("legendFaixa").innerHTML = `<span><i style="background:#8fd3ff;border-color:#254f7a"></i> Faixa de fronteira — representação visual</span>`;
  $("legendOrcrim").innerHTML = `<span><i style="background:#923429;border-color:#fff"></i> Pin de influência relatada</span>`;
}

function renderNews() {
  const news = window.NOTICIAS_FRONTEIRA || [];
  const grid = $("newsGrid");
  const filters = $("newsFilters");
  if (!grid || !filters) return;

  const themes = ["Todos", ...Array.from(new Set(news.map(item => item.tema)))];

  filters.innerHTML = themes.map((theme, index) => `
    <button class="filter-chip ${index === 0 ? "is-active" : ""}" data-theme="${theme}">${theme}</button>
  `).join("");

  function draw(theme = "Todos") {
    const filtered = theme === "Todos" ? news : news.filter(item => item.tema === theme);
    grid.innerHTML = filtered.map(item => `
      <article class="news-card">
        <span class="tag">${item.id}</span>
        <h3>${item.titulo}</h3>
        <div class="news-meta">
          <span>${formatDateBR(item.data)}</span>
          <span>· ${item.pais_area}</span>
          <span>· ${item.fonte}</span>
        </div>
        <p>${item.resumo}</p>
        <p><strong>Relevância:</strong> ${item.relevancia}</p>
        <a class="button-link" href="${item.url}" target="_blank" rel="noopener noreferrer">Abrir fonte</a>
      </article>
    `).join("");
  }

  filters.querySelectorAll(".filter-chip").forEach(button => {
    button.addEventListener("click", () => {
      filters.querySelectorAll(".filter-chip").forEach(btn => btn.classList.remove("is-active"));
      button.classList.add("is-active");
      draw(button.dataset.theme);
    });
  });

  draw();
}

function renderTimeline() {
  const news = (window.NOTICIAS_FRONTEIRA || [])
    .filter(item => item.usar_na_timeline)
    .sort((a, b) => String(a.data).localeCompare(String(b.data)));

  const strip = $("timelineStrip");
  const detail = $("timelineDetail");
  if (!strip || !detail) return;

  strip.innerHTML = news.map((item, index) => `
    <button class="timeline-item ${index === 0 ? "is-active" : ""}" data-id="${item.id}">
      <span>${formatDateBR(item.data)}</span>
      <strong>${item.id}</strong>
      <small>${item.tema}</small>
    </button>
  `).join("");

  function show(id) {
    const item = news.find(n => n.id === id) || news[0];
    if (!item) return;
    detail.innerHTML = `
      <span class="tag">${item.id} · ${item.pais_area}</span>
      <h3>${item.titulo}</h3>
      <div class="source-row">
        <span>${formatDateBR(item.data)}</span>
        <span>· ${item.fonte}</span>
        <span>· ${item.tema}</span>
      </div>
      <p>${item.resumo}</p>
      <p><strong>Relevância:</strong> ${item.relevancia}</p>
      <a class="button-link" href="${item.url}" target="_blank" rel="noopener noreferrer">Abrir fonte</a>
    `;
  }

  strip.querySelectorAll(".timeline-item").forEach(button => {
    button.addEventListener("click", () => {
      strip.querySelectorAll(".timeline-item").forEach(btn => btn.classList.remove("is-active"));
      button.classList.add("is-active");
      show(button.dataset.id);
    });
  });

  if (news.length) show(news[0].id);
}

function chartOptions(unit) {
  const colors = window.CONFIG_VISUAL?.graficos?.cores || {};
  return {
    responsive: true,
    maintainAspectRatio: false,
    interaction: { mode: "nearest", intersect: false },
    plugins: {
      legend: { labels: { color: colors.texto || "#172018" } },
      tooltip: {
        callbacks: {
          label: ctx => `${ctx.dataset.label}: ${formatNumber(ctx.parsed.y)} ${unit || ""}`
        }
      }
    },
    scales: {
      x: { grid: { color: colors.grade || "rgba(23,32,24,.12)" }, ticks: { color: colors.texto || "#172018" } },
      y: { grid: { color: colors.grade || "rgba(23,32,24,.12)" }, ticks: { color: colors.texto || "#172018" } }
    },
    elements: {
      line: { tension: .28 },
      point: { radius: 4, hoverRadius: 6 }
    }
  };
}

function makeLineChart(canvasId, labels, datasets, unit) {
  const canvas = $(canvasId);
  if (!canvas || !window.Chart) return false;
  new Chart(canvas, {
    type: "line",
    data: { labels, datasets },
    options: chartOptions(unit)
  });
  return true;
}

function renderFallbackTable(containerId, rows, columns) {
  const el = $(containerId);
  if (!el) return;
  el.innerHTML = `
    <table>
      <thead><tr>${columns.map(c => `<th>${c.label}</th>`).join("")}</tr></thead>
      <tbody>
        ${rows.map(row => `<tr>${columns.map(c => `<td>${c.format ? c.format(row[c.key], row) : (row[c.key] ?? "—")}</td>`).join("")}</tr>`).join("")}
      </tbody>
    </table>
  `;
}

function renderCharts() {
  renderSantosChart();
  renderConeChart();
  renderGloChart();
}

function renderSantosChart() {
  const serie = window.SERIE_APREENSAO_SANTOS;
  if (!serie) return;
  setText("santosChartTitle", serie.titulo);
  const labels = serie.dados.map(d => d.ano);
  const colors = window.CONFIG_VISUAL?.graficos?.cores || {};
  const ok = makeLineChart("chartSantos", labels, [
    {
      label: "Cocaína apreendida",
      data: serie.dados.map(d => d.valor),
      borderColor: colors.santos || "#254f7a",
      backgroundColor: "rgba(37,79,122,.14)",
      spanGaps: false
    }
  ], serie.unidade);
  renderFallbackTable("santosFallback", serie.dados, [
    { key: "ano", label: "Ano" },
    { key: "valor", label: `Valor (${serie.unidade})`, format: formatNumber },
    { key: "status", label: "Status" },
    { key: "fonte", label: "Fonte" }
  ]);
  if (ok) $("santosFallback").style.display = "none";
}

function renderConeChart() {
  const serie = window.SERIE_APREENSAO_CONE_NORTE;
  if (!serie) return;
  setText("coneChartTitle", serie.titulo);
  const labels = serie.dados.map(d => d.ano);
  const colors = window.CONFIG_VISUAL?.graficos?.cores || {};
  const ok = makeLineChart("chartCone", labels, [
    {
      label: "Cocaína apreendida",
      data: serie.dados.map(d => d.valor),
      borderColor: colors.cone_norte || "#923429",
      backgroundColor: "rgba(146,52,41,.14)",
      spanGaps: false
    }
  ], serie.unidade);
  renderFallbackTable("coneFallback", serie.dados, [
    { key: "ano", label: "Ano" },
    { key: "valor", label: `Valor (${serie.unidade})`, format: formatNumber },
    { key: "status", label: "Status" },
    { key: "fonte", label: "Fonte" }
  ]);
  if (ok) $("coneFallback").style.display = "none";

  const evidencias = serie.evidencias_portuarias || [];
  $("coneEvidence").innerHTML = evidencias.map(item => `
    <article class="evidence-item">
      <span class="tag">${item.ano} · ${item.local}</span>
      <p><strong>${formatNumber(item.valor)} ${item.unidade}</strong> de ${item.droga}. ${item.descricao}</p>
      <a href="${item.url}" target="_blank" rel="noopener noreferrer">Abrir fonte</a>
    </article>
  `).join("");
}

function renderGloChart() {
  const serie = window.SERIE_GLO_FORCA_NACIONAL;
  if (!serie) return;
  setText("gloChartTitle", serie.titulo);
  const labels = serie.dados.map(d => d.ano);
  const colors = window.CONFIG_VISUAL?.graficos?.cores || {};
  const ok = makeLineChart("chartGlo", labels, [
    {
      label: "GLO — operações",
      data: serie.dados.map(d => d.glo),
      borderColor: colors.glo || "#1b6ca8",
      backgroundColor: "rgba(27,108,168,.14)",
      spanGaps: false
    },
    {
      label: "Força Nacional — atos publicados",
      data: serie.dados.map(d => d.forca_nacional),
      borderColor: colors.forca_nacional || "#c77d1a",
      backgroundColor: "rgba(199,125,26,.14)",
      spanGaps: false
    }
  ], serie.unidade);
  renderFallbackTable("gloFallback", serie.dados, [
    { key: "ano", label: "Ano" },
    { key: "glo", label: "GLO — operações", format: formatNumber },
    { key: "forca_nacional", label: "Força Nacional — atos", format: formatNumber }
  ]);
  if (ok) $("gloFallback").style.display = "none";
}

function main() {
  initHeader();
  renderTextSections();
  renderTimeline();
  renderCharts();
  initMapFaixa();
  initMapOrcrim();
}

document.addEventListener("DOMContentLoaded", main);
