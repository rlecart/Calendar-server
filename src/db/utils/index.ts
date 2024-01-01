import mysql from 'mysql2/promise'

import { IEvent } from "../../routes/event/eventMiddlewares";

import { pool } from "../index";

export const usernameExists = async (username: string) => {
  const sql = `
      SELECT * FROM Users
      WHERE username = ?
  `;

  try {
    const [results] = await pool!.query(sql, [username]);

    return (results as mysql.RowDataPacket[]).length > 0;
  }
  catch (err) {
    console.log('usernameExists err', err)
    throw err;
  }

}

export const eventOverlaps = async (newEvent: IEvent, userId: number) => {
  console.log('newEvent', newEvent)
  const sql = `
      SELECT * FROM Events
      WHERE userId = ?
      AND (
        (startTime >= ? AND startTime < ?)
        OR (endTime > ? AND endTime <= ?)
        OR (startTime < ? AND endTime > ?)
      )
  `;

  try {
    const [results] = await pool!.query(sql, [
      userId,
      newEvent.startTime, newEvent.endTime,
      newEvent.startTime, newEvent.endTime,
      newEvent.startTime, newEvent.endTime,
    ]);

    return (results as mysql.RowDataPacket[]).length > 0;
  }
  catch (err) {
    console.log('eventOverlaps err', err)
    throw err;
  }
}