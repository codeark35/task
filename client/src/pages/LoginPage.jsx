import { useAuth } from "../context/authContext";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, Message, Button, Input, Label } from "../components/ui";
import { loginSchema } from "../schemas/auth";

export function LoginPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
  });

  const { signin, errors: loginErrors, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    try {
      await signin(data);  // Asegúrate de que `signin` maneje correctamente los errores
      navigate("/tasks");
    } catch (error) {
      console.error("Login error: ", error);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/tasks");
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="h-[calc(100vh-100px)] flex items-center justify-center">
      <Card>
        {Array.isArray(loginErrors) && loginErrors.map((error, i) => (
          <Message message={error} key={i} />
        ))}
        <h1 className="text-2xl font-bold">Inicio Sesión</h1>

        <form onSubmit={handleSubmit(onSubmit)}>
          <Label htmlFor="email">Correo electrónico:</Label>
          <Input
            label="Write your email"
            type="email"
            name="email"
            placeholder="Escribre tu correo..."
            {...register("email", { required: true })}
          />
          <p>{errors.email?.message}</p>

          <Label htmlFor="password">Contraseña:</Label>
          <Input
            type="password"
            name="password"
            placeholder="Escribe la contraseña"
            {...register("password", { required: true, minLength: 6 })}
          />
          <p>{errors.password?.message}</p>

          <Button>Login</Button>
        </form>

        <p className="flex gap-x-2 justify-between">
        ¿No tienes una cuenta? <Link to="/register" className="text-sky-500">Inscribirse</Link>
        </p>
      </Card>
    </div>
  );
}
