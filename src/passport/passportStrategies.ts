import { Request } from 'express';
import passport from 'passport';
import { Strategy as JwtStrategy } from 'passport-jwt';
import { Strategy as LocalStrategy } from 'passport-local';
import { RowDataPacket } from "mysql2"

import db from '../db';

import SERVER_SECRET from '../../secrets/secret';

const cookieExtractor = (req: Request) => {
  let token = null;
  if (req && req.cookies)
    token = req.cookies['jwt'];
  return token;
};

export const configurePassportStrategies = () => {
  return (new Promise((res, _rej) => {
    const accessJwtOptions = {
      jwtFromRequest: cookieExtractor,
      secretOrKey: SERVER_SECRET,
    };

    passport.use(new LocalStrategy({ session: true, passReqToCallback: true },
      async (_req, username, password, done) => {
        try {
          if (!username || !password)
            throw (400);

          const user: RowDataPacket[] = await db.getUserByUsername(username);
          if (!user || user.length !== 1 || user[0].password !== password)
            throw (404);

          return done(null, user[0]);
        }
        catch (err) {
          console.log('passport LocalStrategy err', err);
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
        console.log('passport JwtStrategy err', err);
        return (done(null, false, { success: false, code: err }));
      }
    }));

    passport.serializeUser((user: Express.User, done) => done(null, user));

    passport.deserializeUser((user: Express.User, done) => done(null, user));
    res(null);
  }));
};