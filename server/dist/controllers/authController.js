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
exports.logout = exports.login = exports.register = exports.verifyToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const argon2_1 = __importDefault(require("argon2"));
const user_1 = require("../models/user");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const JWT_SECRET = process.env.JWT_SECRET || "aRex&37zK0I&hccV*V!0z%GMx1089yiUt$o9vfAivcP6H#L*dyG0gF^e&ue";
const SESSION_EXPIRED = process.env.SESSION_EXPIRED || "1h";
const handleError = (res, message, status = 500) => {
    console.error(message);
    return res.status(status).json({ message });
};
const generateToken = (user) => {
    return jsonwebtoken_1.default.sign({
        name: user.name,
        email: user.email,
        uuid: user.uuid,
        role: user.role,
    }, JWT_SECRET, { expiresIn: SESSION_EXPIRED });
};
const verifyToken = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const token = req.cookies.token || ((_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(" ")[1]);
    if (!token) {
        return handleError(res, "No token provided", 401);
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, JWT_SECRET);
        const userFound = yield user_1.User.findOne({ where: { uuid: decoded.uuid } });
        if (!userFound) {
            return handleError(res, "Invalid token: user not found", 401);
        }
        return res.json({
            uuid: userFound.uuid,
            name: userFound.name,
            email: userFound.email,
        });
    }
    catch (error) {
        return handleError(res, "Invalid token", 401);
    }
});
exports.verifyToken = verifyToken;
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, email, last_name, password, confPassword, role = "admin" } = req.body;
    if (!name || !last_name || !email || !password || !confPassword) {
        return res.status(400).json({ msg: "Todos los campos son obligatorios." });
    }
    if (password !== confPassword) {
        return res.status(400).json({ msg: "Las contraseñas no coinciden." });
    }
    try {
        const existingUser = yield user_1.User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ msg: "El correo ya está registrado." });
        }
        const hashPassword = yield argon2_1.default.hash(password);
        const newUser = yield user_1.User.create({
            name,
            email,
            last_name,
            password: hashPassword,
            role,
        });
        const token = generateToken(newUser);
        return res.status(201).json({
            msg: "Usuario registrado correctamente",
            user: {
                uuid: newUser.uuid,
                name: newUser.name,
                last_name: newUser.last_name,
                email: newUser.email,
                role: newUser.role,
            },
            token
        });
    }
    catch (error) {
        return handleError(res, error.message);
    }
});
exports.register = register;
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    try {
        const userFound = yield user_1.User.findOne({ where: { email } });
        if (!userFound) {
            return res.status(404).json({ msg: "Usuario no encontrado" });
        }
        const match = yield argon2_1.default.verify(userFound.password, password);
        if (!match) {
            return res.status(400).json({ msg: "Contraseña incorrecta" });
        }
        const token = generateToken(userFound);
        return res.status(200).json({
            token,
            user: {
                uuid: userFound.uuid,
                name: userFound.name,
                last_name: userFound.last_name,
                email: userFound.email,
                role: userFound.role,
            },
        });
    }
    catch (error) {
        return handleError(res, error.message);
    }
});
exports.login = login;
const logout = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        res.clearCookie("token");
        return res.status(200).json({ message: "Desconectado exitosamente" });
    }
    catch (error) {
        return handleError(res, "Error interno del servidor");
    }
});
exports.logout = logout;
