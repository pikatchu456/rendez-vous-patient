import React from "react";
import { CheckCircle } from "lucide-react";

const Success = ({ onClick, message = "Success" }) => {
  return (
    <button
      className="inline-flex items-center justify-center px-6 py-3 text-sm font-medium text-white transition-all duration-300 bg-gradient-to-r from-green-400 to-blue-500 rounded-full hover:from-green-500 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-400"
      type="button"
      onClick={onClick}
      aria-label={message}
    >
      <CheckCircle className="w-5 h-5 mr-2" aria-hidden="true" />
      <span className="font-bold">{message}</span>
    </button>
  );
};

export default Success;
