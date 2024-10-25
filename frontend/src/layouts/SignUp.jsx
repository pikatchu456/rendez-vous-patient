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

const SignUp = () => {
  const { isLoaded, signUp, setActive } = useSignUp();
  const navigate = useNavigate();

  const schema = yup.object().shape({
    email: yup.string().email("Enter a valid email").required("Required"),
    username: yup.string().required("Required"),
    password: yup.string().required("Required"),
    confirmPassword: yup
      .string()
      .oneOf([yup.ref("password"), null], "Passwords must match")
      .required("Please confirm your password"),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    clearErrors,
  } = useForm({
    resolver: yupResolver(schema),
  });

  const [isPending, setIsPending] = useState(false);
  const [createAccount] = useCreateAccountMutation();

  const onSubmit = async (data) => {
    if (!isLoaded) {
      console.error("Clerk is not loaded yet");
      return;
    }

    try {
      setIsPending(true);
      clearErrors(); // Clear any previous errors

      // Step 1: Create the account with Clerk
      let clerkResult;
      try {
        clerkResult = await signUp.create({
          emailAddress: data.email,
          password: data.password,
          username: data.username,
        });
      } catch (clerkError) {
        console.error("Clerk signup error:", clerkError);
        handleClerkError(clerkError, setError);
        return;
      }

      // Verify Clerk result
      if (!clerkResult?.createdUserId) {
        setError("email", {
          message: "Unable to create account. Please try again later.",
        });
        return;
      }

      // Step 2: Create account in your database
      try {
        await createAccount({
          email: data.email,
          username: data.username,
          clerkId: clerkResult.createdUserId,
        }).unwrap();
      } catch (dbError) {
        console.error("Database creation error:", dbError);
        setError("email", {
          message:
            "Error creating account in database. Please try again later.",
        });
        return;
      }

      // Step 3: Set active session
      try {
        await setActive({ session: clerkResult.createdSessionId });
      } catch (sessionError) {
        console.error("Session activation error:", sessionError);
        setError("email", {
          message: "Error activating session. Please try signing in.",
        });
        return;
      }

      // If all steps succeeded, navigate to home
      navigate("/");
    } catch (error) {
      console.error("Generic signup error:", error);
      setError("email", {
        message: "An unexpected error occurred. Please try again later.",
      });
    } finally {
      setIsPending(false);
    }
  };

  // Helper function to handle Clerk-specific errors
  const handleClerkError = (error, setError) => {
    if (error.errors && error.errors.length > 0) {
      const clerkError = error.errors[0];

      switch (clerkError.code) {
        case "form_identifier_exists":
          setError("email", { message: "This email is already registered" });
          break;
        case "form_username_exists":
          setError("username", { message: "This username is already taken" });
          break;
        case "form_password_weak":
          setError("password", {
            message: "Password is too weak. Please use a stronger password",
          });
          break;
        default:
          if (clerkError.meta?.paramName) {
            setError(clerkError.meta.paramName, {
              message: clerkError.message,
            });
          } else {
            setError("email", {
              message: clerkError.message || "Error creating account",
            });
          }
      }
    } else {
      setError("email", {
        message: "Error creating account. Please try again later.",
      });
    }
  };

  if (!isLoaded) {
    return <div>Loading...</div>;
  }

  return (
    <main className="w-full h-screen grid grid-cols-1 sm:grid-cols-2">
      <div className="flex justify-center items-center flex-col sm:px-8">
        <h1 className="text-center font-bold text-2xl py-6 px-8">
          Sign up to create an account
        </h1>

        {!isPending && (
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="w-full px-8 flex flex-col space-y-4"
          >
            <Input
              state={{ ...register("email") }}
              isError={errors?.email}
              errorMessage={errors?.email?.message}
              name="Email"
              type="text"
              label="Email"
            />
            <Input
              state={{ ...register("username") }}
              isError={errors?.username}
              errorMessage={errors?.username?.message}
              name="Username"
              type="text"
              label="Username"
            />
            <Input
              state={{ ...register("password") }}
              isError={errors?.password}
              errorMessage={errors?.password?.message}
              name="Password"
              type="password"
              label="Password"
            />
            <Input
              state={{ ...register("confirmPassword") }}
              isError={errors?.confirmPassword}
              errorMessage={errors?.confirmPassword?.message}
              name="Confirm Password"
              type="password"
              label="Confirm Password"
            />

            <Button type="submit">Sign up</Button>
          </form>
        )}

        {isPending && <p className="mt-4">Your account is being created...</p>}

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

export default SignUp;
