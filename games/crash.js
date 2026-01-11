const crashContainer = document.getElementById("crash");

crashContainer.innerHTML = `
<h2 style="text-align:center;margin-bottom:20px;">💥 Crash</h2>

<div style="text-align:center;margin-bottom:15px;">
  <label>Bet Amount: $</label>
  <input type="number" id="crashBetInput" value="100" min="1" style="width:120px;padding:4px;">
</div>

<div style="text-align:center;margin-bottom:20px;">
  <button id="crashStartBtn" style="padding:10px 20px;font-size:16px;cursor:pointer;">Start Game</button>
  <button id="crashStopBtn" style="padding:10px 20px;font-size:16px;cursor:pointer;" disabled>Cash Out</button>
</div>

<div style="text-align:center;font-size:36px;font-weight:bold;margin-bottom:20px;">
  Multiplier: <span id="crashMultiplier">1.00x</span>
</div>

<div id="crashResult" style="text-align:center;font-size:28px;font-weight:bold;margin-bottom:20px;">🎮</div>

<div style="text-align:center;">
  <button onclick="showLobby()" style="padding:8px 16px;cursor:pointer;">⬅ Back</button>
</div>
`;

const crashBetInput = document.getElementById("crashBetInput");
const crashStartBtn = document.getElementById("crashStartBtn");
const crashStopBtn = document.getElementById("crashStopBtn");
const crashMultiplierDisplay = document.getElementById("crashMultiplier");
const crashResult = document.getElementById("crashResult");

let crashInterval;
let currentMultiplier = 1.00;
let crashPoint = 0;
let bet = 0;
let cashedOut = false;

// Reset function (not strictly needed here but could be used for future reset)
function resetCrash() {
  clearInterval(crashInterval);
  currentMultiplier = 1.00;
  crashMultiplierDisplay.textContent = currentMultiplier.toFixed(2) + "x";
  crashResult.textContent = "🎮";
  crashStopBtn.disabled = true;
  crashStartBtn.disabled = false;
  cashedOut = false;
}

// Start Crash Game
crashStartBtn.onclick = () => {
  bet = Number(crashBetInput.value);
  if (bet < 1) {
    crashResult.textContent = "💥 Bet must be at least $1!";
    crashResult.style.color = "red";
    return;
  }
  if (bet > balance) {
    crashResult.textContent = "💥 Not enough balance!";
    crashResult.style.color = "red";
    return;
  }

  // Deduct bet
  balance -= bet;
  updateBalance();

  crashStartBtn.disabled = true;
  crashStopBtn.disabled = false;

  cashedOut = false;

  // Random crash point between 1.1x and 10x
  crashPoint = (Math.random() * 9 + 1.1).toFixed(2);

  currentMultiplier = 1.00;
  crashMultiplierDisplay.textContent = currentMultiplier.toFixed(2) + "x";
  crashResult.textContent = "🎮";
  crashResult.style.color = "#fff";

  // Multiplier growth interval
  crashInterval = setInterval(() => {
    currentMultiplier *= 1.01; // exponential growth
    crashMultiplierDisplay.textContent = currentMultiplier.toFixed(2) + "x";

    // Check for crash
    if (currentMultiplier >= crashPoint) {
      clearInterval(crashInterval);
      crashStopBtn.disabled = true;
      crashStartBtn.disabled = false; // allow new game

      if (!cashedOut) {
        crashResult.textContent = `💥 Crashed at ${crashPoint}x — You Lose $${bet}`;
        crashResult.style.color = "#f87171";
      }
    }
  }, 50);
};

// Cash Out
crashStopBtn.onclick = () => {
  if (!cashedOut) {
    cashedOut = true;
    clearInterval(crashInterval);

    let payout = (bet * currentMultiplier).toFixed(2);
    balance += Number(payout);
    updateBalance();

    crashResult.textContent = `🎉 Cashed out at ${currentMultiplier.toFixed(2)}x — You Win $${payout}!`;
    crashResult.style.color = "#4ade80";

    crashStopBtn.disabled = true;
    crashStartBtn.disabled = false; // allow new game
  }
};
