function loadMines() {
  const minesDiv = document.getElementById("mines");
  minesDiv.innerHTML = `
    <h2>💣 Mines</h2>

    <div style="margin-bottom:15px;display:flex;gap:10px;align-items:center;flex-wrap:wrap;">
      <label>Bet: $</label>
      <input type="number" id="minesBetInput" value="10" min="1">

      <label>Mines:</label>
      <select id="mineCountSelect">
        <option value="1">1</option>
        <option value="3">3</option>
        <option value="5">5</option>
        <option value="8">8</option>
        <option value="12">12</option>
      </select>

      <label>Auto Cashout:</label>
      <input type="number" id="autoCashout" placeholder="x multiplier" step="0.01">

      <button id="minesStartBtn">START</button>
      <button id="cashoutBtn" disabled>CASHOUT</button>
    </div>

    <div id="minesGrid"></div>
    <div id="minesResult" style="font-size:22px;margin-top:15px;"></div>
  `;

  const betInput = document.getElementById("minesBetInput");
  const mineSelect = document.getElementById("mineCountSelect");
  const autoInput = document.getElementById("autoCashout");
  const startBtn = document.getElementById("minesStartBtn");
  const cashoutBtn = document.getElementById("cashoutBtn");
  const gridDiv = document.getElementById("minesGrid");
  const resultDiv = document.getElementById("minesResult");

  [startBtn, cashoutBtn].forEach(btn => {
    btn.style.padding = "14px 28px";
    btn.style.fontSize = "18px";
    btn.style.fontWeight = "bold";
    btn.style.borderRadius = "10px";
    btn.style.border = "none";
    btn.style.cursor = "pointer";
  });

  startBtn.style.background = "#22c55e";
  cashoutBtn.style.background = "#facc15";
  cashoutBtn.style.opacity = "0.5";

  gridDiv.style.display = "grid";
  gridDiv.style.gridTemplateColumns = "repeat(5, 60px)";
  gridDiv.style.gridGap = "10px";
  gridDiv.style.marginTop = "20px";
  gridDiv.style.perspective = "900px";

  let bet = 0;
  let mines = 0;
  let minePositions = [];
  let clicked = [];
  let gameActive = false;
  let currentMultiplier = 1;

  function getMultiplier(safeClicks) {
    const total = 25;
    const safe = total - mines;
    let m = 1;
    for (let i = 0; i < safeClicks; i++) {
      m *= (safe - i) / (total - i);
    }
    return (1 / m) * 0.97;
  }

  startBtn.onclick = () => {
    bet = Number(betInput.value);
    mines = Number(mineSelect.value);

    if (bet < 1 || bet > balance) {
      resultDiv.textContent = "❌ Invalid bet";
      resultDiv.style.color = "red";
      return;
    }

    balance -= bet;
    updateBalance();

    minePositions = [];
    clicked = [];
    gameActive = true;
    currentMultiplier = 1;
    gridDiv.innerHTML = "";
    resultDiv.textContent = "";
    cashoutBtn.disabled = false;
    cashoutBtn.style.opacity = "1";

    while (minePositions.length < mines) {
      const pos = Math.floor(Math.random() * 25);
      if (!minePositions.includes(pos)) minePositions.push(pos);
    }

    for (let i = 0; i < 25; i++) {
      const card = document.createElement("div");
      card.style.width = "60px";
      card.style.height = "60px";
      card.style.position = "relative";
      card.style.transformStyle = "preserve-3d";
      card.style.transition = "transform 0.5s ease, scale 0.3s ease";
      card.style.cursor = "pointer";

      const front = document.createElement("div");
      front.style.position = "absolute";
      front.style.width = "100%";
      front.style.height = "100%";
      front.style.borderRadius = "10px";
      front.style.background = "#2a2a2a";
      front.style.backfaceVisibility = "hidden";

      const back = document.createElement("div");
      back.style.position = "absolute";
      back.style.width = "100%";
      back.style.height = "100%";
      back.style.borderRadius = "10px";
      back.style.display = "flex";
      back.style.alignItems = "center";
      back.style.justifyContent = "center";
      back.style.fontSize = "22px";
      back.style.backfaceVisibility = "hidden";
      back.style.transform = "rotateY(180deg)";

      card.appendChild(front);
      card.appendChild(back);
      gridDiv.appendChild(card);

      card.onclick = () => {
        if (!gameActive || clicked.includes(i)) return;
        clicked.push(i);

        card.style.transform = "rotateY(180deg)";

        if (minePositions.includes(i)) {
          back.textContent = "💣";
          back.style.background = "#dc2626";

          revealRemaining();

          resultDiv.textContent = "💥 You hit a mine!";
          resultDiv.style.color = "#f87171";
          gameActive = false;
          cashoutBtn.disabled = true;
          cashoutBtn.style.opacity = "0.5";
          return;
        }

        back.textContent = "💎";
        back.style.background = "#16a34a";

        currentMultiplier = getMultiplier(clicked.length);
        const payout = (bet * currentMultiplier).toFixed(2);

        resultDiv.textContent =
          `Multiplier: x${currentMultiplier.toFixed(2)} | Cashout: $${payout}`;
        resultDiv.style.color = "#4ade80";

        const auto = Number(autoInput.value);
        if (auto && currentMultiplier >= auto) cashout();
      };
    }
  };

  function revealRemaining() {
    for (let i = 0; i < 25; i++) {
      if (clicked.includes(i)) continue; // 🔥 DO NOT TOUCH picked tiles

      const card = gridDiv.children[i];
      card.onclick = null;
      card.style.transform = "rotateY(180deg)";
      card.style.scale = "0.85";

      const back = card.children[1];
      back.style.background = "#555";
      back.style.opacity = "0.6";
      back.textContent = minePositions.includes(i) ? "💣" : "💎";
    }
  }

  function cashout() {
    if (!gameActive) return;

    const win = bet * currentMultiplier;
    balance += win;
    updateBalance();

    revealRemaining();

    resultDiv.textContent =
      `💰 Cashed out $${win.toFixed(2)} (x${currentMultiplier.toFixed(2)})`;
    resultDiv.style.color = "#22c55e";

    gameActive = false;
    cashoutBtn.disabled = true;
    cashoutBtn.style.opacity = "0.5";
  }

  cashoutBtn.onclick = cashout;
}
