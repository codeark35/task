import { Router } from "express";
import { verifyUser } from "../middlewares/authUser";
import { getTasks, createTask, deleteTask } from "../controllers/taskController";

const routerTask = Router();

routerTask.get("/tasks", verifyUser, getTasks);

routerTask.post("/task/create", verifyUser, createTask);

/* routerTask.get("/tasks/:id",  getTask);

routerTask.put("/tasks/:id",  updateTask);*/

routerTask.delete("/task/delete/:id", verifyUser, deleteTask); 

export default routerTask;
