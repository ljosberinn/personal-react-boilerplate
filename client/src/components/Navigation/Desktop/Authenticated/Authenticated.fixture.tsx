import React from 'react';

import Authenticated from './Authenticated';

export default (
  <Authenticated
    // @ts-expect-error
    auth0Partial={{
      isAuthenticated: true,
      user: {
        name: 'Gerrit Alex',
        picture: 'https://avatars0.githubusercontent.com/u/29307652',
      },
    }}
  />
);
