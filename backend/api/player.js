class Player {
  constructor(name) {
    this.name = name
    this.top = [];
    this.middle = [];
    this.bottom = [];
    this.bank = null;
  }

  addTop(card) {
    this.top.push(card);
  }

  addMiddle(card) {
    this.middle.push(card);
  }

  addBottom(card) {
    this.bottom.push(card);
  }
}

module.exports = Player;