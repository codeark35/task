import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { User } from "../models/user";

// Extend the Express Request type
declare global {
  namespace Express {
    interface Request {
      user?: DecodedToken;
    }
  }
}

interface DecodedToken {
  uuid: string;
}

export const verifyUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const headerToken = req.headers["authorization"];

    if (!headerToken || !headerToken.startsWith("Bearer ")) {
      return res.status(401).json({ msg: "Token no encontrado" });
    }

    const token = headerToken.split(" ")[1];
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "aRex&37zK0I&hccV*V!0z%GMx1089yiUt$o9vfAivcP6H#L*dyG0gF^e&ue"
    ) as DecodedToken;

    req.user = decoded;

    // Verificar si el usuario existe en la base de datos
    const user = await User.findOne({
      where: { uuid: decoded.uuid },
    });

    if (!user) {
      return res.status(401).json({ msg: "Usuario no autorizado" });
    }

    next();
  } catch (error) {
    if (error instanceof Error) {
      return res.status(401).json({ msg: "Token inválido" });
    }
    return res.status(500).json({ msg: "Error interno del servidor" });
  }
};