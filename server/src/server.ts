import express, { Application, Request, Response, NextFunction } from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import routerUser from "./routes/userRoute";
import routerTask from "./routes/taskRoute";
import routerAuth from "./routes/authRoute";
import db from "./connections/db-connection";
import { setupAssociations } from "./models/associations";

class Server {
  private app: Application;
  private port: string;

  constructor() {
    this.app = express();
    this.port = process.env.APP_PORT || "3000";
    this.listen();
    this.conectDB();
    this.midlewares();
    this.routes();
  }

  listen() {
    this.app.listen(this.port, () => {
      console.log(
        `Server listening at http://${process.env.HOSTNAME}:` + this.port
      );
      console.log(`***Environment: ${process.env.NODE_ENV}***`);
      console.log(`***Press CTRL+C to quit***`);
    });
  }

  async conectDB() {
    try {
      await db.sync();
      console.log("***Conexion establecida con la base de datos***");
      setupAssociations();
    } catch (error) {
      console.log(error);
    }
  }

  midlewares() {
    this.app.use(cors({ origin: "http://localhost:5173" })); // Permite todas las solicitudes desde cualquier origen
    this.app.use(express.json());
  }
  routes() {
    this.app.get("/", (req: Request, res: Response) => {
      res.send("Welcome to the API!");
    });
    
    this.app.use(cookieParser()); // Agrega esto antes de tus rutas
    this.app.use("/v1/api/", routerUser);
    this.app.use("/v1/api/", routerTask);
    this.app.use("/v1/api/auth/", routerAuth);

    this.app.use(
      (error: Error, req: Request, res: Response, next: NextFunction) => {
        if (res.headersSent) {
          return next(error as any);
        }
        console.error(error);
        res.status(500).send("Something broke! " + error.message);
      }
    );
  }
}

export default Server;
