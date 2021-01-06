const Type = Object.freeze({
  "HERO": 1,
  "AGENT": 2,
  "BLANK": 3
})

class Token {
  constructor(row, col, type) {
    this.diam = height / 10;
    this.tokenFill = color(255);;
    this.tokenStroke = color(0);
    this.type = type;

    this.x = this.initPos(col);
    this.y = this.initPos(row);
    this.selected = false;
  }

  initPos(pos) {
    return pos * (width / 5) + (width / 5 / 2);
  }

  drawToken() {
    const WHITE = color(255);
    const BLACK = color(0);
    const RED = color(255, 0, 0);

    this.tokenFill = this.type == Type.HERO ? WHITE : BLACK; // it doesn't matter if both type AGENT and BLANK are set to BLACK because BLANK is never drawn.
    this.tokenStroke = this.selected ? RED : BLACK;

    fill(this.tokenFill);
    strokeWeight(2);
    stroke(this.tokenStroke);
    ellipse(this.x, this.y, this.diam, this.diam);
  }

  move(row, col) {
    if (this.selected) {
      this.x = this.initPos(col);
      this.y = this.initPos(row);
    }

    this.selected = false;
  }

  selectToken() {
    let distX = mouseX - this.x;
    let distY = mouseY - this.y;
    let distance = sqrt(sq(distX) + sq(distY));

    this.selected = !this.selected && distance < this.diam / 2;
  }

  // ========== assessors ================
  getSelected() {
    return this.selected; // true/false
  }

  getType() {
    return this.type;
  }

  setType(type) {
    this.type = type;
  }
} // Token