import passport from 'passport';
// import JwtStrategy from ('passport-jwt/Strategy');

// import { isEmpty } from '../utils/utils.js';

import jwt from "jsonwebtoken";

// import bcrypt from 'bcryptjs';

import SECRET from '../../secret';
import { Strategy as JwtStrategy } from 'passport-jwt';
import { Strategy as LocalStrategy } from 'passport-local';
import { Request } from 'express';
import db from '../db';

import { RowDataPacket } from "mysql2"

const cookieExtractor = (req: Request) => {
  let token = null;
  if (req && req.cookies)
    token = req.cookies['jwt'];
  return token;
};

export const configurePassportStrategies = () => {
  return (new Promise((res, rej) => {
    const accessJwtOptions = {
      jwtFromRequest: cookieExtractor,
      secretOrKey: SECRET,
    };

    passport.use(new LocalStrategy({ session: true, passReqToCallback: true },
      async (req, username, password, done) => {
        try {
          if (!username || !password)
            throw (400);

          const user: RowDataPacket[] = await db.getUserByUsername(username);
          if (!user || user.length !== 1 || user[0].password !== password)
            throw (404);

          return done(null, user[0]);
        }
        catch (err) {
          console.log('cuic', err);
          done(null, false, { message: 'User not found' });
        }
      }
    ));

    passport.use(new JwtStrategy(accessJwtOptions, (payload, done) => {
      try {
        if (payload.id == undefined || payload.username === undefined)
          throw (400);

        return done(null, payload, { success: true });
      }
      catch (err) {
        console.log('ca err jwt passport', err);
        return (done(null, false, { success: false, code: err }));
      }
    })
    );

    passport.serializeUser((user: Express.User, done) => {
      console.log('ser', user);
      done(null, user);
    });

    passport.deserializeUser((user: Express.User, done) => {
      console.log('des', user);
      done(null, user);
    });
    res(null);
  })
  );
};