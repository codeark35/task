"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_typescript_1 = require("sequelize-typescript");
const user_1 = require("../models/user");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const db = new sequelize_typescript_1.Sequelize({
    database: process.env.DB_NAME,
    dialect: "mysql",
    username: process.env.USER_NAME,
    password: process.env.PASSWORD_USER,
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    models: [user_1.User],
});
exports.default = db;
