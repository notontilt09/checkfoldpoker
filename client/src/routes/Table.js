import React, {useState, useEffect} from 'react';
// import Loader from 'react-loader-spinner';
import PlayerBoard from '../components/Boards/PlayerBoard.js';
import ActionButtons from '../components/ActionButtons.js';
// import BuyinModal from '../components/BuyinModal/BuyinModal.js';
import Seat from '../components/Seat/Seat.js';
// import SocketIOClient from 'socket.io-client';
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
  // console.log(props.socket);
  // tableID corresponding to ObjectID in db
  const tableID = props.match.params.id;
  // tableInfo set to table document from tables collection in DB
  const [tableInfo, setTableInfo] = useState(null)
  // map of all seats (seats contain board info)
  const [seats, setSeats] = useState(initialSeats);
  // boolean to keep track if client has taken a seat
  const [seated, setSeated] = useState(false);
  //boolean to keep track if it's our turn to display action buttons
  const [myTurn, setmyTurn] = useState(false);
  // show or hide the buy-in popup for a specific seat
  const [showBuyin, setShowBuyin] = useState(null);
  // users balance from db
  const [balance, setBalance] = useState(null);
  // error handling for buyin
  const [buyinError, setBuyinError] = useState(null);
  // boolean to keep track if a hand is in progress
  const [inProgress, setInProgress] = useState(false);
  // number of players seated to determine if a hand should start
  const [numSeated, setNumSeated] = useState(0);
  // seat that has the dealer button
  const [button, setButtom] = useState(1);
  


  // ! this is an attempt to make the user stand up from the table if they close the table window. CURRENTLY NOT WORKING PROPERLY.
  // useEffect(() => {
  //   window.addEventListener('beforeunload', (event) => {
  //     standUp(1, 2500);
  //     event.returnValue = 'Are you sure?'
  //   });

  //   return () => window.removeEventListener('beforeunload');
  // }, [])

  // when seats changes, update the global lobby for all
  useEffect(() => {
    if (props.socket) {
      props.socket.emit('get-lobby-info');
    }
  }, [seats, props.socket])

  // on mount when the socket is defined, get the table info from socket connection
  useEffect(() => {
    console.log('fired effect to get tableInfo');
    if (props.socket) {
      // console.log(props.socket);
      props.socket.on('connect', () => {
        props.socket.emit('room', tableID);
      })
  
      async function fetchTableInfo() {
        await props.socket.emit('get-table-info', tableID);
      }

      fetchTableInfo();
  
      props.socket.on('table-info', (res) => {
        console.log('new table info');
        console.log(res.table);
        setTableInfo(res.table);
        const filledSeats = [];
        if (res.table.seatedPlayers.length) {
          res.table.seatedPlayers.forEach(seat => filledSeats.push(seat.seat));
        }
        setSeats(
          seats.map(seat => {
            if (filledSeats.includes(seat.seatId)) {
              return {
                ...seat,
                filled: true,
                name: res.table.seatedPlayers.find(player => player.seat === seat.seatId).username,
                bank: res.table.seatedPlayers.find(player => player.seat === seat.seatId).bank
              }
            } else {
              return seat
            }
          })
        );
        setNumSeated(res.table.seatedPlayers.length);
      });
    }
  }, [props.socket, tableID])

  // when numSeated changes, fire this effect to start a hand if one is not in progress
  useEffect(() => {
    if (numSeated > 1 && !inProgress) {
      console.log('here');
      props.socket.emit('begin-hand', {tableID, button});
    }
  }, [seated])

  // when buyin modal is opened, get the users balance from db
  useEffect(() => {
    if (showBuyin) {
      axios.post(`${url}/api/tables/get-balance`, {username: username})
        .then(res => setBalance(res.data.balance))
        .catch(err => console.log(err))
    }
  }, [showBuyin])

  // sits player in empty seat, called from Seat.js
  const sitHere = (seatNumber, amount) => {
    if (!amount) {
      setBuyinError('Please buy in for at least 100 points.');
      return;
    }

    axios.post(`${url}/api/tables/join-table`, 
      {tableID, seat: seatNumber, username, amount: parseInt(amount)})
      .then(res => {
        setSeats(
          seats.map((seat) => {
            if (seat.seatId === seatNumber) {
              return {
                ...seat,
                filled: true,
                name: res.data.username,
                bank: amount
              };
            } else {
              return seat;
            }
          })
        );
        setNumSeated(numSeated + 1);
      })
      .then(() => {
        setSeated(true);
        setShowBuyin(false);
      })
      .then(() => props.socket.emit('get-table-info', tableID))
      .catch(err => setBuyinError(err.response.data.message));
  };

  const standUp = (seatNumber, amount) => {
    if (window.confirm('Are you sure you want to leave?')) {
      axios.post(`${url}/api/tables/leave-table`, {tableID, username, amount: parseInt(amount)})
        .then(res => {
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
          setNumSeated(numSeated - 1)
        })
        .then(() => setSeated(false))
        .then(() => props.socket.emit('get-table-info', tableID))
        .catch(err => console.log(err))
    }
  };

  return (
    <div className="table">
        {seats.map((seat) => (
          <div key={seat.seatId} className="player-area">
            <Seat
              seat={seat}
              username={username}
              seated={seated}
              standUp={standUp}
              showBuyin={showBuyin}
              setShowBuyin={setShowBuyin}
              sitHere={sitHere}
              tableID={tableID}
              balance={balance}
              buyinError={buyinError}
              tableInfo={tableInfo}
            />
            <PlayerBoard seat={seat} />
          </div>
        ))}
        {myTurn && <ActionButtons />}
        {/* {showBuyin && 
          <BuyinModal 
            sitHere={sitHere} 
            setShowBuyin={setShowBuyin}
            tableID={tableID}
            balance={balance}
            buyinError={buyinError}
          />
        } */}
    </div>
  );
};

export default Table;
