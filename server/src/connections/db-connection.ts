import { Sequelize } from "sequelize-typescript";
import { User } from "../models/user";
import { Task } from "../models/task";
import dotenv from "dotenv";
dotenv.config();

const db = new Sequelize({
  database: process.env.DB_NAME,
  username: process.env.USER_NAME,
  password: process.env.PASSWORD_USER,
  host: process.env.DB_HOST,
  dialect: "mysql",
  port: Number(process.env.DB_PORT),
  models: [User, Task],
  define: {
    underscored: true,  // This will use snake_case for database column names
  },
});


export default db;
