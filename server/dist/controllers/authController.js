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
exports.logout = exports.login = exports.verifyToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const argon2_1 = __importDefault(require("argon2"));
const user_1 = require("../models/user");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
// Login Controller
const verifyToken = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const token = req.cookies.token || ((_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(" ")[1]);
    // Comprobar si el token es undefined
    if (!token) {
        console.warn("No token provided in request.");
        return res.status(401).json({ message: "No token provided" });
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET || "prprpsww3");
        const userFound = yield user_1.User.findOne({
            where: {
                uuid: decoded.uuid,
            },
        });
        // Comprobar si se encontró el usuario
        if (!userFound) {
            console.warn("Invalid token: user not found.");
            return res.status(401).json({ message: "Invalid token" });
        }
        return res.json({
            uuid: userFound.uuid,
            name: userFound.name,
            email: userFound.email,
        });
    }
    catch (error) {
        console.error("Error decoding token:", error);
        return res.status(401).json({ message: "Invalid token" });
    }
});
exports.verifyToken = verifyToken;
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userFound = yield user_1.User.findOne({
            where: {
                email: req.body.email,
            },
        });
        if (!userFound)
            return res.status(404).json({ msg: "Usuario no encontrado" });
        const match = yield argon2_1.default.verify(userFound.password, req.body.password);
        if (!match)
            return res.status(400).json({ msg: "Contraseña incorrecta" });
        const token = jsonwebtoken_1.default.sign({
            name: userFound.name,
            email: userFound.email,
            uuid: userFound.uuid,
            role: userFound.role,
        }, process.env.JWT_SECRET || "prprpsww3", {
            expiresIn: "1m",
        });
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
        return res.status(500).json({ message: error.message });
    }
});
exports.login = login;
const logout = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Eliminar el token de la respuesta y del cliente
        res.clearCookie("token");
        return res.status(200).json({ message: "Desconectado exitosamente" });
    }
    catch (error) {
        // Manejar cualquier error interno del servidor
        return res.status(500).json({ message: "Error interno del servidor" });
    }
});
exports.logout = logout;
