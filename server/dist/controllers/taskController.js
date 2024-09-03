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
Object.defineProperty(exports, "__esModule", { value: true });
exports.createTask = exports.getTasks = void 0;
const sequelize_1 = require("sequelize");
const task_1 = require("../models/task");
// Error handling function
const handleError = (res, message, status = 500) => {
    console.error(message);
    return res.status(status).json({ message });
};
// Get tasks for a user
const getTasks = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield task_1.Task.findAll({
            attributes: [
                "title",
                "description",
                [
                    sequelize_1.Sequelize.fn("date_format", sequelize_1.Sequelize.col("date"), "%d-%m-%Y"),
                    "date",
                ],
            ],
        });
        return res.status(200).json(response);
    }
    catch (error) {
        return handleError(res, error.message);
    }
});
exports.getTasks = getTasks;
// Create a new task
const createTask = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { title, description, date, userId } = req.body;
    if (!((_a = req.user) === null || _a === void 0 ? void 0 : _a.uuid)) {
        return handleError(res, "User not authenticated or UUID not available", 401);
    }
    console.log(req.user.uuid);
    try {
        const newTask = yield task_1.Task.create({
            title,
            description,
            date,
            userId: req.user.uuid
        });
        return res.status(201).json({
            msg: "Tarea creada correctamente",
            task: {
                id: newTask.id,
                title: newTask.title,
                description: newTask.description,
                date: newTask.date,
                userId: newTask.userId
            },
        });
    }
    catch (error) {
        return handleError(res, `Error al crear la tarea: ${error.message}`);
    }
});
exports.createTask = createTask;
