const diceContainer = document.getElementById("dice");

diceContainer.innerHTML = `
<h2 style="text-align:center;margin-bottom:20px;">🎲 Dice</h2>

<div style="text-align:center;margin-bottom:15px;">
  <label>Bet Amount: $</label>
  <input type="number" id="betInput" value="100" min="1" style="width:120px;padding:4px;">
</div>

<div style="text-align:center;margin-bottom:20px;">
  <label>Roll Over: <span id="rollOverValue">50</span></label><br>
  <input type="range" min="1" max="98" value="50" id="rollSlider" style="width:70%;">
</div>

<div style="text-align:center;margin-bottom:20px;">
  <div>Multiplier: <span id="multiplier">2.00x</span></div>
</div>

<div style="text-align:center;margin-bottom:20px;">
  <button id="rollBtn" style="padding:10px 20px;font-size:16px;cursor:pointer;">Roll 🎲</button>
</div>

<div id="diceResult" style="text-align:center;font-size:36px;font-weight:bold;margin-bottom:20px;">🎲</div>

<div style="text-align:center;">
  <button onclick="showLobby()" style="padding:8px 16px;cursor:pointer;">⬅ Back</button>
</div>
`;

const betInput = document.getElementById("betInput");
const rollSlider = document.getElementById("rollSlider");
const rollOverDisplay = document.getElementById("rollOverValue");
const multiplierDisplay = document.getElementById("multiplier");
const rollBtn = document.getElementById("rollBtn");
const diceResult = document.getElementById("diceResult");

// Update balance function with rounding
function updateBalance() {
  balance = Number(balance.toFixed(2)); // round balance to 2 decimals
  balanceEl.textContent = balance.toFixed(2); // always show 2 decimals
  localStorage.setItem("balance", balance);
}

// Update multiplier dynamically
function updateMultiplier() {
  const rollOver = Number(rollSlider.value);
  const chance = 100 - rollOver;
  const multiplier = chance > 0 ? (98 / chance).toFixed(2) : 98.00;
  multiplierDisplay.textContent = multiplier + "x";
}

// Initialize slider display
rollSlider.oninput = () => {
  rollOverDisplay.textContent = rollSlider.value;
  updateMultiplier();
};
updateMultiplier();

// Roll button
rollBtn.onclick = () => {
  const bet = Number(betInput.value);
  const rollOver = Number(rollSlider.value);

  if (bet < 1) {
    diceResult.textContent = "💥 Bet must be at least $1!";
    diceResult.style.color = "red";
    return;
  }

  if (bet > balance) {
    diceResult.textContent = "💥 Not enough balance!";
    diceResult.style.color = "red";
    return;
  }

  // Deduct bet
  balance -= bet;
  updateBalance();

  diceResult.style.color = "#fff";
  let roll = 0;
  const duration = 1500;
  const intervalTime = 50;
  const steps = duration / intervalTime;
  let currentStep = 0;

  const interval = setInterval(() => {
    roll = Math.floor(Math.random() * 100) + 1;
    diceResult.textContent = roll;
    currentStep++;
    if (currentStep >= steps) {
      clearInterval(interval);

      const chance = 100 - rollOver;
      const multiplier = chance > 0 ? (98 / chance) : 98.00;
      let payout = 0;

      if (roll > rollOver) {
        payout = (bet * multiplier).toFixed(2); // payout with cents
        balance += Number(payout);
        diceResult.textContent = `🎉 ${roll} — You Win $${payout}!`;
        diceResult.style.color = "#4ade80";
      } else {
        diceResult.textContent = `😢 ${roll} — You Lose $${bet}`;
        diceResult.style.color = "#f87171";
      }

      updateBalance();
    }
  }, intervalTime);
};
