"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const userController_1 = require("../controllers/userController");
const routerUser = (0, express_1.Router)();
routerUser.get('/users', userController_1.getUsers);
routerUser.get('/user/:uuid');
routerUser.post('/user/create', userController_1.createUser);
routerUser.put('/user/update/:uuid');
routerUser.delete('user/destroy/:uuid');
exports.default = routerUser;
