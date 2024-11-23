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

  const routes = useMemo(
    () => [
      {
        title: "Dashboard",
        icon: GoHome,
        path: "/dashboard",
        active: location === "/dashboard",
        roles: ["DENTISTE", "DENTISTE_INTERVENANT"], // Spécifier les rôles autorisés
      },
      {
        title: "Dashboard",
        icon: GoHome,
        path: "/dashboard1",
        active: location === "/dashboard1",
        roles: ["PATIENT"], // Spécifier les rôles autorisés
      },
      {
        title: "Dentiste",
        icon: DentisteIcon,
        path: "/dentiste",
        active: location === "/dentiste",
        roles: ["DENTISTE", "DENTISTE_INTERVENANT"],
      },
      {
        title: "Patient",
        icon: PatientIcon,
        path: "/patient",
        active: location === "/patient",
        roles: ["DENTISTE", "DENTISTE_INTERVENANT"],
      },
      {
        title: "Planification",
        icon: GoCalendar,
        path: "/planification1",
        active: location === "/planification1",
        roles: ["DENTISTE", "DENTISTE_INTERVENANT"],
      },
      {
        title: "Message",
        icon: GoCommentDiscussion,
        path: "/message",
        active: location === "/message",
        roles: ["DENTISTE", "DENTISTE_INTERVENANT"],
      },
      {
        title: "Consultation",
        icon: GoTasklist,
        path: "/consultation1",
        active: location === "/consultation1",
        roles: ["DENTISTE", "DENTISTE_INTERVENANT", "PATIENT"], // Accessible à tous
      },
    ],
    [location]
  );

  return routes;
};
