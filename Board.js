const SIZE = 5;

class Board {
  constructor(w, h) {
    this.cellWidth = w / SIZE;
    this.cellHeight = h / SIZE;
    this.cell = this.initializeBoard();
  }

  initializeBoard() {
    let cell = [];

    for (let i = 0; i < SIZE; i++) {
      cell[i] = [];
      for (let j = 0; j < SIZE; j++) {
        if ((i == 0 && (j == 1 || j == 3)) || (i == 3 && j == 2)) {
          cell[i][j] = new Location(i, j, new Token(i, j, Type.HERO));
        } else if ((i == 1 && j == 2) || (i == 4 && (j == 1 || j == 3))) {
          cell[i][j] = new Location(i, j, new Token(i, j, Type.AGENT));
        } else {
          cell[i][j] = new Location(i, j, new Token(i, j, Type.BLANK));
        }
      }
    }
    return cell;
  }

  drawBoard() {
    const BOARD_FILL = color(50, 140, 140);
    const BOARD_STROKE = color(0);

    for (let i = 0; i < SIZE; i++) {
      for (let j = 0; j < SIZE; j++) {
        strokeWeight(1);
        stroke(BOARD_STROKE);
        fill(BOARD_FILL);
        rect(i * this.cellWidth, j * this.cellHeight, this.cellWidth, this.cellHeight);
      }
    }
  }

  drawLocations() {
    for (let i = 0; i < SIZE; i++) {
      for (let j = 0; j < SIZE; j++) {
        if (this.cell[i][j].getToken().getType() != Type.BLANK) {
          this.cell[i][j].getToken().drawToken();
        }
      }
    }
  }

  getSize() {
    return SIZE;
  }

  getCellWidth() {
    return this.cellWidth;
  }

  getCellHeight() {
    return this.cellHeight;
  }

  getLocation(row, col) {
    return this.cell[row][col];
  }

}