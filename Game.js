const Status = Object.freeze({
  "ACTIVE": 1,
  "INACTIVE": 2,
  "HERO_WIN": 3,
  "AGENT_WIN": 4
})

class Game {
  constructor(w, h) {
    this.board = new Board(w, h);
    this.players = this.newPlayers();
    this.turn = this.players[0];
    this.status = Status.INACTIVE;

    this.row = -1;
    this.col = -1;
    this.startX = -1;
    this.startY = -1;
    this.endX = -1;
    this.endY = -1;
  }

  //============ methods called by main ==============

  /* calls the methods that draws the grid (the board) and what is at each location (tokens or blank)
   */
  drawGameElements() {
    this.board.drawBoard();
    this.board.drawLocations();
  }

  /* When the mouse is pressed, if status is active 
   * unhighlight the highlighted token and set mouse location as the end
   * if mouse is on a valid blank location move token to that location otherwise unhighlight the token
   * check for a winner after a move has been made
   * If the status if inactive then
   * if mouse is over a token select it and set the mouse location as the start
   */
  parseMousePressCommands() {
    if (this.status == Status.ACTIVE) { // a token has been selected
      this.parseDeselect();
      this.setEnd();
      this.parseMove();
      this.checkWinner();
    } else {
      this.parseSelect();
      this.setStart();
    }
  }

  getTurn() {
    return this.turn;
  }

  getStatus() {
    return this.status;
  }

  restartGame() {
    this.board = new Board(500, 500);
    this.status = Status.INACTIVE;
  }

  //=== functions called only in Game ===

  /* returns an array containing 2 players for the game.
   * a player can either be the hero (true) or agent (false)
   */
  newPlayers() {
    let players = [];

    players[0] = new Player(true);
    players[1] = new Player(false);
    return players;
  }

  //============= parseMousePressCommand Methods ========================

  /* Check where mouse was clicked, if it is on a token belonging to the player's turn select it
   */
  parseSelect() {
    this.setRow();
    this.setCol();

    if (this.turn == this.players[0]) {
      this.parseSelectHelper(Type.HERO);
    } else {
      this.parseSelectHelper(Type.AGENT);
    }
  }

  parseSelectHelper(type) {
    let mouseOver = this.board.getLocation(this.row, this.col).getToken();

    if (mouseOver.getType() == type) {
      mouseOver.selectToken();
      if (mouseOver.getSelected()) {
        this.status = Status.ACTIVE;
      }
    }
  }

  /* if mouse is over a invalid blank deselect the highlighted item
   */
  parseDeselect() {
    let mouseOver = this.board.getLocation(this.row, this.col).getToken();

    if (mouseOver.getType() != Type.BLANK) {
      mouseOver.selectToken();

      this.status = Status.INACTIVE;
    }
  }

  /* to move a piece swap the token type at between the 2 locations
   */
  parseMove() {
    let start = this.board.getLocation(this.startX, this.startY);
    let end = this.board.getLocation(this.endX, this.endY);

    let myMove = new Move(this.board, start, end);

    // if a valid move has occured, update the current board state and change whos turn it is.
    if (myMove.isValid()) {
      this.board = myMove.updateBoard();
      this.setTurn();
    }
  }

  /* check if there are 3 hero or agent tokens in a row. 
   * if true then there is a winner
   */
  checkWinner() {
    // check for horizontal winner
    this.checkWinnerHelper(0, 1, 0, -1, 0, 1);

    // check for vertical winner
    this.checkWinnerHelper(1, 0, -1, 0, 1, 0);

    // check for diagonal winner both \ and /
    this.checkWinnerHelper(1, 1, -1, -1, 1, 1);
    this.checkWinnerHelper(1, 1, -1, 1, 1, -1);
  }

  checkWinnerHelper(rowEdge, colEdge, rowAdjacent1, colAdjacent1, rowAdjacent2, colAdjacent2) {
    let currentLocationType;

    for (let i = rowEdge; i < this.board.getSize() - rowEdge; i++) { // row
      for (let j = colEdge; j < this.board.getSize() - colEdge; j++) { // col
        // if there is a non blank token check if there are 3 tokens of the same type in a row 
        currentLocationType = this.board.getLocation(i, j).getToken().getType();

        if (currentLocationType != Type.BLANK) {
          if (currentLocationType == this.board.getLocation(i + rowAdjacent1, j + colAdjacent1).getToken().getType() &&
            currentLocationType == this.board.getLocation(i + rowAdjacent2, j + colAdjacent2).getToken().getType()) {
            this.status = this.turn == this.players[0] ? Status.AGENT_WIN : Status.HERO_WIN;
          }
        }
      }
    }
  }

  setStart() {
    this.startX = this.setRow();
    this.startY = this.setCol();
    // print("the start location: " + this.startX + ", " + this.startY);
  }

  setEnd() {
    this.endX = this.setRow();
    this.endY = this.setCol();
    // print("the end location: " + this.endX + ", " + this.endY);
  }

  // ========================================

  setTurn() {
    console.log("this was run");
    console.log(this.turn);
    console.log("after");
    this.turn = this.turn == this.players[0] ? this.players[1] : this.players[0];
  }

  /* set row to where the mouse was clicked and return it
   */
  setRow() {

    for (let i = 0; i < this.board.getSize(); i++) {
      if (mouseY > this.board.getCellHeight() * i && mouseY < this.board.getCellHeight() * (i + 1)) {
        this.row = i;
      }
    }
    return this.row;
  }

  /* set col to where the mouse was clicked and return it
   */
  setCol() {
    for (let i = 0; i < this.board.getSize(); i++) {
      if (mouseX > this.board.getCellWidth() * i && mouseX < this.board.getCellWidth() * (i + 1)) {
        this.col = i;
      }
    }
    return this.col;
  }

} // Game