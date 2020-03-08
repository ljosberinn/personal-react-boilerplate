import React from 'react';
import { useIdentityContext } from 'react-netlify-identity';
import { useLocation, Redirect } from 'react-router-dom';

import { useNavigationContext } from './context';
import { withSuspense } from './hocs';
import { useScrollToTop } from './hooks';
import Routes from './routes';

export default withSuspense(function App() {
  const { pathname } = useLocation();
  const {
    param: { token, type },
  } = useIdentityContext();
  const {
    routes: { RESET_PASSWORD },
  } = useNavigationContext();

  useScrollToTop();

  if (token && pathname === '/' && type === 'recovery') {
    return (
      <Redirect
        to={{
          pathname: RESET_PASSWORD.clientPath,
          state: { token },
        }}
      />
    );
  }

  return <Routes />;
});
