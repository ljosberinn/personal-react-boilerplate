import { useIdentityContext } from 'react-netlify-identity';

import React from 'react';

export default function LandingPage() {
  const { user } = useIdentityContext();

  //console.log(user);

  return null;
}
