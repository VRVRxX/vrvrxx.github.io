<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Mines Game</title>
<style>
  body {
    font-family: Arial, sans-serif;
    background: #222;
    color: #fff;
    display: flex;
    justify-content: center;
    align-items: flex-start;
    padding-top: 30px;
  }
  #minesContainer {
    text-align: center;
  }
  #minesGrid {
    display: grid;
    grid-template-columns: repeat(5, 60px);
    grid-gap: 5px;
    justify-content: center;
    margin-bottom: 20px;
  }
  .mineTile {
    width: 60px;
    height: 60px;
    background-color: #444;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    font-size: 24px;
    user-select: none;
    transition: all 0.2s ease;
    border-radius: 5px;
  }
  input, select, button {
    padding: 6px 10px;
    font-size: 16px;
    margin: 5px;
  }
</style>
</head>
<body>

<div id="minesContainer">
  <h2>💣 Mines</h2>

  <div>
    <label>Bet Amount: $</label>
    <input type="number" id="minesBetInput" value="100" min="1">
  </div>

  <div>
    <label>Number of Mines: </label>
    <select id="mineCountSelect">
      <option value="3">3 Mines</option>
      <option value="5" selected>5 Mines</option>
      <option value="7">7 Mines</option>
      <option value="10">10 Mines</option>
    </select>
  </div>

  <div>
    <button id="minesStartBtn">Start Game</button>
    <button id="minesCashOutBtn" disabled>Cash Out</button>
  </div>

  <div id="minesGrid"></div>

  <div style="font-size:24px;margin-bottom:10px;">
    Multiplier: <span id="minesMultiplier">1.00x</span>
  </div>

  <div id="minesResult" style="font-size:28px;font-weight:bold;margin-bottom:20px;">🎮</div>
</div>

<script>
let balance = 1000; // Starting balance for testing
function updateBalance() { console.log("Balance:", balance.toFixed(2)); }

const minesBetInput = document.getElementById("minesBetInput");
const mineCountSelect = document.getElementById("mineCountSelect");
const minesStartBtn = document.getElementById("minesStartBtn");
const minesCashOutBtn = document.getElementById("minesCashOutBtn");
const minesGrid = document.getElementById("minesGrid");
const minesMultiplierDisplay = document.getElementById("minesMultiplier");
const minesResult = document.getElementById("minesResult");

let mines = [], safeTiles = 0, clickedTiles = 0, bet = 0, currentMultiplier = 1.00, gameActive = false;

function generateMines(mineCount){
  const positions = [];
  while (positions.length < mineCount){
    const pos = Math.floor(Math.random() * 25);
    if(!positions.includes(pos)) positions.push(pos);
  }
  return positions;
}

function calculateMultiplier(clicked, mineCount){
  const safe = 25 - mineCount;
  return (1 + clicked / safe * (mineCount / 1.5)).toFixed(2);
}

function revealTile(tile, mineCount){
  if(!gameActive) return;
  if(tile.dataset.clicked === "true") return;

  tile.dataset.clicked = "true";
  const index = Number(tile.dataset.index);

  if(mines.includes(index)){
    tile.textContent = "💣";
    tile.style.backgroundColor = "#f87171";
    tile.style.transform = "scale(1.1)";
    setTimeout(()=>tile.style.transform="scale(1)",200);

    minesResult.textContent = `💥 You hit a mine! You lose $${bet}`;
    minesResult.style.color = "#f87171";
    gameActive = false;
    minesCashOutBtn.disabled = true;
    minesStartBtn.disabled = false;
  } else {
    tile.style.backgroundColor = "#4ade80";
    tile.style.transform = "scale(1.1)";
    setTimeout(()=>tile.style.transform="scale(1)",200);
    clickedTiles++;
    currentMultiplier = calculateMultiplier(clickedTiles, mineCount);
    minesMultiplierDisplay.textContent = currentMultiplier;
  }
}

minesStartBtn.onclick = ()=>{
  bet = Number(minesBetInput.value);
  if(bet < 1){ minesResult.textContent="💥 Bet must be at least $1!"; minesResult.style.color="red"; return; }
  if(bet > balance){ minesResult.textContent="💥 Not enough balance!"; minesResult.style.color="red"; return; }

  balance -= bet; updateBalance();

  const mineCount = Number(mineCountSelect.value);
  mines = generateMines(mineCount);
  safeTiles = 25 - mineCount;
  clickedTiles = 0;
  currentMultiplier = 1.00;
  minesMultiplierDisplay.textContent = currentMultiplier;
  minesResult.textContent = "🎮";
  minesResult.style.color = "#fff";
  gameActive = true;

  minesStartBtn.disabled = true;
  minesCashOutBtn.disabled = false;

  minesGrid.innerHTML = "";
  for(let i=0;i<25;i++){
    const tile = document.createElement("div");
    tile.classList.add("mineTile");
    tile.dataset.index = i;
    tile.dataset.clicked = "false";
    tile.onclick = ()=>revealTile(tile, mineCount);
    minesGrid.appendChild(tile);
  }
}

minesCashOutBtn.onclick = ()=>{
  if(!gameActive) return;
  gameActive = false;
  const payout = (bet * currentMultiplier).toFixed(2);
  balance += Number(payout);
  updateBalance();

  minesResult.textContent = `🎉 Cashed out at ${currentMultiplier}x — You Win $${payout}!`;
  minesResult.style.color = "#4ade80";

  minesCashOutBtn.disabled = true;
  minesStartBtn.disabled = false;
}
</script>
</body>
</html>
