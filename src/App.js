import React from 'react';
import { useIdentityContext } from 'react-netlify-identity';
import { useLocation, Redirect } from 'react-router-dom';

import { withSuspense } from './hocs';
import { useScrollToTop } from './hooks';
import Routes from './routes';

export default withSuspense(function App() {
  const { pathname } = useLocation();
  const {
    isLoggedIn,
    param: { token, type },
  } = useIdentityContext();

  useScrollToTop();

  if (token && pathname === '/' && type === 'recovery') {
    return (
      <Redirect
        to={{
          pathname: '/reset-password',
          state: { token },
        }}
      />
    );
  }

  return <Routes isLoggedIn={isLoggedIn} />;
});
