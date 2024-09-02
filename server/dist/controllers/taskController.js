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
    const { title, description, date } = req.body;
    try {
        const newTask = yield task_1.Task.create({
            title,
            description,
            date,
        });
        return res.status(201).json({
            msg: "Tarea creada correctamente",
            task: {
                title: newTask.title,
                description: newTask.description,
                date: newTask.date,
            },
        });
    }
    catch (error) {
        return handleError(res, error.message);
    }
});
exports.createTask = createTask;
