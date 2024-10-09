import { useRoutes } from "../hooks/useRoutes.jsx";
import { useLocation, useNavigate } from "react-router-dom";
import { ThemeContext } from "../context/ThemeContext.jsx";
import { GiMoon } from "react-icons/gi";
import { useContext } from "react";
import { LuSun } from "react-icons/lu";
import { useAuth } from "@clerk/clerk-react";

const Navbar = () => {
  const pathname = useLocation().pathname;
  const routes = useRoutes();
  const { theme, toggleTheme } = useContext(ThemeContext);
  const { signOut } = useAuth(); // Utiliser useAuth pour accéder à la fonction signOut
  const navigate = useNavigate(); // Pour rediriger après la déconnexion

  const handleSignOut = async () => {
    await signOut(); // Déconnexion de Clerk
    navigate("/login"); // Redirection vers la page de login
  };

  return (
    <div className="navbar dark:bg-slate-900 duration-300 ease-in-out dark:text-white fixed row-[1] h-[60px] md:pr-[250px] w-full flex items-center justify-between px-6 shadow ">
      {routes.map(
        (item) =>
          item.path === pathname && (
            <h1 className="text-2xl font-bold" key={item.path}>
              {item.title}
            </h1>
          )
      )}
      <div className="flex items-center">
        <div
          onClick={toggleTheme}
          className="mr-3 size-8 bg-slate-100 dark:bg-slate-950 rounded-full flex items-center justify-center"
        >
          {theme === "light" ? (
            <LuSun className="text-2xl" />
          ) : (
            <GiMoon className="text-2xl" />
          )}
        </div>
        <button
          onClick={handleSignOut}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md"
        >
          Se déconnecter
        </button>
      </div>
    </div>
  );
};

export default Navbar;
