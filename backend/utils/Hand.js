const Deck = require('./deck.js');
const Player = require('./player.js');

let handId = 1;

class Hand {
  constructor(numPlayers=2, players) {
    this.handId = handId;
    handId++;
    this.numPlayers = numPlayers;

    const unshuffled = new Deck()
    this.deck = unshuffled.shuffle();

    this.players = players.map(player => new Player(player));
  }


}

module.exports = Hand;