import Navlink from "./Navlink.jsx";
import { useRoutes } from "../hooks/useRoutes.jsx";

const Sidebar = () => {
  const routes = useRoutes();
  const userRole = localStorage.getItem("userRole");

  // Filtre les routes en fonction du rôle
  const filteredRoutes = routes.filter((route) => {
    if (userRole === "PATIENT") {
      // Patient voit dashboard1 et consultation
      return route.roles.includes("PATIENT");
    } else if (userRole === "DENTISTE" || userRole === "DENTISTE_INTERVENANT") {
      // Dentistes voient tout sauf dashboard1
      return route.roles.includes(userRole) && route.path !== "/dashboard1";
    }
    return false;
  });

  return (
    <div className="sidebar bg-gray-100 duration-300 ease-in-out dark:bg-slate-900 px-8 bottom-0 fixed w-full md:w-[250px] h-16 md:h-screen md:col-[1]">
      <div className="text-xl dark:text-slate-100 hidden md:block font-semibold mt-8">
        RENDEZ-VOUS
      </div>
      <div className="flex md:flex-col items-center pt-2 justify-between md:justify-normal md:items-start space-y-1 md:mt-8">
        {filteredRoutes.map((item, index) => (
          <Navlink
            key={index}
            path={item.path}
            active={item.active}
            title={item.title}
            icon={item.icon}
          />
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
