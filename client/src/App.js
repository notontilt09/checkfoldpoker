import React, { useState, useEffect } from 'react';
import Loader from 'react-loader-spinner'
// import axios from 'axios';
import './App.css';

// import images from './assets/images.js';
import PlayerBoard from './components/Boards/PlayerBoard.js';
import ActionButtons from './components/ActionButtons.js';
import Seat from './components/Seat/Seat.js';

const initialSeats = [
  {
    seatId: 1,
    name: null,
    bank: 1000,
    filled: false,
    top: [null, null, null],
    middle: [null, null, null, null, null],
    bottom: [null, null, null, null, null],
    discards: [],
    hasButton: false
  },
  {
    seatId: 2,
    name: null,
    bank: 1000,
    filled: false,
    top: [null, null, null],
    middle: [null, null, null, null, null],
    bottom: [null, null, null, null, null],
    discards: [],
    hasButton: false
  },
]

const App = () => {
  // setup websocket instance
  const [ws, setWs] = useState(new WebSocket('ws://localhost:3030'));
  // boolean to keep track if it's our turn to show action buttons
  const [myTurn, setMyTurn] = useState(false);
  // map of all seats (seats contain board info)
  const [seats, setSeats] = useState(initialSeats);
  // boolean to kep track if we've already taken a seat
  const [seated, setSeated] = useState(false);
  const [numFilledSeats, setNumFilledSeats] = useState(0);
  const [username, setUsername] = useState(null);

  ws.onopen = () => {
    console.log('connected');
    console.log(ws.readyState);
  }

  ws.onmessage = e => {
    const seatArray = JSON.parse(e.data);
    console.log('sa', seatArray);
    setSeats(seatArray);
  }

  ws.onclose = () => {
    // try to reconnect the websocket if it gets disconnected
    console.log('disconnected, attempting to reconnect');
    setWs(new WebSocket('ws://localhost:3030'));
  }

  // if user sits down or stands up from table, send the new seat information to the server
  useEffect(() => {
    // seat information to send to ws server
    const seatInfo = {
      seats,
      type: 'seat'
    }

    // if connected send the seatInfo
    if (ws.readyState === 1) {
      ws.send(JSON.stringify(seatInfo));
    }
  }, [numFilledSeats])

  const sitHere = seatNumber => {
    const me = window.prompt('What is your name?');
    setUsername(me);
    setSeats(seats.map(seat => {
      if (seat.seatId === seatNumber) {
        return {
          ...seat,
          name: me,
          filled: true
        }
      } else {
        return seat
      }
    }));
    setSeated(true);
    setNumFilledSeats(numFilledSeats + 1);
  }

  const standUp = seatNumber => {
    console.log(`standing up from seat ${seatNumber}`)
    if (window.confirm('Are you sure you want to leave?')) {
      setSeats(seats.map(seat => {
        if (seat.seatId === seatNumber) {
          return {
            ...seat,
            name: null,
            filled: false
          }
        } else {
          return seat
        }
      }))
      setSeated(false);
      setNumFilledSeats(numFilledSeats - 1);
    }
  }

  return (
    <div className='table'>
      {/* if websocket in connecting state, show a spinner */}
      {ws.readyState === 0 &&
        <Loader 
          type="TailSpin" 
          color="gray" 
        />
      }
      {/* if websocket in ready state show table */}
      {ws.readyState === 1 && seats.map(seat => (
        <div key={seat.seatId} className="player-area">
          <Seat 
            seat={seat} 
            sitHere={sitHere} 
            seated={seated}
            standUp={standUp}
            username={username}
          />
          <PlayerBoard seat={seat}/>
        </div>
      ))}
      {myTurn && <ActionButtons />}
    </div>
  )
}

export default App;
