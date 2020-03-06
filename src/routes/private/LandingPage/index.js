import React from 'react';
import { useIdentityContext } from 'react-netlify-identity';

import { withSentry } from '../../../hocs';

export default withSentry(function LandingPage() {
  const { user } = useIdentityContext();

  //console.log(user);

  return null;
});
