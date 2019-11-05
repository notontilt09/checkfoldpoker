import React, {useState, useEffect} from 'react';
import axios from 'axios';

import TableListItem from '../components/TableList/TableListItem';

import '../styles/lobby.css';

const Lobby = () => {
  const [tableInfo, setTableInfo] = useState([]);
  const [selectedTable, setSelectedTable] = useState(null);

  // load all the table info from server on mount
  useEffect(() => {
    axios
      .get('http://localhost:5000/api/tables/')
      .then(res => {
        setTableInfo(res.data);
      })
      .catch(err => console.log(err));
  }, [])

  // open table in popout window
  // TODO: FIND A WAY TO OPEN TABLES IN TILED VIEW, CURRENTLY OVERLAPPING
  const openTable = (id) => {
    const windowFeatures = 'toolbar=no,height=600,width=1000,top=0,left=0';
    window.open(`table/${id}`, id, windowFeatures);
  }

  return (
    tableInfo.length > 0 ?
      <table className="tables-list">
        <tbody>
          <tr>
            <th>Table</th>
            <th>Stakes</th>
            <th>Game Type</th>
            <th>Players</th>
          </tr>
          {tableInfo.map(table => (
            <tr 
              onClick={() => setSelectedTable(table._id)}
              onDoubleClick={() => openTable(table._id)}
              className={selectedTable === table._id ? "active table-list-item" : "table-list-item"}
              key={table._id}
            >
              <TableListItem selectedTable={selectedTable} table={table} />
            </tr>
          ))}
        </tbody>
      </table>
      : <h3>Getting Table Information</h3>
  );
};

export default Lobby;
