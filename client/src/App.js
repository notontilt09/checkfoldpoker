import React, {useState} from 'react';
import {BrowserRouter, Route} from 'react-router-dom';
import PrivateRoute from './routes/PrivateRoute';
import {AuthContext} from './context/auth';

import Login from './routes/Login';
import Lobby from './routes/Lobby';
import Admin from './routes/Admin';
import Table from './routes/Table';

import './styles/app.css';

function App(props) {
  const [authTokens, setAuthTokens] = useState();

  const setTokens = (data) => {
    localStorage.setItem('token', JSON.stringify(data));
    setAuthTokens(data);
  };

  return (
    <AuthContext.Provider value={{authTokens, setAuthTokens: setTokens}}>
      <BrowserRouter>
        <Route exact path="/" component={Login} />
        <Route path="/lobby" component={Lobby} />
        <Route path="/table/:id" component={Table} />
        <PrivateRoute path="/admin" component={Admin} />
      </BrowserRouter>
    </AuthContext.Provider>
  );
}

export default App;
