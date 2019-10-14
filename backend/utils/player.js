class Player {
  constructor(name) {
    this.name = name
    this.top = [null, null, null];
    this.middle = [null, null, null, null, null];
    this.bottom = [null, null, null, null, null];
    this.discards = [null, null, null, null]
    this.fantasy = false;
    // default this to 1000, eventually will pull from database
    this.bank = 1000;
  }
}

module.exports = Player;