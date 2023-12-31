import { Request, Response, NextFunction } from 'express'

import db from '../../db';

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