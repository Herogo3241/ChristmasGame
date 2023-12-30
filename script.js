// Background snow
const snowContainer = document.getElementById("snow-container");
const snowContent = ["&#10052", "&#10053", "&#10054"];

const random = (num) => {
  return Math.floor(Math.random() * num);
};

const getRandomStyles = () => {
  const top = random(100);
  const left = random(100);
  const dur = random(10) + 10;
  const size = random(25) + 25;
  return `
    top: -${top}%;
    left: ${left}%;
    font-size: ${size}px;
    animation-duration: ${dur}s;
  `;
};

const createSnow = (num) => {
  for (var i = num; i > 0; i--) {
    var snow = document.createElement("div");
    snow.className = "snow";
    snow.style.cssText = getRandomStyles();
    snow.innerHTML = snowContent[random(3)];
    snowContainer.append(snow);
  }
};

const removeSnow = () => {
  snowContainer.style.opacity = "0";
  setTimeout(() => {
    snowContainer.remove();
  }, 500);
};

window.addEventListener("load", () => {
  createSnow(50);
});

// Game - Santa's Journey

const canvas = document.querySelector("canvas");
const c = canvas.getContext("2d");

//important variables and constants
let gameOver = false;
let gameStarted = false;
let keyPressed = false;
let playerMovement = 3;
const acceleration = 2;
const friction = -2;
canvas.width = screen.width;
canvas.height = 400;
let gameTimeout = 10;
let numberEnemies = 3;
let score = 0;
let highScore = 0;
let speedScaling = 1;
let startTime = new Date().getTime();

// controlling the speed of the player and enemy and scaling necessarily
function updateSpeed() {
  if (speedScaling < 1.4) speedScaling += 0.1;
  else speedScaling += 0.01;

  console.log(speedScaling);
}

setInterval(() => {
  if (gameStarted) {
    updateSpeed();
  }
}, 10000);

//updating and displaying the score based on the time passed
function updateScore() {
  if (gameStarted && !gameOver) {
    const currentTime = new Date().getTime();
    const elapsedTime = (currentTime - startTime) / 1000; // Convert to seconds
    score = Math.floor(elapsedTime);
    highScore = Math.max(highScore, score);
  }
}

function displayScore() {
  c.fillStyle = "#fff";
  c.font = "30px 'MOC', sans-serif";
  c.fillText(`Score: ${score}`, canvas.width - 150, 30);
  c.fillText(`High Score: ${highScore}`, canvas.width - 150, 60);
}

//Initial Screen before game starts
function displayStartText() {
  if (!gameStarted) {
    c.fillStyle = "#fff";
    c.font = "40px 'MOC', sans-serif";
    c.fillText(
      "Santa's Journey",
      canvas.width / 2 - 150,
      canvas.height / 2 - 100
    );
    c.font = "40px 'MOC', sans-serif";
    c.fillText(
      "Press 'Space' to start",
      canvas.width / 2 - 150,
      canvas.height / 2 + 150
    );
  }
}

// player
const player = new Player({
  position: {
    x: canvas.width / 2 - 300,
    y: canvas.height / 2,
  },
});

//Enemy
const enemies = [];

function createEnemies() {
  for (let i = 0; i < numberEnemies; i++) {
    const enemy = new Enemy();
    enemies.push(enemy);
  }
}
createEnemies();

//displaying game over screen
function gameOverScreen() {
  c.fillStyle = "rgba(0, 0, 0, 0.5)";
  c.fillRect(0, 0, canvas.width, canvas.height);

  c.fillStyle = "#fff";
  c.font = "50px 'MOC', sans-serif";
  c.fillText("Game Over", canvas.width / 2 - 100, canvas.height / 2 - 20);
  c.font = "30px 'MOC', sans-serif";
  c.font = "30px 'MOC', sans-serif";
  const finalScoreText = `Score: ${score}`;
  const highScoreText = `High Score: ${highScore}`;
  const newHighScoreText = highScore === score ? "New High Score!" : "";
  let restartHeight;

  c.fillText(finalScoreText, canvas.width / 2 - 100, canvas.height / 2 + 20);
  c.fillText(highScoreText, canvas.width / 2 - 100, canvas.height / 2 + 50);
  if (highScore === score) {
    c.fillText(
      newHighScoreText,
      canvas.width / 2 - 100,
      canvas.height / 2 + 80
    );
    restartHeight = 110;
  } else {
    restartHeight = 80;
  }
  c.fillText(
    "Press any key to restart",
    canvas.width / 2 - 100,
    canvas.height / 2 + restartHeight
  );
  playerMovement = 0;
  for (const enemy of enemies) {
    enemy.speed = 0;
  }
  startTime = null;
}

//reseting game to intial position
function resetGame() {
  player.initialize();
  for (const enemy of enemies) {
    enemy.initialize();
  }
  score = 0;
  speedScaling = 1;
  gameStarted = false;
  keyPressed = false;
  gameOver = false;
  startTime = new Date().getTime();
}

keys = {
  space: {
    pressed: false,
  },
};

// animation function
function animate() {
  c.clearRect(0, 0, canvas.width, canvas.height);
  window.requestAnimationFrame(animate);

  displayStartText();
  player.update();

  for (const enemy of enemies) {
    enemy.update();
    const xMargin = -35;
    const yMargin = -35;
    if (
      player.position.x < enemy.x + enemy.width + xMargin &&
      player.position.x + player.width + xMargin > enemy.x &&
      player.position.y < enemy.y + enemy.height + yMargin &&
      player.position.y + player.height + yMargin > enemy.y
    ) {
      gameOver = true;
    }
  }

  if (gameOver) {
    gameOverScreen();
    if (keyPressed) {
      resetGame();
    }
    return;
  }

  if (player.position.y <= 0) player.position.y = 0;
  if (player.position.y >= canvas.height - player.height)
    player.position.y = canvas.height - player.height;

  if (keys.space.pressed) playerMovement = friction;
  else if (!keys.space.pressed) playerMovement = acceleration;

  updateScore();
  displayScore();
}

//all the event listeners for the player
window.addEventListener("keydown", (event) => {
  if (gameOver) {
    keyPressTimeout = setTimeout(() => {
      keyPressed = true;
    }, 700);
  }

  if (!gameStarted && event.code === "Space") {
    gameStarted = true;
  }

  switch (event.code) {
    case "Space":
      keys.space.pressed = true;
      break;
  }
});

window.addEventListener("keyup", (event) => {
  keyPressed = false;
  switch (event.code) {
    case "Space":
      keys.space.pressed = false;
      break;
  }
});

animate();

//background stars: controlling brightness by minimizing and maximizing opacity
const stars = [];

function initStars() {
  for (let i = 0; i < 100; i++) {
    const star = {
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      opacity: Math.random(),
      blinkSpeed: Math.random() * 0.02 + 0.01,
    };
    stars.push(star);
  }
}

function drawStars() {
  for (const star of stars) {
    c.beginPath();
    c.arc(star.x, star.y, 2, 0, Math.PI * 2);
    c.fillStyle = `rgba(255, 255, 255, ${star.opacity})`;
    c.fill();

    star.opacity += star.blinkSpeed;

    if (star.opacity > 1 || star.opacity < 0) {
      star.blinkSpeed = -star.blinkSpeed;
    }
  }

  requestAnimationFrame(drawStars);
}

initStars();
drawStars();
