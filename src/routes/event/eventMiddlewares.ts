import { Request, Response, NextFunction } from 'express'

import db from '../../db';
import { IUser } from '../user';
import { isEmpty } from '../../utils/utils';

export interface EventInterface {
  userId: number,
  title: string,
  description: string,
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
      || body.startTime === undefined
      || body.endTime === undefined
      || body.notes === undefined
      || body.color === undefined
      || body.dayOfMonth === undefined
      || body.month === undefined
      || body.year === undefined
    )
      throw ({ status: 400, message: 'body undefined' });

    const eventOverlaps = await db.eventOverlaps(body, user.id);
    if (eventOverlaps)
      return res.status(409).send('Il y a déjà un événement à cette heure là.');

    next();
  } catch (err) {
    console.log('createEventMiddleware err', err)

    if (err === 400)
      res.sendStatus(400);
    else if (err === 404)
      res.sendStatus(404);
    else
      res.sendStatus(500);
  }
}

export const getMonthEventMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (
      req.params.year === undefined
      || req.params.month === undefined
    )
      throw ({ status: 400, message: 'params year || month undefined' });

    if (
      isNaN(+req.params.year)
      || isNaN(+req.params.month)
    )
      throw ({ status: 400, message: 'isNaN year || month' });

    if (+req.params.month < 1 || +req.params.month > 12)
      throw ({ status: 400, message: 'params month < 1 || > 12' });

    next();
  } catch (err) {
    console.log('getMonthEventMiddleware err', err)

    if (err === 400)
      res.sendStatus(400);
    else if (err === 404)
      res.sendStatus(404);
    else
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
      throw ({ status: 400, message: 'params year || month || day undefined' });

    if (
      isNaN(+req.params.year)
      || isNaN(+req.params.month)
      || isNaN(+req.params.day)
    )
      throw ({ status: 400, message: 'isNaN year || month || day' });

    if (
      +req.params.month < 1 || +req.params.month > 12
      || +req.params.day < 1 || +req.params.day > 31
    )
      throw ({ status: 400, message: 'params month < 1 || > 12 || day < 1 || > 31' });

    const date = new Date(+req.params.year, +req.params.month, 1);
    date.setDate(date.getDate() - 1);
    const lastDayOfMonth = date.getDate();

    if (+req.params.day > lastDayOfMonth)
      throw ({ status: 400, message: 'day > lasDayOfMonth' });

    next();
  } catch (err) {
    console.log('getDayEventMiddleware err', err)

    if (err === 400)
      res.sendStatus(400);
    else if (err === 404)
      res.sendStatus(404);
    else
      res.sendStatus(500);
  }
}

// declare module 'express-serve-static-core' {
//   interface Request {
//     eventFromDB?: EventInterface,
//   }
// }

export const updateEventMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = req.user as IUser;

    if (req.params.eventId === undefined
      || isNaN(+req.params.eventId))
      throw ({ status: 400, message: '' });

    const event = await db.getEventById(user.id, +req.params.eventId);
    if (!event || event.length === 0)
      throw ({ status: 404, message: 'event not found by id' });

    if (
      !req.body || isEmpty(req.body)

      || req.body.title === undefined
      || req.body.description === undefined
      || req.body.startTime === undefined
      || req.body.endTime === undefined
      || req.body.notes === undefined
      || req.body.color === undefined
      || req.body.dayOfMonth === undefined
      || req.body.month === undefined
      || req.body.year === undefined

      || req.body.title === ''
      || req.body.color === ''

      || isNaN(+req.body.startTime)
      || isNaN(+req.body.endTime)
      || isNaN(+req.body.dayOfMonth)
      || isNaN(+req.body.month)
      || isNaN(+req.body.year)

      || +req.body.startTime < 0
      || +req.body.endTime < 0
      || +req.body.year < 0
      || +req.body.month < 1 || +req.body.month > 12
    )
      throw ({ status: 400, message: 'body tests (undefined, isNaN, < 0, ...)' });

    const date = new Date(+req.body.year, +req.body.month, 1);
    date.setDate(date.getDate() - 1);
    const lastDayOfMonth = date.getDate();

    if (+req.body.day > lastDayOfMonth)
      throw ({ status: 400, message: 'day > lasDayOfMonth' });

    // req.eventFromDB = (event[0] as EventInterface);

    next();
  } catch (err) {
    console.log('updateEventMiddleware err', err)

    if (err === 400)
      res.sendStatus(400);
    else if (err === 404)
      res.sendStatus(404);
    else
      res.sendStatus(500);
  }
}

export const deleteEventMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = req.user as IUser;

    if (req.params.eventId === undefined
      || isNaN(+req.params.eventId))
      throw ({ status: 400, message: 'eventId undefined || isNaN' });

    const event = await db.getEventById(user.id, +req.params.eventId);
    if (!event || event.length === 0)
      throw ({ status: 404, message: 'event not found by id' });

    next();
  } catch (err) {
    console.log('deleteEventMiddleware err', err)

    if (err === 400)
      res.sendStatus(400);
    else if (err === 404)
      res.sendStatus(404);
    else
      res.sendStatus(500);
  }
}