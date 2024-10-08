"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authUser_1 = require("../middlewares/authUser");
const taskController_1 = require("../controllers/taskController");
const routerTask = (0, express_1.Router)();
routerTask.get("/tasks", authUser_1.verifyUser, taskController_1.getTasks);
routerTask.post("/task/create", authUser_1.verifyUser, taskController_1.createTask);
routerTask.get("/task/:id", authUser_1.verifyUser, taskController_1.getTask);
routerTask.put("/task/update/:id", authUser_1.verifyUser, taskController_1.updateTask);
routerTask.delete("/task/delete/:id", authUser_1.verifyUser, taskController_1.deleteTask);
exports.default = routerTask;
