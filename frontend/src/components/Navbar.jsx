import { useRoutes } from "../hooks/useRoutes.jsx";
import { useLocation } from "react-router-dom";
import { ThemeContext } from "../context/ThemeContext.jsx";
import { GiMoon } from "react-icons/gi";
import { useContext } from "react";
import { LuSun } from "react-icons/lu";

const Navbar = () => {
  const pathname = useLocation().pathname;
  const routes = useRoutes();

  const { Theme, toggleTheme } = useContext(ThemeContext);
  return (
    <div className="navbar dark:bg-slate-900 duration-300 ease-in-out dark:text-white fixed row-[1] h-[60px] md:pr-[250px] w-full flex items-center justify-between px-6 shadow ">
      {routes.map(
        (item) =>
          item.path === pathname && (
            <h1 className="text-2xl font-bold">{item.title}</h1>
          )
      )}
      <div
        onClick={toggleTheme}
        className="mr-3 size-8 bg-slate-100 dark:bg-slate-950 rounded-full flex items-center justify-center"
      >
        {theme === "light" ? (
          <GiMoon className="text-2xl" />
        ) : (
          <LuSun className="text-2xl" />
        )}
      </div>
    </div>
  );
};

export default Navbar;
