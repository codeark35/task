import express, { Application, Request, Response, NextFunction } from "express";
import compression from "compression";
import cookieParser from "cookie-parser";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import morgan from "morgan";
import winston from "winston";
import routerUser from "./routes/userRoute";
import routerTask from "./routes/taskRoute";
import routerAuth from "./routes/authRoute";
import db from "./connections/db-connection";
import { setupAssociations } from "./models/associations";

// Crear logger con Winston
const logger = winston.createLogger({
  level: "info",
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: "error.log", level: "error" }),
    new winston.transports.File({ filename: "combined.log" }),
  ],
});
class Server {
  private app: Application;
  private port: string;

  constructor() {
    this.app = express();
    this.port = process.env.APP_PORT || "3000";
    this.listen();
    this.conectDB();
    this.middlewares();
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

  middlewares() {
    // Helmet para seguridad de cabeceras
    this.app.use(helmet());

    // Compresión para optimizar el tamaño de las respuestas
    this.app.use(compression());

    // Rate limiting para limitar solicitudes por IP
    const limiter = rateLimit({
      windowMs: 15 * 60 * 1000, // 15 minutos
      max: 100, // Limita a 100 solicitudes por IP
      message:
        "Demasiadas solicitudes desde esta IP, intenta de nuevo más tarde.",
    });
    this.app.use(limiter);

    // Logger de solicitudes HTTP con Morgan
    this.app.use(
      morgan("combined", {
        stream: {
          write: (message: string) => logger.info(message.trim()),
        },
      })
    );

    // CORS configurado para permitir solicitudes desde dominios específicos
    this.app.use(
      cors({
        origin: "http://localhost:5173",
        credentials: false, 
        methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        allowedHeaders: ["Content-Type", "Authorization"],
      })
    );

    // Body parser para recibir JSON en el cuerpo de la solicitud
    this.app.use(express.json());

    // Analizador de cookies
    this.app.use(cookieParser());
  }

  // Rutas de la aplicación
  routes() {
    this.app.get("/", (req: Request, res: Response) => {
      res.send("Welcome to the API!");
    });

    // Definición de rutas
    this.app.use("/v1/api/", routerUser);
    this.app.use("/v1/api/", routerTask);
    this.app.use("/v1/api/auth/", routerAuth);

    // Manejo global de errores
    this.app.use(
      (error: Error, req: Request, res: Response, next: NextFunction) => {
        if (res.headersSent) {
          return next(error);
        }
        logger.error(error.message);
        res
          .status(500)
          .json({
            message: "Algo salió mal en el servidor.",
            error: error.message,
          });
      }
    );
  }
}

export default Server;
