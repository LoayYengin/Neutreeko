/*
 * Moves are passed the current board state, the start location of a token and the intended end location.
 * Tokens can move in any linear direction but must move as far as it can along the board until it encounters another token or an edge.
 */

class Move {
  constructor(board, start, end) {
    this.board = board;
    this.start = start;
    this.end = end;
  }

  /* set the end location's token type to the start location's token type
   * set the start location's token type to BLANK
   */
  updateBoard() {
    this.board.getLocation(this.end.getRow(), this.end.getCol()).getToken().setType(this.start.getToken().getType());
    this.board.getLocation(this.start.getRow(), this.start.getCol()).getToken().setType(Type.BLANK);

    return this.board;
  }

  /* find all valid move locations for all 8 directions 
   * check if start and end locations are the same
   * check if end location is == to one of the valid locations
   */
  isValid() {
    let isValid = false;

    if (this.start.getRow() != this.end.getRow() || this.start.getCol() != this.end.getCol()) {
      if (this.end.getRow() == this.findValidSpot().getRow() && this.end.getCol() == this.findValidSpot().getCol()) {
        isValid = true;
      }
    }
    return isValid;
  }

  /* check direction of end location relative to the start and return the valid location for this direction
   */
  findValidSpot() {
    let valid;

    if (this.start.getRow() == this.end.getRow()) { // horizontal
      valid = this.end.getCol() < this.start.getCol() ? this.findValidSpotHorizontal(this.start, 0, -1) : this.findValidSpotHorizontal(this.start, 4, 1);
    } else if (this.start.getCol() == this.end.getCol()) { // vertical 
      valid = this.end.getRow() < this.start.getRow() ? this.findValidSpotVertical(this.start, 0, -1) : this.findValidSpotVertical(this.start, 4, 1);
    } else if (this.start.getRow() > this.end.getRow()) { // upwards diagnonal
      valid = this.start.getCol() > this.end.getCol() ? this.findValidSpotDiagonal(this.start, 0, 0, -1, -1) : this.findValidSpotDiagonal(this.start, 0, 4, -1, 1);
    } else { // downwards diagonal
      valid = this.start.getCol() > this.end.getCol() ? this.findValidSpotDiagonal(this.start, 4, 0, 1, -1) : this.findValidSpotDiagonal(this.start, 4, 4, 1, 1);
    }
    return valid;
  }

  findValidSpotHorizontal(valid, minMax, direction) {
    // minMax is either 0 or 4 and direction is -1 or +1

    while (valid.getCol() != minMax && this.board.getLocation(valid.getRow(), valid.getCol() + direction).getToken().getType() == Type.BLANK) {
      valid = this.board.getLocation(valid.getRow(), valid.getCol() + direction);
    }
    return valid;
  }

  findValidSpotVertical(valid, minMax, direction) {
    // minMax is either 0 or 4 and direction is -1 or +1

    while (valid.getRow() != minMax && this.board.getLocation(valid.getRow() + direction, valid.getCol()).getToken().getType() == Type.BLANK) {
      valid = this.board.getLocation(valid.getRow() + direction, valid.getCol());
    }
    return valid;
  }

  findValidSpotDiagonal(valid, rowLimit, colLimit, rowDirection, colDirection) {
    // minMax is either 0 or 4 and direction is -1 or +1

    while ((valid.getRow() != rowLimit && valid.getCol() != colLimit) && this.board.getLocation(valid.getRow() + rowDirection, valid.getCol() + colDirection).getToken().getType() == Type.BLANK) {
      valid = this.board.getLocation(valid.getRow() + rowDirection, valid.getCol() + colDirection);
    }
    return valid;
  }
}