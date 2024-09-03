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
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const cors_1 = __importDefault(require("cors"));
const userRoute_1 = __importDefault(require("./routes/userRoute"));
const taskRoute_1 = __importDefault(require("./routes/taskRoute"));
const authRoute_1 = __importDefault(require("./routes/authRoute"));
const db_connection_1 = __importDefault(require("./connections/db-connection"));
const associations_1 = require("./models/associations");
class Server {
    constructor() {
        this.app = (0, express_1.default)();
        this.port = process.env.APP_PORT || "3000";
        this.listen();
        this.conectDB();
        this.midlewares();
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
    midlewares() {
        this.app.use((0, cors_1.default)({
            origin: "http://localhost:5173",
            credentials: true,
            methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
            allowedHeaders: ["Content-Type", "Authorization"],
        }));
        this.app.use(express_1.default.json());
        // this.app.use(verifyUser); 
    }
    routes() {
        this.app.get("/", (req, res) => {
            res.send("Welcome to the API!");
        });
        this.app.use((0, cookie_parser_1.default)()); // Agrega esto antes de tus rutas
        this.app.use("/v1/api/", userRoute_1.default);
        this.app.use("/v1/api/", taskRoute_1.default);
        this.app.use("/v1/api/auth/", authRoute_1.default);
        this.app.use((error, req, res, next) => {
            if (res.headersSent) {
                return next(error);
            }
            console.error(error);
            res.status(500).send("Something broke! " + error.message);
        });
    }
}
exports.default = Server;
