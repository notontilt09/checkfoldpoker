import React from 'react';
import {Route, Redirect} from 'react-router-dom';
import {useAuth} from '../context/auth';

// A wrapper for <Route> that redirects to the login
// screen if you're not yet authenticated.
function PrivateRoute({component: Component, ...rest}) {
  const {authTokens} = useAuth();

  return (
    <Route
      {...rest}
      render={(props) =>
        authTokens ? (
          <Component {...props} />
        ) : (
          <Redirect to={{pathname: '/', state: {referer: props.location}}} />
        )
      }
    />
  );
}

export default PrivateRoute;
