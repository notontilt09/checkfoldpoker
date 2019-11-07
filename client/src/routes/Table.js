import React, {useState, useEffect} from 'react';
import Loader from 'react-loader-spinner';
import PlayerBoard from '../components/Boards/PlayerBoard.js';
import ActionButtons from '../components/ActionButtons.js';
import Seat from '../components/Seat/Seat.js';
import SocketIOClient from 'socket.io-client';
import axios from 'axios';

import '../styles/table.css';

const initialSeats = [
  {
    seatId: 1,
    name: null,
    filled: false,
    top: [null, null, null],
    middle: [null, null, null, null, null],
    bottom: [null, null, null, null, null],
    discards: [],
    hasButton: false,
  },
  {
    seatId: 2,
    name: null,
    filled: false,
    top: [null, null, null],
    middle: [null, null, null, null, null],
    bottom: [null, null, null, null, null],
    discards: [],
    hasButton: false,
  },
];

const url = 'http://localhost:5000';
const username = localStorage.getItem('cfp-user');

const Table = (props) => {
  // tableID corresponding to ObjectID in db
  const tableID = props.match.params.id;
  // socketIO endpoint.  TODO: Create room/namespace with the tableID
  const [tableInfo, setTableInfo] = useState(null)
  
  // map of all seats (seats contain board info)
  const [seats, setSeats] = useState(initialSeats);
  // boolean to kep track if we've already taken a seat
  const [seated, setSeated] = useState(false);
  const [numFilledSeats, setNumFilledSeats] = useState(0);
  //boolean to keep track if it's our turn to display action buttons
  const [myTurn, setmyTurn] = useState(false);
  
  // on mount, get the table info from REST endpoint.
  useEffect(() => {
    let socket = SocketIOClient(`${url}`);
    socket.on('connect', () => {
      socket.emit('room', tableID);
    })

    async function fetchTableInfo() {
      await socket.emit('get_table_info', tableID);
    }
    fetchTableInfo();

    socket.on('table-info', (res) => {
      console.log(res);
      setTableInfo(res.table);
    });
  }, [])

  // sits player in empty seat, called from Seat.js
  const sitHere = (seatNumber) => {
    axios.post(`${url}/api/tables/join-table`, {tableID, username})
      .then(res => console.log(res))
      .catch(err => console.log(err));

    setSeats(
      seats.map((seat) => {
        if (seat.seatId === seatNumber) {
          return {
            ...seat,
            filled: true,
          };
        } else {
          return seat;
        }
      })
    );
    setSeated(true);
    setNumFilledSeats(numFilledSeats + 1);
  };

  const standUp = (seatNumber) => {
    console.log(`standing up from seat ${seatNumber}`);
    if (window.confirm('Are you sure you want to leave?')) {
      setSeats(
        seats.map((seat) => {
          if (seat.seatId === seatNumber) {
            return {
              ...seat,
              name: null,
              filled: false,
            };
          } else {
            return seat;
          }
        })
      );
      setSeated(false);
      setNumFilledSeats(numFilledSeats - 1);
    }
  };

  return (
    <div className="table">
        {seats.map((seat) => (
          <div key={seat.seatId} className="player-area">
            <Seat
              seat={seat}
              sitHere={sitHere}
              seated={seated}
              standUp={standUp}
            />
            <PlayerBoard seat={seat} />
          </div>
        ))}
        {myTurn && <ActionButtons />}
    </div>
  );
};

export default Table;
