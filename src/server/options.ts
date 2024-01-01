const fs = require('fs');

const key = fs.readFileSync(__dirname + '/../../certs/key.pem');
const cert = fs.readFileSync(__dirname + '/../../certs/cert.pem');
// const key = undefined;
// const cert = undefined;

export interface OptionsInterface {
  credentials: {
    key: string,
    cert: string,
  },
  front: {
    path: string,
    port: number,
  },
  back: {
    path: string,
    port: number,
  }

}

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
    port: 8001,
  }
};

export default options;