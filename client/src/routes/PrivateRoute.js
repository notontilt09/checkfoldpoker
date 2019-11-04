import React from 'react';
import {Route, Redirect} from 'react-router-dom';
import {useAuth} from '../context/auth';

// A wrapper for <Route> that redirects to the login
// screen if you're not yet authenticated.
function PrivateRoute({children, ...rest}) {
  const {authTokens} = useAuth();

  return (
    <Route
      {...rest}
      render={({location}) =>
        authTokens ? (
          children
        ) : (
          <Redirect
            to={{
              pathname: '/login',
              state: {from: location},
            }}
          />
        )
      }
    />
  );
}

export default PrivateRoute;
