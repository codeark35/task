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
exports.verifyUser = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_1 = require("../models/user");
const verifyUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const headerToken = req.headers["authorization"];
        if (!headerToken || !headerToken.startsWith("Bearer ")) {
            return res.status(401).json({ msg: "Token no encontrado" });
        }
        const token = headerToken.split(" ")[1];
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET || "prprpsww3");
        req.user = decoded;
        // Verificar si el usuario existe en la base de datos
        const user = yield user_1.User.findOne({
            where: { uuid: decoded.uuid },
        });
        if (!user) {
            return res.status(401).json({ msg: "Usuario no autorizado" });
        }
        next();
    }
    catch (error) {
        if (error instanceof Error) {
            return res.status(401).json({ msg: "Token inválido" });
        }
        return res.status(500).json({ msg: "Error interno del servidor" });
    }
});
exports.verifyUser = verifyUser;
