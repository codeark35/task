"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authController_1 = require("../controllers/authController");
// Create a new router for authentication routes
const routerAuth = (0, express_1.Router)();
routerAuth.post("/login", authController_1.login);
routerAuth.get("/verify-token", authController_1.verifyToken);
routerAuth.post("/register", authController_1.register);
routerAuth.delete("/logout", authController_1.logout);
exports.default = routerAuth;
