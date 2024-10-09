import { useMemo } from "react";
import {
  GoCommentDiscussion,
  GoHome,
  GoTasklist,
  GoCalendar,
} from "react-icons/go";
import { FaTooth, FaUserInjured } from "react-icons/fa";

import { useLocation } from "react-router-dom";

export const useRoutes = () => {

  const DentisteIcon = () => (
    <FaTooth style={{ color: "white", stroke: "black", strokeWidth: 40 }} />
  );
  const PatientIcon = () => (
    <FaUserInjured
      style={{ color: "white", stroke: "black", strokeWidth: 40 }}
    />
  );

  const location = useLocation().pathname;

  const routes = useMemo(() => [
    {
      title: "Dashboard",
      icon: GoHome,
      path: "/",
      active: location === "/",
    },
    {
      title: "Dentiste",
      icon: DentisteIcon,
      path: "/dentiste",
      active: location === "/dentiste",
    },
    {
      title: "Patient",
      icon: PatientIcon,
      path: "/patient",
      active: location === "/patient",
    },
    {
      title: "Planification",
      icon: GoCalendar, // Remplacez par une icône appropriée si nécessaire
      path: "/planification",
      active: location === "/planification",
    },
    {
      title: "Message",
      icon: GoCommentDiscussion,
      path: "/message",
      active: location === "/message",
    },
    {
      title: "Consultation",
      icon: GoTasklist, // Remplacez par une icône appropriée si nécessaire
      path: "/consultation",
      active: location === "/consultation",
    },
  ]);

  return routes;
};
