"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyUser = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const verifyUser = (req, res, next) => {
    // console.log('All request headers:', req.headers);
    const authHeader = req.header('Authorization');
    // console.log('Authorization header:', authHeader);
    const token = authHeader === null || authHeader === void 0 ? void 0 : authHeader.split(' ')[1];
    // console.log('Extracted token:', token);
    if (!token) {
        return res.status(401).json({ message: 'No token provided' });
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        // console.log('Decoded token:', decoded);
        req.user = decoded;
        next();
    }
    catch (error) {
        console.error('Token verification error:', error);
        if (error instanceof jsonwebtoken_1.default.JsonWebTokenError) {
            console.log('JWT Error:', error.message);
        }
        res.status(401).json({ message: 'Invalid token' });
    }
};
exports.verifyUser = verifyUser;
