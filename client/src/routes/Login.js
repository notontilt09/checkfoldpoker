import React, {useState} from 'react';
import {Redirect} from 'react-router-dom';
import axios from 'axios';
import {useAuth} from '../context/auth';

const Login = (props) => {
  const [isLoggedIn, setLoggedIn] = useState(false);
  const [isError, setIsError] = useState(false);
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const {setAuthTokens} = useAuth();
  console.log(props);
  const locState = props.location.state;
  const referer = locState ? locState.referer || '/' : '/';

  function postLogin() {
    axios
      .post('http://localhost:5000/api/auth/login', {
        userName,
        password,
      })
      .then((result) => {
        if (result.status === 200) {
          setAuthTokens(result.data);
          setLoggedIn(true);
        } else {
          setIsError(true);
        }
      })
      .catch((e) => {
        setIsError(true);
      });
  }

  function postRegistration() {
    axios
      .post('http://localhost:5000/api/auth/register', {
        userName,
        password,
      })
      .then((res) => {
        if (res.status === 200) {
          setAuthTokens(res.data);
          setLoggedIn(true);
        } else {
          setIsError(true);
        }
      })
      .catch((e) => {
        setIsError(true);
      });
  }

  if (isLoggedIn) {
    return <Redirect to={referer} />;
  }

  return (
    <div className="card">
      <div className="form">
        <input
          type="username"
          value={userName}
          onChange={(e) => {
            setUserName(e.target.value);
          }}
          placeholder="email"
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
        {isError && (
          <div className="error">The Username or Password were incorrect.</div>
        )}
      </div>
    </div>
  );
};

export default Login;
