import express, { Request, Response } from 'express';
import passport from 'passport';

import db from '../../db';

import { createEventMiddleware, deleteEventMiddleware, getDayEventMiddleware, getMonthEventMiddleware, updateEventMiddleware } from './eventMiddlewares';

import { IUser } from '../user';

const router = express.Router({ mergeParams: true });

router.post('/', [
  passport.authenticate('jwt', { session: false }),
  createEventMiddleware,
], async (req: Request, res: Response) => {
  try {
    const userId = (req.user as IUser).id;

    const newEventId = await db.createEvent(req.body, userId);

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
    console.log('GET /event/year/:year/month/:month', err)
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

    const events = await db.getDayEvents(user.id, month, year, day);

    res.status(200).send(events);
  }
  catch (err) {
    console.log('GET /event/year/:year/month/:month/day/:day', err)
    res.sendStatus(500);
  }
});

router.put('/:eventId', [
  passport.authenticate('jwt', { session: false }),
  updateEventMiddleware,
], async (req: Request, res: Response) => {
  try {
    const userId = (req.user as IUser).id;
    const eventId = +req.params.eventId;
    const newEvent = req.body;

    await db.updateEvent(userId, eventId, newEvent);

    res.sendStatus(200);
  }
  catch (err) {
    console.log('PUT /event/:eventId', err)
    res.sendStatus(500);
  }
});


router.delete('/:eventId', [
  passport.authenticate('jwt', { session: false }),
  deleteEventMiddleware,
], async (req: Request, res: Response) => {
  try {
    const userId = (req.user as IUser).id;
    const eventId = +req.params.eventId;

    await db.deleteEvent(userId, eventId);

    res.sendStatus(200);
  }
  catch (err) {
    console.log('DELETE /event/:eventId', err)
    res.sendStatus(500);
  }
});

export default router;