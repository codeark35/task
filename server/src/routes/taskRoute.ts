import { Router } from "express";
import { getTasks, createTask } from "../controllers/taskController";


const routerTask = Router();

routerTask.get("/tasks",  getTasks);

routerTask.post("/tasks",   createTask);

/* routerTask.get("/tasks/:id",  getTask);

routerTask.put("/tasks/:id",  updateTask);

routerTask.delete("/tasks/:id",  deleteTask); */

export default routerTask;
 