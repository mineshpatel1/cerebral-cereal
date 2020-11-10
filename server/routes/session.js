const express = require('express');
const session = require('express-session');
const { OAuth2Client } = require('google-auth-library');

const router = express.Router();
const clientId = global.config.google.web_client_id
const client = new OAuth2Client(clientId);

const pg = require(__dirname + '/../utils/pg');
const users = require(__dirname + '/../models/users');

const SESSION_AGE = 28 * 24 * 60 * 60 * 1000;  // 28 Days

const verifyGoogleToken = idToken => {
  return new Promise((resolve, reject) => {
    client.verifyIdToken({
      idToken,
      audience: clientId,
    }).then(ticket => {
      return resolve(ticket.getPayload());
    }).catch(reject);
  });
}

const setSession = (req, res, user) => {
  req.session.user = user;
  res.send({message: user.email + ' logged in.'});
}

// Configure sessionisation with PostgreSQL
router.use(session({
  store: new (require('connect-pg-simple')(session))({
    pool: pg.pools[pg.DEFAULT_DB],
    tableName: 'session',
  }),
  secret: global.config.session_secret,
  resave: false,
  saveUninitialized: false,
  cookie : { httpOnly: true, maxAge: SESSION_AGE },
  unset: 'destroy',
}));

router.post('/login', (req, res, next) => {
  if (req.session.user) return next(new Error('Already logged in'));
  if (!req.body.idToken) return next(new Error('Parameter: idToken is required.'));

  verifyGoogleToken(req.body.idToken)
    .then(info => {
      const email = info.email;
      const name = info.name;
      if (global.config.allowed.indexOf(email) == -1) return next(new Error(email + ' is disallowed.'));

      users.get(email)
        .then(user => {
          if (user) return setSession(req, res, user);
          users.new(email, name)
            .then(user => setSession(req, res, user))
            .catch(next);
        }).catch(next);
    }).catch(next);
});

router.get('/logout', (req, res, next) => {
  if (!req.session.user) return next(new Error('Not logged in'));
  req.session.destroy(err => {
    if (err) return next(err);
    return res.send({message: 'Logged Out'});
  });
});

router.get('/session', (req, res) => {
  res.send(req.session.user);
});

module.exports = router;