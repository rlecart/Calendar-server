import { promisify } from 'util';

import mysql, { Connection } from 'mysql2/promise'

import DB_PASSWORD from '../../secrets/db'

import { usernameExists, eventOverlaps } from "./utils"
import { EventInterface } from '../routes/event/eventMiddlewares';

export let connection: null | Connection = null;

export const initDB = async () => {
  try {
    connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: DB_PASSWORD,
      database: 'calendar_planer'
    });

    console.log("Successfully connected to the database.");
    return connection;

  } catch (error) {
    console.error("Error connecting to the database:", error);
    throw error;
  }
};

export const ensureConnection = async () => {
  if (!connection) {
    connection = await initDB();
    if (!connection)
      throw new Error('Could not connect to database.');
  }
}

const firstQuery = async () => {
  try {
    // await ensureConnection();

    //   const createEventsTable = `
    //   CREATE TABLE IF NOT EXISTS Events (
    //     id INT AUTO_INCREMENT PRIMARY KEY,
    //     userId INT NOT NULL,
    //     title VARCHAR(255) NOT NULL,
    //     description VARCHAR(255) NOT NULL,
    //     startTime BIGINT NOT NULL,
    //     endTime BIGINT NOT NULL,
    //     notes VARCHAR(255) NOT NULL,
    //     color VARCHAR(255) NOT NULL,
    //     dayOfMonth INT NOT NULL,
    //     month INT NOT NULL,
    //     year INT NOT NULL
    //   );
    // `;

    //   await connection.query(createEventsTable, (error, results) => {
    //     if (error) throw error;
    //     console.log("Table Events created successfully.");
    //   });

    //   await connection.query(`DROP TABLE Events`, (error, results) => {
    //     if (error) throw error;
    //     console.log("Table Events deleted successfully.");
    //   });

    // const [results] = await connection!.query('SELECT * FROM Events');
    // console.log('results', results)

    //   const username = 'username3';
    //   const password = 'password';
    //   const query = `INSERT INTO Users (username, password) VALUES (?, ?)`;

    //   await connection.query(query, [username, password], (error, results) => {
    //     if (error) throw error;
    //     console.log("User created successfully.", results);
    //   });

  } catch (err) {
    console.log('firstQuery err', err)
    throw err;
  }
}

firstQuery();

// interface User {
//   id: string,
//   username: string,
//   password: string,
// }

const createUser = async (username: string, password: string) => {
  const query = `
    INSERT INTO Users
    (username, password)
    VALUES (?, ?)
  `;

  try {
    await ensureConnection();

    const [results] = await connection!.query(query, [username, password]);
    return (results as mysql.ResultSetHeader).insertId;
  } catch (err) {
    console.log('createUser err', err)
    throw err;
  }
}

const createEvent = async (newEvent: EventInterface, userId: number) => {
  const query = `
    INSERT INTO Events
    (userId, title, description, startTime, endTime, notes, color, dayOfMonth, month, year)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  try {
    await ensureConnection();

    const [results] = await connection!.query(query, [
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

    console.log("Event created successfully.");
    return (results as mysql.ResultSetHeader).insertId;
  } catch (err) {
    console.log('createUser err', err)
    throw err;
  }
}

const getUserByUsername = async (username: string) => {
  const query = `
    SELECT * FROM Users
    WHERE username = ?
  `;

  try {
    await ensureConnection();

    const [results] = await connection!.query(query, [
      username
    ]);

    return (results as mysql.RowDataPacket[]);
  } catch (err) {
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
    await ensureConnection();

    const [results] = await connection!.query(query, [
      userId,
      year,
      month,
    ]);

    return (results as mysql.RowDataPacket[]);
  } catch (err) {
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
    await ensureConnection();

    const [results] = await connection!.query(query, [
      userId,
      year,
      month,
      day,
    ]);

    return (results as mysql.RowDataPacket[]);
  } catch (err) {
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
    await ensureConnection();

    const [results] = await connection!.query(query, [
      userId,
      eventId,
    ]);

    return (results as mysql.RowDataPacket[]);
  } catch (err) {
    console.log('getDayEvents err', err)
    throw err;
  }
}

const updateEvent = async (userId: number, eventId: number, newEvent: EventInterface) => {
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
    await ensureConnection();

    const [results] = await connection!.query(query, [
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

  } catch (err) {
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
    await ensureConnection();

    const [results] = await connection!.query(query, [
      userId,
      eventId,
    ]);

  } catch (err) {
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