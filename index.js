var startGame = null,
  speedofGame = null,
  AreaofGame = null,
  gameArea = null,
  cellWidth = null,
  gameAreaWidth = null,
  gameAreaHeight = null,
  playerScore = null,
  snakeDirection = null,
  snake = null,
  snakeFood = null,
  speedSize = null,
  timer = null,
  egg = ["images/egg.png", "./images/eggtwo.png", "images/eggthree.png"],
  eggEaten = null,
  imageIndex = Math.floor(Math.random() * 1000) % 3;

function init() {
  startGame = document.querySelector("#startGame");
  speedofGame = document.querySelector("#speedofGame");
  scoreDisplay = document.getElementById("scoreDisplay");
  gameArea = document.querySelector("#gameArea");
  gameAreaContext = gameArea.getContext("2d");
  gameAreaHeight = 600;
  gameAreaWidth = 600;
  cellWidth = 20;
  gameArea.height = gameAreaHeight;
  gameArea.width = gameAreaWidth;

  startGame.onclick = function () {
    this.disabled = true;
    gameStart();
  };
}

function gameStart() {
  playerScore = 0;
  snakeDirection = "right";
  speedSize = parseInt(speedofGame.value);
  if (speedSize > 10) {
    speedSize = 10;
  } else if (speedSize < 0) {
    speedSize = 1;
  }
  snake = [{ x: 0, y: cellWidth - 1 }];
  gameAreaContext.fillStyle = "white";
  gameAreaContext.fillRect(0, 0, gameAreaWidth, gameAreaHeight);
  gameAreaContext.strokeStyle = "white";
  gameAreaContext.strokeRect(0, 0, gameAreaWidth, gameAreaHeight);
  createFood();
  createEgg(snakeFood.x, snakeFood.y);
  clearInterval(timer);
  timer = setInterval(createGameArea, 500 / speedSize);
}

function createFood() {
  snakeFood = {
    x: Math.round((Math.random() * (gameAreaWidth - cellWidth)) / cellWidth),
    y: Math.round((Math.random() * (gameAreaHeight - cellWidth)) / cellWidth),
  };
}
function createGameArea() {
  var snakeX = snake[0].x; //Default head so
  var snakeY = snake[0].y;
  if (snakeDirection == "right") {
    snakeX++;
  } else if (snakeDirection == "left") {
    snakeX--;
  } else if (snakeDirection == "up") {
    snakeY--;
  } else if (snakeDirection == "down") {
    snakeY++;
  }
  //loose the game conditions
  if (
    snakeX == -1 ||
    snakeX == gameAreaWidth / cellWidth ||
    snakeY == -1 ||
    snakeY == gameAreaHeight / cellWidth ||
    Control(snakeX, snakeY, snake)
  ) {
    //first change the score and then clr the time and then enable the start btn
    writeScore();
    clearInterval(timer);
    startGame.disabled = false;
    return;
  }

  //incrementing snake size each time
  if (snakeX == snakeFood.x && snakeY == snakeFood.y) {
    var newHead = { x: snakeX, y: snakeY };
    playerScore += speedSize;
    updateScoreDisplay(playerScore);
    createFood();
    eggEaten = true;
    createEgg(snakeFood.x, snakeFood.y);
  } else {
    var newHead = snake.pop();
    createWhite(newHead.x, newHead.y);
    newHead.x = snakeX; // current headX
    newHead.y = snakeY; // current headY
  }
  snake.unshift(newHead);
  for (var i = 0; i < snake.length; i++) {
    createSquare(snake[i].x, snake[i].y);
  }
}
function createWhite(x, y) {
  gameAreaContext.fillStyle = "#fff";
  gameAreaContext.fillRect(x * cellWidth, y * cellWidth, cellWidth, cellWidth);
  gameAreaContext.strokeStyle = "#fff";
  gameAreaContext.strokeRect(
    x * cellWidth,
    y * cellWidth,
    cellWidth,
    cellWidth
  );
}
function Control(x, y, array) {
  for (var i = 0; i < array.length; i++) {
    if (array[i].x == x && array[i].y == y) {
      //here it checks with each cordinates if it matches that means the snake is colliding with itself
      return true;
    }
  }
}
function writeScore() {
  gameAreaContext.font = "50px sans-serif";
  gameAreaContext.fillStyle = "#FF0000";
  gameAreaContext.fillText(
    "Game Over",
    gameAreaWidth / 2 - 130,
    gameAreaHeight / 2
  );
}
function updateScoreDisplay(score) {
  scoreDisplay.textContent = "Score: " + score;
}
function createSquare(x, y) {
  gameAreaContext.fillStyle = "#228B22";
  gameAreaContext.fillRect(x * cellWidth, y * cellWidth, cellWidth, cellWidth);
}
function createEgg(x, y) {
  var img1 = new Image();

  img1.onload = function () {
    gameAreaContext.drawImage(img1, x * cellWidth, y * cellWidth);
  };
  img1.src = egg[imageIndex];
  if (eggEaten) {
    imageIndex = Math.floor(Math.random() * 1000) % 3;
    eggEaten = false;
  }
}

function changeDirection(e) {
  var keys = e.which;
  if (keys == "40" && snakeDirection != "up") snakeDirection = "down";
  else if (keys == "39" && snakeDirection != "left") snakeDirection = "right";
  else if (keys == "38" && snakeDirection != "down") snakeDirection = "up";
  else if (keys == "37" && snakeDirection != "right") snakeDirection = "left";
}
window.onkeydown = changeDirection;
window.onload = init;
