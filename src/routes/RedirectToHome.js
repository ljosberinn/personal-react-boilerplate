import React from 'react';
import { Redirect } from 'react-router-dom';

/**
 * @returns {React.FC} RedirectToHome
 */
export default function RedirectToHome() {
  return <Redirect to="/" />;
}
