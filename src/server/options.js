const fs = require('fs');

// const key = fs.readFileSync(__dirname + '/../../certs/CA/localhost/localhost.decrypted.key');
// const cert = fs.readFileSync(__dirname + '/../../certs/CA/localhost/localhost.crt');
const key = undefined;
const cert = undefined;

const options = {
  credentials: {
    key: key,
    cert: cert
  },
  front: {
    path: 'localhost',
    port: 3000,
  },
  back: {
    path: 'localhost',
    port: 8000,
  }
};

module.exports = options;