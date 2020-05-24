import Local from 'passport-local';

export default new Local.Strategy(function (username, password, done) {
  done(null, { username, password });
});
