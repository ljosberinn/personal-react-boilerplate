import React from 'react';
import { useIdentityContext } from 'react-netlify-identity';

/**
 * @returns {React.FC} LandingPage
 */
export default function LandingPage() {
  const { user } = useIdentityContext();

  //console.log(user);

  return null;
}
