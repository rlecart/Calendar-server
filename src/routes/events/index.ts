import express from 'express';
const router = express.Router({ mergeParams: true });
import jwt from 'jsonwebtoken';

import { Request, Response } from 'express'
import { createEventMiddleware } from './eventsMiddlewares';
import db from '../../db';
import SECRET from '../../../secret';

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
  createEventMiddleware,
], async (req: Request, res: Response) => {
  try {
    const newEventId = await db.createEvent(req.body, 8);
    console.log('newEventId', newEventId)

    res.status(200).send({
      id: newEventId,
      ...req.body,
    });
  }
  catch (err) {
    console.log('POST /users', err)
    res.sendStatus(500);
  }
}
);

export default router;