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
exports.deleteTask = exports.updateTask = exports.createTask = exports.getTask = exports.getTasks = void 0;
const task_1 = require("../models/task");
// Error handling function
const handleError = (res, message, status = 500) => {
    console.error(message);
    return res.status(status).json({ message });
};
// Get tasks for a user
const getTasks = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        if (!((_a = req.user) === null || _a === void 0 ? void 0 : _a.uuid)) {
            return handleError(res, "User not authenticated or UUID not available", 401);
        }
        const response = yield task_1.Task.findAll({
            attributes: [
                "id",
                "title",
                "description",
                "date",
            ],
            where: {
                userId: req.user.uuid,
            },
        });
        return res.status(200).json(response);
    }
    catch (error) {
        return handleError(res, error.message);
    }
});
exports.getTasks = getTasks;
const getTask = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _b;
    try {
        if (!((_b = req.user) === null || _b === void 0 ? void 0 : _b.uuid)) {
            return handleError(res, "User not authenticated or UUID not available", 401);
        }
        const taskId = req.params.id;
        //const taskId = req.query.id as string;
        console.log(taskId);
        const response = yield task_1.Task.findOne({
            attributes: [
                "id",
                "title",
                "description",
                "date",
            ],
            where: {
                userId: req.user.uuid,
                id: taskId,
            },
        });
        return res.status(200).json(response);
    }
    catch (error) {
        return handleError(res, error.message);
    }
});
exports.getTask = getTask;
// Create a new task
const createTask = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _c;
    const { title, description, date } = req.body;
    if (!((_c = req.user) === null || _c === void 0 ? void 0 : _c.uuid)) {
        return handleError(res, "User not authenticated or UUID not available", 401);
    }
    try {
        const newTask = yield task_1.Task.create({
            title,
            description,
            date,
            userId: req.user.uuid,
        });
        return res.status(201).json({
            msg: "Tarea creada correctamente",
            task: {
                id: newTask.id,
                title: newTask.title,
                description: newTask.description,
                date: newTask.date,
                userId: newTask.userId,
            },
        });
    }
    catch (error) {
        return handleError(res, `Error al crear la tarea: ${error.message}`);
    }
});
exports.createTask = createTask;
const updateTask = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _d;
    if (!((_d = req.user) === null || _d === void 0 ? void 0 : _d.uuid)) {
        return handleError(res, "User not authenticated or UUID not available", 401);
    }
    const taskId = req.params.id;
    try {
        const task = yield task_1.Task.findOne({
            where: {
                id: taskId,
                userId: req.user.uuid, // Ensure the task belongs to the authenticated user
            },
        });
        if (!task) {
            return res
                .status(404)
                .json({
                msg: "Task not found or you don't have permission to update it",
            });
        }
        const { title, description, date } = req.body;
        yield task_1.Task.update({
            title,
            description,
            date,
        }, {
            where: {
                id: taskId,
                userId: req.user.uuid,
            },
        });
        // Fetch the updated task to return in the response
        const updatedTask = yield task_1.Task.findOne({
            where: {
                id: taskId,
                userId: req.user.uuid,
            },
        });
        return res.status(200).json({
            msg: "Tarea actualizada correctamente",
            task: updatedTask,
        });
    }
    catch (error) {
        return handleError(res, `Error al actualizar la tarea: ${error.message}`);
    }
});
exports.updateTask = updateTask;
const deleteTask = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _e;
    try {
        if (!((_e = req.user) === null || _e === void 0 ? void 0 : _e.uuid)) {
            return handleError(res, "User not authenticated or UUID not available", 401);
        }
        // Find the task using a query builder approach for clarity
        const task = yield task_1.Task.findOne({
            where: {
                id: req.params.id,
                userId: req.user.uuid,
            },
        });
        console.log(task);
        if (!task) {
            return res.status(404).json({ msg: "Data not found" });
        }
        // Destroy the task using the correct method (likely `destroy` or `delete`)
        yield task.destroy(); // Assuming `destroy` is the appropriate method
        res.status(204).json({ msg: "Se ha borrado correctamente" }); // Success message
    }
    catch (error) {
        return handleError(res, `Error al eliminar: ${error.message}`); // Error handling
    }
});
exports.deleteTask = deleteTask;
