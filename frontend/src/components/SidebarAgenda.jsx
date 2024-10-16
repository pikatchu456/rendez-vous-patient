import React, { useState } from "react";

const SidebarAgenda = ({ show, onHide }) => {
  const [formData, setFormData] = useState({
    date_service: "",
    heures_debut: "",
    heures_fin: "",
    dentiste_nom: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: Handle form submission (e.g., send data to API)
    console.log("Form submitted:", formData);
    onHide(); // Close the sidebar after submission
  };

  return (
    <div
      className={`absolute top-0 right-0 w-[300px] h-full bg-white shadow-lg transition-transform duration-300 ease-in-out transform ${
        show ? "translate-x-0" : "translate-x-full"
      } z-[1000]`}
    >
      <div className="h-full p-5">
        <div className="flex justify-between items-center mb-5">
          <h3 className="text-xl font-semibold">Add Event</h3>
          <button
            className="text-gray-500 hover:text-gray-700"
            onClick={onHide}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
        {/* Ajoutez ici le contenu de votre formulaire d'ajout d'événement */}
        <div className="mt-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="date_service"
                className="block text-sm font-medium text-gray-700"
              >
                Date de service
              </label>
              <input
                type="date"
                id="date_service"
                name="date_service"
                value={formData.date_service}
                onChange={handleChange}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
            <div>
              <label
                htmlFor="heures_debut"
                className="block text-sm font-medium text-gray-700"
              >
                Heure du début
              </label>
              <input
                type="time"
                id="heures_debut"
                name="heures_debut"
                value={formData.heures_debut}
                onChange={handleChange}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
            <div>
              <label
                htmlFor="heures_fin"
                className="block text-sm font-medium text-gray-700"
              >
                Heure de fin
              </label>
              <input
                type="time"
                id="heures_fin"
                name="heures_fin"
                value={formData.heures_fin}
                onChange={handleChange}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
            <div>
              <label
                htmlFor="dentiste_nom"
                className="block text-sm font-medium text-gray-700"
              >
                Nom complet du dentiste
              </label>
              <input
                type="text"
                id="dentiste_nom"
                name="dentiste_nom"
                value={formData.dentiste_nom}
                onChange={handleChange}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
            <div className="pt-4">
              <button
                type="submit"
                className="w-full bg-blue-600 text-white hover:bg-blue-700 rounded-md px-4 py-2 transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
              >
                Ajout
              </button>
            </div>
          </form>
        </div>
        {/* Ajoutez d'autres champs de formulaire selon vos besoins */}
      </div>
    </div>
  );
};

export default SidebarAgenda;
