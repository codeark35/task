import { Router } from "express";
import {login, logout, verifyToken } from "../controllers/authController";
import { verifyUser } from "../middlewares/authUser";
// Create a new router for authentication routes
const routerAuth = Router();

routerAuth.post("/login", login);
routerAuth.get("/verify-token", verifyToken);
routerAuth.post(/register)
routerAuth.delete("/logout", logout)


export default routerAuth;