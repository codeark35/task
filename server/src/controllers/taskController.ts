import { Request, Response } from "express";
import { Sequelize, DataTypes } from "sequelize";
import { Task } from "../models/task";
import { User } from "../models/user";

// Interface for the create request body
interface CreateRequestBody {
  title: string;
  description: string;
  date: Date;
  userId: string;
}

interface AuthenticatedRequest extends Request {
  user?: {
    uuid: string;
  };
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
export const createTask = async (req: AuthenticatedRequest, res: Response) => {
  const { title, description, date, userId } = req.body as CreateRequestBody;

  if (!req.user?.uuid) {
    return handleError(res, "User not authenticated or UUID not available", 401);
  }
  console.log(req.user.uuid)

  try {
    const newTask = await Task.create({
      title,
      description,
      date,
      userId: req.user.uuid
    } as Task);
 

    return res.status(201).json({
      msg: "Tarea creada correctamente",
      task: {
        id: newTask.id, // Assuming Task model has an id field
        title: newTask.title,
        description: newTask.description,
        date: newTask.date,
        userId: newTask.userId
      },
    });
  } catch (error: any) {
    return handleError(res, `Error al crear la tarea: ${error.message}`);
  }
};