import { Profile } from 'passport';
import { Strategy as LocaLStrategy } from 'passport-local';

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

export default new LocaLStrategy((username, pw, done) => {
  // custom logic for your db goes here!
  const user = localDB.find(
    user => user.username === username && user.password === pw
  );

  if (!user) {
    return done(null);
  }

  const { password, ...response } = user;

  done(null, { ...response, provider: 'local' });
});
