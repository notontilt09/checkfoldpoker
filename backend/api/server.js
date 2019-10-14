const express = require('express');
const configureMiddleware = require('./middleware.js');
const Player = require('../utils/player.js');
const Deck = require('../utils/deck.js');
const Hand = require('../utils/Hand.js');

const server = express();

configureMiddleware(server);

let deck;
let players = [];

server.get('/hand', (req, res) => {
  const hand = new Hand(2, 'pineapple_high', ['Dan', 'Matt'])
  res.status(200).json(hand);
})

server.get('/', (req, res) => {
  res.send('Hello');
})

server.post('/join-game', (req, res) => {
  const { name } = req.body;

  const player = new Player(name);
  players.push(player);
  res.status(200).json({ message: `${name} joined the game` });
})

server.post('/leave-game', (req, res) => {
  const { name } = req.body;

  const remove = players.find(player => player.name === name);

  if (!remove) {
    res.status(404).json({ message: `${name} is not at the table.` })
  } else {
    players = players.filter(player => player.name !== name)
    res.status(204).end();
  }
})

// test endpoint to check which players are at the table and their info
server.get('/check-players', (req, res) => {
  res.status(200).json(players);
})

// this endpoint will initialized the game (shuffle the deck, initialize the players)
server.get('/start-game', (req, res) => {
  deck = new Deck();
  deck.shuffle();
  res.status(200).json(deck);
})

// get the top 3 cards from the deck
server.get('/deal-three', (req, res) => {
  if (deck.deck.length < 3) {
    res.status(500).json({ message: 'Not enough cards in deck' })
  } else {
    let cards = deck.deal(3);
    res.status(200).json(cards)
  }
})

// get the top 5 cards from the deck
server.get('/deal-five', (req, res) => {
  if (deck.deck.length < 5) {
    res.status(500).json({ message: 'Not enough cards in deck' })
  } else {
    let cards = deck.deal(5);
    res.status(200).json(cards);
  }
})

// post endpoint to update a players board
server.post('/set-cards', (req, res) => {
  // grab playerName and entire top/mid/bottom from the request.  Request must send the whole board info, not just the last played cards
  const { playerName, top, middle, bottom } = req.body;

  // find the player in the list of players at the table
  const playerToUpdate = players.find(player => player.name === playerName);

  if (playerToUpdate) {
    playerToUpdate.top = top;
    playerToUpdate.middle = middle;
    playerToUpdate.bottom = bottom;
    res.status(200).json(playerToUpdate)
  } else {
    res.status(500).json({ message: `${playerName} not at the table.` })
  }
})

module.exports = server;