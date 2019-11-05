import React, {useState, useEffect} from 'react';
// import {Redirect} from 'react-router-dom';
import axios from 'axios';
import {useAuth} from '../context/auth';

const Login = (props) => {
  const [isLoggedIn, setLoggedIn] = useState(false);
  const [error, setError] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const {setAuthTokens} = useAuth();
  // console.log(props);

  // if isLoggedIn boolean gets flips to true and redirect to lobby
  useEffect(() => {
    if(isLoggedIn) {
      props.history.push('/lobby');
    }
  }, [props.history, isLoggedIn])

  function postLogin() {
    axios
      .post('http://localhost:5000/api/auth/login', {
        username,
        password,
      })
      .then((res) => {
        setAuthTokens(res.data.token);
        setLoggedIn(true);
      })
      .catch((err) => {
        setError(err.response.data.message);
      });
  }

  function postRegistration() {
    axios
      .post('http://localhost:5000/api/auth/register', {
        username,
        password,
      })
      .then((res) => {
        setAuthTokens(res.data.token);
        setLoggedIn(true);
      })
      .catch((err) => {
        setError(err.response.data.message);
      });
  }

  // if (isLoggedIn) {
  //   return <Redirect to={referer} />;
  // }

  return (
    <div className="login">
      <div className="form">
        <input
          type="username"
          value={username}
          onChange={(e) => {
            setUsername(e.target.value);
          }}
          placeholder="username"
        />
        <input
          type="password"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
          }}
          placeholder="password"
        />
        <button className="submit" onClick={postLogin}>
          Sign In
        </button>
        <button className="submit" onClick={postRegistration}>
          Create Account
        </button>
        {error && (
          <div className="error">{error}</div>
        )}
      </div>
    </div>
  );
};

export default Login;
