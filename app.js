let balance = Number(localStorage.getItem("balance")) || 1000;
const balanceEl = document.getElementById("balance");

function updateBalance(){
  balanceEl.textContent = balance;
  localStorage.setItem("balance", balance);
}
updateBalance();

function showGame(id){
  document.getElementById("lobby").style.display = "none";
  document.querySelectorAll(".game").forEach(g=>g.style.display="none");
  const game = document.getElementById(id);
  if(game) game.style.display = "block";
}

function showLobby(){
  document.getElementById("lobby").style.display = "grid";
  document.querySelectorAll(".game").forEach(g=>g.style.display="none");
}
