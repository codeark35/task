import { Request, Response } from "express";
import { Sequelize, DataTypes } from "sequelize";
import { Task } from "../models/task";
//import { User } from "../models/user";

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
export const getTasks = async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user?.uuid) {
      return handleError(
        res,
        "User not authenticated or UUID not available",
        401
      );
    }
    const response = await Task.findAll({
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
  } catch (error: any) {
    return handleError(res, error.message);
  }
};

export const getTask = async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user?.uuid) {
      return handleError(
        res,
        "User not authenticated or UUID not available",
        401
      );
    }
    const taskId = req.params.id;
    //const taskId = req.query.id as string;
    console.log(taskId);
    const response = await Task.findOne({
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
  } catch (error: any) {
    return handleError(res, error.message);
  }
};

// Create a new task
export const createTask = async (req: AuthenticatedRequest, res: Response) => {
  const { title, description, date } = req.body as CreateRequestBody;

  if (!req.user?.uuid) {
    return handleError(
      res,
      "User not authenticated or UUID not available",
      401
    );
  }

  try {
    const newTask = await Task.create({
      title,
      description,
      date,
      userId: req.user.uuid,
    } as Task);

    return res.status(201).json({
      msg: "Tarea creada correctamente",
      task: {
        id: newTask.id, // Assuming Task model has an id field
        title: newTask.title,
        description: newTask.description,
        date: newTask.date,
        userId: newTask.userId,
      },
    });
  } catch (error: any) {
    return handleError(res, `Error al crear la tarea: ${error.message}`);
  }
};

export const updateTask = async (req: AuthenticatedRequest, res: Response) => {
  if (!req.user?.uuid) {
    return handleError(
      res,
      "User not authenticated or UUID not available",
      401
    );
  }

  const taskId = req.params.id;

  try {
    const task = await Task.findOne({
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

    const { title, description, date } = req.body as CreateRequestBody;

    await Task.update(
      {
        title,
        description,
        date,
      },
      {
        where: {
          id: taskId,
          userId: req.user.uuid,
        },
      }
    );

    // Fetch the updated task to return in the response
    const updatedTask = await Task.findOne({
      where: {
        id: taskId,
        userId: req.user.uuid,
      },
    });

    return res.status(200).json({
      msg: "Tarea actualizada correctamente",
      task: updatedTask,
    });
  } catch (error: any) {
    return handleError(res, `Error al actualizar la tarea: ${error.message}`);
  }
};


export const deleteTask = async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user?.uuid) {
      return handleError(
        res,
        "User not authenticated or UUID not available",
        401
      );
    }

    // Find the task using a query builder approach for clarity
    const task = await Task.findOne({
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
    await task.destroy(); // Assuming `destroy` is the appropriate method

    res.status(204).json({ msg: "Se ha borrado correctamente" }); // Success message
  } catch (error: any) {
    return handleError(res, `Error al eliminar: ${error.message}`); // Error handling
  }
};
