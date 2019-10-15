import React from 'react'

import './seat.css';

const Seat = props => {

  const sitDown = () => {
    if (!props.seated) {
      props.sitHere(props.seat.seatId);
    }
  }

  return (
    <div className='seat'>
      {props.seat.filled &&
        // if this is the seat client clicked, show their info
        <div className='player-info'>
          <h4 className='player-name'>{props.seat.name}</h4>
          <h4 className='player-bank'>{props.seat.bank}</h4>
          {props.seat.name === props.username &&
            <button onClick={() => props.standUp(props.seat.seatId)}>Leave Table</button>
          }
        </div>
      }
      {!props.seat.filled &&
        // seat is empty
        <div className='seat-open' onClick={sitDown}>
          <h4>Seat Open</h4>
        </div>
      }
    </div>
  )
}

export default Seat