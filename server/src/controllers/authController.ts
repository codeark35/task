import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import argon2 from "argon2";
import { User } from "../models/user";
import dotenv from "dotenv";

dotenv.config();

interface RegisterRequestBody {
  name: string;
  email: string;
  last_name: string;
  password: string;
  confPassword: string;
  role?: string;
}

const JWT_SECRET = process.env.JWT_SECRET || "aRex&37zK0I&hccV*V!0z%GMx1089yiUt$o9vfAivcP6H#L*dyG0gF^e&ue";
const SESSION_EXPIRED = process.env.SESSION_EXPIRED || "1h";

const handleError = (res: Response, message: string, status: number = 500) => {
  console.error(message);
  return res.status(status).json({ message });
};

const generateToken = (user: User) => {
  return jwt.sign(
    {
      name: user.name,
      email: user.email,
      uuid: user.uuid,
      role: user.role,
    },
    JWT_SECRET,
    { expiresIn: SESSION_EXPIRED }
  );
};

export const verifyToken = async (req: Request, res: Response) => {
  const token = req.cookies.token || req.headers.authorization?.split(" ")[1];

  if (!token) {
    return handleError(res, "No token provided", 401);
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as jwt.JwtPayload;
    const userFound = await User.findOne({ where: { uuid: decoded.uuid } });

    if (!userFound) {
      return handleError(res, "Invalid token: user not found", 401);
    }

    return res.json({
      uuid: userFound.uuid,
      name: userFound.name,
      email: userFound.email,
    });
  } catch (error) {
    return handleError(res, "Invalid token", 401);
  }
};

export const register = async (req: Request, res: Response) => {
  const { name, email, last_name, password, confPassword, role = "admin" } = req.body as RegisterRequestBody;

  if (!name || !last_name || !email || !password || !confPassword) {
    return res.status(400).json({ msg: "Todos los campos son obligatorios." });
  }

  if (password !== confPassword) {
    return res.status(400).json({ msg: "Las contraseñas no coinciden." });
  }

  try {
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ msg: "El correo ya está registrado." });
    }

    const hashPassword = await argon2.hash(password);

    const newUser = await User.create({
      name,
      email,
      last_name,
      password: hashPassword,
      role,
    } as User);

    const token = generateToken(newUser);

    return res.status(201).json({ 
      msg: "Usuario registrado correctamente", 
      user: {
        uuid: newUser.uuid,
        name: newUser.name,
        last_name: newUser.last_name,
        email: newUser.email,
        role: newUser.role,
      }, 
      token 
    });
  } catch (error: any) {
    return handleError(res, error.message);
  }
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const userFound = await User.findOne({ where: { email } });

    if (!userFound) {
      return res.status(404).json({ msg: "Usuario no encontrado" });
    }

    const match = await argon2.verify(userFound.password, password);

    if (!match) {
      return res.status(400).json({ msg: "Contraseña incorrecta" });
    }

    const token = generateToken(userFound);

    return res.status(200).json({
      token,
      user: {
        uuid: userFound.uuid,
        name: userFound.name,
        last_name: userFound.last_name,
        email: userFound.email,
        role: userFound.role,
      },
    });
  } catch (error: any) {
    return handleError(res, error.message);
  }
};

export const logout = async (req: Request, res: Response) => {
  try {
    res.clearCookie("token");
    return res.status(200).json({ message: "Desconectado exitosamente" });
  } catch (error) {
    return handleError(res, "Error interno del servidor");
  }
};