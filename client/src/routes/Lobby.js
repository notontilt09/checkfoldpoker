import React, {useState, useEffect} from 'react';
import axios from 'axios';
import SocketIOClient from 'socket.io-client';

import TableListItem from '../components/TableList/TableListItem';

import '../styles/lobby.css';

// const url = 'http://localhost:5000';
const username = localStorage.getItem('cfp-user');

const Lobby = (props) => {
  // console.log(props);
  const [tableInfo, setTableInfo] = useState([]);
  const [selectedTable, setSelectedTable] = useState(null);
  const [socket, setSocket] = useState(null);
  console.log(selectedTable);

  // when socket is defined during mount, run this side effect to get lobby information
  useEffect(() => {
    if (props.socket) {

      async function fetchLobbyInfo() {
        await props.socket.emit('get-lobby-info');
      }

      fetchLobbyInfo();
      
      props.socket.on('lobby-info', res => {
        const prev_selected = tableInfo._id
        setTableInfo(res.tables);
      })
    }
  }, [props.socket])

  useEffect(() => {
    if (selectedTable) {
      setSelectedTable(tableInfo.find(table => table._id === selectedTable._id))
    }
  }, [tableInfo])

  // open table in popout window
  // TODO: FIND A WAY TO OPEN TABLES IN TILED VIEW, CURRENTLY OVERLAPPING
  const openTable = (id) => {
    const windowFeatures = 'toolbar=no,height=600,width=1000,top=0,left=0';
    window.open(`table/${id}`, id, windowFeatures);
  }

  return (
    tableInfo.length > 0 ?
      <div className='lobby'>
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
                onClick={() => setSelectedTable(table)}
                onDoubleClick={() => openTable(table._id)}
                className={selectedTable === table ? "active table-list-item" : "table-list-item"}
                key={table._id}
              >
                <TableListItem selectedTable={selectedTable} table={table} />
              </tr>
            ))}
          </tbody>
        </table>
        {selectedTable &&
          <section className='selected-table-info'>
            <h3>{selectedTable.name}</h3>
            <h3>{selectedTable.type}</h3>
            <ul>
              {selectedTable.seatedPlayers.map(player => (
                <li key={player}>{player}</li>
              ))}
            </ul>
          </section>
        }
      </div>
      : <h3>Getting Table Information</h3>
  );
};

export default Lobby;
