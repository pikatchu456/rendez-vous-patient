import React, { useState, useEffect } from "react";
import Dentiste from "../pages/Dentiste";

const SelectDentiste = ({ register, errors, setValue }) => {
  const [dentistes, setDentistes] = useState([]);

  useEffect(() => {
    // Récupérer tous les dentistes depuis l'API ou votre base de données
    // Par exemple :
    const fetchDentists = async () => {
      const response = await fetch("/api/dentiste");
      const data = await response.json();
      setDentistes(data);
    };
    fetchDentists();
  }, []);

  const handleChange = (event) => {
    setValue("id_dentiste", event.target.value);
  };


  return (
    <select {...register("id_dentiste")} onChange={handleChange}>
      <option value="">Sélectionnez un dentiste</option>
      {dentistes.map((dentiste) => (
        <option key={dentiste.id_dentiste} value={dentiste.id_dentiste}>
          {dentiste.prenom_dentiste} {dentiste.nom_dentiste}
        </option>
      ))}
    </select>
  );
};

export default SelectDentiste;
