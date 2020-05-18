import pool from "./pool";
//const pool = require("./pool");
// console.log("abcs")
pool.on("connect", () => {
  console.log("connected to the db");
});

/**
 * Create User Table
 * CREATE TABLE test
  (id SERIAL PRIMARY KEY, 
  name VARCHAR(100) UNIQUE NOT NULL, 
  phone VARCHAR(100));
 */
const createUserTable = () => {
  const userCreateQuery = `CREATE TABLE IF NOT EXISTS users
  (id SERIAL PRIMARY KEY, 
  email VARCHAR(100) UNIQUE NOT NULL, 
  first_name VARCHAR(100), 
  nick_name VARCHAR(100),
  unique_name VARCHAR(100),
  password VARCHAR(100) NOT NULL,
  created_on DATE NOT NULL)`;

  pool
    .query(userCreateQuery)
    .then((res) => {
      console.log(res);
      pool.end();
    })
    .catch((err) => {
      console.log(err);
      pool.end();
    });
};

/**
 * Create friendslist table
 */

 const createFriendTable =()=>{
   const createFriendQuery =`CREATE TABLE IF NOT EXISTS friendlist
   (id SERIAL PRIMARY KEY,
    name VARCHAR(100),
    socket_name VARCHAR,
    requeststatus INTEGER ,
    created_date date,
    accepted_date date,
    userid  INTEGER  references users(id) ON DELETE CASCADE,
    friendid INTEGER references users(id) ON DELETE CASCADE
    )`;
    pool
    .query(createFriendQuery)
    .then((res) => {
      console.log(res);
      pool.end();
    })
    .catch((err) => {
      console.log(err);
      pool.end();
    });
 }

 /**
  * drop friendlist table
  */
 const dropFriendTable = () => {
  const dropFriendQuery = "DROP TABLE IF EXISTS friendlist";
  pool
    .query(dropFriendQuery)
    .then((res) => {
      console.log(res);
      pool.end();
    })
    .catch((err) => {
      console.log(err);
      pool.end();
    })
};
/**
 * Drop User Table
 */
const dropUserTable = () => {
  const usersDropQuery = "DROP TABLE IF EXISTS users";
  pool
    .query(usersDropQuery)
    .then((res) => {
      console.log(res);
      pool.end();
    })
    .catch((err) => {
      console.log(err);
      pool.end();
    });
};

/**
 * Create All Tables
 */
const createAllTables = () => {
  createUserTable();
  createFriendTable();
};

/**
 * Drop All Tables
 */
const dropAllTables = () => {
  dropUserTable();
  dropFriendTable();
};

pool.on("remove", () => {
  console.log("client removed");
  process.exit(0);
});

export { createAllTables, dropAllTables };

require("make-runnable");
