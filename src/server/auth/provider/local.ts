import Local from 'passport-local';

export default new Local.Strategy((username, password, done) => {
  done(null, { username, password });
});
