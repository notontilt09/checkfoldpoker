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
      {props.seatNumber === props.mySeatNumber ?
        // if this is the seat client clicked, show their info
        <div className='player-info'>
          <h4>{props.me.name}</h4>
          <h4>{props.me.bank}</h4>
        </div> :
        // if no player in seat, display seat open
        <div className='seat-open' onClick={sitDown}>Seat Open</div>
      }
    </div>
  )
}

export default Seat