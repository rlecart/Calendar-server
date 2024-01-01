import https from 'https';
import express from 'express';
import session from 'express-session';
import passport from "passport";
import cors from 'cors';
import cookieParser from 'cookie-parser';

import { configurePassportStrategies } from '../passport/passportStrategies';

import userRoutes from '../routes/user';
import eventRoutes from '../routes/event';

import { initDB } from "../db";

import { IOptions } from "./options";

import SERVER_SECRET from '../../secrets/secret';

const startServer = (options: IOptions) => {
  return (new Promise(async (res, _rej) => {
    const app = express();
    app.use(express.json());
    app.use(cookieParser(SERVER_SECRET));
    app.use(
      session({
        secret: SERVER_SECRET,
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
      origin: `https://${options.front.path}`,
      // origin: `https://${options.front.path}:${options.front.port}`, // for dev
      optionsSuccessStatus: 200,
      credentials: true,
    };
    app.use(cors(corsOptions));
    app.use(passport.initialize());
    app.use(await passport.session());

    await initDB();

    configurePassportStrategies();


    // app.get('/', (_req, res) => {
    //   res.send('homepage');
    // });
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