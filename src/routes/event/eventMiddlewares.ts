import { Request, Response, NextFunction } from 'express'

import db from '../../db';

import { isEmpty } from '../../utils/utils';

import { IUser } from '../user';

export interface IEvent {
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
    const body: IEvent = req.body;
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
      throw ('body undefined');

    const eventOverlaps = await db.eventOverlaps(body, user.id);
    if (eventOverlaps)
      throw ('event overlaps');

    next();
  } catch (err) {
    console.log('createEventMiddleware err', err)

    if (err === 'body undefined')
      res.sendStatus(400);
    else if (err === 'event overlaps')
      res.status(409).send('Il y a déjà un événement à cette heure là.');
    else
      res.sendStatus(500);
  }
}

export const getMonthEventMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (req.params.year === undefined
      || req.params.month === undefined)
      throw ('params year || month undefined');

    if (isNaN(+req.params.year)
      || isNaN(+req.params.month))
      throw ('isNaN year || month');

    if (+req.params.month < 1 || +req.params.month > 12)
      throw ('params month < 1 || > 12');

    next();
  } catch (err) {
    console.log('getMonthEventMiddleware err', err)

    if (err === 'params year || month undefined'
      || err === 'isNaN year || month'
      || err === 'params month < 1 || > 12')
      res.sendStatus(400);
    else
      res.sendStatus(500);
  }
}

export const getDayEventMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (req.params.year === undefined
      || req.params.month === undefined
      || req.params.day === undefined)
      throw ('params year || month || day undefined');

    if (isNaN(+req.params.year)
      || isNaN(+req.params.month)
      || isNaN(+req.params.day))
      throw ('isNaN year || month || day');

    if (+req.params.month < 1 || +req.params.month > 12
      || +req.params.day < 1 || +req.params.day > 31)
      throw ('params month < 1 || > 12 || day < 1 || > 31');

    const date = new Date(+req.params.year, +req.params.month, 1);
    date.setDate(date.getDate() - 1);
    const lastDayOfMonth = date.getDate();

    if (+req.params.day > lastDayOfMonth)
      throw ('day > lasDayOfMonth');

    next();
  } catch (err) {
    console.log('getDayEventMiddleware err', err)

    if (err === 'params year || month || day undefined'
      || err === 'isNaN year || month || day'
      || err === 'params month < 1 || > 12 || day < 1 || > 31'
      || err === 'day > lasDayOfMonth')
      res.sendStatus(400);
    else
      res.sendStatus(500);
  }
}

export const updateEventMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = req.user as IUser;

    if (req.params.eventId === undefined
      || isNaN(+req.params.eventId))
      throw ('eventId undefined || isNaN');

    const event = await db.getEventById(user.id, +req.params.eventId);
    if (!event || event.length === 0)
      throw ('event not found by id');

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
      throw ('body tests (undefined, isNaN, < 0, ...)');

    const date = new Date(+req.body.year, +req.body.month, 1);
    date.setDate(date.getDate() - 1);
    const lastDayOfMonth = date.getDate();

    if (+req.body.day > lastDayOfMonth)
      throw ('day > lasDayOfMonth');

    next();
  } catch (err) {
    console.log('updateEventMiddleware err', err)

    if (err === 'eventId undefined || isNaN'
      || err === 'body tests (undefined, isNaN, < 0, ...)'
      || err === 'day > lasDayOfMonth')
      res.sendStatus(400);
    else if (err === 'event not found by id')
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
      throw ('eventId undefined || isNaN');

    const event = await db.getEventById(user.id, +req.params.eventId);
    if (!event || event.length === 0)
      throw ('event not found by id');

    next();
  } catch (err) {
    console.log('deleteEventMiddleware err', err)

    if (err === 'eventId undefined || isNaN')
      res.sendStatus(400);
    else if (err === 'event not found by id')
      res.sendStatus(404);
    else
      res.sendStatus(500);
  }
}