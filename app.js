// Global balance
if(!window.balance) window.balance = 1000;
document.getElementById("balance").textContent = window.balance.toFixed(2);

function updateBalance(){
  document.getElementById("balance").textContent = window.balance.toFixed(2);
}

// Hide all games and show lobby
function showLobby(){
  const games = ["dice","crash","mines"];
  games.forEach(g => document.getElementById(g).style.display = "none");
  document.getElementById("lobby").style.display = "flex";
}

// Show a specific game
function showGame(gameId){
  const games = ["dice","crash","mines"];
  games.forEach(g => document.getElementById(g).style.display = "none");
  document.getElementById("lobby").style.display = "none";
  document.getElementById(gameId).style.display = "block";

  // Load game logic
  if(gameId==="crash") loadCrash();
  if(gameId==="dice") loadDice();
  if(gameId==="mines") loadMines();
}
