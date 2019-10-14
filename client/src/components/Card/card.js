import React from 'react';

import './card.css';

const Card = props => {
  console.log(props);
  return (
    <div className="card">{props.card}</div>
  )
}

export default Card