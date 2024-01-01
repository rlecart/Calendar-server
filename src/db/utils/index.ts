import mysql from 'mysql2/promise'

import { EventInterface } from "../../routes/event/eventMiddlewares";

import { connection, ensureConnection } from "../index";

export const usernameExists = async (username: string) => {
  const sql = `
      SELECT * FROM Users
      WHERE username = ?
  `;

  try {
    await ensureConnection();

    const [results] = await connection!.query(sql, [
      username
    ]);
    return (results as mysql.RowDataPacket[]).length > 0;
  } catch (err) {
    console.log('usernameExists err', err)
    throw err;
  }

}

export const eventOverlaps = async (newEvent: EventInterface, userId: number) => {
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
    await ensureConnection();

    const [results] = await connection!.query(sql, [
      userId,
      newEvent.startTime,
      newEvent.endTime,
      newEvent.startTime,
      newEvent.endTime,
      newEvent.startTime,
      newEvent.endTime,
    ]);
    console.log('results', results)
    return (results as mysql.RowDataPacket[]).length > 0;
  } catch (err) {
    console.log('eventOverlaps err', err)
    throw err;
  }
}