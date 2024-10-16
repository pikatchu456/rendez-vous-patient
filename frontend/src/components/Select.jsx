import React from "react";
import clsx from "clsx";

const Select = ({ name, label, options, isError, errorMessage, state }) => {
  const optionValues = options.map((option) => option.value);

  return (
    <div>
      <label
        htmlFor={name}
        className="block text-sm font-semibold leading-6 text-gray-900"
      >
        {label}
      </label>
      <div className="mt-2.5">
        <select
          id={name}
          name={name}
          {...state}
          className={clsx(
            "block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6",
            isError
              ? "border-rose-500 focus:ring-rose-600"
              : "focus:ring-indigo-600"
          )}
        >
          <option value="" disabled>
            Sélectionnez une option
          </option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
      {isError && <p className="text-rose-500 text-sm">{errorMessage}</p>}
    </div>
  );
};

export default Select;
