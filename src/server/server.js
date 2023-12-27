const express = require('express');
const http = require('http');
const SECRET = require('../../secret.js');
const session = require('express-session');
const cors = require('cors');
const cookieParser = require('cookie-parser');
// const db = require('../database/db.js');

// const devRoutes = require('../routes/dev.js');
const userRoutes = require('../routes/user.js');

const startServer = (options) => {
  return (new Promise(async (res, rej) => {
    app = express();
    await app.use(express.json());
    await app.use(cookieParser(SECRET));
    await app.use(
      session({
        secret: SECRET,
        cookie: {
          maxAge: 24 * 60 * 60 * 1000,
          httpOnly: true,
          sameSite: 'strict',
          secure: true,
        },
        resave: false,
        saveUninitialized: true,
      })
    );
    const corsOptions = {
      origin: `http://${options.front.path}:${options.front.port}`,
      optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
      credentials: true,
    };
    await app.use(cors(corsOptions));
    // app.use(
    //   express.urlencoded({
    //     extended: true,
    //   })
    // );


    await app.get('/', (req, res) => {
      res.send('homepage');
    });
    // await app.use('/dev', devRoutes);
    await app.use('/user', userRoutes);

    const server = http.createServer({}, app);

    server.listen(options.back.port, () => {
      res({ server: server, app: app });
    });
  }));
};

const stopServer = (app, cb) => {
  app.close();
  cb();
};

module.exports = {
  startServer,
  stopServer,
};