import React, { useState } from 'react';

import './popup.css';

const BuyinModal = (props) => {
  console.log(props);
  const [buyinAmount, setBuyinAmount] = useState(parseInt(props.tableInfo.stakes*100));

  const handleBuyinChange = e => {
    setBuyinAmount(e.target.value);
  }

  console.log('buyinAmount:', parseInt(buyinAmount), 'stakes:', parseInt(props.tableInfo.stakes))

  return (
    <div className="buyin-modal">
      <div className="modal-content">
        <h3 className="modal-table-name">{`${props.tableInfo.name}`}</h3>
        <h3 className="modal-table-stakes">{`${props.tableInfo.stakes}/pt`}</h3>
        <h3>{`Balance: ${props.balance}`}</h3>
        <div className="buyin-amount">
          <label htmlFor="buyin-input">Buyin:</label>
          <input 
            id="buyin-input" 
            type="number" 
            value={buyinAmount}
            onChange={handleBuyinChange}
          />
        </div>
        <div className="buyin-buttons">
          <button 
            className="cancel-buyin"
            onClick={props.cancelBuyin}
          >Cancel
          </button>
          <button
            disabled={parseInt(buyinAmount) < 100 * parseInt(props.tableInfo.stakes)}
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