import { Profile } from 'passport';
import { Strategy as LocaLStrategy, VerifyFunction } from 'passport-local';

interface LocalDBDataset extends Omit<Profile, 'provider'> {
  password: string;
}

const localDB: LocalDBDataset[] = [
  {
    displayName: 'gerrit alex',
    id: '1',
    password: 'next-with-batteries!',
    username: 'ljosberinn',
  },
];

const verify: VerifyFunction = (username, pw, done) => {
  // custom logic for your db goes here!
  const user = localDB.find(
    user => user.username === username && user.password === pw
  );

  if (!user) {
    return done(null);
  }

  const { password, ...response } = user;

  done(null, { ...response, provider: 'local' });
};

export default new LocaLStrategy(verify);
