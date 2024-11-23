import React, { useState, useEffect } from "react";

const SelectPatient = ({ register, errors, setValue }) => {
  const [patients, setPatients] = useState([]);

  useEffect(() => {
    // Récupérer tous les patients depuis l'API ou la base de données
    const fetchPatients = async () => {
      const response = await fetch("/api/patient");
      const data = await response.json();
      setPatients(data);
    };
    fetchPatients();
  }, []);

  const handleChange = (event) => {
    setValue("id_patient", event.target.value);
  };

  return (
    <select {...register("id_patient")} onChange={handleChange}>
      <option value="">Sélectionnez un patient</option>
      {patients.map((patient) => (
        <option key={patient.id_patient} value={patient.id_patient}>
                  {patient.prenom_patient}  {patient.nom_patient} 
        </option>
      ))}
    </select>
  );
};

export default SelectPatient;
