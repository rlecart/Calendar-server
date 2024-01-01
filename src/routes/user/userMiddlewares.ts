import { Request, Response, NextFunction } from 'express'
import passport from 'passport';

import db from '../../db';

import { IVerifyOptions } from 'passport-local';

interface IBody {
  username: string,
  password: string,
}

export const createUserMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const body: IBody = req.body;

    if (!body.username || !body.password)
      throw ('body undefined');

    if (await db.usernameExists(body.username))
      throw ('username already exists')

    next();
  }
  catch (err) {
    console.log('createUserMiddleware err', err)

    if (err === 'body undefined')
      res.sendStatus(400);
    else if (err === 'username already exists')
      res.status(409).send('Cet identifiant est déjà pris');
    else
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