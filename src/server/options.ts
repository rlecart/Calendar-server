import fs from 'fs';

const keyPath = process.env.NODE_ENV === 'production'
  ? __dirname + '/../../../certs/key.pem'
  : __dirname + '/../../certs/key.pem';

const certPath = process.env.NODE_ENV === 'production'
  ? __dirname + '/../../../certs/cert.pem'
  : __dirname + '/../../certs/cert.pem';

const key = fs.readFileSync(keyPath);
const cert = fs.readFileSync(certPath);

export interface IOptions {
  credentials: {
    key: Buffer,
    cert: Buffer,
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