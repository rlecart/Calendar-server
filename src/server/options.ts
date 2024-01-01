const fs = require('fs');

const keyPath = process.env.NODE_ENV === 'production'
  ? __dirname + '/../../../certs/key.pem'
  : __dirname + '/../../certs/key.pem';

const certPath = process.env.NODE_ENV === 'production'
  ? __dirname + '/../../../certs/cert.pem'
  : __dirname + '/../../certs/cert.pem';

const key = fs.readFileSync(keyPath);
const cert = fs.readFileSync(certPath);
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