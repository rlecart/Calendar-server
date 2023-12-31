import { promisify } from 'util';

import mysql, { Connection } from 'mysql2/promise'

import DB_PASSWORD from '../../secrets/db'

import { usernameExists, eventOverlaps } from "./utils"
import { EventInterface } from '../routes/events/eventsMiddlewares';

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
    await ensureConnection();

    //   const createEventsTable = `
    //   CREATE TABLE IF NOT EXISTS Events (
    //     id INT AUTO_INCREMENT PRIMARY KEY,
    //     userId INT NOT NULL,
    //     title VARCHAR(255) NOT NULL,
    //     description VARCHAR(255) NOT NULL,
    //     isAllDay TINYINT NOT NULL,
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

    const [results] = await connection!.query('SELECT * FROM Events');
    console.log('results', results)

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
  const query = `INSERT INTO Users (username, password) VALUES (?, ?)`;

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
  const query = `INSERT INTO Events (userId, title, description, isAllDay, startTime, endTime, notes, color, dayOfMonth, month, year) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

  try {
    await ensureConnection();

    const [results] = await connection!.query(query, [
      userId,
      newEvent.title,
      newEvent.description,
      newEvent.isAllDay,
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
  const query = `SELECT * FROM Users WHERE username = ?`;

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


export default {
  usernameExists,
  eventOverlaps,

  getUserByUsername,
  createUser,
  createEvent,
}