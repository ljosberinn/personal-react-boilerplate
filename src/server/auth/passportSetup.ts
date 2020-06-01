import passport from 'passport';

import { github, google, local, facebook, discord } from './provider';

[local, github, google, facebook, discord].forEach(provider =>
  passport.use(provider)
);
