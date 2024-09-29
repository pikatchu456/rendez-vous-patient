import React from "react";

const Button = ({ children, onClick, type }) => {
  const func = () => {
    if (onClick) {
      onClick();
    }
  }
  return (
    <button
      type={type}
      onClick={func}
      className="block w-full rounded-md bg-sky-300 px-3.5 py-2.5 text-center text-sm font-semibold text-white shadow-md hover:bg-sky-400 hover:shadow-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-300 transition-all duration-300"
    >
      {children}
    </button>
  );
};

export default Button;
