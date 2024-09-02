"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const taskController_1 = require("../controllers/taskController");
const routerTask = (0, express_1.Router)();
routerTask.get("/tasks", taskController_1.getTasks);
routerTask.post("/tasks", taskController_1.createTask);
/* routerTask.get("/tasks/:id",  getTask);

routerTask.put("/tasks/:id",  updateTask);

routerTask.delete("/tasks/:id",  deleteTask); */
exports.default = routerTask;
