const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Responsive Canvas
function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);  // Adjust canvas size when window is resized

// Game variables
let elfY = canvas.height / 2;
let velocity = 0;
const gravity = 0.5;
const jumpStrength = -10;

let obstacles = [];
let snowflakes = [];
let frame = 0;
let score = 0;

// Elf image
const elf = new Image();
elf.src = "elf.png"; // Replace with your elf image

// Background
const bg = new Image();
bg.src = "northpole-bg.jpg"; // Replace with your background image

// Game over flag and message
let gameOver = false;
let gameOverMessage = "";

// Elf size
const elfWidth = 80;
const elfHeight = 80;

// Game start flag
let gameStarted = false;

// Create an obstacle
function createObstacle() {
  const size = Math.random() * (canvas.height / 4) + 50;
  const gap = Math.random() * (200) + 200;
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

// Update game mechanics
function update() {
  if (gameOver) return;

  velocity += gravity;
  elfY += velocity;

  if (elfY < 0) elfY = 0;
  if (elfY > canvas.height) {
    gameOver = true;
    gameOverMessage = `Game Over! Your score: ${score}`;
  }

  if (frame % 120 === 0 && !gameOver) createObstacle();
  if (frame % 80 === 0 && !gameOver) createSnowflake();

  // Move obstacles
  for (let i = 0; i < obstacles.length; i++) {
    obstacles[i].x -= 3;

    if (obstacles[i].x + obstacles[i].width < 0) {
      obstacles.splice(i, 1);
      score++;
    }

    // Collision detection with obstacles
    if (
      (elfY < obstacles[i].top || elfY > obstacles[i].bottom) &&
      obstacles[i].x < canvas.width / 2 + 25 &&
      obstacles[i].x + obstacles[i].width > canvas.width / 2 - 25
    ) {
      gameOver = true;
      gameOverMessage = `Game Over! Your score: ${score}`;
    }
  }

  // Move snowflakes
  for (let i = 0; i < snowflakes.length; i++) {
    snowflakes[i].y += 2;

    if (snowflakes[i].y > canvas.height) {
      snowflakes.splice(i, 1);
    }

    // Collision detection with elf
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

// Draw everything (elf, obstacles, background, score, snowflakes)
function draw() {
  ctx.drawImage(bg, 0, 0, canvas.width, canvas.height);

  ctx.drawImage(elf, canvas.width / 2 - elfWidth / 2, elfY, elfWidth, elfHeight);

  ctx.fillStyle = "white";
  for (let i = 0; i < obstacles.length; i++) {
    ctx.fillRect(obstacles[i].x, 0, obstacles[i].width, obstacles[i].top);
    ctx.fillRect(obstacles[i].x, obstacles[i].bottom, obstacles[i].width, canvas.height - obstacles[i].bottom);
  }

  ctx.fillStyle = "lightblue";
  for (let i = 0; i < snowflakes.length; i++) {
    ctx.beginPath();
    ctx.arc(snowflakes[i].x, snowflakes[i].y, snowflakes[i].radius, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.fillStyle = "black";
  ctx.font = "30px Arial";
  ctx.fillText(`Score: ${score}`, 20, 50);

  if (gameOver) {
    ctx.fillStyle = "red";
    ctx.font = "40px Arial";
    ctx.fillText(gameOverMessage, canvas.width / 2 - 150, canvas.height / 2);
    ctx.font = "20px Arial";
    ctx.fillText("Tap to restart", canvas.width / 2 - 100, canvas.height / 2 + 50);
  }

  if (!gameStarted && !gameOver) {
    ctx.fillStyle = "green";
    ctx.font = "40px Arial";
    ctx.fillText("Tap to Start", canvas.width / 2 - 150, canvas.height / 2);
  }
}

// Game loop
function loop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  update();
  draw();
  if (!gameOver && gameStarted) requestAnimationFrame(loop);
}

// Device type detection (mobile vs desktop)
const isMobile = /Mobi|Android/i.test(navigator.userAgent);

// Mobile touch controls (tap to jump or start)
window.addEventListener(isMobile ? "touchstart" : "keydown", (e) => {
  if (gameOver) {
    resetGame();
  } else if (!gameStarted) {
    startGame();
  } else {
    // Jumping action (spacebar on desktop, tap on mobile)
    if (isMobile || e.code === "Space") {
      velocity = jumpStrength;
    }
  }
});

// Start the game
function startGame() {
  gameStarted = true;
  loop();
}

// Reset the game
function resetGame() {
  gameOver = false;
  gameOverMessage = "";
  score = 0;
  obstacles = [];
  snowflakes = [];
  elfY = canvas.height / 2;
  velocity = 0;
  frame = 0;
  gameStarted = false;
  loop();
}

// Start the game loop once the elf image is loaded
elf.onload = () => loop();




















