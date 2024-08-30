"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createUser = exports.getUsers = void 0;
const argon2_1 = __importDefault(require("argon2"));
const sequelize_typescript_1 = require("sequelize-typescript");
const user_1 = require("../models/user");
const getUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield user_1.User.findAll({
            attributes: [
                "uuid",
                "name",
                "last_name",
                "email",
                "role",
                [
                    sequelize_typescript_1.Sequelize.fn("date_format", sequelize_typescript_1.Sequelize.col("createdAt"), "%d-%m-%Y"),
                    "createdAt",
                ],
                "updatedAt",
            ],
        });
        res.status(200).json(response);
    }
    catch (error) {
        //res.status(500).json({ msg: error.message });
    }
});
exports.getUsers = getUsers;
const createUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, email, last_name, password, confPassword, role } = req.body;
        if (!name || !email || !password || !confPassword) {
            return res.status(400).json({ msg: "Todos los campos son obligatorios." });
        }
        if (password !== confPassword) {
            return res.status(400).json({ msg: "Password and Confirm Password do not match" });
        }
        const hashPassword = yield argon2_1.default.hash(password);
        console.log(hashPassword);
        yield user_1.User.create({
            name,
            email,
            last_name,
            password: hashPassword,
            role
        });
        res.status(201).json({ msg: "Usuario registrado correctamente" });
    }
    catch (error) {
        //  res.status(400).json({ msg: error.message });
    }
});
exports.createUser = createUser;
