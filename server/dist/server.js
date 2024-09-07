"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const compression_1 = __importDefault(require("compression"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const morgan_1 = __importDefault(require("morgan"));
const winston_1 = __importDefault(require("winston"));
const userRoute_1 = __importDefault(require("./routes/userRoute"));
const taskRoute_1 = __importDefault(require("./routes/taskRoute"));
const authRoute_1 = __importDefault(require("./routes/authRoute"));
const db_connection_1 = __importDefault(require("./connections/db-connection"));
const associations_1 = require("./models/associations");
// Crear logger con Winston
const logger = winston_1.default.createLogger({
    level: "info",
    format: winston_1.default.format.json(),
    transports: [
        new winston_1.default.transports.File({ filename: "error.log", level: "error" }),
        new winston_1.default.transports.File({ filename: "combined.log" }),
    ],
});
class Server {
    constructor() {
        this.app = (0, express_1.default)();
        this.port = process.env.APP_PORT || "3000";
        this.listen();
        this.conectDB();
        this.middlewares();
        this.routes();
    }
    listen() {
        this.app.listen(this.port, () => {
            console.log(`Server listening at http://${process.env.HOSTNAME}:` + this.port);
            console.log(`***Environment: ${process.env.NODE_ENV}***`);
            console.log(`***Press CTRL+C to quit***`);
        });
    }
    conectDB() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield db_connection_1.default.sync();
                console.log("***Conexion establecida con la base de datos***");
                (0, associations_1.setupAssociations)();
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    middlewares() {
        // Helmet para seguridad de cabeceras
        this.app.use((0, helmet_1.default)());
        // Compresión para optimizar el tamaño de las respuestas
        this.app.use((0, compression_1.default)());
        // Rate limiting para limitar solicitudes por IP
        const limiter = (0, express_rate_limit_1.default)({
            windowMs: 15 * 60 * 1000,
            max: 100,
            message: "Demasiadas solicitudes desde esta IP, intenta de nuevo más tarde.",
        });
        this.app.use(limiter);
        // Logger de solicitudes HTTP con Morgan
        this.app.use((0, morgan_1.default)("combined", {
            stream: {
                write: (message) => logger.info(message.trim()),
            },
        }));
        // CORS configurado para permitir solicitudes desde dominios específicos
        this.app.use((0, cors_1.default)({
            origin: "http://localhost:5173",
            credentials: false,
            methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
            allowedHeaders: ["Content-Type", "Authorization"],
        }));
        // Body parser para recibir JSON en el cuerpo de la solicitud
        this.app.use(express_1.default.json());
        // Analizador de cookies
        this.app.use((0, cookie_parser_1.default)());
    }
    // Rutas de la aplicación
    routes() {
        this.app.get("/", (req, res) => {
            res.send("Welcome to the API!");
        });
        // Definición de rutas
        this.app.use("/v1/api/", userRoute_1.default);
        this.app.use("/v1/api/", taskRoute_1.default);
        this.app.use("/v1/api/auth/", authRoute_1.default);
        // Manejo global de errores
        this.app.use((error, req, res, next) => {
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
        });
    }
}
exports.default = Server;
