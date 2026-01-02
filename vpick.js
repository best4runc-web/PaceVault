// Definícia otázok (zjednodušená 1. verzia). [file:956]
const VpickSteps = [
  {
    key: "surface",
    title: "Kde najčastejšie beháš?",
    sub: "Vyber hlavný povrch. Neskôr to vieš doladiť konkrétnym modelom.",
    options: [
      { value: "road", label: "Cesta / asfalt" },
      { value: "trail", label: "Trail / terén" },
      { value: "any", label: "Mix povrchov / neviem" }
    ]
  },
  {
    key: "segment",
    title: "Na čo chceš topánky použiť?",
    sub: "Tréning, preteky alebo trail?",
    options: [
      { value: "daily", label: "Každodenný tréning" },
      { value: "daily-stability", label: "Tréning so stabilitou" },
      { value: "racing", label: "Preteky / tempo" },
      { value: "trail-universal", label: "Trail – univerzál" },
      { value: "trail-ultra", label: "Trail – dlhé behy" },
      { value: "any", label: "Nechám si poradiť" }
    ]
  },
  {
    key: "runnerLevel",
    title: "Ako by si sa opísal?",
    sub: "Nerieš tempo, skôr skúsenosti.",
    options: [
      { value: "beginner", label: "Začiatočník / vraciam sa k behu" },
      { value: "intermediate", label: "Mierne pokročilý" },
      { value: "racer", label: "Pretekár / tempo nadovšetko" },
      { value: "any", label: "Neviem / je mi to jedno" }
    ]
  },
  {
    key: "gait",
    title: "Potrebujete stabilitu?",
    sub: "Ak máš výraznú pronáciu, zvoľ podporu.",
    options: [
      { value: "neutral", label: "Skôr neutrál" },
      { value: "support", label: "Potrebujem podporu (pronácia)" },
      { value: "any", label: "Neviem" }
    ]
  },
  {
    key: "budget",
    title: "Aký máš rozpočet na pár?",
    sub: "Orientačne v eurách.",
    options: [
      { value: "to80", label: "Do 80 €" },
      { value: "80-120", label: "80 – 120 €" },
      { value: "120-170", label: "120 – 170 €" },
      { value: "170+", label: "170+ € (top modely / karbón)" },
      { value: "any", label: "Rozpočet neriešim" }
    ]
  }
];

const answers = {};
let currentStepIndex = 0;
let selectedShoeId = null;

function $(id){ return document.getElementById(id); }

function renderWizard(){
  const step = VpickSteps[currentStepIndex];
  const total = VpickSteps.length;
  const container = $("wizard");

  const selectedValue = answers[step.key] ?? null;

  const optionsHtml = step.options.map(opt => `
    <button
      class="vp-option ${selectedValue === opt.value ? "vp-option-active" : ""}"
      type="button"
      data-value="${opt.value}"
    >
      ${opt.label}
    </button>
  `).join("");

  container.innerHTML = `
    <h1 class="vp-step-title">${step.title}</h1>
    <p class="vp-step-sub">${step.sub}</p>
    <div class="vp-options">${optionsHtml}</div>

    <div class="vp-step-footer">
      <div class="vp-step-progress">
        Krok ${currentStepIndex + 1} / ${total}
      </div>
      <div class="vp-step-actions">
        <button class="vp-btn vp-btn-ghost" type="button" id="btn-skip">Preskočiť</button>
        ${
          currentStepIndex < total - 1
            ? `<button class="vp-btn vp-btn-primary" type="button" id="btn-next">Ďalej</button>`
            : `<button class="vp-btn vp-btn-secondary" type="button" id="btn-finish">Ukázať výsledky</button>`
        }
      </div>
    </div>
  `;

  // Eventy
  container.querySelectorAll(".vp-option").forEach(btn => {
    btn.addEventListener("click", () => {
      const value = btn.dataset.value;
      answers[step.key] = value;
      renderWizard(); // re-render pre highlight
    });
  });

  $("btn-skip").onclick = () => {
    // preskočené = žiadna hodnota (vymažeme prípadnú starú)
    delete answers[step.key];
    goNextStep();
  };

  const nextBtn = $("btn-next");
  if(nextBtn){
    nextBtn.onclick = () => {
      goNextStep();
    };
  }

  const finishBtn = $("btn-finish");
  if(finishBtn){
    finishBtn.onclick = () => {
      computeAndRenderResults();
    };
  }
}

function goNextStep(){
  if(currentStepIndex < VpickSteps.length - 1){
    currentStepIndex++;
    renderWizard();
  }else{
    computeAndRenderResults();
  }
}

// Filtračná funkcia
function computeAndRenderResults(){
  let result = VpickShoes.slice();

  // Povrch
  if(answers.surface && answers.surface !== "any"){
    result = result.filter(s => s.surface === answers.surface);
  }

  // Segment
  if(answers.segment && answers.segment !== "any"){
    result = result.filter(s =>
      s.segment === answers.segment ||
      (answers.segment === "trail-universal" && s.segment.startsWith("trail")) ||
      (answers.segment === "daily" && s.segment.startsWith("daily"))
    );
  }

  // Úroveň
  if(answers.runnerLevel && answers.runnerLevel !== "any"){
    result = result.filter(s => s.runnerLevel === answers.runnerLevel);
  }

  // Gait
  if(answers.gait && answers.gait !== "any"){
    if(answers.gait === "support"){
      result = result.filter(s => s.gait === "support" || s.segment.includes("stability"));
    }else{
      result = result.filter(s => s.gait === "neutral");
    }
  }

  // Rozpočet
  if(answers.budget && answers.budget !== "any"){
    result = result.filter(s => s.budget === budgetMap(answers.budget));
  }

  renderResults(result);
}

function budgetMap(ansBudget){
  if(ansBudget === "to80") return "to80";
  if(ansBudget === "80-120") return "80-120";
  if(ansBudget === "120-170") return "120-170";
  if(ansBudget === "170+") return "170+";
  return "any";
}

function renderResults(list){
  const info = $("results-info");
  const body = $("results-list");
  const detailSection = $("detail-section");
  detailSection.hidden = true;
  selectedShoeId = null;

  if(list.length === 0){
    info.textContent = "Podľa zadaných odpovedí sa nenašli žiadne modely. Skús niektoré otázky preskočiť alebo zmeniť.";
    body.innerHTML = "";
    return;
  }

  info.textContent = `Nájdené modely: ${list.length}`;

  body.innerHTML = list.map(s => `
    <article class="vp-card-shoe" data-id="${s.id}">
      <h3 class="vp-card-shoe-title">${s.brand} ${s.model}</h3>
      <div class="vp-card-shoe-tags">
        <span class="vp-tag">${s.surface === "trail" ? "Trail" : "Cesta"}</span>
        <span class="vp-tag">${segmentLabel(s.segment)}</span>
        <span class="vp-tag">${s.gait === "support" ? "Stabilita" : "Neutrál"}</span>
        <span class="vp-tag vp-tag-accent">${budgetLabel(s.budget)}</span>
      </div>
    </article>
  `).join("");

  body.querySelectorAll(".vp-card-shoe").forEach(card => {
    card.addEventListener("click", () => {
      const id = card.dataset.id;
      const shoe = VpickShoes.find(x => x.id === id);
      if(shoe) showDetail(shoe);
    });
  });
}

function segmentLabel(seg){
  if(seg === "daily") return "Daily tréning";
  if(seg === "daily-stability") return "Tréning + stabilita";
  if(seg === "racing") return "Preteky / tempo";
  if(seg === "trail-universal") return "Trail univerzál";
  if(seg === "trail-ultra") return "Trail ultra";
  return seg;
}

function budgetLabel(b){
  if(b === "to80") return "Do 80 €";
  if(b === "80-120") return "80–120 €";
  if(b === "120-170") return "120–170 €";
  if(b === "170+") return "170+ €";
  return "Rôzne";
}

function showDetail(shoe){
  selectedShoeId = shoe.id;

  const detail = $("detail");
  const section = $("detail-section");
  section.hidden = false;

  const imageHtml = shoe.image
    ? `<img src="images/${shoe.image}" alt="${shoe.brand} ${shoe.model}" />`
    : `<div>Sem môžeš pridať fotku modelu s orezaným pozadím (${shoe.image || "názov_súboru.png"}).</div>`;

  detail.innerHTML = `
    <div class="vp-detail-wrap">
      <div>
        <h2 class="vp-detail-title">${shoe.brand} ${shoe.model}</h2>
        <p class="vp-detail-brand">${segmentLabel(shoe.segment)} • ${shoe.surface === "trail" ? "Trail" : "Cesta"}</p>

        <table class="vp-detail-table">
          <tbody>
            <tr>
              <th>Typ použitia</th>
              <td>${segmentLabel(shoe.segment)}</td>
            </tr>
            <tr>
              <th>Povrch</th>
              <td>${shoe.terrainDetail}</td>
            </tr>
            <tr>
              <th>Došľap</th>
              <td>${shoe.gait === "support" ? "Stabilita / pronácia" : "Neutrál"}</td>
            </tr>
            <tr>
              <th>Úroveň bežca</th>
              <td>${
                shoe.runnerLevel === "beginner"
                  ? "Začiatočník / rekreačný"
                  : shoe.runnerLevel === "intermediate"
                  ? "Mierne pokročilý"
                  : "Pretekár / výkonnostný"
              }</td>
            </tr>
            <tr>
              <th>Cieľové vzdialenosti</th>
              <td>${shoe.targetDistance}</td>
            </tr>
            <tr>
              <th>Úroveň tlmenia</th>
              <td>${
                shoe.cushion === "high"
                  ? "Vysoké / max"
                  : shoe.cushion === "medium"
                  ? "Stredné"
                  : "Skôr nižšie / responzívne"
              }</td>
            </tr>
            <tr>
              <th>Drop (kategória)</th>
              <td>${
                shoe.dropCat === "zero"
                  ? "0 mm (zero-drop)"
                  : shoe.dropCat === "low"
                  ? "Nižší (0–6 mm)"
                  : shoe.dropCat === "mid"
                  ? "Stredný (6–8 mm)"
                  : "Vyšší (8–12 mm)"
              }</td>
            </tr>
            <tr>
              <th>Šírka / fit</th>
              <td>${shoe.width}</td>
            </tr>
            <tr>
              <th>Hmotnosť</th>
              <td>${shoe.weight}</td>
            </tr>
            <tr>
              <th>Technológie / poznámka</th>
              <td>${shoe.tech}</td>
            </tr>
            <tr>
              <th>Rozpočet (úroveň)</th>
              <td>${budgetLabel(shoe.budget)}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="vp-detail-photo">
        ${imageHtml}
      </div>
    </div>
  `;
}

function initVpick(){
  renderWizard();
  $("detail-back").onclick = () => {
    $("detail-section").hidden = true;
    selectedShoeId = null;
  };
}

document.addEventListener("DOMContentLoaded", initVpick);
