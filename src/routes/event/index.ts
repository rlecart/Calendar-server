import express from 'express';
const router = express.Router({ mergeParams: true });
import jwt from 'jsonwebtoken';

import { Request, Response } from 'express'
import { createEventMiddleware, getDayEventMiddleware, getMonthEventMiddleware } from './eventMiddlewares';
import db from '../../db';
import SECRET from '../../../secret';
import passport from 'passport';
import { IUser } from '../user';

export interface CalendarEventDataInterface {
  id: number,
  title: string,
  description: string,
  isAllDay: boolean,
  startTime: string,
  endTime: string,
  notes: string,
  color: string,
  dayOfMonth: number,
  month: number,
  year: number,
}

router.post('/', [
  passport.authenticate('jwt', { session: false }),
  createEventMiddleware,
], async (req: Request, res: Response) => {
  try {
    console.log('req.user', req.user);
    const newEventId = await db.createEvent(req.body, 8);
    console.log('newEventId', newEventId)

    res.status(200).send({
      id: newEventId,
      ...req.body,
    });
  }
  catch (err) {
    console.log('POST /events', err)
    res.sendStatus(500);
  }
});

router.get('/year/:year/month/:month', [
  passport.authenticate('jwt', { session: false }),
  getMonthEventMiddleware,
], async (req: Request, res: Response) => {
  try {
    const user = req.user as IUser;
    const year = +req.params.year;
    const month = +req.params.month;

    const events = await db.getMonthEvents(month, year, user.id);

    console.log('events', events)
    res.status(200).send(events);
  }
  catch (err) {
    console.log('GET /events/year/:year/month/:month', err)
    res.sendStatus(500);
  }
});

router.get('/year/:year/month/:month/day/:day', [
  passport.authenticate('jwt', { session: false }),
  getDayEventMiddleware,
], async (req: Request, res: Response) => {
  try {
    const user = req.user as IUser;
    const year = +req.params.year;
    const month = +req.params.month;
    const day = +req.params.day;

    const events = await db.getDayEvents(month, year, day, user.id);

    console.log('events', events)
    res.status(200).send(events);
  }
  catch (err) {
    console.log('GET /events/year/:year/month/:month/day/:day', err)
    res.sendStatus(500);
  }
});

export default router;