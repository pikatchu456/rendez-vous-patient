import React, { useState } from "react";
import Input from "../components/Input.jsx";
import Button from "../components/Button.jsx";
import { Link } from "react-router-dom";

import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { SignUp } from "@clerk/clerk-react";
import { useCheckEmailMutation } from "../redux/slices/patient.api.slice.jsx";


const SignUpOne = () => {
  const schema = yup.object().shape({
    email: yup.string().email("Email invalide").required("Champs requis"),
    password: yup.string().required("Champs requis"),
    confirm_password: yup
      .string()
      .oneOf(
        [yup.ref("password"), null],
        "Les mots de passe doivent correspondre"
      )
      .required("Champs requis"),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) });

  const [checkEmail, { isLoading }] = useCheckEmailMutation();

  const onSubmit = async (data) => {
    try {
      const response = await checkEmail({ email: data.email }).unwrap();
      console.log("Success:", response);
    } catch (error) {
      console.error("Failed:", error);
    }
  };

  return (
    <main className="w-full h-screen grid grid-cols-1 sm:grid-cols-2">
      {/* Formulaire principal */}
      <div className="flex justify-center items-center flex-col sm:px-8">
        <h1 className="text-center font-bold text-2xl py-6">Sign Up</h1>
        <h2 className="text-center mb-8">Remplir le formulaire</h2>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="w-full px-8 flex flex-col space-y-4"
        >
          <Input
            error={errors.email?.message}
            {...register("email")}
            name="email"
            type="email"
            label="Register email"
          />

          <Input
            {...register("password")}
            name="password"
            type="password"
            label="Mot de passe"
            error={errors.password?.message}
          />
          <Input
            {...register("confirm_password")}
            name="confirm_password"
            type="password"
            label="Confirmer le mot de passe"
            error={errors.confirm_password?.message}
          />
          <Button type="submit">Sign Up</Button>
        </form>
      </div>
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

export default SignUpOne;

