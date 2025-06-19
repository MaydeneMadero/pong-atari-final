const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const paddleHeight = 80;
const paddleWidth = 10;
let playerY = canvas.height / 2 - paddleHeight / 2;
let aiY = playerY;

let ballX, ballY, ballSpeedX, ballSpeedY;
const ballRadius = 10;

let playerScore = 0;
let aiScore = 0;
const maxScore = 7;
let gameOver = false;

function resetBall() {
  ballX = canvas.width / 2;
  ballY = canvas.height / 2;
  ballSpeedX = Math.random() > 0.5 ? 5 : -5;
  ballSpeedY = (Math.random() * 4) - 2;
}

function resetGame() {
  playerScore = 0;
  aiScore = 0;
  gameOver = false;
  document.getElementById("winnerMessage").textContent = "";
  updateScore();
  resetBall();
}

function updateScore() {
  document.getElementById("playerScore").textContent = playerScore;
  document.getElementById("aiScore").textContent = aiScore;
}

function endGame(winner) {
  gameOver = true;
  document.getElementById("winnerMessage").textContent = winner + " ganó la partida 🏆";
}

document.addEventListener("mousemove", (e) => {
  let rect = canvas.getBoundingClientRect();
  playerY = e.clientY - rect.top - paddleHeight / 2;
});

function draw() {
  ctx.fillStyle = "#111";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "#fff";
  ctx.fillRect(0, playerY, paddleWidth, paddleHeight);
  ctx.fillRect(canvas.width - paddleWidth, aiY, paddleWidth, paddleHeight);

  ctx.beginPath();
  ctx.arc(ballX, ballY, ballRadius, 0, Math.PI * 2);
  ctx.fillStyle = "#00ff88";
  ctx.fill();

  if (gameOver) return;

  ballX += ballSpeedX;
  ballY += ballSpeedY;

  if (ballY <= 0 || ballY >= canvas.height) {
    ballSpeedY = -ballSpeedY;
  }

  if (
    ballX - ballRadius <= paddleWidth &&
    ballY > playerY &&
    ballY < playerY + paddleHeight
  ) {
    ballSpeedX = -ballSpeedX;
  }

  if (
    ballX + ballRadius >= canvas.width - paddleWidth &&
    ballY > aiY &&
    ballY < aiY + paddleHeight
  ) {
    ballSpeedX = -ballSpeedX;
  }

  if (ballX < 0) {
    aiScore++;
    updateScore();
    if (aiScore >= maxScore) endGame("La Máquina");
    resetBall();
  } else if (ballX > canvas.width) {
    playerScore++;
    updateScore();
    if (playerScore >= maxScore) endGame("Tú");
    resetBall();
  }

  const difficulty = parseInt(document.getElementById("difficulty").value);
  const aiCenter = aiY + paddleHeight / 2;
  if (aiCenter < ballY - 10) {
    aiY += difficulty;
  } else if (aiCenter > ballY + 10) {
    aiY -= difficulty;
  }
}

function gameLoop() {
  draw();
  requestAnimationFrame(gameLoop);
}

resetBall();
updateScore();
gameLoop();