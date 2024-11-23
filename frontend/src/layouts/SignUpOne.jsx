import React, { useState } from "react";
import Input from "../components/Input.jsx";
import Button from "../components/Button.jsx";
import { Link } from "react-router-dom";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { useCheckCodeMutation } from "../redux/slices/dentiste.api.slice.jsx";
import { useSignUp } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";
import { useCreateAccountMutation } from "../redux/slices/compte.api.slice.jsx";

const SignUpOne = () => {
  const { isLoaded, signUp, setActive } = useSignUp();

  if (!isLoaded) {
    return null;
  }

  const navigate = useNavigate();

  const schema = yup.object().shape({
    code: yup.string().required("required"),
  });

  const schemaValidation = yup.object().shape({
    code: yup.string().required("required"),
  });

  const schemaSignUp = yup.object().shape({
    password: yup.string().required("Required"),
    username: yup.string().required("Required"),
    email: yup.string().email("Enter a valid email").required("Required"),
    confirmPassword: yup
      .string()
      .oneOf([yup.ref("password"), null])
      .required("Veuiller confirmer le mot de passe"),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    getValues,
  } = useForm({
    resolver: yupResolver(schema),
  });

  const {
    register: registerSignup,
    handleSubmit: handleSubmitSignup,
    formState: { errors: errorsSignup },
    setError: setErrorsSignup,
    getValues: getValuesSignUp,
  } = useForm({
    resolver: yupResolver(schemaSignUp),
  });

  const {
    register: registerValidation,
    handleSubmit: handleSubmitValidation,
    formState: { errors: errorsValidation },
    setError: setErrorsValidation,
  } = useForm({
    resolver: yupResolver(schemaValidation),
  });
  const [isCorrectCode, setIsCorrectCode] = useState(false);
  const [pendingVerification, setPendingVerification] = useState(false);
  const [checkCode, { isLoading }] = useCheckCodeMutation();

  const [createAccount, { isLoading: isCreatingAccount }] =
    useCreateAccountMutation();
  const onSubmit = async (data) => {
    try {
      const res = await checkCode(data).unwrap();
      setIsCorrectCode(true);
    } catch (error) {
      setError("code", { message: error.data.message });
    }
  };

  const onSubmitSignUp = async (data) => {
    try {
      await signUp.create({
        emailAddress: data.email,
        password: data.password,
        username: data.username,
      });

      // send the email.
      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });

      // change the UI to our pending section.
      setPendingVerification(true);
    } catch (err) {
      const error = err.errors[0];
      const paramName = error.meta.paramName;
      if (paramName === "email_address") {
        setErrorsSignUp("email", { message: error.message });
      }
      if (paramName === "username") {
        setErrorsSignUp("username", { message: error.message });
      }
      if (paramName === "password") {
        setErrorsSignUp("password", { message: error.message });
      }
    }
  };

  const onSubmitValidation = async (data) => {
    try {
      await signUp.attemptEmailAddressVerification({ code: data.code });
      const clerkId = signUp.createdUserId;
      await createAccount({
        clerkId,
        email: getValuesSignUp("email"),
        username: getValuesSignUp("username"),
        numIns: getValues("code"),
      }).unwrap();

      navigate("/consultation1");
      window.location.reload();
    } catch (err) {
      setError("code", {
        message: err.errors?.[0]?.message || "Error occurred",
      });
    }
  };

  return (
    <main className="w-full h-screen grid grid-cols-1 sm:grid-cols-2">
      {/* Section du formulaire à gauche */}
      <div className="flex justify-center items-center flex-col sm:px-8">
        <h1 className="text-center font-bold text-2xl py-6 px-8">
          Sign up to create an account Dentist
        </h1>
        <h1 className="text-center mb-8">Enter your Num d'inscription</h1>
        {!isCorrectCode && (
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="w-full px-8 flex flex-col space-y-4"
          >
            <Input
              state={{ ...register("code") }}
              isError={errors?.code}
              errorMessage={errors?.code?.message}
              name="numIns"
              type="text"
              label="Numéro d'inscription"
            />

            <Button type="submit">
              {" "}
              {isLoading
                ? "Checking num d'inscription ..."
                : "Check num d'inscription"}
            </Button>
          </form>
        )}

        {isCorrectCode && !pendingVerification && (
          <form
            onSubmit={handleSubmitSignup(onSubmitSignUp)}
            className="w-full px-8 flex flex-col space-y-4"
          >
            <Input
              state={{ ...registerSignup("email") }}
              isError={errorsSignup?.email}
              errorMessage={errorsSignup?.email?.message}
              name="Email"
              type="text"
              label="Email"
            />
            <Input
              state={{ ...registerSignup("username") }}
              isError={errorsSignup?.username}
              errorMessage={errorsSignup?.username?.message}
              name="Username"
              type="text"
              label="Username"
            />
            <Input
              state={{ ...registerSignup("password") }}
              isError={errorsSignup?.password}
              errorMessage={errorsSignup?.password?.message}
              name="Password"
              type="password"
              label="Password"
            />
            <Input
              state={{ ...registerSignup("confirmPassword") }}
              isError={errorsSignup?.confirmPassword}
              errorMessage={errorsSignup?.confirmPassword?.message}
              name="Confirm Password"
              type="password"
              label="Confirm Password"
            />

            <Button>Sign up</Button>
          </form>
        )}

        {pendingVerification && (
          <form
            onSubmit={handleSubmitValidation(onSubmitValidation)}
            className="w-full px-8 flex flex-col space-y-4"
          >
            <Input
              state={{ ...registerValidation("code") }}
              errorMessage={errorsValidation?.code?.message}
              isError={errorsValidation?.code}
              name="code"
              type="text"
              label="Register number an Email"
            />

            <Button>{isLoading ? "Checking code ..." : "Check code"}</Button>
          </form>
        )}
        <p className="my-4">
          You already have an account? {"   "}
          <Link to="/">
            <span className="inline-block relative cursor-pointer transition-all duration-500 sm:before:content-[''] sm:before:absolute sm:before:-bottom-2 sm:before:left-0 sm:before:w-0 sm:before:h-1.5 sm:before:rounded-full sm:before:opacity-0 sm:before:transition-all sm:before:duration-500 sm:before:bg-gradient-to-r sm:before:from-sky-300 sm:before:via-sky-400 sm:before:to-sky-500 sm:hover:before:w-full sm:hover:before:opacity-100 underline sm:no-underline">
              Sign in
            </span>
          </Link>
        </p>
      </div>
      {/* Section de l'image à droite */}
      <div className="h-full hidden sm:block">
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
