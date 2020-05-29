import passport from 'passport';

import { github, google, local, facebook, twitter, discord } from './provider';

[local, github, google, facebook, twitter, discord].forEach(provider =>
  passport.use(provider)
);
