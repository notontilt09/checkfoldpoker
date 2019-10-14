const Deck = require('./deck.js');
const Player = require('./player.js');

class Hand {
  constructor(numPlayers=2, gameType='pinapple_high', players) {
    this.numPlayers = numPlayers;
    this.gameType = gameType
    const unshuffled = new Deck()
    this.deck = unshuffled.shuffle();
    this.players = players.map(player => new Player(player));
  }


}

module.exports = Hand;