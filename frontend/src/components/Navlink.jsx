import React from "react";
import clsx from "clsx";
import { Link } from "react-router-dom";
const Navlink = ({ icon: Icon, title, active, path }) => {
  return (
    <Link to={path} className="">
      <div
        className={clsx(
          "w-full py-2 dark:text-slate-100 flex items-center space-x-4",
          active ? "font-bold " : "text-slate-950"
        )}
      >
        <Icon className="text-3xl md:text-xl" />
        <p className="hidden md:block ">{title}</p>
      </div>
    </Link>
  );
};

export default Navlink;
