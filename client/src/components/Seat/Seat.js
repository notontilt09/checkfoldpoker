import React from 'react'

import './seat.css';

const Seat = props => {
  console.log(props);

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
          <h4>{props.player}</h4>
          <h4>{props.bank}</h4>
        </div>
      }
      {!props.player &&
        // seat is empty
        <div className='seat-open' onClick={sitDown}>Seat Open</div>
      }
    </div>
  )
}

export default Seat