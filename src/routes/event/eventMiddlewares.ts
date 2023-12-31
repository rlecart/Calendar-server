import { Request, Response, NextFunction } from 'express'

import db from '../../db';
import { IUser } from '../user';

export interface EventInterface {
  userId: number,
  title: string,
  description: string,
  isAllDay: boolean,
  startTime: number,
  endTime: number,
  notes: string,
  color: string,
  dayOfMonth: number,
  month: number,
  year: number,
}

export const createEventMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const body: EventInterface = req.body;
    console.log('body', body)
    const user = req.user as IUser;

    if (body.title === undefined
      || body.description === undefined
      || body.isAllDay === undefined
      || body.startTime === undefined
      || body.endTime === undefined
      || body.notes === undefined
      || body.color === undefined
      || body.dayOfMonth === undefined
      || body.month === undefined
      || body.year === undefined
    )
      return res.sendStatus(400);

    const eventOverlaps = await db.eventOverlaps(body, user.id);
    // console.log('eventOverlaps', eventOverlaps)
    if (eventOverlaps)
      return res.status(409).send('Il y a déjà un événement à cette heure là.');

    next();
  } catch (err) {
    console.log('createEventMiddleware', err)

    res.sendStatus(500);
  }
}

export const getMonthEventMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (
      req.params.year === undefined
      || req.params.month === undefined
    )
      return res.sendStatus(400);

    if (
      isNaN(+req.params.year)
      || isNaN(+req.params.month)
    )
      return res.sendStatus(400);

    if (+req.params.month < 1 || +req.params.month > 12)
      return res.sendStatus(400);

    next();
  } catch (err) {
    console.log('getMonthEventMiddleware', err)

    res.sendStatus(500);
  }
}

export const getDayEventMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (
      req.params.year === undefined
      || req.params.month === undefined
      || req.params.day === undefined
    )
      return res.sendStatus(400);

    if (
      isNaN(+req.params.year)
      || isNaN(+req.params.month)
      || isNaN(+req.params.day)
    )
      return res.sendStatus(400);

    if (
      +req.params.month < 1 || +req.params.month > 12
      || +req.params.day < 1 || +req.params.day > 31
    )
      return res.sendStatus(400);

    const date = new Date(+req.params.year, +req.params.month, 1);
    date.setDate(date.getDate() - 1);
    const lastDayOfMonth = date.getDate();

    if (+req.params.day > lastDayOfMonth)
      return res.sendStatus(400);

    next();
  } catch (err) {
    console.log('getDayEventMiddleware', err)

    res.sendStatus(500);
  }
}