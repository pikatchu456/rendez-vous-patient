import { useRoutes } from "../hooks/useRoutes.jsx";
import { useLocation, useNavigate } from "react-router-dom";
import { ThemeContext } from "../context/ThemeContext.jsx";
import { GiMoon } from "react-icons/gi";
import { useContext, useState } from "react";
import { LuSun } from "react-icons/lu";
import { useAuth } from "@clerk/clerk-react";
import { UserButton } from "@clerk/clerk-react";
import { BsBell } from "react-icons/bs";

const Navbar = () => {
  const pathname = useLocation().pathname;
  const routes = useRoutes();
  const { theme, toggleTheme } = useContext(ThemeContext);
  const { signOut } = useAuth(); // Utiliser useAuth pour accéder à la fonction signOut
  const navigate = useNavigate(); // Pour rediriger après la déconnexion
  const [notification, setNotification] = useState([])

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
        <div className="mr-3">
          <BsBell
            className={`text-2xl ${
              theme === "light" ? "text-gray-800" : "text-white"
            }`}
          />
        </div>
        <UserButton />
        
      </div>
    </div>
  );
};

export default Navbar;
