import express from 'express';
const router = express.Router({ mergeParams: true });
import jwt from 'jsonwebtoken';

import { Request, Response } from 'express'
import { createUserMiddleware, loginMiddleware } from './userMiddlewares';
import db from '../../db';
import SECRET from '../../../secret';
import passport from 'passport';

// const { isEmpty } = require('../utils/utils.js');
// const db = require('../database/db.js');
// const SECRET = require('../../secret.js');
// const { USER_ROLE_COMMERCIAL } = require('../resources/roles.js');
// const {
// } = require('./middlewares/userMiddleware.js');
// const { getATL } = require('../utils/roles.js');

router.post('/signup', [
  createUserMiddleware,
], async (req: Request, res: Response) => {
  try {
    const newUserId = await db.createUser(req.body.username, req.body.password);
    console.log('newUserId', newUserId)

    const token = jwt.sign({
      id: newUserId,
      username: req.body.username,
    }, SECRET, { expiresIn: '24h' });

    res.cookie('jwt', token, {
      httpOnly: true,
      sameSite: 'lax',
      // signed: true, // ca ca unauthorized avec passport
      secure: false,
      // maxAge: 1000 * 10, // 10s
      maxAge: 24 * 60 * 60 * 1000, // 24h
    });

    res.sendStatus(200)
  }
  catch (err) {
    console.log('POST /users', err)
    res.sendStatus(500);
  }
});

export interface IUser {
  id: number,
  username: string,
}

router.post('/login', [
  loginMiddleware,
], async (req: Request, res: Response) => {
  try {
    // const newUserId = await db.createUser(req.body.username, req.body.password);
    const user = req.user as IUser;

    console.log('req.user', req.user)

    const token = jwt.sign({
      id: user.id,
      username: user.username,
    }, SECRET, { expiresIn: '24h' });

    res.cookie('jwt', token, {
      httpOnly: true,
      sameSite: 'lax',
      // signed: true, // ca ca unauthorized avec passport
      secure: false,
      // maxAge: 1000 * 10, // 10s
      maxAge: 24 * 60 * 60 * 1000, // 24h
    });

    res.sendStatus(200)
  }
  catch (err) {
    console.log('POST /users', err)
    res.sendStatus(500);
  }
});

export default router;