import { Router } from "express";
import { getUsersAll, getUser,/*  createUser  */} from "../controllers/userController";
import { verifyUser } from "../middlewares/authUser";

const routerUser = Router();

routerUser.get("/users", /* verifyUser, */ getUsersAll);
routerUser.get("/user/:uuid", verifyUser, getUser);
/* routerUser.post("/user/create", createUser); */
routerUser.put("/user/update/:uuid");
routerUser.delete("user/destroy/:uuid");

export default routerUser;
