import React from "react";
import Input from "../components/Input.jsx";
import Button from "../components/Button.jsx";
import { Link } from "react-router-dom";

const Login = () => {
  return (
    <main className="w-full h-screen grid grid-cols-1 sm:grid-cols-2">
      {/* Section du formulaire à gauche */}
      <div className="flex justify-center items-center flex-col sm:px-8">
        <h1 className="text-center font-bold text-2xl py-6 px-8">
          Bienvenue, chers utilisateurs
        </h1>
        <h1 className="text-center mb-8">Veuillez-vous authentifier</h1>
        <form className="w-full px-8 flex flex-col space-y-4">
          <Input name="username" type="text" label="Username or email" />
          <Input name="password" type="password" label="Password" />
          <Button>Sign in</Button>
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
