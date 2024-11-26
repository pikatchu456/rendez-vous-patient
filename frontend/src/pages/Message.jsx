import React, { useState, useEffect } from "react";
import { Send, Search } from "lucide-react";

const Message = () => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [selectedDentist, setSelectedDentist] = useState(null);
  const [dentists, setDentists] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const userRole = localStorage.getItem("userRole");

  // Simuler le chargement des dentistes (à remplacer par votre API)
  useEffect(() => {
    const fetchDentists = async () => {
      try {
        const response = await fetch("/api/dentiste");
        const data = await response.json();
        setDentists(data);
      } catch (error) {
        console.error("Erreur lors du chargement des dentistes:", error);
      }
    };

    fetchDentists();
  }, []);

  const filteredDentists = dentists.filter(
    (dentist) =>
      dentist.nom?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dentist.prenom?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSendMessage = () => {
    if (newMessage.trim() && selectedDentist) {
      const message = {
        id: Date.now(),
        text: newMessage,
        sender: userRole,
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, message]);
      setNewMessage("");
    }
  };

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-slate-900">
      {/* Liste des dentistes */}
      <div className="w-1/4 bg-white dark:bg-slate-800 border-r dark:border-slate-700">
        <div className="p-4 border-b dark:border-slate-700">
          <div className="relative">
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={20}
            />
            <input
              type="text"
              placeholder="Rechercher un dentiste..."
              className="w-full pl-10 pr-4 py-2 rounded-lg bg-gray-100 dark:bg-slate-700 focus:outline-none dark:text-white"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        <div className="overflow-y-auto h-full">
          {filteredDentists.map((dentist) => (
            <div
              key={dentist.id_dentiste}
              onClick={() => setSelectedDentist(dentist)}
              className={`flex items-center p-4 hover:bg-gray-100 dark:hover:bg-slate-700 cursor-pointer ${
                selectedDentist?.id_dentiste === dentist.id_dentiste
                  ? "bg-blue-50 dark:bg-slate-700"
                  : ""
              }`}
            >
              <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold">
                {dentist.prenom?.[0]}
                {dentist.nom?.[0]}
              </div>
              <div className="ml-4">
                <p className="font-semibold dark:text-white">
                  Dr. {dentist.prenom} {dentist.nom}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {dentist.specialite || "Dentiste"}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Zone de chat */}
      <div className="flex-1 flex flex-col">
        {selectedDentist ? (
          <>
            {/* En-tête du chat */}
            <div className="p-4 bg-white dark:bg-slate-800 border-b dark:border-slate-700">
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold">
                  {selectedDentist.prenom?.[0]}
                  {selectedDentist.nom?.[0]}
                </div>
                <div className="ml-4">
                  <p className="font-semibold dark:text-white">
                    Dr. {selectedDentist.prenom} {selectedDentist.nom}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {selectedDentist.specialite || "Dentiste"}
                  </p>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 dark:bg-slate-900">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${
                    message.sender === userRole
                      ? "justify-end"
                      : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[70%] rounded-lg p-3 ${
                      message.sender === userRole
                        ? "bg-blue-500 text-white"
                        : "bg-white dark:bg-slate-800 dark:text-white"
                    }`}
                  >
                    <p>{message.text}</p>
                    <p className="text-xs mt-1 opacity-70">
                      {new Date(message.timestamp).toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Zone de saisie */}
            <div className="p-4 bg-white dark:bg-slate-800 border-t dark:border-slate-700">
              <div className="flex space-x-4">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Écrivez votre message..."
                  className="flex-1 p-2 rounded-lg bg-gray-100 dark:bg-slate-700 focus:outline-none dark:text-white"
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      handleSendMessage();
                    }
                  }}
                />
                <button
                  onClick={handleSendMessage}
                  className="p-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 focus:outline-none"
                >
                  <Send size={20} />
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center bg-gray-50 dark:bg-slate-900">
            <p className="text-gray-500 dark:text-gray-400">
              Sélectionnez un dentiste pour commencer une conversation
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Message;
