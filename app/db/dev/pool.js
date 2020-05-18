 import { Pool } from 'pg';
//const Pool = require("pg");
//const dotenv = require("dotenv");
 import dotenv from 'dotenv';

dotenv.config();

const databaseConfig = { connectionString: process.env.DATABASE_URL };
const pool = new Pool(databaseConfig);
export default pool;