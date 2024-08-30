import { useEffect } from "react";
import { useAuth } from "../context/authContext";
import { Link, useNavigate } from "react-router-dom";
import { Card, Message, Button, Input, Label } from "../components/ui";
import { useForm } from "react-hook-form";
import { registerSchema } from "../schemas/auth";
import { zodResolver } from "@hookform/resolvers/zod";

function Register() {
  const { signup, errors: registerErrors, isAuthenticated } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(registerSchema),
  });
  const navigate = useNavigate();

  const onSubmit = async (value) => {
    await signup(value);
  };

  useEffect(() => {
    if (isAuthenticated) navigate("/tasks");
  }, [isAuthenticated]);

  return (
    <div className="h-[calc(100vh-100px)] flex items-center justify-center">
      <Card>
        {registerErrors.map((error, i) => (
          <Message message={error} key={i} />
        ))}
        <h1 className="text-3xl font-bold">Registro de Usuario</h1>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Label htmlFor="email">Correo electrónico:</Label>
          <Input
            name="email"
            placeholder="youremail@domain.tld"
            {...register("email")}
          />
          {errors.email?.message && (
            <p className="text-danger">{errors.email?.message}</p>
          )}
          <Label htmlFor="name">Nombres:</Label>
          <Input
            type="text"
            name="name"
            placeholder="Escribe tu Nombre"
            {...register("name")}
            autoFocus
          />
          {errors.name?.message && (
            <p className="text-danger">{errors.name?.message}</p>
          )}
          <Label htmlFor="last_name">Apellidos:</Label>
          <Input
            type="text"
            name="last_name"
            placeholder="Escribe tu Apellido"
            {...register("last_name")}
            autoFocus
          />
          {errors.last_name?.message && (
            <p className="text-danger">{errors.last_name?.message}</p>
          )}

          <Label htmlFor="password">Password:</Label>
          <Input
            type="password"
            name="password"
            placeholder="********"
            {...register("password")}
          />
          {errors.password?.message && (
            <p className="text-danger">{errors.password?.message}</p>
          )}

          <Label htmlFor="confPassword">Confirmar Contraseña:</Label>
          <Input
            type="password"
            name="confPassword"
            placeholder="********"
            {...register("confPassword")}
          />
          {errors.confPassword?.message && (
            <p className="text-danger">{errors.confPassword?.message}</p>
          )}
          <Button>Registrar</Button>
        </form>
        <p>
        ¿Ya tienes una cuenta?
          <Link className="text-sky-500" to="/login">
          Iniciar sesión
          </Link>
        </p>
      </Card>
    </div>
  );
}

export default Register;
