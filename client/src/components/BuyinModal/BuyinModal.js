import React, { useState } from 'react';

import './popup.css';

const BuyinModal = (props) => {
  const [buyinAmount, setBuyinAmount] = useState(100);

  return (
    <div className="buyin-modal">
      <div className="modal-content">
        <h3>{`Balance: ${props.balance}`}</h3>
        <div className="buyin-amount">
          <label htmlFor="buyin-input">Buyin:</label>
          <input 
            id="buyin-input" 
            type="text" 
            value={buyinAmount}
            onChange={(e) => setBuyinAmount(e.target.value)}
          />
        </div>
        <div className="buyin-buttons">
          <button 
            className="cancel-buyin"
            onClick={props.cancelBuyin}
          >Cancel
          </button>
          <button
            className="submit-buyin"
            onClick={() => props.sitHere(props.seat.seatId, buyinAmount)}
          >OK</button>
        </div>
        {props.buyinError &&
          <h4 className="buyin-error">{props.buyinError}</h4>
        }
      </div>
    </div>
  )
};

export default BuyinModal;