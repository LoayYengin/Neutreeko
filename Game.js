const Status = Object.freeze({ "ACTIVE": 1, "INACTIVE": 2, "HERO_WIN": 3, "AGENT_WIN": 4 })

class Game {
  constructor(w, h) {
    this.board = new Board(w, h);
    this.players = this.newPlayers();
    this.turn = this.players[0];
    this.status = Status.INACTIVE;

    this.agentLocations = this.newAgentLocations(); // Location[]

    this.row = -1;
    this.col = -1;
    this.startX = -1;
    this.startY = -1;
    this.endX = -1;
    this.endY = -1;
  }

  /* returns an array containing 2 players for the game.
     * a player can either be the hero (true) or agent (false)
     */
    newPlayers() {
      let players = [];
  
      players[0] = new Player(true, true);
      players[1] = new Player(false, false);
      return players;
    }
  
    /* searches the board and stores the location of the AGENT tokens (black)
     */
    newAgentLocations() {
      let agentLocations = [];
      let index = 0;
  
      for (let i = 0; i < this.board.getSize(); i++) {
        for (let j = 0; j < this.board.getSize(); j++) {
          if (this.board.getLocation(i, j).getToken().getType() == Type.AGENT) {
            agentLocations[index] = new Location(i, j, new Token(i, j, Type.AGENT));
            index++;
          }
        }
      }
  
      return agentLocations;
    }

  //========== methods called by main ==========

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

      if (this.checkWinner()) {
        this.setWinStatus();
      }

      if (this.status != Status.HERO_WIN && !this.turn.getHero()) {
        this.parseAgentMove();
        this.setTurn();
        if (this.checkWinner()) {
          this.setWinStatus();
        }
      }
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

    // this.board.initializeBoard();
    this.turn = this.players[0];
    this.status = Status.INACTIVE;
    this.agentLocations = this.newAgentLocations();
  }

  //========== functions called only in Game ==========

  //========== parseMousePressCommand Methods ==========

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
    let winFound = false;

    winFound = this.checkWinnerHelper(0, 1, 0, -1, 0, 1); // check for horizontal winner
    if (!winFound) {
      winFound = this.checkWinnerHelper(1, 0, -1, 0, 1, 0); // check for vertical winner
      if (!winFound) {
        winFound = this.checkWinnerHelper(1, 1, -1, -1, 1, 1); // check for diagonal winner \ 
        if (!winFound) {
          winFound = this.checkWinnerHelper(1, 1, -1, 1, 1, -1); // check for diagonal winner /
        }
      }
    }
    return winFound;
  }

  checkWinnerHelper(rowEdge, colEdge, rowAdjacent1, colAdjacent1, rowAdjacent2, colAdjacent2) {
    let currentLocationType;
    let winFound = false;

    for (let i = rowEdge; i < this.board.getSize() - rowEdge; i++) { // row
      for (let j = colEdge; j < this.board.getSize() - colEdge; j++) { // col
        // if there is a non blank token check if there are 3 tokens of the same type in a row 
        currentLocationType = this.board.getLocation(i, j).getToken().getType();

        if (currentLocationType != Type.BLANK) {
          if (currentLocationType == this.board.getLocation(i + rowAdjacent1, j + colAdjacent1).getToken().getType() &&
            currentLocationType == this.board.getLocation(i + rowAdjacent2, j + colAdjacent2).getToken().getType()) {
            this.status = this.turn == this.players[0] ? Status.AGENT_WIN : Status.HERO_WIN;

            winFound = true;
          }
        }
      }
    }
    return winFound;
  } // checkWinnerHelper

  setStart() {
    this.startX = this.setRow();
    this.startY = this.setCol();
    print("the start location: " + this.startX + ", " + this.startY);
  }

  setEnd() {
    this.endX = this.setRow();
    this.endY = this.setCol();
    print("the end location: " + this.endX + ", " + this.endY);
  }

  // ========== setters ==========

  /* set turn to the other player
  */
  setTurn() {
    this.turn = this.turn == this.players[0] ? this.players[1] : this.players[0];
  }

  setWinStatus() {
    this.status = this.turn == this.players[0] ? Status.AGENT_WIN : Status.HERO_WIN;
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

  //==================== Random AI Movement - always play winning move if it exists ===================
  /* track the start index in allmoves for the moves of each token 
   Agent plays the winning move if it exists, otheriwse random
   */
  parseAgentMove() {
    // let maxMoves = 8; // max number of possible moves
    // let numAgentTokens = 3;

    let allMoves = []; // 2d list of moves for each AGENT token [numAgentTokens][maxMoves]
    let numMovesCounter = []; // number of moves for each AGENT token
    let agentLocationIndex = 0; // which token?

    let chosenMove = null; // move to be checked and/or final move played by computer
    let winMoveFound = false; // is there a winning move?

    // calculates all valid moves of each token, store in 2d array allMoves, return and store number of moves for each token
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 8; j++) {
        numMovesCounter[i] = this.calculateMoves(allMoves, i); 
      }
    }

    //---

    for (let i = 0; !winMoveFound && i < 3; i++) {
      agentLocationIndex = i;
      for (let j = 0; !winMoveFound && j < numMovesCounter[i]; j++) {
        chosenMove = this.aiCheckWinningMove(allMoves, i, numMovesCounter[i]); // check each set of moves
        if (chosenMove != null) {
          winMoveFound = true;
        }
      }
    }

    //---
    if (chosenMove != null) {
      this.board = chosenMove.updateBoard();
      this.agentLocations[agentLocationIndex] = new Location(chosenMove.getEnd().getRow(), chosenMove.getEnd().getCol(), new Token(1, 2, Type.AGENT));
    } else {
      let i = Math.floor(Math.random(3) * 3);
      let j = Math.floor(Math.random(numMovesCounter[i]) * numMovesCounter[i]);
      chosenMove = allMoves[i][j];
      this.board = chosenMove.updateBoard();
      this.agentLocations[i] = new Location(chosenMove.getEnd().getRow(), chosenMove.getEnd().getCol(), new Token(1, 2, Type.AGENT));
    }
  }//parseAgentMove

  /*
  *
   */
  calculateMoves(allMoves, n) {
    let size = 5;
    let index = 0;
    let end;
    let aiMove;
    allMoves[n] = [];
    let start = this.board.getLocation(this.agentLocations[n].getRow(), this.agentLocations[n].getCol());

    for (let i = 0; i < size; i++) {
      for (let j = 0; j < size; j++) {
        end = this.board.getLocation(i, j);
        aiMove = new Move(this.board, start, end);

        if (aiMove.isValid()) { // if a valid move has occured store it in allMoves[][]
          allMoves[n][index] = aiMove;
          index++;
        }
      }
    }
    return index;
  }

  /*
  *
   */
  aiCheckWinningMove(allMoves, token, numMoves) { //****** can't find a diagonal \ winning move - doesn't see it
    let winFound = false;
    let winningMove = null;

    for (let i = 0; (!winFound && i < numMoves); i++) {
      allMoves[token][i].updateBoard();

      if (this.checkWinner()) {
        winningMove = allMoves[token][i];
        winFound = true;
      }
      allMoves[token][i].undoBoard();
    }
    return winningMove;
  }//aiCheckWinningMove

} // Game
