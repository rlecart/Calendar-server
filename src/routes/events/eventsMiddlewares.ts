import { Request, Response, NextFunction } from 'express'

import db from '../../db';

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

    const eventOverlaps = await db.eventOverlaps(body);
    console.log('eventOverlaps', eventOverlaps)
    // throw new Error('eventOverlaps')
    // if (await db.eventOverlaps(body))
    //   return res.status(409).send('Il y a déjà un événement à cette heure là.');

    next();
  } catch (err) {
    console.log('createEventMiddleware', err)

    res.sendStatus(500);
  }
}