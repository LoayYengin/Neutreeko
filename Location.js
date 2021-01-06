/*
 * The Location class represents a square on the 5x5 board.
 * stores an x and y coordinate and a token
 */

class Location {
  constructor(row, col, token) {
    this.row = row;
    this.col = col;
    this.token = token;
  }

  // getters
  getRow() {
    return this.row;
  }

  getCol() {
    return this.col;
  }

  getToken() {
    return this.token;
  }

} // Location