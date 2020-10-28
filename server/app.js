#!/usr/bin/env node

global.config = require(__dirname + '/../private/server.json');

const fs = require('fs');
const http = require('http');
const https = require('https');
const express = require('express');
const bodyParser = require('body-parser');

// Serve Challenge for Let's Encrypt over HTTP only
const httpApp = express();
const challenge = '/.well-known/acme-challenge/';
httpApp.use(challenge, express.static(__dirname + challenge));

const httpServer = http.createServer(httpApp);
httpServer.listen(global.config.server.httpPort);
console.log('Cerebral Cereal HTTP server started on port ' + global.config.server.httpPort + '...');

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
  console.warn('Did not find security certificates.');
  global.secure = false;
}

// If credentials are present, serve the main site over TLS
if (global.secure) {
  const app = express();
  app.use(bodyParser.json());

  app.get('/', (_req, res) => {
    res.send('Hello World');
  });

  const httpsServer = https.createServer(credentials, app);
  httpsServer.listen(global.config.server.port);

  console.log('Cerebral Cereal HTTPS server started on port ' + global.config.server.port + '...');
}

