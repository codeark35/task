import { Router } from "express";
import {login, logout, register, verifyToken } from "../controllers/authController";

// Create a new router for authentication routes
const routerAuth = Router();

routerAuth.post("/login", login);
routerAuth.get("/verify-token", verifyToken);
routerAuth.post("/register", register);
routerAuth.delete("/logout", logout)


export default routerAuth;