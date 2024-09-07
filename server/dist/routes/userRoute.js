"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const userController_1 = require("../controllers/userController");
const routerUser = (0, express_1.Router)();
routerUser.get("/users", /* verifyUser, */ userController_1.getUsersAll);
routerUser.get("/user/:uuid", userController_1.getUser);
/* routerUser.post("/user/create", createUser); */
routerUser.put("/user/update/:uuid");
routerUser.delete("user/destroy/:uuid");
exports.default = routerUser;
