import { Sequelize } from "sequelize-typescript";
import { User } from "../models/user";
import dotenv from "dotenv";
dotenv.config();

const db = new Sequelize({
  database: process.env.DB_NAME,
  dialect: "mysql",
  username: process.env.USER_NAME,
  password: process.env.PASSWORD_USER,
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  models: [User],
});


export default db;
