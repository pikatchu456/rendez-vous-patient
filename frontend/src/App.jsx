import React from "react";
import Login from "./layouts/Login.jsx";
import { Route, Routes } from "react-router-dom";
import SignUpOne from "./layouts/SignUpOne.jsx";
import AdminLayout from "./layouts/AdminLayout.jsx";

const App = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<SignUpOne />} />
      </Routes>
    </>
  );
};

export default App;
