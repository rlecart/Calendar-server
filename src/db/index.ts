import { promisify } from 'util';

import mysql from 'mysql'

import DB_PASSWORD from '../../secrets/db'

import { usernameExists } from "./utils"

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: DB_PASSWORD,
  database: 'calendar_planer'
})

connection.connect(error => {
  if (error)
    throw error;

  console.log("Successfully connected to the database.");

  //   const createUsersTable = `
  //   CREATE TABLE IF NOT EXISTS Users (
  //     id INT AUTO_INCREMENT PRIMARY KEY,
  //     username VARCHAR(255) NOT NULL UNIQUE,
  //     password VARCHAR(255) NOT NULL
  //   );
  // `;

  // connection.query(createUsersTable, (error, results) => {
  //   if (error) throw error;
  //   console.log("Table Users created successfully.");
  // });

  connection.query('SELECT * FROM Users', (error, results) => {
    if (error)
      throw error;

    console.log("Users", results);
  }
  );
  // const username = 'username3';
  // const password = 'password';
  // const query = `INSERT INTO Users (username, password) VALUES (?, ?)`;

  // connection.query(query, [username, password], (error, results) => {
  //   if (error) throw error;
  //   console.log("User created successfully.", results);
  // });
});


// interface User {
//   id: string,
//   username: string,
//   password: string,
// }

const createUser = (username: string, password: string) => {
  return new Promise((resolve, reject) => {
    const query = `INSERT INTO Users (username, password) VALUES (?, ?)`;

    connection.query(query, [username, password], (error, results) => {
      if (error) {
        reject(error);
        return;
      }

      console.log("User created successfully.");
      resolve(results.insertId);
    });
  });
}

export default {
  usernameExists,
  createUser,
}