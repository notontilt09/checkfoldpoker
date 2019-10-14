import React from 'react';
import images from '../../assets/images.js';
import './card.css';


const Card = props => {
  const cardImage = images.find(image => image.title === props.card)

  return (
    <div className="card">{cardImage ? <img className="card-image" src={cardImage.src} alt={props.card} /> : null}</div>
  )
}

export default Card