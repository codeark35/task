import { Router } from "express";
import { verifyUser } from "../middlewares/authUser";
import { getTasks, createTask } from "../controllers/taskController";


const routerTask = Router();

routerTask.get("/tasks",  getTasks);

routerTask.post("/task/create", verifyUser, createTask);

/* routerTask.get("/tasks/:id",  getTask);

routerTask.put("/tasks/:id",  updateTask);

routerTask.delete("/tasks/:id",  deleteTask); */

export default routerTask;
 