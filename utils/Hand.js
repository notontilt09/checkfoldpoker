const Deck = require('./deck');

let handId = 1;

class Hand {
  constructor(numPlayers, buttonSeat) {
    this.handId = handId;
    this.numPlayers = numPlayers;
    this.buttonSeat = buttonSeat;
    
    const unshuffled = new Deck();
    this.deck = unshuffled.shuffle();

    handId++;
  }
}

module.exports = Hand;
