let game;
let newGame;

function setup() {
  createCanvas(500, 500);
  game = new Game(width, height);

  newGame = createButton("New Game");
  newGame.mousePressed(restart);
}

function draw() {
  background(123);
  game.drawGameElements();
}

function mousePressed() {
  if (game.getStatus() == Status.INACTIVE || game.getStatus() == Status.ACTIVE) {
    game.parseMousePressCommands();
  }
}

function restart() {
  game.restartGame();
  print("A new game has started");
}