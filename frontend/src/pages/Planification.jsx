import React, { useState } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { Plus, X } from "lucide-react";

const localizer = momentLocalizer(moment);

const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        {children}
      </div>
    </div>
  );
};

const EventForm = ({ onClose, onAddEvent }) => {
  const [date, setDate] = useState("");
  const [starTime, setStarTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [name, setName] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();

    const newEvent = {
      id: Math.random(),
      start: moment(date)
        .set({ hour: starTime.split(":")[0], minute: starTime.split(":")[1] })
        .toDate(),
      end: moment(date)
        .set({ hour: endTime.split(":")[0], minute: endTime.split(":")[1] })
        .toDate(),
      title: name,
    };

    onAddEvent(newEvent);
    onClose(); // Fermer le modal après l'ajout
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-5">
        <h3 className="text-xl font-semibold">Ajouter un événement</h3>
        <button className="text-gray-500 hover:text-gray-700" onClick={onClose}>
          <X className="h-6 w-6" />
        </button>
      </div>
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
            value={date}
            onChange={(e) => setDate(e.target.value)}
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
            value={starTime}
            onChange={(e) => setStarTime(e.target.value)}
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
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
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
            value={name}
            onChange={(e) => setName(e.target.value)}
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
  );
};

export default function Planification() {
  const [showModal, setShowModal] = useState(false);
  const [events, setEvents] = useState([]);

  const toggleModal = () => {
    setShowModal(!showModal);
  };

  const handleAddEvent = (newEvent) => {
    setEvents((prevEvents) => [...prevEvents, newEvent]);
  };

  return (
    <div className="p-4 md:p-6 space-y-4 md:space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
        <h1 className="text-2xl font-bold text-foreground">Planning</h1>
        <button
          onClick={() => {
            toggleModal();
          }}
          className="bg-blue-600 text-white hover:bg-blue-700 rounded-full px-4 py-2 flex items-center transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
        >
          <Plus className="mr-2 h-4 w-4" /> Ajouter un événement
        </button>
      </div>
      <div className="rounded-lg shadow-md overflow-hidden border border-gray-200">
        <Calendar
          localizer={localizer}
          startAccessor="start"
          events={events}
          endAccessor="end"
          style={{ height: "calc(100vh - 180px)" }}
          className="bg-white text-gray-800 p-4"
        />
      </div>
      <Modal isOpen={showModal} onClose={toggleModal}>
        <EventForm onClose={toggleModal} onAddEvent={handleAddEvent} />
      </Modal>
    </div>
  );
}
