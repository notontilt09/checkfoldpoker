import React from 'react';

import Card from '../Card/card.js'
import './board.css';

const PlayerBoard = props => {
  console.log(props);
  return (
    <div className="board">
      <div className="top">
        {props.seat.top.map(card => (
          <Card key={card ? card : Math.random()} card={card}/>
        ))}
      </div>
      <div className="middle">
        {props.seat.middle.map(card => (
          <Card key={card ? card : Math.random()} card={card}/>
        ))}
      </div>
      <div className="bottom">
        {props.seat.bottom.map(card => (
          <Card key={card ? card : Math.random()} card={card}/>
        ))}
      </div>
    </div>
  )
}

export default PlayerBoard;