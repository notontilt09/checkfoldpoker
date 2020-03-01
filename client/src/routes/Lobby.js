import React, {useState, useEffect} from 'react';
import axios from 'axios';

import TableListItem from '../components/TableList/TableListItem';

import '../styles/lobby.css';

const url = 'http://localhost:5000/api/tables';
// const username = localStorage.getItem('cfp-user');

const Lobby = (props) => {
  // console.log(props);
  const [tables, setTables] = useState([]);
  const [selectedTable, setSelectedTable] = useState(null);
  const [seatedPlayers, setSeatedPlayers] = useState(null);
  console.log('tables', tables);
  console.log('seated Players', seatedPlayers);
  console.log('selected Table', selectedTable);

  useEffect(() => {
    async function fetchLobbyInfo() {
      const tables = await axios.get(url);
      setTables(tables.data);
    }

    fetchLobbyInfo();
  }, [])

  useEffect(() => {
    async function fetchTableInfo(id) {
      const tableDetail = await axios.post(`${url}/info`, { id });
      setSeatedPlayers(tableDetail.data.seatedPlayers);
    }

    if (selectedTable) {
      fetchTableInfo(selectedTable.id);
    }
    
  }, [selectedTable])

  // open table in popout window
  // TODO: FIND A WAY TO OPEN TABLES IN TILED VIEW, CURRENTLY OVERLAPPING
  const openTable = (id) => {
    const windowFeatures = 'toolbar=no,height=600,width=1000,top=0,left=0';
    window.open(`table/${id}`, id, windowFeatures);
  }

  return (
    tables.length > 0 ?
      <div className='lobby'>
        <table className="tables-list">
          <tbody>
            <tr>
              <th>Table</th>
              <th>Stakes</th>
              <th>Game Type</th>
              <th>Seats</th>
            </tr>
            {tables.map(table => (
              <tr 
                key={table.id}
                onClick={() => setSelectedTable(table)}
                onDoubleClick={() => openTable(table.id)}
                className={selectedTable === table ? "active table-list-item" : "table-list-item"}
              >
                <TableListItem selectedTable={selectedTable} table={table} />
              </tr>
            ))}
          </tbody>
        </table>
        {selectedTable &&
          <section className='selected-table-info'>
            <h3>{selectedTable.name}</h3>
            <h3>{`${selectedTable.stakes}/point ${selectedTable.type}`}</h3>
            <ul>
              {seatedPlayers && seatedPlayers.map(player => (
                <li key={player}>{`${player.username}   ${player.tableBalance}`}</li>
              ))}
            </ul>
          </section>
        }
      </div>
      : <h3>Getting Table Information</h3>
  );
};

export default Lobby;
