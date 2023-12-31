import mysql from 'mysql2/promise'

import { EventInterface } from "../../routes/events/eventsMiddlewares";

import { connection, ensureConnection } from "../index";

export const usernameExists = async (username: string) => {
  return false;
}

export const eventOverlaps = async (newEvent: EventInterface) => {
  console.log('newEvent', newEvent)
  const sql = `
      SELECT * FROM Events
      WHERE userId = ?
      AND (
        (startTime BETWEEN ? AND ?)
        OR (endTime BETWEEN ? AND ?)
        OR (? BETWEEN startTime AND endTime)
        OR (? BETWEEN startTime AND endTime)
      )
  `;

  try {
    await ensureConnection();

    const [results] = await connection!.query(sql, [
      newEvent.userId,
      newEvent.startTime,
      newEvent.endTime,
      newEvent.startTime,
      newEvent.endTime,
      newEvent.startTime,
      newEvent.endTime,
    ]);
    return (results as mysql.RowDataPacket[]);
  } catch (err) {
    console.log('eventOverlaps err', err)
    throw err;
  }
}