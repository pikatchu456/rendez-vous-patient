import React from "react";
import { useEffect, useState } from "react";
import TableContainer from "../components/TableContainer";
import { PiPlus } from "react-icons/pi";
import TableRow from "../components/TableRow";
import Modal from "../components/Modal";
import Input from "../components/Input";
import useQuery from "../hooks/useQuery";
import Loader from "../components/Loader/Loader";

import { Dialog, Transition } from "@headlessui/react";
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";

import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import useMutation from "../hooks/useMutation";
import Success from "../components/Success/Success";
import { HiOutlinePencil, HiOutlineTrash } from "react-icons/hi2";
import Select from "../components/Select";
import SelectPatient from "../components/SelectPatient";
import { FaFilePdf } from "react-icons/fa";
import { io } from "socket.io-client";

const schema = yup.object().shape({
  date_consultation: yup
    .date()
    .required("Entrer la date de la consultation")
    .typeError("La date de consultation doit être une date valide"),
  heures: yup
    .string()
    .required("Entrer l'heure de la consultation")
    .matches(
      /^([01]\d|2[0-3]):([0-5]\d)$/,
      "Format de l'heure invalide (HH:MM)"
    ),
  motif: yup.string().required("Entrer le motif de la consultation"),
  status: yup
    .string()
    .required("Entrer le statut de la consultation")
    .oneOf(
      ["en attente", "confirme", "annule"],
      "Le statut doit être 'En attente', 'Confirmé' ou 'Annulé'"
    ),
});

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString();
};

const ConsultationAdmin = () => {
  const userRole = localStorage.getItem("userRole")?.toUpperCase();
  const [addModal, setAddModal] = useState(false);
  const toggleAddModal = () => setAddModal(!addModal);
  const [updateModal, setUpdateModal] = useState(false);
  const toggleUpdateModal = () => setUpdateModal(!updateModal);
  const [deleteModal, setDeleteModal] = useState(false);
  const toggleDeleteModal = () => setDeleteModal(!deleteModal);
  const [selectedId, setSelectedId] = useState(null);
  const [socket, setSocket] = useState(null);
  const { loading, data, error, refetch } = useQuery("/api/consultation");

  const isPatient = userRole === "PATIENT";

  /*paginations */
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3;

  // WebSocket connection setup
  useEffect(() => {
    const newSocket = io("http://localhost:3000", {
      // Ajoutez des paramètres de configuration supplémentaires si nécessaire
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    // Logs de débogage
    newSocket.on("connect", () => {
      console.log("Connected to WebSocket server");
    });

    newSocket.on("connect_error", (error) => {
      console.error("WebSocket connection error:", error);
    });

    // Écouteurs génériques pour tous les types de consultations
    newSocket.on("consultationEvent", (eventData) => {
      console.log("Consultation Event Received:", eventData);
      refetch(); // Rechargez les données pour tous les événements
    });

    // Stockez le socket
    setSocket(newSocket);

    // Nettoyage
    return () => {
      if (newSocket) {
        newSocket.disconnect();
      }
    };
  }, []); // Tableau de dépendances vide pour n'exécuter qu'une seule fois

  // Calculate pagination values
  const totalPages = data ? Math.ceil(data.length / itemsPerPage) : 0;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = data
    ? data.slice(indexOfFirstItem, indexOfLastItem)
    : [];

  // Handle page changes
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <main className="w-full h-screen dark:bg-slate-950 bg-gray-50">
      <div className="font-bold text-xl text-center py-6 animate-color-change"></div>

      <TableContainer>
        <div className="dark:bg-slate-900 flex p-3 items-center justify-between">
          <p className="dark:text-slate-100">Liste des Consultations</p>
          <button
            onClick={toggleAddModal}
            className="bg-gradient-to-r from-teal-400 to-yellow-200 text-lg py-2 px-8 rounded-md text-white flex item-center space-x-3"
          >
            <PiPlus className="text-xl"></PiPlus>{" "}
            <span>Ajouter Consultation</span>
          </button>
        </div>
        <TableRow
          bg=" bg-slate-950  text-white font-bold"
          col="grid-cols-[1fr,1fr,1fr,1fr,1fr,max-content]"
        >
          <p className="md:hidden">Informations</p>
          <p className="hidden md:block">Date</p>
          <p className="hidden md:block">Heures</p>
          <p className="hidden md:block">Motif</p>
          <p className="hidden md:block">Status</p>
          <p className="hidden md:block">Nom du Patient</p>
          {!isPatient && <p className="hidden md:block">Actions</p>}
        </TableRow>
        {error && (
          <div className="w-full h-80 flex items-center justify-center">
            <h1 className="text-4xl font-semibold text-rose-500">
              {" "}
              Il y a une erreur quelque part
            </h1>
          </div>
        )}
        {loading ? (
          <div className="w-full h-80 flex items-center justify-center">
            <Loader />
          </div>
        ) : (
          !error &&
          currentItems?.map((item) => (
            <TableRow
              key={item.id_consultation}
              col={`dark:bg-slate-900 grid-cols-1 md:grid-cols-[1fr,1fr,1fr,1fr,1fr${
                userRole !== "patient" ? ",max-content" : ""
              }]`}
            >
              <p>
                {" "}
                <span className="font-bold md:hidden">Date :</span>
                {formatDate(item.date_consultation)}
              </p>
              <p>
                {" "}
                <span className="font-bold md:hidden">Heure :</span>
                {item.heures}
              </p>
              <p>
                {" "}
                <span className="font-bold md:hidden">Motif :</span>
                {item.motif}
              </p>
              <p>
                {" "}
                <span className="font-bold md:hidden">Status :</span>
                {item.status}
              </p>
              <p>
                {" "}
                <span className="font-bold md:hidden">Nom du patient :</span>
                {`${item.patient?.prenom_patient} ${item.patient?.nom_patient}`}
              </p>

              {!isPatient && (
                <Actions
                  id_consultation={item.id_consultation}
                  setSelectedId={setSelectedId}
                  toggleUpdateModal={toggleUpdateModal}
                  toggleDeleteModal={toggleDeleteModal}
                />
              )}
            </TableRow>
          ))
        )}
      </TableContainer>

      {/* Pagination */}
      <div className="flex flex-wrap justify-center items-center space-x-2 p-4">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-3 py-1 rounded bg-blue-500 text-white disabled:bg-blue-300"
        >
          Précédent
        </button>

        {[...Array(totalPages)].map((_, index) => (
          <button
            key={index + 1}
            onClick={() => handlePageChange(index + 1)}
            className={`px-3 py-1 rounded ${
              currentPage === index + 1
                ? "bg-blue-600 text-white"
                : "bg-blue-100 text-blue-600 hover:bg-blue-200"
            }`}
          >
            {index + 1}
          </button>
        ))}

        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-3 py-1 rounded bg-blue-500 text-white disabled:bg-blue-300"
        >
          Suivant
        </button>
      </div>

      <AddModal
        refetch={refetch}
        open={addModal}
        setOpen={setAddModal}
        socket={socket}
      />

      {!isPatient && (
        <>
          <DeleteModal
            refetch={refetch}
            open={deleteModal}
            setOpen={setDeleteModal}
            id_consultation={selectedId}
            setSelectedId={setSelectedId}
            socket={socket}
          />
          <UpdateModal
            refetch={refetch}
            open={updateModal}
            setOpen={setUpdateModal}
            id_consultation={selectedId}
            setSelectedId={setSelectedId}
            socket={socket}
          />
        </>
      )}
    </main>
  );
};

const AddModal = ({ open, setOpen, refetch, socket }) => {
  const userRole = localStorage.getItem("userRole")?.toUpperCase();
  const isPatient = userRole === "PATIENT";

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(schema),
  });

  const { mutationFn, error, loading, success } = useMutation(
    "/api/consultation",
    "POST"
  );

  const [show, setShow] = useState(true);

  const onSubmit = async (data) => {
    setShow(false);
    const res = await mutationFn(data);

    if (socket && res) {
      socket.emit("consultationAdded", res);
    }
    refetch();
    reset();
  };

  useEffect(() => {
    if (success) {
      setTimeout(() => {
        setOpen(false);
        setShow(true);
      }, 2000);
    }
  }, [success]);

  return (
    <Modal open={open} setOpen={setOpen}>
      {show && (
        <>
          <h1 className="dark:text-slate-100 dark:bg-slate-900 text-center text-xl font-bold py-3 w-full">
            Ajouter Consultation
          </h1>
          <div className="dark:bg-slate-900 p-3">
            <form onSubmit={handleSubmit(onSubmit)}>
              <Input
                label="Date de Consultation"
                type="date"
                errorMessage={errors?.date_consultation?.message}
                state={{ ...register("date_consultation") }}
                isError={errors?.date_consultation}
              />
              <Input
                label="Heure de Consultation"
                type="time"
                errorMessage={errors?.heures?.message}
                state={{ ...register("heures") }}
                isError={errors?.heures}
              />
              <Input
                label="Motif"
                type="text"
                errorMessage={errors?.motif?.message}
                state={{ ...register("motif") }}
                isError={errors?.motif}
              />
              {!isPatient && (
                <Select
                  label="Statut"
                  options={[
                    { value: "en attente", label: "En attente" },
                    { value: "confirme", label: "Confirmé" },
                    { value: "annule", label: "Annulé" },
                  ]}
                  errorMessage={errors?.status?.message}
                  state={{ ...register("status") }}
                  isError={errors?.status}
                />
              )}

              <SelectPatient
                register={register}
                errors={errors}
                setValue={(value) => {
                  register.onChange("id_patient")(value);
                }}
              />

              <div className="flex mt-4 items-center justify-between">
                <button
                  type="submit"
                  className="bg-gradient-to-r from-teal-400 to-yellow-200 text-sm py-2 px-8 rounded-md text-white flex item-center space-x-3"
                >
                  <span>Ajouter Consultation</span>
                </button>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="bg-gradient-to-r from-red-400 to-rose-200 text-sm py-2 px-8 rounded-md text-white flex item-center space-x-3"
                >
                  <span>Retour</span>
                </button>
              </div>
            </form>
          </div>
        </>
      )}
      {!show && loading && (
        <div className="w-full h-80 flex items-center justify-center">
          <Loader />
        </div>
      )}
      {!show && !loading && success && (
        <div className="w-full h-80 flex items-center justify-center">
          <Success />
        </div>
      )}
      {!show && !loading && error && (
        <div className="w-full h-80 flex items-center justify-center">
          <p>Erreur !!!</p>
        </div>
      )}
    </Modal>
  );
};

const UpdateModal = ({
  open,
  setOpen,
  refetch,
  id_consultation,
  setSelectedId,
  socket,
}) => {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const { mutationFn, error, loading, success } = useMutation(
    `/api/consultation/${id_consultation}`,
    "PUT"
  );

  const { data, loading: isLoading } = useQuery(
    `/api/consultation/${id_consultation}`,
    open ? false : true
  );

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toISOString().split("T")[0];
  };

  useEffect(() => {
    if (data !== null) {
      setValue("date_consultation", formatDate(data.date_consultation));
      setValue("heures", data.heures);
      setValue("motif", data.motif);
      setValue("status", data.status);
      if (data.patient) {
        setValue("id_patient", data.patient.id_patient);
      }
    }
  }, [data]);

  useEffect(() => {
    if (!open) {
      setValue("date_consultation", "");
      setValue("heures", "");
      setValue("motif", "");
      setValue("status", "");
      setValue("id_patient", "");
    }
  }, [open, setValue]);

  const [show, setShow] = useState(true);

  const onSubmit = async (data) => {
    setShow(false);
    const res = await mutationFn(data);
    if (socket && res) {
      socket.emit("consultationUpdated", res);
    }
    refetch();
  };

  useEffect(() => {
    if (success) {
      setTimeout(() => {
        setOpen(false);
        setShow(true);
      }, 2000);
    }
  }, [setOpen, success]);

  return (
    <Modal open={open} setOpen={setOpen}>
      {show &&
        (isLoading ? (
          <div className="w-full h-80 flex items-center justify-center">
            <Loader />
          </div>
        ) : (
          <>
            <h1 className="dark:text-slate-100 dark:bg-slate-900 text-center text-xl font-bold py-3 w-full">
              Modifier Consultation
            </h1>
            <div className="dark:bg-slate-900 p-3">
              <form onSubmit={handleSubmit(onSubmit)}>
                <Input
                  label="Date de Consultation"
                  type="date"
                  errorMessage={errors?.date_consultation?.message}
                  state={{ ...register("date_consultation") }}
                  isError={errors?.date_consultation}
                />
                <Input
                  label="Heure de Consultation"
                  type="time"
                  errorMessage={errors?.heures?.message}
                  state={{ ...register("heures") }}
                  isError={errors?.heures}
                />
                <Input
                  label="Motif"
                  type="text"
                  errorMessage={errors?.motif?.message}
                  state={{ ...register("motif") }}
                  isError={errors?.motif}
                />
                <Select
                  label="Statut"
                  options={[
                    { value: "en attente", label: "En attente" },
                    { value: "confirme", label: "Confirmé" },
                    { value: "annule", label: "Annulé" },
                  ]}
                  errorMessage={errors?.status?.message}
                  state={{ ...register("status") }}
                  isError={errors?.status}
                />

                <SelectPatient
                  register={register}
                  errors={errors}
                  setValue={setValue}
                  defaultValue={data?.patient?.id_patient}
                />

                <div className="flex mt-4 items-center justify-between">
                  <button
                    type="submit"
                    className="bg-gradient-to-r from-teal-400 to-yellow-200 text-sm py-2 px-8 rounded-md text-white flex item-center space-x-3"
                  >
                    <span>Modifier Consultation</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setOpen(false)}
                    className="bg-gradient-to-r from-red-400 to-rose-200 text-sm py-2 px-8 rounded-md text-white flex item-center space-x-3"
                  >
                    <span>Retour</span>
                  </button>
                </div>
              </form>
            </div>
          </>
        ))}

      {!show && loading && (
        <div className="w-full h-80 flex items-center justify-center">
          <Loader />
        </div>
      )}
      {!show && !loading && success && (
        <div className="w-full h-80 flex items-center justify-center">
          <Success />
        </div>
      )}
      {!show && !loading && error && (
        <div className="w-full h-80 flex items-center justify-center">
          <p>Erreur !!!</p>
        </div>
      )}
    </Modal>
  );
};

const DeleteModal = ({
  open,
  setOpen,
  refetch,
  id_consultation,
  setSelectedId,
  socket,
}) => {
  const { mutationFn, error, loading, success } = useMutation(
    `/api/consultation/${id_consultation}`,
    "DELETE"
  );

  const [show, setShow] = useState(true);

  const deleteHandler = async () => {
    setShow(false);
    await mutationFn();
    if (socket) {
      socket.emit("consultationDeleted", id_consultation);
    }
    setSelectedId(null);
    refetch();
  };

  useEffect(() => {
    if (success) {
      setTimeout(() => {
        setOpen(false);
        setShow(true);
      }, 2000);
    }
  }, [success]);

  return (
    <Modal open={open} setOpen={setOpen}>
      {show && (
        <>
          <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
            <div className="sm:flex sm:items-start">
              <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                <ExclamationTriangleIcon
                  className="h-6 w-6 text-red-600"
                  aria-hidden="true"
                />
              </div>
              <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                <h3 className="text-lg font-medium leading-6 text-gray-900">
                  Supprimer le Consultation
                </h3>
                <div className="mt-2">
                  <p className="text-sm text-gray-500">
                    Êtes-vous sûr de vouloir supprimer ce consultation ?
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="flex gap-4 justify-center pb-6">
            <button
              type="button"
              className="inline-flex justify-center rounded-md border border-transparent bg-red-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
              onClick={deleteHandler}
            >
              Supprimer
            </button>
            <button
              type="button"
              className="inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              onClick={() => setOpen(false)}
            >
              Annuler
            </button>
          </div>
        </>
      )}
      {!show && loading && (
        <div className="w-full h-80 flex items-center justify-center">
          <Loader />
        </div>
      )}
      {!show && !loading && success && (
        <div className="w-full h-80 flex items-center justify-center">
          <Success />
        </div>
      )}
      {!show && !loading && error && (
        <div className="w-full h-80 flex items-center justify-center">
          <p>Erreur !!!</p>
        </div>
      )}
    </Modal>
  );
};

const Actions = ({
  id_consultation,
  setSelectedId,
  toggleUpdateModal,
  toggleDeleteModal,
}) => {
  const deleteFunc = () => {
    setSelectedId(id_consultation);
    toggleDeleteModal();
  };

  const updateFunc = () => {
    setSelectedId(id_consultation);
    toggleUpdateModal();
  };

  const [isLoading, setIsLoading] = useState(false);

  const generatePDFWithId = async (id_consultation) => {
    try {
      // Ajouter un état de chargement
      setIsLoading(true); // Vous devrez créer cet état avec useState

      const response = await fetch(`/api/consultation/pdf/${id_consultation}`);
      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `consultation_${id_consultation}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error generating PDF:", error);
    } finally {
      setIsLoading(false); // Désactiver l'état de chargement
    }
  };
  return (
    <div className="flex space-x-2">
      <div className="flex items-center space-x-3">
        <HiOutlinePencil
          className="text-xl text-teal-400"
          onClick={updateFunc}
        />
        <HiOutlineTrash
          className="text-xl text-rose-500"
          onClick={deleteFunc}
        />
        <FaFilePdf
          className="text-xl text-[#FF0000] cursor-pointer"
          onClick={() => generatePDFWithId(id_consultation)}
        />
      </div>
    </div>
  );
};

export default ConsultationAdmin;
