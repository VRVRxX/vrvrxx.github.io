let balance = Number(localStorage.getItem("balance")) || 1000;
const balanceEl = document.getElementById("balance");

function updateBalance(){
  balanceEl.textContent = balance.toFixed(2);
  localStorage.setItem("balance", balance.toFixed(2));
}
updateBalance();

function showLobby(){
  document.getElementById("lobby").style.display = "grid";
  document.querySelectorAll(".game").forEach(g=>g.style.display="none");
}

function showGame(id){
  document.getElementById("lobby").style.display = "none";
  document.querySelectorAll(".game").forEach(g=>g.style.display="none");
  document.getElementById(id).style.display = "block";

  if(id==="crash") loadCrash();
  if(id==="dice") loadDice();
  if(id==="mines") loadMines();
  if(id==="roulette") loadRoulette();
  if(id==="slots") loadSlots();
  if(id==="plinko") loadPlinko();
}
