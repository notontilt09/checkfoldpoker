import React, { useState, useEffect} from 'react';
import axios from 'axios';
import './App.css';

import images from './assets/images.js';
import PlayerBoard from './components/Boards/PlayerBoard.js';
import OpponentBoard from './components/Boards/OpponentBoard.js';
import ActionButtons from './components/ActionButtons.js';
import Seat from './components/Seat/Seat.js';

const emptyBoard = [[null, null, null], [null, null, null], [null, null, null, null, null]];
const initialSeats = [
  {
    seatId: 1,
    name: null,
    bank: 1000,
    filled: false
  },
  {
    seatId: 2,
    name: null,
    bank: 1000,
    filled: false
  },
]

const App = () => {
  // setup websocket instance
  const [ws, setWs] = useState(new WebSocket('ws://localhost:3030'));
  // initialize players' boards to all empty spots
  const [myBoard, setMyBoard] = useState(emptyBoard)
  const [opp1Board, setOpp1Board] = useState(emptyBoard);
  // boolean to keep track if it's our turn to show action buttons
  const [myTurn, setMyTurn] = useState(false);
  // map of all players in seats
  const [seats, setSeats] = useState(initialSeats);
  // boolean to kep track if we've already taken a seat
  const [seated, setSeated] = useState(false);

  ws.onopen = () => {
    console.log('connected');
  }

  ws.onmessage = e => {
    console.log(e.data);
    // TODO: do something with the data...
  }

  ws.onclose = () => {
    // try to reconnect the websocket if it gets disconnected
    console.log('disconnected');
    setWs(new WebSocket('ws://localhost:3030'));
  }

  const handleChanges = e => {
    setMyBoard(e.target.value);
  }

  // const submitForm = e => {
  //   e.preventDefault();
  //   ws.send(myBoard);
  // }

  const sitHere = seatNumber => {
    const me = window.prompt('What is your name?');
    setSeats(seats.map(seat => {
      if (seat.seatId === seatNumber) {
        return {
          ...seat,
          player: me,
          filled: true
        }
      } else {
        return seat
      }
    }));
    setSeated(true);
  }
  
  // const newWindow = () => {
  //   // window.open with these params to open a new window with /table url
  //   window.open('/table', '_blank', 'toolbar=0,location=0,menubar=0,height=500,width=800');
  // }

  return (
    <div className='table'>
      {seats.map(seat => (
        <div key={seat.seatId} className="player-area">
          <Seat
            seatNumber={seat.seatId}
            player={seat.player}
            bank={seat.bank}
            sitHere={sitHere}
            seated={seated}
          />
          <PlayerBoard />
        </div>
      ))}
      {myTurn && <ActionButtons />}
    </div>
  )
}

export default App;
