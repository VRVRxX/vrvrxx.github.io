document.getElementById("slots").innerHTML = `
<h3>🎰 Slots</h3>
<input id="slotBet" type="number" placeholder="Bet">
<div id="reels">🍒 🍋 🍉</div>
<button class="play" onclick="spinSlots()">Spin</button>
<div id="slotResult"></div>
`;

const symbols = ["🍒","🍋","🍉","⭐","💎"];

function spinSlots(){
  let bet = +slotBet.value;
  if(bet<=0 || bet>balance) return;

  let a = symbols[Math.random()*5|0];
  let b = symbols[Math.random()*5|0];
  let c = symbols[Math.random()*5|0];
  reels.textContent = `${a} ${b} ${c}`;

  if(a===b && b===c){
    balance += bet*5;
    slotResult.textContent = "JACKPOT";
  } else {
    balance -= bet;
    slotResult.textContent = "LOSE";
  }
  updateBalance();
}
