import React from "react";
import { UserButton, useUser } from "@clerk/clerk-react";

const DashboardPatient = () => {
  const { user } = useUser();

  return (
    <main className="w-full h-screen dark:bg-slate-950 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        {/* Header avec UserButton */}

        {/* Message de bienvenue */}
        <div className="bg-white dark:bg-slate-950 rounded-lg shadow-lg p-6 mb-6">
          <div className="text-center space-y-4">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-slate-100">
              Bienvenue, {user?.username || "Patient"}! 👋
            </h2>
            <p className="text-lg md:text-xl text-gray-600 dark:text-slate-300">
              Nous sommes heureux de vous revoir pour votre consultation
            </p>
          </div>
        </div>
      </div>
    </main>
  );
};

export default DashboardPatient;
