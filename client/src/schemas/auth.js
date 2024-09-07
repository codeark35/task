import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email({
    message: "Por favor, introduce una dirección de correo electrónico válida",
  }),
  password: z.string().min(6, {
    message: "Password must be at least 6 characters",
  }),
});

export const registerSchema = z
  .object({
    name: z
      .string({
        required_error: "El nombre de usuario es obligatorio",
      })
      .min(3, {
        message: "El nombre de usuario debe tener al menos 3 caracteres",
      }),
      last_name: z
      .string({
        required_error: "El apellido es obligatorio",
      })
      .min(4, {
        message: "El apellido debe tener al menos 4 caracteres",
      }),
    email: z.string().email({
      message: "Por favor, introduce una dirección de correo electrónico válida",
    }),
    password: z.string().min(6, {
      message: "La contraseña debe tener al menos 6 caracteres",
    }),
    confPassword: z.string().min(6, {
      message: "La contraseña debe tener al menos 6 caracteres",
    }),
  })
  .refine((data) => data.password === data.confPassword, {
    message: "Las contraseñas no coinciden",
    path: ["confPassword"],
  });
