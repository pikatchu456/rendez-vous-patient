import React from "react";

const TableContainer = ({ children }) => {
  return (
    <div className="w-full max-w-[1280px] bg-white dark:bg-slate-900 shadow min-h-60 mx-auto rounded-lg">
      {children}
    </div>
  );
};

export default TableContainer;
