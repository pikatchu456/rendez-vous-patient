import React from "react";
import Input from "../components/Input.jsx";
import Button from "../components/Button.jsx";
import { Link, useNavigate } from "react-router-dom";
import { useSignIn } from "@clerk/clerk-react";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form"; // Import de l'API
import { useGetRoleByUsernameOrEmailMutation } from "../redux/slices/compte_login.api.slice.jsx";

const schema = yup.object().shape({
  password: yup.string().required("Champs requis"),
  username: yup.string().required("Champs requis"),
});

const Login = () => {
  const { isLoaded, signIn, setActive } = useSignIn();
  const navigate = useNavigate();
  const [getRoleByUsernameOrEmail] = useGetRoleByUsernameOrEmailMutation();
  const [isLoading, setIsLoading] = React.useState(false);

  if (!isLoaded) {
    return null; // Attendre que Clerk soit chargé
  }

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      const result = await signIn.create({
        identifier: data.username,
        password: data.password,
      });

      if (result.status === "complete") {
        // Attendre 500ms pour éviter les conflits de timing
        await new Promise((resolve) => setTimeout(resolve, 500));

        // Envoyer username et email (si disponible)
        const roleResponse = await getRoleByUsernameOrEmail({
          username: data.username.includes("@") ? null : data.username, // Si c'est un email, ignorer le username
          email: data.username.includes("@") ? data.username : null, // Si c'est un email, envoyer comme email
        }).unwrap();

        const { role } = roleResponse;
        localStorage.setItem("userRole", role);
        const redirectToAppropriatePage = (role) => {
          if (role === "PATIENT") {
            return "/consultation1";
          } else if (role === "DENTISTE" || role === "DENTISTE_INTERVENANT") {
            return "/dashboard";
          }
        };

        // Exemple d'utilisation
        navigate(redirectToAppropriatePage(role));
        window.location.reload();
      }
    } catch (err) {
      if (err?.data?.message) {
        console.error("Erreur API:", err.data.message);
      }
      setError("username", {
        message: "Erreur d'authentification ou rôle introuvable",
      });
    } finally {
      setIsLoading(false);
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
            label="Nom d'utilisateur ou Email"
          />
          <Input
            state={{ ...register("password") }}
            isError={errors?.password}
            errorMessage={errors?.password?.message}
            name="password"
            type="password"
            label="Mot de passe"
          />
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Connexion en cours..." : "Se connecter"}
          </Button>
        </form>
        <p className="my-4">
          Vous n'avez pas de compte ?{" "}
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
