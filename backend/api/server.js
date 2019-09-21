const express = require('express');
const configureMiddleware = require('./middleware.js');

const server = express();

configureMiddleware(server);

// fisher-yates shuffle algorithm
const shuffle = originalArray => {
  const array = originalArray.slice(0);

  for (let i = (array.length - 1); i > 0; i -= 1) {
    const randomIndex = Math.floor(Math.random() * (i + 1));
    [array[i], array[randomIndex]] = [array[randomIndex], array[i]];
  }

  return array;
}

let deck = [];

server.get('/shuffle', (req, res) => {
  if (deck.length) {
    deck = []
  }
  const suits = ['s', 'd', 'h', 'c'];
  const ranks = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
  for (let i = 0; i < ranks.length; i++) {
    for (let j = 0; j < suits.length; j++) {
      deck.push(`${ranks[i]}${suits[j]}`)
    }
  }
  deck = shuffle(deck)

  res.status(200).json({ message: 'Deck has been shuffled.'})
})

server.get('/deal-three', (req, res) => {
  let cards = deck.slice(0,3);
  deck = deck.slice(3);
  res.status(200).json({ cards })
})

module.exports = server;