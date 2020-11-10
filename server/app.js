#!/usr/bin/env node

global.config = require(__dirname + '/../private/server.json');

const fs = require('fs');
const http = require('http');
const https = require('https');
const express = require('express');
const bodyParser = require('body-parser');

const { log } = require(__dirname + '/utils/utils');

// Serve Challenge for Let's Encrypt over HTTP only
const httpApp = express();
const challenge = '/.well-known/acme-challenge/';
httpApp.use(challenge, express.static(__dirname + challenge));

const httpServer = http.createServer(httpApp);
httpServer.listen(global.config.server.httpPort);
log.info('Cerebral Cereal HTTP server started on port ' + global.config.server.httpPort + '...');

// Certificate
let credentials;
try {
  credentials = {
    key: fs.readFileSync(global.config.server.cert_path + '/privkey.pem', 'utf8'),
    cert: fs.readFileSync(global.config.server.cert_path + '/cert.pem', 'utf8'),
    ca: fs.readFileSync(global.config.server.cert_path + '/chain.pem', 'utf8')
  };
  global.secure = true;
} catch {
  log.warning('Did not find security certificates.');
  global.secure = false;
}

// If credentials are present, serve the main site over TLS
if (global.secure) {
  const app = express();
  app.use(bodyParser.json());
  app.use(require(__dirname + '/routes/session'));

  app.get('/', (req, res) => {
    console.log(req.session);
    res.send({message: 'Hello World'});
  });

  // Error handler
  app.use((err, _req, res, _next) => {
    log.error(err.toString());
    res.status(500).send({error: err.toString()});
  });

  const httpsServer = https.createServer(credentials, app);
  httpsServer.listen(global.config.server.port);

  log.info('Cerebral Cereal HTTPS server started on port ' + global.config.server.port + '...');
}

