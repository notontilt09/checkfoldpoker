import React, {useState, useEffect} from 'react';
import {BrowserRouter, Route} from 'react-router-dom';
import PrivateRoute from './routes/PrivateRoute';
import {AuthContext} from './context/auth';
import SocketIOClient from 'socket.io-client';

import Login from './routes/Login';
import Lobby from './routes/Lobby';
import Admin from './routes/Admin';
import Table from './routes/Table';

import './styles/app.css';

const url = 'http://localhost:5000';

function App(props) {
  const [authTokens, setAuthTokens] = useState();
  const [socket, setSocket] = useState(null);
  const [lobbyInfo, setLobbyInfo] = useState(null);

  useEffect(() => {
    setSocket(SocketIOClient(url));
  }, [])

  const setTokens = (data) => {
    localStorage.setItem('token', JSON.stringify(data));
    setAuthTokens(data);
  };

  return (
    <AuthContext.Provider value={{authTokens, setAuthTokens: setTokens}}>
      <BrowserRouter>
        <Route exact path="/" component={Login} />
        <Route path="/lobby" render={(props) => <Lobby {...props} socket={socket}/>} />
        <Route path="/table/:id" render={(props) => <Table {...props} socket={socket}/>} />
        <PrivateRoute path="/admin" component={Admin} />
      </BrowserRouter>
    </AuthContext.Provider>
  );
}

export default App;
