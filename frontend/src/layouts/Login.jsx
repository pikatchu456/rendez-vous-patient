import React from "react";
import Input from "../components/Input.jsx";
import Button from "../components/Button.jsx";
import { Link } from "react-router-dom";
import { useSignIn } from "@clerk/clerk-react";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";

const schema = yup.object().shape({
  password: yup.string().required("Champs requis"),
  username: yup.string().required("Champs requis"),
});

const Login = () => {
  const { isLoaded, signIn, setActive } = useSignIn();

  if (!isLoaded) {
    return null;
  }

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data) => {
    try {
      const result = await signIn.create({
        identifier: data.username,
        password: data.password,
      });
      if (result.status === "complete") {
        console.log(result);
        await setActive({ session: result.createdSessionId });
      } else {
        console.log(result);
      }
    } catch (err) {
      const {message, meta:{paramName}} = err.errors[0];
      const nom = paramName === "identifier" ? "username" : "password";
      setError(nom , {message})
    }
  };

  return (
    <main className="w-full h-screen grid grid-cols-1 sm:grid-cols-2">
      {/* Section du formulaire à gauche */}
      <div className="flex justify-center items-center flex-col sm:px-8">
        <h1 className="text-center font-bold text-2xl py-6 px-8">
          Bienvenue, chers utilisateurs
        </h1>
        <h1 className="text-center mb-8">Veuillez-vous authentifier</h1>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="w-full px-8 flex flex-col space-y-4"
        >
          <Input
            state={{ ...register("username") }}
            isError={errors?.username}
            errorMessage={errors?.username?.message}
            name="username"
            type="text"
            label="username or email"
          />
          <Input
            state={{ ...register("password") }}
            isError={errors?.password}
            errorMessage={errors?.password?.message}
            name="password"
            type="password"
            label="Password"
          />
          <Button type="submit">Sign in</Button>
        </form>
        <p className="my-4">
          Vous n'avez pas de compte?{"   "}
          <Link to="/signup">
            <span className="inline-block relative cursor-pointer transition-all duration-500 sm:before:content-[''] sm:before:absolute sm:before:-bottom-2 sm:before:left-0 sm:before:w-0 sm:before:h-1.5 sm:before:rounded-full sm:before:opacity-0 sm:before:transition-all sm:before:duration-500 sm:before:bg-gradient-to-r sm:before:from-sky-300 sm:before:via-sky-400 sm:before:to-sky-500 sm:hover:before:w-full sm:hover:before:opacity-100 underline sm:no-underline">
              Créer un compte
            </span>
          </Link>
        </p>
      </div>
      {/* Section de l'image à droite */}
      <div className="hidden sm:block">
        <img
          src="/photo/Capture2.PNG"
          alt="dent"
          className="w-full h-full object-cover"
        />
      </div>
    </main>
  );
};

export default Login;
