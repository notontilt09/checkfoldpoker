// initialize the deck as empty array and suits/ranks for a standard deck of cards
class Deck {
  constructor() {
    this.deck = []
    const suits = ['s', 'd', 'h', 'c'];
    const ranks = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
    for (let i = 0; i < ranks.length; i++) {
      for (let j = 0; j < suits.length; j++) {
        this.deck.push(`${ranks[i]}${suits[j]}`)
      }
    }
  }

  shuffle() {
    this.deck = shuffleArray(this.deck);
  }
}

// fisher-yates shuffle algorithm
const shuffleArray = originalArray => {
  const array = originalArray.slice(0);

  for (let i = (array.length - 1); i > 0; i -= 1) {
    const randomIndex = Math.floor(Math.random() * (i + 1));
    [array[i], array[randomIndex]] = [array[randomIndex], array[i]];
  }

  return array;
}


module.exports = Deck;