import React from 'react';
import { Link } from 'react-router-dom';
import * as ROUTES from '../../../constants/routes';

export const errors = {
  'mail.duplicate': (
    <span>
      An account with this email already exists. Did you{' '}
      <Link to={ROUTES.RESET_PASSWORD}>forget your password</Link>?
    </span>
  ),
  'mail.registrationPending':
    'This mail already has a recent registration pending.',
  'mail.invalid': 'Please enter a valid mail.',
  'password.unsafe': 'The chosen password is insecure.',
  'password.mismatch': 'Passwords do not match.',
  tos: 'Please agree to the Terms of Service.',
};
