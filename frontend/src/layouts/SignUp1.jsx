import React, { useState } from "react";
import Input from "../components/Input.jsx";
import Button from "../components/Button.jsx";
import { Link } from "react-router-dom";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { useSignUp } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";
import { useCreateAccountMutation } from "../redux/slices/compte_patient.api.slice.jsx";

const SignUp1 = () => {
  const { isLoaded, signUp, setActive } = useSignUp();
  const navigate = useNavigate();
  const [pendingVerification, setPendingVerification] = useState(false);
  const [createAccount] = useCreateAccountMutation();

  if (!isLoaded) {
    return null;
  }

  // Schema for initial signup form
  const schemaSignUp = yup.object().shape({
    email: yup.string().email("Enter a valid email").required("Required"),
    username: yup.string().required("Required"),
    password: yup
      .string()
      .min(8, "Password should be at least 8 characters long")
      .required("Required"),
    confirmPassword: yup
      .string()
      .oneOf([yup.ref("password"), null], "Passwords must match")
      .required("Please confirm your password"),
  });

  // Schema for verification code
  const schemaValidation = yup.object().shape({
    code: yup.string().required("Verification code is required"),
  });

  // Form handling for signup
  const {
    register: registerSignup,
    handleSubmit: handleSubmitSignup,
    formState: { errors: errorsSignup },
    setError: setErrorSignup,
    getValues: getValuesSignUp,
  } = useForm({
    resolver: yupResolver(schemaSignUp),
  });

  // Form handling for verification
  const {
    register: registerValidation,
    handleSubmit: handleSubmitValidation,
    formState: { errors: errorsValidation },
    setError: setErrorValidation,
  } = useForm({
    resolver: yupResolver(schemaValidation),
  });

  // Handle initial signup
  const onSubmitSignUp = async (data) => {
    try {
      // Create the signup
      await signUp.create({
        emailAddress: data.email,
        password: data.password,
        username: data.username,
      });

      // Send the verification email
      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });

      // Switch to verification UI
      setPendingVerification(true);
    } catch (err) {
      const error = err.errors[0];
      if (!error) return;

      const paramName = error.meta?.paramName;
      if (paramName === "email_address") {
        setErrorSignup("email", { message: error.message });
      }
      if (paramName === "username") {
        setErrorSignup("username", { message: error.message });
      }
      if (paramName === "password") {
        setErrorSignup("password", { message: error.message });
      }
    }
  };

  // Handle verification code submission
  const onSubmitValidation = async (data) => {
    try {
      const completeSignUp = await signUp.attemptEmailAddressVerification({
        code: data.code,
      });

      if (completeSignUp.status !== "complete") {
        console.log(JSON.stringify(completeSignUp, null, 2));
        return;
      }

      // Create account in your database
      await createAccount({
        clerkId: completeSignUp.createdUserId,
        email: getValuesSignUp("email"),
        username: getValuesSignUp("username"),
      }).unwrap();

      // Set active session
      await setActive({ session: completeSignUp.createdSessionId });

      // Redirect to home
      navigate("/");
    } catch (err) {
      const error = err.errors?.[0];
      if (error) {
        setErrorValidation("code", { message: error.message });
      }
    }
  };

  return (
    <main className="w-full h-screen grid grid-cols-1 sm:grid-cols-2">
      <div className="flex justify-center items-center flex-col sm:px-8">
        <h1 className="text-center font-bold text-2xl py-6 px-8">
          Sign up to create an account
        </h1>

        {!pendingVerification ? (
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

            <Button type="submit">Sign up</Button>
          </form>
        ) : (
          <form
            onSubmit={handleSubmitValidation(onSubmitValidation)}
            className="w-full px-8 flex flex-col space-y-4"
          >
            <Input
              state={{ ...registerValidation("code") }}
              isError={errorsValidation?.code}
              errorMessage={errorsValidation?.code?.message}
              name="code"
              type="text"
              label="Verification Code"
            />

            <Button type="submit">Verify Email</Button>
          </form>
        )}

        <p className="my-4">
          Already have an account?{" "}
          <Link to="/">
            <span className="inline-block relative cursor-pointer transition-all duration-500 sm:before:content-[''] sm:before:absolute sm:before:-bottom-2 sm:before:left-0 sm:before:w-0 sm:before:h-1.5 sm:before:rounded-full sm:before:opacity-0 sm:before:transition-all sm:before:duration-500 sm:before:bg-gradient-to-r sm:before:from-sky-300 sm:before:via-sky-400 sm:before:to-sky-500 sm:hover:before:w-full sm:hover:before:opacity-100 underline sm:no-underline">
              Sign in
            </span>
          </Link>
        </p>
        <p className="my-4">
          Are you a dentist?{" "}
          <Link to="/signup1">
            <span className="inline-block relative cursor-pointer transition-all duration-500 sm:before:content-[''] sm:before:absolute sm:before:-bottom-2 sm:before:left-0 sm:before:w-0 sm:before:h-1.5 sm:before:rounded-full sm:before:opacity-0 sm:before:transition-all sm:before:duration-500 sm:before:bg-gradient-to-r sm:before:from-sky-300 sm:before:via-sky-400 sm:before:to-sky-500 sm:hover:before:w-full sm:hover:before:opacity-100 underline sm:no-underline">
              Sign up as a dentist
            </span>
          </Link>
        </p>
      </div>
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

export default SignUp1;
