import React, {useState} from 'react';
import {BrowserRouter, Route} from 'react-router-dom';
import PrivateRoute from './routes/PrivateRoute';
import Login from './routes/Login';
import Lobby from './routes/Lobby';
import Admin from './routes/Admin';

import './styles/app.css';
import {AuthContext} from './context/auth';

function App() {
  const [authTokens, setAuthTokens] = useState();

  const setTokens = (data) => {
    localStorage.setItem('tokens', JSON.stringify(data));
    setAuthTokens(data);
  };

  return (
    <AuthContext.Provider value={{authTokens, setAuthTokens: setTokens}}>
      <BrowserRouter>
        <Route path="/" component={Login} exact />
        <PrivateRoute path="/lobby" component={Lobby} />
        <PrivateRoute path="/admin" component={Admin} />
      </BrowserRouter>
    </AuthContext.Provider>
  );
}

export default App;
