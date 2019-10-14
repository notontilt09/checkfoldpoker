import React, { useState, useEffect} from 'react';
import axios from 'axios';
import './App.css';

import images from './assets/images.js';
import PlayerBoard from './components/Boards/PlayerBoard.js';
import OpponentBoard from './components/Boards/OpponentBoard.js';
import ActionButtons from './components/ActionButtons.js';
import Seat from './components/Seat/Seat.js';


const emptyBoard = [[null, null, null], [null, null, null], [null, null, null, null, null]];

const App = () => {
  // setup websocket instance
  const [ws, setWs] = useState(new WebSocket('ws://localhost:3030'));
  const [seated, setSeated] = useState(false);
  const [me, setMe] = useState(null)
  const [opp1, setOpp1] = useState(null)
  // initialize players' boards to all empty spots
  const [myBoard, setMyBoard] = useState(emptyBoard)
  const [opp1Board, setOpp1Board] = useState(emptyBoard);
  const [myTurn, setMyTurn] = useState(false);
  const [mySeatNumber, setMySeatNumber] = useState(null);

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

  const submitForm = e => {
    e.preventDefault();
    ws.send(myBoard);
  }

  const sitHere = seatNumber => {
    console.log(seatNumber);
    const me = window.prompt('What is your name?');
    if (me) {
      setMe({
        name: me,
        bank: 1000
      });
      setSeated(true);
      setMySeatNumber(seatNumber);
    }
  }
  
  // const newWindow = () => {
  //   // window.open with these params to open a new window with /table url
  //   window.open('/table', '_blank', 'toolbar=0,location=0,menubar=0,height=500,width=800');
  // }

  return (
    <div className='table'>
      <div className="player-area">
        <Seat 
          seatNumber={1} 
          sitHere={sitHere} 
          seated={seated}
          mySeatNumber={mySeatNumber}
          me={me}
          opp1={opp1}
        />
        <PlayerBoard />
      </div>
      <div className="player-area">
        <Seat 
          seatNumber={2} 
          sitHere={sitHere} 
          seated={seated}
          mySeatNumber={mySeatNumber}
          me={me}
          opp1={opp1}
        />        
        <PlayerBoard />
      </div>
      {myTurn && <ActionButtons />}
    </div>
  )
}

export default App;
