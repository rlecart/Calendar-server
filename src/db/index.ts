import mysql, { Pool } from 'mysql2/promise'

import { IEvent } from '../routes/event/eventMiddlewares';

import { usernameExists, eventOverlaps } from "./utils"

import DB_PASSWORD from '../../secrets/db'


export let pool: null | Pool = null;

export const initDB = async () => {
  try {
    pool = mysql.createPool({
      host: 'localhost',
      user: 'root',
      password: DB_PASSWORD,
      database: 'calendar_planer',
    });

    console.log("Successfully connected to the database.");
    return pool;
  }
  catch (error) {
    console.error("Error connecting to the database:", error);
    throw error;
  }
};

const createUser = async (username: string, password: string) => {
  const query = `
    INSERT INTO Users
    (username, password)
    VALUES (?, ?)
  `;

  try {
    const [results] = await pool!.query(query, [username, password]);

    return (results as mysql.ResultSetHeader).insertId;
  }
  catch (err) {
    console.log('createUser err', err)
    throw err;
  }
}

const createEvent = async (newEvent: IEvent, userId: number) => {
  const query = `
    INSERT INTO Events
    (userId, title, description, startTime, endTime, notes, color, dayOfMonth, month, year)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  try {
    const [results] = await pool!.query(query, [
      userId,
      newEvent.title,
      newEvent.description,
      newEvent.startTime,
      newEvent.endTime,
      newEvent.notes,
      newEvent.color,
      newEvent.dayOfMonth,
      newEvent.month,
      newEvent.year
    ]);

    return (results as mysql.ResultSetHeader).insertId;
  }
  catch (err) {
    console.log('createEvent err', err)
    throw err;
  }
}

const getUserByUsername = async (username: string) => {
  const query = `
    SELECT * FROM Users
    WHERE username = ?
  `;

  try {
    const [results] = await pool!.query(query, [username]);

    return (results as mysql.RowDataPacket[]);
  }
  catch (err) {
    console.log('getUserByUsername err', err)
    throw err;
  }
}

const getMonthEvents = async (month: number, year: number, userId: number) => {
  const query = `
    SELECT * FROM Events
    WHERE userId = ?
    AND (
      year = ?
      AND month = ?
    )
  `;

  try {
    const [results] = await pool!.query(query, [
      userId,
      year,
      month,
    ]);

    return (results as mysql.RowDataPacket[]);
  }
  catch (err) {
    console.log('getMonthEvents err', err)
    throw err;
  }
}

const getDayEvents = async (userId: number, month: number, year: number, day: number) => {
  const query = `
    SELECT * FROM Events
    WHERE userId = ?
    AND (
      year = ?
      AND month = ?
      AND dayOfMonth = ?
    )
  `;

  try {
    const [results] = await pool!.query(query, [
      userId,
      year,
      month,
      day,
    ]);

    return (results as mysql.RowDataPacket[]);
  }
  catch (err) {
    console.log('getDayEvents err', err)
    throw err;
  }
}

const getEventById = async (userId: number, eventId: number) => {
  const query = `
    SELECT * FROM Events
    WHERE userId = ?
    AND id = ?
  `;

  try {
    const [results] = await pool!.query(query, [
      userId,
      eventId,
    ]);

    return (results as mysql.RowDataPacket[]);
  }
  catch (err) {
    console.log('getDayEvents err', err)
    throw err;
  }
}

const updateEvent = async (userId: number, eventId: number, newEvent: IEvent) => {
  const query = `
    UPDATE Events
    SET
      title = ?,
      description = ?,
      startTime = ?,
      endTime = ?,
      notes = ?,
      color = ?,
      dayOfMonth = ?,
      month = ?,
      year = ?
    WHERE userId = ?
    AND id = ?
  `;

  try {
    await pool!.query(query, [
      newEvent.title,
      newEvent.description,
      newEvent.startTime,
      newEvent.endTime,
      newEvent.notes,
      newEvent.color,
      newEvent.dayOfMonth,
      newEvent.month,
      newEvent.year,
      userId,
      eventId,
    ]);

  }
  catch (err) {
    console.log('getDayEvents err', err)
    throw err;
  }
}

const deleteEvent = async (userId: number, eventId: number) => {
  const query = `
    DELETE FROM Events
    WHERE userId = ?
    AND id = ?
  `;

  try {
    await pool!.query(query, [
      userId,
      eventId,
    ]);

  }
  catch (err) {
    console.log('getDayEvents err', err)
    throw err;
  }
}

export default {
  usernameExists,
  eventOverlaps,

  getUserByUsername,
  createUser,
  createEvent,

  getMonthEvents,
  getDayEvents,
  getEventById,
  updateEvent,
  deleteEvent,
}