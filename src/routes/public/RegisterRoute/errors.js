import React from 'react';
import { Link } from 'react-router-dom';
import * as ROUTES from '../../../constants/routes';

export const errors = {
  'A user with this email address has already been registered': (
    <span>
      An account with this email already exists. Did you{' '}
      <Link to={ROUTES.RESET_PASSWORD.normalizedPath}>
        forget your password
      </Link>
      ?
    </span>
  ),
  tos: 'Please agree to the Terms of Service.',
};
