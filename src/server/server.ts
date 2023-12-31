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
import eventsRoutes from '../routes/events';
import { initDB } from "../db";

const startServer = (options: OptionsInterface) => {
  return (new Promise(async (res, rej) => {
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
    const corsOptions = {
      origin: `https://${options.front.path}:${options.front.port}`,
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


    app.get('/', (req, res) => {
      res.send('homepage');
    });
    // await app.use('/dev', devRoutes);
    app.use('/user', userRoutes);
    app.use('/events', eventsRoutes);

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