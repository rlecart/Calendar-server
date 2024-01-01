import { OptionsInterface } from "./options";

import express from 'express';
import https from 'https';
import SECRET from '../../secret';
import session from 'express-session';
import passport from "passport";
import { configurePassportStrategies } from '../passport/passportStrategies';

import cors from 'cors';
import cookieParser from 'cookie-parser';
// const db = require('../database/db.js');

// const devRoutes = require('../routes/dev.js');
import userRoutes from '../routes/user';
import eventRoutes from '../routes/event';
import { initDB } from "../db";

const startServer = (options: OptionsInterface) => {
  return (new Promise(async (res, _rej) => {
    const app = express();
    app.use(express.json());
    app.use(cookieParser(SECRET));
    app.use(
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

    // app.use(function(req, res, next) {
    //   res.header('Access-Control-Allow-Credentials', true);
    //   res.header('Access-Control-Allow-Origin', req.headers.origin);
    //   res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    //   res.header('Access-Control-Allow-Headers', 'X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept');
    //   next();
    // });
    const corsOptions = {
      // origin: `http://${options.front.path}:${options.front.port}`,
      origin: `https://${options.front.path}:${options.front.port}`, // TODO: changer en prod
      optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
      credentials: true,
    };
    app.use(cors(corsOptions));
    app.use(passport.initialize());
    app.use(await passport.session());

    await initDB();

    // app.use(
    //   express.urlencoded({
    //     extended: true,
    //   })
    // );

    configurePassportStrategies();


    app.get('/', (_req, res) => {
      res.send('homepage');
    });
    // await app.use('/dev', devRoutes);
    app.use('/user', userRoutes);
    app.use('/event', eventRoutes);

    const server = https.createServer(options.credentials, app);

    server.listen(options.back.port, () => {
      res({ server: server, app: app });
    });
  }));
};

// const stopServer = (app, cb) => {
//   app.close();
//   cb();
// };

export {
  startServer,
  // stopServer,
};