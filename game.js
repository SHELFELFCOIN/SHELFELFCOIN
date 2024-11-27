const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Responsive Canvas
function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener("resize", resizeCanvas);

// Game variables
let elfY = canvas.height / 2;
let velocity = 0;
const gravity = 0.5;
const jumpStrength = -10;

let obstacles = [];
let snowflakes = [];
let frame = 0;
let score = 0;

const elf = new Image();
elf.src = "elf.png";

const bg = new Image();
bg.src = "northpole-bg.jpg";

let gameOver = false;
let gameStarted = false;

const elfWidth = 80;
const elfHeight = 80;

// Create an obstacle
function createObstacle() {
  const size = Math.random() * (canvas.height / 4) + 50;
  const gap = Math.random() * 200 + 200;
  obstacles.push({
    x: canvas.width,
    top: size,
    bottom: size + gap,
    width: 50,
  });
}

// Create a snowflake
function createSnowflake() {
  const snowflakeX = Math.random() * canvas.width;
  snowflakes.push({
    x: snowflakeX,
    y: 0,
    radius: 10,
  });
}

// Show wallet form
function showWalletForm() {
  const walletForm = document.getElementById("walletForm");
  const scoreInput = document.getElementById("score");
  scoreInput.value = score; // Set the current score
  walletForm.style.display = "block";

  // Close button functionality
  const closeButton = document.getElementById("closeWalletForm");
  closeButton.onclick = () => {
    walletForm.style.display = "none"; // Hide the form
    resetGame(); // Restart the game
  };
}

// Draw everything
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(bg, 0, 0, canvas.width, canvas.height);

  if (!gameStarted) {
    ctx.fillStyle = "green";
    ctx.font = "40px Arial";
    ctx.textAlign = "center";
    ctx.fillText("Press Spacebar to Start", canvas.width / 2, canvas.height / 2);
  }

  if (gameStarted) {
    ctx.drawImage(elf, canvas.width / 2 - elfWidth / 2, elfY, elfWidth, elfHeight);

    ctx.fillStyle = "white";
    for (const obs of obstacles) {
      ctx.fillRect(obs.x, 0, obs.width, obs.top);
      ctx.fillRect(obs.x, obs.bottom, obs.width, canvas.height - obs.bottom);
    }

    ctx.fillStyle = "lightblue";
    for (const snowflake of snowflakes) {
      ctx.beginPath();
      ctx.arc(snowflake.x, snowflake.y, snowflake.radius, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.fillStyle = "black";
    ctx.font = "30px Arial";
    ctx.fillText(`Score: ${score}`, 20, 50);
  }

  if (gameOver) {
    ctx.fillStyle = "red";
    ctx.font = "40px Arial";
    ctx.textAlign = "center";
    ctx.fillText("Game Over!", canvas.width / 2, canvas.height / 2 - 20);
  }
}

// Main game loop
function loop() {
  if (!gameOver && gameStarted) {
    update();
    draw();
    requestAnimationFrame(loop);
  }
}

// Update game logic
function update() {
  velocity += gravity;
  elfY += velocity;

  if (elfY < 0) elfY = 0;
  if (elfY > canvas.height) {
    gameOver = true;
    showWalletForm();
    return;
  }

  if (frame % 120 === 0) createObstacle();
  if (frame % 80 === 0) createSnowflake();

  for (let i = 0; i < obstacles.length; i++) {
    obstacles[i].x -= 3;

    if (obstacles[i].x + obstacles[i].width < 0) {
      obstacles.splice(i, 1);
      score++;
    }

    if (
      (elfY < obstacles[i].top || elfY > obstacles[i].bottom) &&
      obstacles[i].x < canvas.width / 2 + 25 &&
      obstacles[i].x + obstacles[i].width > canvas.width / 2 - 25
    ) {
      gameOver = true;
      showWalletForm();
    }
  }

  for (let i = 0; i < snowflakes.length; i++) {
    snowflakes[i].y += 2;

    if (snowflakes[i].y > canvas.height) snowflakes.splice(i, 1);

    if (
      elfY + elfHeight > snowflakes[i].y &&
      elfY < snowflakes[i].y + snowflakes[i].radius &&
      canvas.width / 2 - elfWidth / 2 < snowflakes[i].x + snowflakes[i].radius &&
      canvas.width / 2 + elfWidth / 2 > snowflakes[i].x - snowflakes[i].radius
    ) {
      snowflakes.splice(i, 1);
      score += 5;
    }
  }

  frame++;
}

// Reset the game
function resetGame() {
  gameOver = false;
  gameStarted = false;
  score = 0;
  elfY = canvas.height / 2;
  velocity = 0;
  obstacles = [];
  snowflakes = [];
  frame = 0;
  draw();
}

// Ensure images are loaded before rendering
bg.onload = () => {
  draw(); // Draw the initial screen with the background
};

// Event listener for starting the game
window.addEventListener("keydown", (e) => {
  if (e.code === "Space" || e.code === "ArrowUp") {
    if (!gameStarted) {
      gameStarted = true;
      loop();
    } else if (!gameOver) {
      velocity = jumpStrength;
    }
  }
});





















