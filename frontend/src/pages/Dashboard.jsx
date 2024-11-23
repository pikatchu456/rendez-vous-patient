import React, { useMemo } from "react";
import {
  FaUserInjured,
  FaUserMd,
  FaCalendarCheck,
  FaUserTag,
} from "react-icons/fa";
import useQuery from "../hooks/useQuery";
import Loader from "../components/Loader/Loader";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

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

  const userRole = localStorage.getItem("userRole");

  const formatRole = (role) => {
    switch (role) {
      case "DENTISTE":
        return "Dentiste";
      case "DENTISTE_INTERVENANT":
        return "Dentiste Intervenant";
      case "PATIENT":
        return "Patient";
      default:
        return role;
    }
  };

  // Préparer les données pour le graphique
  const consultationStats = useMemo(() => {
    if (!consultationsData) return [];

    const monthNames = [
      "Janvier",
      "Février",
      "Mars",
      "Avril",
      "Mai",
      "Juin",
      "Juillet",
      "Août",
      "Septembre",
      "Octobre",
      "Novembre",
      "Décembre",
    ];

    const stats = {};
    consultationsData.forEach((consultation) => {
      const date = new Date(consultation.date_consultation);
      const monthYear = `${monthNames[date.getMonth()]} ${date.getFullYear()}`;

      stats[monthYear] = (stats[monthYear] || 0) + 1;
    });

    return Object.entries(stats).map(([month, count]) => ({
      month,
      consultations: count,
    }));
  }, [consultationsData]);

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
    <main className="w-full min-h-screen dark:bg-slate-950 bg-gray-50 flex flex-col items-center p-4 sm:p-8">
      {/* User Role Banner */}
      <div className="w-full max-w-4xl mb-8 bg-white dark:bg-slate-800 rounded-lg shadow-md p-4">
        <div className="flex items-center justify-center space-x-4">
          <FaUserTag className="text-3xl text-blue-500" />
          <div className="text-center">
            <h2 className="text-lg font-medium text-gray-600 dark:text-gray-300">
              Connecté en tant que
            </h2>
            <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {formatRole(userRole)}
            </p>
          </div>
        </div>
      </div>

      <h1 className="font-bold text-2xl sm:text-3xl md:text-4xl text-center mb-6 dark:text-white">
        Tableau de Bord
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 md:gap-8 w-full max-w-4xl mb-8">
        <div className="bg-blue-500 text-white p-6 rounded-md shadow-md flex flex-col items-center">
          <FaUserInjured className="text-5xl mb-4" />
          <h2 className="text-lg sm:text-xl font-semibold">
            Nombre de Patients
          </h2>
          <p className="text-3xl sm:text-4xl font-bold mt-4">{patientCount}</p>
        </div>

        <div className="bg-green-500 text-white p-6 rounded-md shadow-md flex flex-col items-center">
          <FaUserMd className="text-5xl mb-4" />
          <h2 className="text-lg sm:text-xl font-semibold">
            Nombre de Dentistes
          </h2>
          <p className="text-3xl sm:text-4xl font-bold mt-4">{dentistCount}</p>
        </div>

        <div className="bg-purple-500 text-white p-6 rounded-md shadow-md flex flex-col items-center">
          <FaCalendarCheck className="text-5xl mb-4" />
          <h2 className="text-lg sm:text-xl font-semibold">
            Nombre de Consultations
          </h2>
          <p className="text-3xl sm:text-4xl font-bold mt-4">
            {consultationCount}
          </p>
        </div>
      </div>

      {/* Graphique des consultations */}
      <div className="w-full max-w-4xl bg-white dark:bg-slate-800 rounded-lg shadow-md p-4 mb-8">
        <h2 className="text-xl font-bold mb-4 text-center dark:text-white">
          Évolution des Consultations par Mois
        </h2>
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={consultationStats}
              margin={{
                top: 20,
                right: 30,
                left: 20,
                bottom: 60,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="month"
                angle={-45}
                textAnchor="end"
                height={60}
                interval={0}
                tick={{ fill: userRole === "PATIENT" ? "#ffffff" : "#000000" }}
              />
              <YAxis
                tick={{ fill: userRole === "PATIENT" ? "#ffffff" : "#000000" }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor:
                    userRole === "PATIENT" ? "#1f2937" : "#ffffff",
                  color: userRole === "PATIENT" ? "#ffffff" : "#000000",
                }}
              />
              <Legend />
              <Bar
                dataKey="consultations"
                name="Nombre de consultations"
                fill="#8884d8"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </main>
  );
};

export default Dashboard;
