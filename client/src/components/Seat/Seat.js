import React from 'react'

import './seat.css';

const Seat = props => {

  const sitDown = () => {
    if (!props.seated) {
      props.sitHere(props.seatNumber);
    }
  }

  return (
    <div className='seat'>
      {props.player &&
        // if this is the seat client clicked, show their info
        <div className='player-info'>
          <h4 className='player-name'>{props.player}</h4>
          <h4 className='player-bank'>{props.bank}</h4>
        </div>
      }
      {!props.player &&
        // seat is empty
        <div className='seat-open' onClick={sitDown}>
          <h4>Seat Open</h4>
        </div>
      }
    </div>
  )
}

export default Seat