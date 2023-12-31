import { Request, Response, NextFunction } from 'express'

import db from '../../db';
import passport from 'passport';
import { IVerifyOptions } from 'passport-local';

interface Body {
  username: string,
  password: string,
}

export const createUserMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const body: Body = req.body;

    if (!body.username || !body.password)
      return res.sendStatus(400);

    if (await db.usernameExists(body.username))
      return res.status(409).send('Cet identifiant est déjà pris');

    next();
  } catch (err) {
    res.sendStatus(500);
  }
}

export const loginMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  passport.authenticate('local', (err: Error | null, user: Express.User | false, info: IVerifyOptions) => {
    if (err)
      return next(err);

    if (!user)
      return res.status(404).send(info);

    req.login(user, loginErr => {
      if (loginErr)
        return next(loginErr);

      next();
    });
  })(req, res, next);

}