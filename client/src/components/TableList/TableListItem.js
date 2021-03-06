import React from 'react'

const TableListItem = (props) => {
  return (
    <>
      <td>{props.table.name}</td>
      <td>{`${props.table.stakes}/pt`}</td>
      <td>{props.table.type}</td>
      <td>{`${props.table.seats}`}</td> 
    </>
  );
};

export default TableListItem;