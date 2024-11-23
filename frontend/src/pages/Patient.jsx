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

const schema = yup.object().shape({
  nom_patient: yup.string().required("Entrer le nom du patient"),
  prenom_patient: yup.string().required("Entrer le prénom du patient"),
  quartier: yup.string().required("Entrer le quartier"),
  age: yup
    .number()
    .required("Entrer l'âge")
    .integer("L'âge doit être un nombre entier")
    .min(0, "L'âge doit être supérieur ou égal à 0")
    .max(120, "L'âge doit être inférieur ou égal à 120"),
  telephone: yup
    .string()
    .required("Entrer le numéro de téléphone")
    .matches(/^[0-9]+$/, "Le téléphone doit contenir uniquement des chiffres")
    .min(10, "Le numéro de téléphone doit comporter au moins 10 chiffres"),
});

const Patient = () => {
  const [addModal, setAddModal] = useState(false);
  const toggleAddModal = () => setAddModal(!addModal);
  const [updateModal, setUpdateModal] = useState(false);
  const toggleUpdateModal = () => setUpdateModal(!updateModal);
  const [deleteModal, setDeleteModal] = useState(false);
  const toggleDeleteModal = () => setDeleteModal(!deleteModal);
  const [selectedId, setSelectedId] = useState(null);
  const { loading, data, error, refetch } = useQuery("/api/patient");

  /*paginations */
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3;

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
      <div className="font-bold text-xl text-center py-6 animate-color-change">
        Patients
      </div>

      <TableContainer>
        <div className="dark:bg-slate-900 flex p-3 items-center justify-between">
          <p className="dark:text-slate-100">Liste des Patients</p>
          <button
            onClick={toggleAddModal}
            className="bg-gradient-to-r from-teal-400 to-yellow-200 text-lg py-2 px-8 rounded-md text-white flex item-center space-x-3"
          >
            <PiPlus className="text-xl"></PiPlus> <span>Ajouter Patient</span>
          </button>
        </div>
        <TableRow
          bg=" bg-slate-950  text-white font-bold"
          col="grid-cols-[1fr,1fr,1fr,1fr,1fr,max-content]"
        >
          <p className="md:hidden">Informations</p>
          <p className="hidden md:block">Nom</p>
          <p className="hidden md:block">Prénom</p>
          <p className="hidden md:block">Age</p>
          <p className="hidden md:block">Quartier</p>
          <p className="hidden md:block">Téléphone</p>
          <p className="hidden md:block">Actions</p>
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
              key={item.id_patient}
              col="dark:bg-slate-900 grid-cols-1 md:grid-cols-[1fr,1fr,1fr,1fr,1fr,max-content]"
            >
              <p>
                {" "}
                <span className="font-bold md:hidden">Nom :</span>
                {item.nom_patient}
              </p>
              <p>
                {" "}
                <span className="font-bold md:hidden">Prénom :</span>
                {item.prenom_patient}
              </p>
              <p>
                {" "}
                <span className="font-bold md:hidden">Age :</span>
                {item.age}
              </p>
              <p>
                {" "}
                <span className="font-bold md:hidden">Quartier :</span>
                {item.quartier}
              </p>
              <p>
                {" "}
                <span className="font-bold md:hidden">Téléphone :</span>
                {item.telephone}
              </p>

              <Actions
                id_patient={item.id_patient}
                setSelectedId={setSelectedId}
                toggleUpdateModal={toggleUpdateModal}
                toggleDeleteModal={toggleDeleteModal}
              />
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

      <AddModal refetch={refetch} open={addModal} setOpen={setAddModal} />
      <DeleteModal
        refetch={refetch}
        open={deleteModal}
        setOpen={setDeleteModal}
        id_patient={selectedId}
        setSelectedId={setSelectedId}
      />
      <UpdateModal
        refetch={refetch}
        open={updateModal}
        setOpen={setUpdateModal}
        id_patient={selectedId}
        setSelectedId={setSelectedId}
      />
    </main>
  );
};

const AddModal = ({ open, setOpen, refetch }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(schema),
  });

  const { mutationFn, error, loading, success } = useMutation(
    "/api/patient",
    "POST"
  );

  const [show, setShow] = useState(true);

  const onSubmit = async (data) => {
    setShow(false);
    const res = await mutationFn(data);
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
            Ajouter Patient
          </h1>
          <div className="dark:bg-slate-900 p-3">
            <form onSubmit={handleSubmit(onSubmit)}>
              <Input
                label="Nom"
                type="text"
                errorMessage={errors?.nom_patient?.message}
                state={{ ...register("nom_patient") }}
                isError={errors?.nom_patient}
              />
              <Input
                label="Prénom"
                type="text"
                errorMessage={errors?.prenom_patient?.message}
                state={{ ...register("prenom_patient") }}
                isError={errors?.prenom_patient}
              />
              <Input
                label="Age"
                type="text"
                errorMessage={errors?.age?.message}
                state={{ ...register("age") }}
                isError={errors?.age}
              />
              <Input
                label="Quartier"
                type="text"
                errorMessage={errors?.quartier?.message}
                state={{ ...register("quartier") }}
                isError={errors?.quartier}
              />
              <Input
                label="Téléphone"
                type="text"
                errorMessage={errors?.telephone?.message}
                state={{ ...register("telephone") }}
                isError={errors?.telephone}
              />

              <div className="flex mt-4 items-center justify-between">
                <button
                  type="submit"
                  className="bg-gradient-to-r from-teal-400 to-yellow-200 text-sm py-2 px-8 rounded-md text-white flex item-center space-x-3"
                >
                  <span>Ajouter Patient</span>
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

const UpdateModal = ({ open, setOpen, refetch, id_patient, setSelectedId }) => {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const { mutationFn, error, loading, success } = useMutation(
    `/api/patient/${id_patient}`,
    "PUT"
  );

  const { data, loading: isLoading } = useQuery(
    `/api/patient/${id_patient}`,
    open ? false : true
  );

  useEffect(() => {
    if (data !== null) {
      setValue("nom_patient", data.nom_patient);
      setValue("prenom_patient", data.prenom_patient);
      setValue("age", data.age);
      setValue("quartier", data.quartier);
      setValue("telephone", data.telephone);
    }
  }, [data]);

  useEffect(() => {
    if (!open) {
      setValue("nom_patient", "");
      setValue("prenom_patient", "");
      setValue("age", "");
      setValue("quartier", "");
      setValue("telephone", "");
    }
  }, [open]);

  const [show, setShow] = useState(true);

  const onSubmit = async (data) => {
    setShow(false);
    await mutationFn(data);
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
      {show &&
        (isLoading ? (
          <div className="w-full h-80 flex items-center justify-center">
            <Loader />
          </div>
        ) : (
          <>
            <h1 className="dark:text-slate-100 dark:bg-slate-900 text-center text-xl font-bold py-3 w-full">
              Modifier Patient
            </h1>
            <div className="dark:bg-slate-900 p-3">
              <form onSubmit={handleSubmit(onSubmit)}>
                <Input
                  label="Nom"
                  type="text"
                  errorMessage={errors?.nom_patient?.message}
                  state={{ ...register("nom_patient") }}
                  isError={errors?.nom_patient}
                />
                <Input
                  label="Prénom"
                  type="text"
                  errorMessage={errors?.prenom_patient?.message}
                  state={{ ...register("prenom_patient") }}
                  isError={errors?.prenom_patient}
                />
                <Input
                  label="Age"
                  type="text"
                  errorMessage={errors?.age?.message}
                  state={{ ...register("age") }}
                  isError={errors?.age}
                />
                <Input
                  label="Quartier"
                  type="text"
                  errorMessage={errors?.quartier?.message}
                  state={{ ...register("quartier") }}
                  isError={errors?.quartier}
                />
                <Input
                  label="Téléphone"
                  type="text"
                  errorMessage={errors?.telephone?.message}
                  state={{ ...register("telephone") }}
                  isError={errors?.telephone}
                />

                <div className="flex mt-4 items-center justify-between">
                  <button
                    type="submit"
                    className="bg-gradient-to-r from-teal-400 to-yellow-200 text-sm py-2 px-8 rounded-md text-white flex item-center space-x-3"
                  >
                    <span>Modifier Patient</span>
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

const DeleteModal = ({ open, setOpen, refetch, id_patient, setSelectedId }) => {
  const { mutationFn, error, loading, success } = useMutation(
    `/api/patient/${id_patient}`,
    "DELETE"
  );

  const [show, setShow] = useState(true);

  const deleteHandler = async () => {
    setShow(false);
    await mutationFn();
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
                  Supprimer le Patient
                </h3>
                <div className="mt-2">
                  <p className="text-sm text-gray-500">
                    Êtes-vous sûr de vouloir supprimer ce patient ?
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
  id_patient,
  setSelectedId,
  toggleUpdateModal,
  toggleDeleteModal,
}) => {
  const deleteFunc = () => {
    setSelectedId(id_patient);
    toggleDeleteModal();
  };

  const updateFunc = () => {
    setSelectedId(id_patient);
    toggleUpdateModal();
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
      </div>
    </div>
  );
};

export default Patient;
