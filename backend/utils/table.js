class Table {
  constructor(gameType='pineapple_high', numSeats=2) {
    this.gameType = gameType;
    this.numSeats = numSeats;
    this.button = 1
    this.seatArray = []
    // for (let i = 0; i < numSeats; i++) {
    //   this.seatArray.push({
    //     seatId: i + 1,
    //     name: null,
    //     filled: false,
    //     bank: 1000
    //   })
    // }
  }

  sitPlayer(seatId, name) {
    this.seatArray[seatId - 1].name = name;
    this.seatArray[seatId - 1].filled = true;
  }

  removePlayer(seatId) {
    this.seatArray[seatId - 1].name = null;
    this.seatArray[seatId - 1].filled = false;
  }

  setSeats(seatInfo) {
    this.seatArray = seatInfo;
  }
}

module.exports = Table;