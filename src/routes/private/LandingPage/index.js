import React from 'react';
import { useIdentityContext } from 'react-netlify-identity';

export default function LandingPage() {
  const { user } = useIdentityContext();

  //console.log(user);

  return null;
}
