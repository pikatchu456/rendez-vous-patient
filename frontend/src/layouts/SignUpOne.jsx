import React, { useState } from 'react';
import Input from "../components/Input.jsx";
import Button from "../components/Button.jsx";
import { Link } from 'react-router-dom';

const SignUpOne = () => {
  const [isCorrectCode, setIsCorrectCode] = useState(false);
  const [pendingVerification, setPendingVerification] = useState(false);
  return (
    <main className="w-full h-screen grid grid-cols-1 sm:grid-cols-2">
      {/* Section du formulaire à gauche */}
      <div className="flex justify-center items-center flex-col sm:px-8">
        <h1 className="text-center font-bold text-2xl py-6 px-8">
          Sign up pour creer un compte
        </h1>
        <h1 className="text-center mb-8">Entrer votre email</h1>
        {!isCorrectCode && (
          <form className="w-full px-8 flex flex-col space-y-4">
            <Input name="email" type="text" label="Register email" />
            <Button
              onClick={() => {
                setIsCorrectCode(true);
              }}
              type="submit"
            >
              Check Email
            </Button>
          </form>
        )}
        {isCorrectCode && !pendingVerification && (
          <form className="w-full px-8 flex flex-col space-y-4">
            <Input name="Email" type="text" label="Email" />
            <Input name="Username" type="text" label="Username" />
            <Input name="Password" type="password" label="Password" />
            <Input
              name="Confirm Password"
              type="password"
              label="Confirm Password"
            />
            <Button
              onClick={() => {
                setPendingVerification(true);
              }}
            >
              Sign up
            </Button>
          </form>
        )}
        {pendingVerification && (
          <form className="w-full px-8 flex flex-col space-y-4">
            <Input
              name="code"
              type="text"
              label="Entrer le code de validation"
            />
            <Button
              onClick={() => {
                setIsCorrectCode(true);
              }}
              type="submit"
            >
              Check Code
            </Button>
          </form>
        )}
        <p className="my-4">
          Vous avez déja un compte?{" "}
          <Link to="/">
            <span className="inline-block relative cursor-pointer transition-all duration-500 sm:before:content-[''] sm:before:absolute sm:before:-bottom-2 sm:before:left-0 sm:before:w-0 sm:before:h-1.5 sm:before:rounded-full sm:before:opacity-0 sm:before:transition-all sm:before:duration-500 sm:before:bg-gradient-to-r sm:before:from-sky-300 sm:before:via-sky-400 sm:before:to-sky-500 sm:hover:before:w-full sm:hover:before:opacity-100 underline sm:no-underline">
              Sign In
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
}

export default SignUpOne