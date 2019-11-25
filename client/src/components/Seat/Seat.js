import React from 'react'
import BuyinModal from '../BuyinModal/BuyinModal';

import './seat.css';

const Seat = props => {
  console.log(props);
  const showModal = (seatId) => {
    if (!props.seated) {
      props.setShowBuyin(seatId);
    }
  }

  const cancelBuyin = () => {
    props.setShowBuyin(false);
  }

  return (
    <div className='seat'>
      {props.seat.filled &&
        // if this is the seat client clicked, show their info
        <div className='player-info'>
          <h4 className='player-name'>{props.seat.name}</h4>
          <h4 className='player-bank'>{props.seat.bank}</h4>
        </div>
      }
      {props.seat.name && props.seat.name === props.username &&
        <button className="leave" onClick={() => props.standUp(props.seat.seatId, props.seat.bank)}>Stand up</button>
      }
      {!props.seat.filled &&
        // seat is empty
        <div className='seat-open' onClick={() => showModal(props.seat.seatId)}>
          <h4>Seat Open</h4>
        </div>
      }
      {props.showBuyin === props.seat.seatId &&
        <BuyinModal 
          sitHere={props.sitHere} 
          setShowBuyin={props.setShowBuyin}
          tableID={props.tableID}
          balance={props.balance}
          buyinError={props.buyinError}
          seat={props.seat}
          cancelBuyin={cancelBuyin}
          tableInfo={props.tableInfo}
        />
      }
    </div>
  )
}

export default Seat