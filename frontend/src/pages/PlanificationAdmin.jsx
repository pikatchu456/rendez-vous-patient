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
  date_service: yup
    .date()
    .required("Veuillez entrer la date de service")
    .typeError("La date de service doit être une date valide"),

  heures_debut: yup
    .string()
    .required("Veuillez entrer les heures de début")
    .matches(/^\d{2}:\d{2}$/, "Le format doit être HH:mm (par exemple, 14:30)"),

  heures_fin: yup
    .string()
    .required("Veuillez entrer les heures de fin")
    .matches(/^\d{2}:\d{2}$/, "Le format doit être HH:mm (par exemple, 15:00)"),
});

const PlanificationAdmin = () => {
  const [addModal, setAddModal] = useState(false);
  const toggleAddModal = () => setAddModal(!addModal);
  const [updateModal, setUpdateModal] = useState(false);
  const toggleUpdateModal = () => setUpdateModal(!updateModal);
  const [deleteModal, setDeleteModal] = useState(false);
  const toggleDeleteModal = () => setDeleteModal(!deleteModal);
  const [selectedId, setSelectedId] = useState(null);
  const { loading, data, error, refetch } = useQuery("/api/planification");

  return (
    <main className="w-full h-screen bg-gray-50">
      <div className="font-bold text-xl text-center py-6 animate-color-change">
        Planifications
      </div>

      <TableContainer>
        <div className="flex p-3 items-center justify-between">
          <p>Liste des Planifications</p>
          <button
            onClick={toggleAddModal}
            className="bg-gradient-to-r from-teal-400 to-yellow-200 text-lg py-2 px-8 rounded-md text-white flex item-center space-x-3"
          >
            <PiPlus className="text-xl"></PiPlus>{" "}
            <span>Ajouter Planification</span>
          </button>
        </div>
        <TableRow
          bg=" bg-slate-950  text-white font-bold"
          col="grid-cols-[1fr,1fr,1fr,max-content]"
        >
          <p className="md:hidden">Informations</p>
          <p className="hidden md:block">Date de service</p>
          <p className="hidden md:block">Heure du début</p>
          <p className="hidden md:block">Heure de fin</p>
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
          data?.map((item) => (
            <TableRow
              key={item.id_planification}
              col="grid-cols-1 md:grid-cols-[1fr,1fr,1fr,max-content]"
            >
              <p>
                {" "}
                <span className="font-bold md:hidden">Date de service :</span>
                {item.date_service}
              </p>
              <p>
                {" "}
                <span className="font-bold md:hidden">Heure du début :</span>
                {item.heures_debut}
              </p>
              <p>
                {" "}
                <span className="font-bold md:hidden">Heure de fin :</span>
                {item.heures_fin}
              </p>

              <Actions
                id_planification={item.id_planification}
                setSelectedId={setSelectedId}
                toggleUpdateModal={toggleUpdateModal}
                toggleDeleteModal={toggleDeleteModal}
              />
            </TableRow>
          ))
        )}
      </TableContainer>

      <AddModal refetch={refetch} open={addModal} setOpen={setAddModal} />
      <DeleteModal
        refetch={refetch}
        open={deleteModal}
        setOpen={setDeleteModal}
        id_planification={selectedId}
        setSelectedId={setSelectedId}
      />
      <UpdateModal
        refetch={refetch}
        open={updateModal}
        setOpen={setUpdateModal}
        id_planification={selectedId}
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
    "/api/planification",
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
          <h1 className="text-center text-xl font-bold py-3 w-full">
            Ajouter Planification
          </h1>
          <div className="p-3">
            <form onSubmit={handleSubmit(onSubmit)}>
              <Input
                label="Date de Service"
                type="date"
                errorMessage={errors?.date_service?.message}
                state={{ ...register("date_service") }}
                isError={errors?.date_service}
              />

              <Input
                label="Heures de Début"
                type="time"
                errorMessage={errors?.heures_debut?.message}
                state={{ ...register("heures_debut") }}
                isError={errors?.heures_debut}
              />

              <Input
                label="Heures de Fin"
                type="time"
                errorMessage={errors?.heures_fin?.message}
                state={{ ...register("heures_fin") }}
                isError={errors?.heures_fin}
              />

              <div className="flex mt-4 items-center justify-between">
                <button
                  type="submit"
                  className="bg-gradient-to-r from-teal-400 to-yellow-200 text-sm py-2 px-8 rounded-md text-white flex item-center space-x-3"
                >
                  <span>Ajouter Planification</span>
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
  id_planification,
  setSelectedId,
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
    `/api/planification/${id_planification}`,
    "PUT"
  );

  const { data, loading: isLoading } = useQuery(
    `/api/planification/${id_planification}`,
    open ? false : true
  );

  useEffect(() => {
    if (data !== null) {
      setValue("date_service", new Date(data.date_service));
      setValue("heures_debut", data.heures_debut);
      setValue("heures_fin", data.heures_fin);
    }
  }, [data]);

  useEffect(() => {
    if (!open) {
      setValue("date_service", new Date());
      setValue("heures_debut", "09:00"); // Heure par défaut
      setValue("heures_fin", "17:00"); // Heure par défaut
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
            <h1 className="text-center text-xl font-bold py-3 w-full">
              Modifier Planification
            </h1>
            <div className="p-3">
              <form onSubmit={handleSubmit(onSubmit)}>
                <Input
                  label="Date de Service"
                  type="date"
                  errorMessage={errors?.date_service?.message}
                  state={{ ...register("date_service") }}
                  isError={errors?.date_service}
                />

                <Input
                  label="Heures de Début"
                  type="time"
                  errorMessage={errors?.heures_debut?.message}
                  state={{ ...register("heures_debut") }}
                  isError={errors?.heures_debut}
                />

                <Input
                  label="Heures de Fin"
                  type="time"
                  errorMessage={errors?.heures_fin?.message}
                  state={{ ...register("heures_fin") }}
                  isError={errors?.heures_fin}
                />

                <div className="flex mt-4 items-center justify-between">
                  <button
                    type="submit"
                    className="bg-gradient-to-r from-teal-400 to-yellow-200 text-sm py-2 px-8 rounded-md text-white flex item-center space-x-3"
                  >
                    <span>Modifier Planification</span>
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
  id_planification,
  setSelectedId,
}) => {
  const { mutationFn, error, loading, success } = useMutation(
    `/api/planification/${id_planification}`,
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
                  Supprimer le Planification
                </h3>
                <div className="mt-2">
                  <p className="text-sm text-gray-500">
                    Êtes-vous sûr de vouloir supprimer ce planification ?
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
  id_planification,
  setSelectedId,
  toggleUpdateModal,
  toggleDeleteModal,
}) => {
  const deleteFunc = () => {
    setSelectedId(id_planification);
    toggleDeleteModal();
  };

  const updateFunc = () => {
    setSelectedId(id_planification);
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

export default PlanificationAdmin;