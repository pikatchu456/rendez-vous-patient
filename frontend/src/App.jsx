import React from "react";
import { Route, Routes } from "react-router-dom";
import {
  ClerkLoaded,
  ClerkLoading,
  SignedIn,
  SignedOut,
} from "@clerk/clerk-react";
import Login from "./layouts/Login.jsx";
import SignUpOne from "./layouts/SignUpOne.jsx";
import AdminLayout from "./layouts/AdminLayout.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Message from "./pages/Message.jsx";
import Planification from "./pages/Planification.jsx";
import Consultation from "./pages/Consultation.jsx";
import Dentiste from "./pages/Dentiste.jsx";
import Patient from "./pages/Patient.jsx";
import Loader from "./components/Loader/Loader.jsx";
import SignUp from "./layouts/SignUp.jsx";
import ConsultationAdmin from "./pages/ConsultationAdmin.jsx";
import PlanificationAdmin from "./pages/PlanificationAdmin.jsx";

const App = () => {
  return (
    <>
      <ClerkLoading>
        <Loader />
      </ClerkLoading>
      <ClerkLoaded>
        <SignedIn>
          <Routes>
            <Route path="/" element={<AdminLayout />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/message" element={<Message />} />
              <Route path="/dentiste" element={<Dentiste />} />
              <Route path="/patient" element={<Patient />} />
              <Route path="/planification" element={<Planification />} />
              <Route path="/planification1" element={<PlanificationAdmin />} />
              <Route path="/consultation" element={<Consultation />} />
              <Route path="/consultation1" element={<ConsultationAdmin />} />
            </Route>
          </Routes>
        </SignedIn>
        <SignedOut>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/signup1" element={<SignUpOne />} />
          </Routes>{" "}
        </SignedOut>
      </ClerkLoaded>
    </>
  );
};

export default App;
