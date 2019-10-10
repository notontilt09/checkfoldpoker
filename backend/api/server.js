const express = require('express');
const configureMiddleware = require('./middleware.js');
const Player = require('./player.js');
const Deck = require('./deck.js');

const server = express();

configureMiddleware(server);


const deck = new Deck();
deck.shuffle()


// endpoint to get the top 3 cards from the deck
server.get('/deal-three', (req, res) => {
  let cards = deck.slice(0,3);
  deck = deck.slice(3);
  res.status(200).json({ cards });
})

// endpoint to get the top 5 cards from the deck
server.get('/deal-five', (req, res) => {
  let cards = deck.slice(0, 5);
  deck = deck.slice(5);
  res.status(200).json({ cards });
})

module.exports = server;