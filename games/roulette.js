function loadRoulette() {
  const container = document.getElementById("roulette");
  container.innerHTML = `
    <h2>🎡 Roulette</h2>
    <div style="display:flex;flex-direction:column;align-items:center;margin-top:15px;">
      <div style="position: relative; width:300px; height:300px;">
        <canvas id="rouletteWheel" width="300" height="300" style="border-radius:50%;border:5px solid #334155; display:block;"></canvas>
        <!-- arrow pointing DOWN, slightly right -->
        <div style="
          position:absolute;
          top:-10px;
          left:50%;
          transform:translateX(-45%);
          width:0;
          height:0;
          border-left:10px solid transparent;
          border-right:10px solid transparent;
          border-top:20px solid yellow;
          z-index:10;
        "></div>
      </div>

      <input type="number" id="rouletteBet" placeholder="Bet $" style="margin-top:10px;">

      <select id="rouletteChoice" style="margin-top:5px;">
        <option value="red">Red</option>
        <option value="black">Black</option>
        <option value="green">Green</option>
        <option value="odd">Odd</option>
        <option value="even">Even</option>
        <option value="number">Specific Number</option>
      </select>

      <input type="number" id="rouletteNumber" placeholder="Number 0-36" style="margin-top:5px; display:none; width:100px;">

      <div id="roulettePayout" style="margin-top:5px;">Payout: </div>
      <button id="rouletteSpin" style="margin-top:10px;">Spin</button>
      <div id="rouletteRes" style="margin-top:10px;"></div>
    </div>
  `;

  const canvas = container.querySelector("#rouletteWheel");
  const ctx = canvas.getContext("2d");
  const spinBtn = container.querySelector("#rouletteSpin");
  const betInput = container.querySelector("#rouletteBet");
  const res = container.querySelector("#rouletteRes");
  const choiceSelect = container.querySelector("#rouletteChoice");
  const numberInput = container.querySelector("#rouletteNumber");
  const payoutDisplay = container.querySelector("#roulettePayout");

  const numbers = Array.from({ length: 37 }, (_, i) => i); // 0-36
  const colors = numbers.map(n => n === 0 ? "green" : n % 2 === 0 ? "red" : "black");
  const center = 150;
  const radius = 140;
  const anglePerNumber = 360 / numbers.length;

  // Show/hide number input when selecting "Specific Number"
  choiceSelect.addEventListener("change", () => {
    numberInput.style.display = choiceSelect.value === "number" ? "block" : "none";
  });

  // Update payout info dynamically
  function updatePayout() {
    const bet = Number(betInput.value);
    let payout = 0;
    const choice = choiceSelect.value;
    if (!bet || bet < 1) {
      payoutDisplay.textContent = "Payout: ";
      return;
    }
    switch(choice) {
      case "red":
      case "black":
      case "odd":
      case "even":
        payout = bet * 2; break;
      case "green":
        payout = bet * 14; break;
      case "number":
        payout = bet * 36; break;
    }
    payoutDisplay.textContent = `Payout: $${payout.toFixed(2)}`;
  }

  betInput.addEventListener("input", updatePayout);
  choiceSelect.addEventListener("change", updatePayout);
  numberInput.addEventListener("input", updatePayout);

  // Draw wheel slices
  function drawWheel() {
    ctx.clearRect(0, 0, 300, 300);
    const angleStep = (2 * Math.PI) / numbers.length;
    numbers.forEach((num, i) => {
      const start = -Math.PI / 2 + i * angleStep;
      const end = start + angleStep;

      ctx.beginPath();
      ctx.moveTo(center, center);
      ctx.arc(center, center, radius, start, end);
      ctx.closePath();
      ctx.fillStyle = colors[i];
      ctx.fill();

      ctx.save();
      ctx.translate(center, center);
      ctx.rotate(start + angleStep / 2);
      ctx.textAlign = "right";
      ctx.fillStyle = "#fff";
      ctx.font = "14px Arial";
      ctx.fillText(num, radius - 10, 5);
      ctx.restore();
    });
  }

  drawWheel();

  spinBtn.onclick = () => {
    const bet = Number(betInput.value);
    if (bet < 1 || bet > balance) {
      res.textContent = "Invalid bet";
      return;
    }
    balance -= bet;
    updateBalance();

    const spins = 6 + Math.random() * 4;
    const extraDegrees = Math.random() * 360;
    const totalRotation = spins * 360 + extraDegrees;
    const duration = 4000;
    const start = performance.now();

    function animate(time) {
      const progress = Math.min((time - start) / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      const rotation = ease * totalRotation;
      canvas.style.transform = `rotate(${rotation}deg)`;

      if (progress < 1) requestAnimationFrame(animate);
      else {
        const finalRotation = rotation % 360;
        let indexAtTop = Math.round((360 - finalRotation - anglePerNumber / 2) / anglePerNumber);
        indexAtTop = ((indexAtTop % numbers.length) + numbers.length) % numbers.length;
        const winningNumber = numbers[indexAtTop];
        const winningColor = colors[indexAtTop];

        // Check if user wins
        const choice = choiceSelect.value;
        let isWin = false;
        let payout = 0;

        if (choice === "red" && winningColor === "red") isWin = true;
        if (choice === "black" && winningColor === "black") isWin = true;
        if (choice === "green" && winningColor === "green") isWin = true;
        if (choice === "odd" && winningNumber !== 0 && winningNumber % 2 === 1) isWin = true;
        if (choice === "even" && winningNumber !== 0 && winningNumber % 2 === 0) isWin = true;
        if (choice === "number" && Number(numberInput.value) === winningNumber) isWin = true;

        switch(choice) {
          case "red":
          case "black":
          case "odd":
          case "even":
            payout = bet * 2; break;
          case "green":
            payout = bet * 14; break;
          case "number":
            payout = bet * 36; break;
        }

        if (isWin) {
          balance += payout;
          res.textContent = `🎉 Winning number: ${winningNumber} (${winningColor}) | You win $${payout.toFixed(2)}`;
        } else {
          res.textContent = `😢 Winning number: ${winningNumber} (${winningColor}) | You lose`;
        }

        updateBalance();
      }
    }

    requestAnimationFrame(animate);
  };
}
