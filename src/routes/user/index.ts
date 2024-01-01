import express, { Request, Response } from 'express';
import jwt from 'jsonwebtoken';

import db from '../../db';

import { createUserMiddleware, loginMiddleware } from './userMiddlewares';

import SERVER_SECRET from '../../../secrets/secret';

export interface IUser {
  id: number,
  username: string,
}

const router = express.Router({ mergeParams: true });

router.post('/signup', [
  createUserMiddleware,
], async (req: Request, res: Response) => {
  try {
    const newUserId = await db.createUser(req.body.username, req.body.password);

    const token = jwt.sign({
      id: newUserId,
      username: req.body.username,
    }, SERVER_SECRET, { expiresIn: '24h' });

    res.cookie('jwt', token, {
      httpOnly: true,
      sameSite: 'lax',
      secure: false,
      maxAge: 24 * 60 * 60 * 1000, // 24h
    });

    res.sendStatus(200)
  }
  catch (err) {
    console.log('POST /users', err)
    res.sendStatus(500);
  }
});

router.post('/login', [
  loginMiddleware,
], async (req: Request, res: Response) => {
  try {
    const user = req.user as IUser;

    const token = jwt.sign({
      id: user.id,
      username: user.username,
    }, SERVER_SECRET, { expiresIn: '24h' });

    res.cookie('jwt', token, {
      maxAge: 24 * 60 * 60 * 1000,
      httpOnly: true,
      sameSite: 'strict',
      secure: true,
    });

    console.log('successfull login', user.username);
    res.sendStatus(200)
  }
  catch (err) {
    console.log('POST /users', err)
    res.sendStatus(500);
  }
});

router.delete('/logout', [
  // passport.authenticate('jwt', { session: false }),
  // logoutMiddleware
], async (req: Request, res: Response) => {
  try {
    req.session.destroy(async (err) => {
      try {
        if (err)
          throw (err);
        res.clearCookie('connect.sid');
        res.clearCookie('jwt');
        console.log('successfull logout')
        res.sendStatus(200);
      }
      catch (err) {
        console.log('DELETE /users/logout : req.session.destroy(cb)', err)
        res.sendStatus(500);
      }
    });
  }
  catch (err) {
    console.log('DELETE /users/logout', err)
    res.sendStatus(500);
  }
}
);


export default router;