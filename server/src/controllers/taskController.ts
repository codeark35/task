import { Request, Response } from "express";
import { Sequelize, DataTypes } from "sequelize";
import { Task } from "../models/task";

// Interface for the create request body
interface CreateRequestBody {
  title: string;
  description: string;
  date: Date;
}

// Error handling function
const handleError = (res: Response, message: string, status: number = 500) => {
  console.error(message);
  return res.status(status).json({ message });
};

// Get tasks for a user
export const getTasks = async (req: Request, res: Response) => {
  try {
    const response = await Task.findAll({
      attributes: [
        "title",
        "description",
        [
          Sequelize.fn("date_format", Sequelize.col("date"), "%d-%m-%Y"),
          "date",
        ],
      ],
    });
    
    return res.status(200).json(response);
  } catch (error: any) {
    return handleError(res, error.message);
  }
};

// Create a new task
export const createTask = async (req: Request, res: Response) => {
  const { title, description, date } = req.body as CreateRequestBody;
  try {
    const newTask = await Task.create({
      title,
      description,
      date,
    } as Task);

    return res.status(201).json({
      msg: "Tarea creada correctamente",
      task: {
        title: newTask.title,
        description: newTask.description,
        date: newTask.date,
      },
    });
  } catch (error: any) {
    return handleError(res, error.message);
  }
};