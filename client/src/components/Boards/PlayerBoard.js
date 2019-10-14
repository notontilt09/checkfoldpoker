import React from 'react';

import Card from '../Card/card.js'
import './board.css';

const PlayerBoard = props => {
  return (
    <div className="board">
      <div className="top">
        {props.board[0].map(card => (
          <Card key={Math.random()} card={card}/>
        ))}
      </div>
      <div className="middle">
        {props.board[1].map(card => (
          <Card key={Math.random()} card={card}/>
        ))}
      </div>
      <div className="bottom">
        {props.board[2].map(card => (
          <Card key={Math.random()} card={card}/>
        ))}
      </div>
    </div>
  )
}

export default PlayerBoard;