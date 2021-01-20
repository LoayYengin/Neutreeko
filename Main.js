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
  printEndOutput();
}

function mousePressed() {
  if (game.getStatus() == Status.INACTIVE || game.getStatus() == Status.ACTIVE) {
    game.parseMousePressCommands();
    printGameInfo();
  } else {
    print("press tab to restart the game");
  }
}

function keyPressed() {
  if (keyCode == TAB) {
    game.restartGame();
    print("A new game has started");
    print(game);
  }
}

function restart() {
  game.restartGame();
  print("A new game has started");
}

function printGameInfo() {

  if (game.getStatus() == Status.INACTIVE) {
    print(game);
    if (game.getTurn().getHero()) {
      print("It is currently the hero's turn");
    } else {
      print("It is currently the agent's turn");
    }
  } else if (game.getStatus() == Status.HERO_WIN) {
    print("Hero has won the game");
  } else if (game.getStatus() == Status.AGENT_WIN) {
    print("Agent has won the game");
  }
}

function printEndOutput() {
  let offset = 32;
  textAlign(CENTER);
  textSize(36);
  fill(255, 0, 0);
  if (game.getStatus() == Status.HERO_WIN || game.getStatus() == Status.AGENT_WIN) {
    if (game.getStatus() == Status.HERO_WIN) {
      text("White has won the game!", width / 2, height / 2);
    } else if (game.getStatus() == Status.AGENT_WIN) {
      text("Black has won the game!", width / 2, height / 2);
    }
  }
}

