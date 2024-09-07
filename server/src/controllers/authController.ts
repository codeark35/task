import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import argon2 from "argon2";
import { User } from "../models/user";
import dotenv from "dotenv";

dotenv.config();

// Interface for the register request body
interface RegisterRequestBody {
  name: string;
  email: string;
  last_name: string;
  password: string;
  confPassword: string;
  role?: string;
}

// Load environment variables for JWT secret and session expiration
const JWT_SECRET = process.env.JWT_SECRET || "aRex&37zK0I&hccV*V!0z%GMx1089yiUt$o9vfAivcP6H#L*dyG0gF^e&ue";
const SESSION_EXPIRED = process.env.SESSION_EXPIRED || "1h";

// Handle error responses
const handleError = (res: Response, message: string, status: number = 500) => {
  console.error(message);
  return res.status(status).json({ message });
};

// Generate a JWT token for a user
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

// Verify the JWT token in the request
export const verifyToken = async (req: Request, res: Response) => {
  // Get the token from cookies or authorization header
  const token = req.cookies.token || req.headers.authorization?.split(" ")[1];

  // If no token is provided, return an error
  if (!token) {
    return handleError(res, "No token provided", 401);
  }

  try {
    // Verify the token using the JWT secret
    const decoded = jwt.verify(token, JWT_SECRET) as jwt.JwtPayload;
    const userFound = await User.findOne({ where: { uuid: decoded.uuid } });

    // If the user is not found, return an error
    if (!userFound) {
      return handleError(res, "Invalid token: user not found", 401);
    }

    // Return the user's information
    return res.json({
      uuid: userFound.uuid,
      name: userFound.name,
      email: userFound.email,
    });
  } catch (error) {
    // If the token is invalid, return an error
    return handleError(res, "Invalid token", 401);
  }
};

// Handle user registration
export const register = async (req: Request, res: Response) => {
  const { name, email, last_name, password, confPassword, role = "admin" } = req.body as RegisterRequestBody;

  // Check if all required fields are present
  if (!name || !last_name || !email || !password || !confPassword) {
    return res.status(400).json({ msg: "Todos los campos son obligatorios." });
  }

  // Check if the passwords match
  if (password !== confPassword) {
    return res.status(400).json({ msg: "Las contraseñas no coinciden." });
  }

  try {
    // Check if the email is already registered
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ msg: "El correo ya está registrado." });
    }

    // Hash the password using argon2
    const hashPassword = await argon2.hash(password);

    // Create a new user
    const newUser = await User.create({
      name,
      email,
      last_name,
      password: hashPassword,
      role,
    } as User);

    // Generate a token for the new user
    const token = generateToken(newUser);

    // Return the new user's information and the token
    return res.status(201).json({
      msg: "Usuario registrado correctamente",
      user: {
        uuid: newUser.uuid,
        name: newUser.name,
        last_name: newUser.last_name,
        email: newUser.email,
        role: newUser.role,
      },
      token,
    });
  } catch (error: any) {
    // Handle any errors that occur during registration
    return handleError(res, error.message);
  }
};

// Handle user login
export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    // Find the user by email
    const userFound = await User.findOne({ where: { email } });

    // If the user is not found, return an error
    if (!userFound) {
      return res.status(404).json({ msg: "Usuario no encontrado" });
    }

    // Verify the password using argon2
    const match = await argon2.verify(userFound.password, password);

    // If the password is incorrect, return an error
    if (!match) {
      return res.status(400).json({ msg: "Contraseña incorrecta" });
    }

    // Generate a token for the user
    const token = generateToken(userFound);

    // Return the user's information and the token
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
    // Handle any errors that occur during login
    return handleError(res, error.message);
  }
};

// Handle user logout
export const logout = async (req: Request, res: Response) => {
  try {
    // Clear the token cookie
    res.clearCookie("token");
    return res.status(200).json({ message: "Desconectado exitosamente" });
  } catch (error) {
    // Handle any errors that occur during logout
    return handleError(res, "Error interno del servidor");
  }
};