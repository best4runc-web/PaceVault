function routeKey(){
  const key = (location.hash || "#home").replace("#", "");
  return key || "home";
}

function setActiveNav(key){
  document.querySelectorAll(".nav a").forEach(a => {
    a.classList.toggle("active", a.dataset.route === key);
  });
}

function renderHome(){
  return `
    <section class="hero">
      <div>
        <h1 class="h1">Čistý a moderný web pre bežcov.</h1>
        <p class="p">
          PaceVault spája katalóg tenisiek (shoepick), tréningové základy (vaultrain),
          odporúčania podľa typu bežca (vaultips) a návod na tréningový denník (vaultjournal).
        </p>
        <div style="margin-top:14px; display:flex; gap:10px; flex-wrap:wrap;">
          <a class="btn btn-primary" href="#shoepick" style="display:inline-block; text-decoration:none;">Prejsť na shoepick</a>
        </div>
      </div>

      <div class="grid">
        <div class="kpi"><strong>shoepick</strong><small>Filtrovanie a katalóg modelov (ukážka UI).</small></div>
        <div class="kpi"><strong>vaultrain</strong><small>Základné princípy a typy tréningov.</small></div>
        <div class="kpi"><strong>vaultjournal</strong><small>Návod na tréningový denník.</small></div>
      </div>
    </section>

    <section class="card">
      <h2 style="margin:0 0 8px;">Poznámka</h2>
      <p class="p">
        Toto je statická verzia vhodná pre GitHub Pages. API a databázu (Shoepick filter systém)
        treba hostovať zvlášť (Render/Railway/Fly.io), potom sa sem len doplní URL na API.
      </p>
    </section>
  `;
}

function renderShoepick(){
  return `
    <section class="hero">
      <div>
        <h1 class="h1">shoepick</h1>
        <p class="p">
          Ukážka filtračného UI. Na GitHub Pages bez backendu funguje len ako dizajn/prototyp.
        </p>

        <div class="card" style="margin-top:16px;">
          <h2 style="margin:0 0 10px;">Filtre</h2>

          <div class="grid">
            <div>
              <label>Povrch (povinné)</label>
              <select>
                <option>cesta</option>
                <option>trail</option>
                <option>hybrid</option>
              </select>
            </div>

            <div>
              <label>Použitie (povinné)</label>
              <select>
                <option>daily</option>
                <option>performance</option>
                <option>racing</option>
              </select>
            </div>

            <div>
              <label>Stabilita (povinné)</label>
              <select>
                <option>neutral</option>
                <option>stability</option>
              </select>
            </div>
          </div>

          <div style="margin-top:12px; display:flex; gap:10px; flex-wrap:wrap;">
            <button class="btn btn-primary" type="button" onclick="alert('Tu sa napojí API /api/shoes, keď bude backend online.')">Hľadať</button>
          </div>
        </div>
      </div>

      <div class="card">
        <h2 style="margin:0 0 10px;">Výsledky (demo)</h2>
        <div style="overflow:auto;">
          <table class="table">
            <thead>
              <tr>
                <th>Značka</th>
                <th>Model</th>
                <th>Verzia (latest)</th>
                <th>Povrch</th>
                <th>Použitie</th>
                <th>Stabilita</th>
                <th>Platňa</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>ASICS</td>
                <td>Novablast</td>
                <td>5</td>
                <td>road</td>
                <td>daily</td>
                <td>neutral</td>
                <td>none</td>
              </tr>
              <tr>
                <td>Nike</td>
                <td>Vaporfly</td>
                <td>3</td>
                <td>road</td>
                <td>racing</td>
                <td>neutral</td>
                <td>carbon</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>
  `;
}

function renderVaultips(){
  return `
    <section class="hero">
      <div>
        <h1 class="h1">vaultips</h1>
        <p class="p">
          Praktické odporúčania podľa typu bežca a cieľa. Sekciu vieš neskôr rozšíriť na články.
        </p>
      </div>
      <div class="card">
        <h2 style="margin:0 0 8px;">Rýchle tipy</h2>
        <ul class="p" style="margin:0; padding-left:18px;">
          <li>Najprv konzistentnosť, potom intenzita.</li>
          <li>Väčšina behov má byť ľahkých (komfortné tempo).</li>
          <li>Ak sa bolesť zhoršuje, uber objem a rieš príčinu.</li>
        </ul>
      </div>
    </section>
  `;
}

function renderVaultrain(){
  return `
    <section class="hero">
      <div>
        <h1 class="h1">vaultrain</h1>
        <p class="p">
          Základné informácie, ako zostaviť tréning: objem, intenzita, regenerácia a progres.
        </p>
      </div>

      <div class="card">
        <h2 style="margin:0 0 8px;">Typy tréningov</h2>
        <ul class="p" style="margin:0; padding-left:18px;">
          <li>Ľahký beh: základ vytrvalosti.</li>
          <li>Tempový beh: prahová vytrvalosť.</li>
          <li>Intervaly: rýchlosť a kapacita.</li>
          <li>Dlhý beh: odolnosť.</li>
          <li>Silový doplnok: prevencia zranení.</li>
        </ul>
      </div>
    </section>
  `;
}

function renderVaultjournal(){
  return `
    <section class="hero">
      <div>
        <h1 class="h1">vaultjournal</h1>
        <p class="p">
          Návod, ako si vytvoriť tréningový denník a čo si zapisovať, aby to malo zmysel.
        </p>
      </div>

      <div class="card">
        <h2 style="margin:0 0 8px;">Čo zapisovať</h2>
        <ul class="p" style="margin:0; padding-left:18px;">
          <li>Dĺžka, čas, pocit náročnosti (RPE).</li>
          <li>Povrch, topánky, únava, bolesť (0–10).</li>
          <li>Spánok, stres, regenerácia.</li>
        </ul>
      </div>
    </section>
  `;
}

function render(){
  const key = routeKey();
  setActiveNav(key);

  const app = document.getElementById("app");
  if(!app) return;

  if(key === "home") app.innerHTML = renderHome();
  else if(key === "shoepick") app.innerHTML = renderShoepick();
  else if(key === "vaultips") app.innerHTML = renderVaultips();
  else if(key === "vaultrain") app.innerHTML = renderVaultrain();
  else if(key === "vaultjournal") app.innerHTML = renderVaultjournal();
  else app.innerHTML = renderHome();
}

window.addEventListener("hashchange", render);
render();
