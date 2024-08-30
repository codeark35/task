import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import argon2 from "argon2";
import { User } from "../models/user";
import dotenv from "dotenv";

dotenv.config();
// Login Controller
export const verifyToken = async (req: Request, res: Response) => {
  const token = req.cookies.token || req.headers.authorization?.split(" ")[1];

  // Comprobar si el token es undefined
  if (!token) {
    console.warn("No token provided in request.");
    return res.status(401).json({ message: "No token provided" });
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "aRex&37zK0I&hccV*V!0z%GMx1089yiUt$o9vfAivcP6H#L*dyG0gF^e&ue"
    ) as jwt.JwtPayload;

    const userFound = await User.findOne({
      where: {
        uuid: decoded.uuid,
      },
    });

    // Comprobar si se encontró el usuario
    if (!userFound) {
      console.warn("Invalid token: user not found.");
      return res.status(401).json({ message: "Invalid token" });
    }

    return res.json({
      uuid: userFound.uuid,
      name: userFound.name,
      email: userFound.email,
    });
  } catch (error) {
    console.error("Error decoding token:", error);
    return res.status(401).json({ message: "Invalid token" });
  }
};

export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, last_name, password, confPassword, role } = req.body;

    // Validación de datos
    if (!name || !last_name || !email || !password || !confPassword) {
      return res.status(400).json({ msg: "Todos los campos son obligatorios." });
    }

    if (password !== confPassword) {
      return res.status(400).json({ msg: "Las contraseñas no coinciden." });
    }

    // Verifica si el usuario ya existe
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
    });

    res.status(201).json({ msg: "Usuario registrado correctamente", user: newUser });
  } catch (error: any) {
    res.status(500).json({ msg: error.message });
  }
};
export const login = async (req: Request, res: Response) => {
  try {
    const userFound = await User.findOne({
      where: {
        email: req.body.email,
      },
    });
    if (!userFound)
      return res.status(404).json({ msg: "Usuario no encontrado" });
    const match = await argon2.verify(userFound.password, req.body.password);
    if (!match) return res.status(400).json({ msg: "Contraseña incorrecta" });

    const token = jwt.sign(
      {
        name: userFound.name,
        email: userFound.email,
        uuid: userFound.uuid,
        role: userFound.role,
      },
      process.env.JWT_SECRET || "aRex&37zK0I&hccV*V!0z%GMx1089yiUt$o9vfAivcP6H#L*dyG0gF^e&ue",
      {
        expiresIn: process.env.SESSION_EXPIRED,
      }
    );
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
    return res.status(500).json({ message: error.message });
  }
};

export const logout = async (req: Request, res: Response) => {
  try {
    // Eliminar el token de la respuesta y del cliente
    res.clearCookie("token");

    return res.status(200).json({ message: "Desconectado exitosamente" });
  } catch (error) {
    // Manejar cualquier error interno del servidor
    return res.status(500).json({ message: "Error interno del servidor" });
  }
};
