import React from "react";

const TableContainer = ({ children }) => {
  return (
    <div className="w-full max-w-[1280px] bg-white shadow min-h-60 mx-auto rounded-lg">
      {children}
    </div>
  );
};

export default TableContainer;
