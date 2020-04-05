import React from 'react';
import { Redirect } from 'react-router-dom';

import { DASHBOARD, INDEX } from '../';
import { useAuth0 } from '../../hooks/useAuth0';

export default function AuthAwareRedirect() {
  const { isAuthenticated } = useAuth0();

  return (
    <Redirect
      to={isAuthenticated ? DASHBOARD.path.router : INDEX.path.router}
    />
  );
}
