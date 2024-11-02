import React from "react";
import { FaUserInjured, FaUserMd, FaCalendarCheck } from "react-icons/fa"; // Importation des icônes
import useQuery from "../hooks/useQuery";
import Loader from "../components/Loader/Loader";

const Dashboard = () => {
  const {
    data: patientsData,
    loading: loadingPatients,
    error: errorPatients,
  } = useQuery("/api/patient");

  const {
    data: dentistsData,
    loading: loadingDentists,
    error: errorDentists,
  } = useQuery("/api/dentiste");

  const {
    data: consultationsData,
    loading: loadingConsultations,
    error: errorConsultations,
  } = useQuery("/api/consultation");

  // Calcul du nombre total de patients, de dentistes et de consultations
  const patientCount = patientsData ? patientsData.length : 0;
  const dentistCount = dentistsData ? dentistsData.length : 0;
  const consultationCount = consultationsData ? consultationsData.length : 0;

  if (loadingPatients || loadingDentists || loadingConsultations) {
    return <Loader />;
  }

  if (errorPatients || errorDentists || errorConsultations) {
    return (
      <div className="w-full h-80 flex items-center justify-center">
        <h1 className="text-4xl font-semibold text-rose-500">
          Il y a une erreur quelque part
        </h1>
      </div>
    );
  }

  return (
    <main className="w-full h-screen dark:bg-slate-950 bg-gray-50 flex flex-col items-center justify-center px-4 sm:px-8">
      <h1 className="font-bold text-2xl sm:text-3xl md:text-4xl text-center mb-6">
        Tableau de Bord
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 md:gap-8 w-full max-w-4xl">
        <div className="bg-blue-500 text-white p-6 rounded-md shadow-md flex flex-col items-center">
          <FaUserInjured className="text-5xl mb-4" /> {/* Icône de patient */}
          <h2 className="text-lg sm:text-xl font-semibold">
            Nombre de Patients
          </h2>
          <p className="text-3xl sm:text-4xl font-bold mt-4">{patientCount}</p>
        </div>
        <div className="bg-green-500 text-white p-6 rounded-md shadow-md flex flex-col items-center">
          <FaUserMd className="text-5xl mb-4" /> {/* Icône de dentiste */}
          <h2 className="text-lg sm:text-xl font-semibold">
            Nombre de Dentistes
          </h2>
          <p className="text-3xl sm:text-4xl font-bold mt-4">{dentistCount}</p>
        </div>
        <div className="bg-purple-500 text-white p-6 rounded-md shadow-md flex flex-col items-center">
          <FaCalendarCheck className="text-5xl mb-4" />{" "}
          {/* Icône de consultation */}
          <h2 className="text-lg sm:text-xl font-semibold">
            Nombre de Consultations
          </h2>
          <p className="text-3xl sm:text-4xl font-bold mt-4">
            {consultationCount}
          </p>
        </div>
      </div>
    </main>
  );
};

export default Dashboard;
