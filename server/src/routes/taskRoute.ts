import { Router } from "express";
import { verifyUser } from "../middlewares/authUser";
import {
  getTasks,
  createTask,
  deleteTask,
  getTask,
  updateTask,
} from "../controllers/taskController";

const routerTask = Router();

routerTask.get("/tasks", verifyUser, getTasks);

routerTask.post("/task/create", verifyUser, createTask);

routerTask.get("/task/:id", verifyUser, getTask);

routerTask.put("/task/update/:id", verifyUser, updateTask);

routerTask.delete("/task/delete/:id", verifyUser, deleteTask);

export default routerTask;
