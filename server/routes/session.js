const express = require('express');
const session = require('express-session');
const router = express.Router();

const pg = require(__dirname + '/../utils/pg.js');

const SESSION_AGE = 28 * 24 * 60 * 60 * 1000;  // 28 Days

// Configure sessionisation with PostgreSQL
router.use(session({
  store: new (require('connect-pg-simple')(session))({
    pool: pg.pool[pg.DEFAULT_DB],
    tableName: 'session',
  }),
  secret: global.config.session_secret,
  resave: false,
  saveUninitialized: false,
  cookie : { httpOnly: true, maxAge: SESSION_AGE },
  unset: 'destroy',
}));

module.exports = router;