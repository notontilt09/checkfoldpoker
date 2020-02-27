class Seat {
  constructor(id, bank = 1000) {
    (this.seatId = id),
      (this.name = null),
      (this.filled = false),
      (this.bank = bank),
      (this.top = [null, null, null]),
      (this.middle = [null, null, null, null, null]),
      (this.bottom = [null, null, null, null, null]),
      (this.discards = []),
      (this.hasButton = false);
  }
}

module.exports = Seat;
