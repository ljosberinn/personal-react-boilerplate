import React from 'react';
import { Redirect } from 'react-router-dom';

import { DASHBOARD, INDEX } from '../';

export default function AuthAwareRedirect() {
  return <Redirect to={false ? DASHBOARD.path.router : INDEX.path.router} />;
}
