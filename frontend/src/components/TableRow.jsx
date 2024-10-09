import React from "react";
import clsx from "clsx";

const TableRow = ({ children, col, bg }) => {
  return (
    <div
      className={clsx(
        "w-full grid p-2",
        col ? col : "grid-cols-1",
        bg ? bg : "bg-white"
      )}
    >
      {children}
    </div>
  );
};

export default TableRow;
