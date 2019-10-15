const Seat = require('./seat.js');

class Table {
  constructor(gameType='pineapple_high', numSeats=2) {
    this.gameType = gameType;
    this.numSeats = numSeats;
    // * start button in null seat, randomize for first hand, and move appropriately for all subsequent hands
    this.button = null;
    this.filledSeats = 0;
    this.seatArray = []
    // fill the seat array with as many empty seat objects as necessary
    for (let i = 0; i < numSeats; i++) {
      this.seatArray.push(new Seat(i+1))
      console.log(this.seatArray);
    }
  }

  // called from the websocket on a seat-update message, sets the seat config on the server
  setSeats(seatInfo) {
    this.seatArray = seatInfo;
    this.updateFilledSeats();
  }

  // keeps track of how many seats are filled to determine if a hand should be dealt
  updateFilledSeats() {
    let filled = 0;
    this.seatArray.forEach(seat => {
      if (seat.filled) {
        filled++;
      }
    })
    this.filledSeats = filled;
  }

  // set the button for the first hand dealt at a table
  setInitialButton() {
    // randomizing button in 2 seat game for 1st hand
    if (this.numSeats === 2) {
      const rand = Math.random();
      console.log(1/3);
      if (rand < 0.5) {
        this.button = 1;
      } else {
        this.button = 2;
      }
      // randomizing button in 3 seat game for first hand
    } else if (this.numSeats === 3) {
      const rand = Math.random();
      if (rand < 1/3) {
        this.button = 1;
      } else if (rand < 2/3) {
        this.button = 2;
      } else {
        this.button = 3;
      }
    }
  }

  // move the button after a hand is completed
  moveButton() {
    if (this.button === this.numSeats) {
      this.button = 1
    } else {
      this.button++;
    }
  }

  // main logic for dealing a hand
  // TODO: build out this function
  dealHand() {
    // move the button to the correct seat
    if (!this.button) {
      this.setInitialButton()
    } else {
      this.moveButton();
    }
  }
}

module.exports = Table;