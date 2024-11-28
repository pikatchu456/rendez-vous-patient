import React, { useContext, useState, useEffect } from "react";
import { useRoutes } from "../hooks/useRoutes.jsx";
import { useLocation, useNavigate } from "react-router-dom";
import { ThemeContext } from "../context/ThemeContext.jsx";
import { GiMoon } from "react-icons/gi";
import { LuSun } from "react-icons/lu";
import { useAuth } from "@clerk/clerk-react";
import { UserButton } from "@clerk/clerk-react";
import { BsBell } from "react-icons/bs";
import io from "socket.io-client"; // Make sure to install socket.io-client
import axios from "axios"; // For fetching initial notifications

const Navbar = () => {
  const pathname = useLocation().pathname;
  const routes = useRoutes();
  const { theme, toggleTheme } = useContext(ThemeContext);
  const { signOut, getToken } = useAuth();
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [socket, setSocket] = useState(null);
  const [unreadCount, setUnreadCount] = useState(0);

  // Fetch initial notifications
  // Modification de fetchNotifications
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const userRole = localStorage.getItem("userRole")?.toUpperCase();
        const userId = localStorage.getItem("userId"); // Assurez-vous de stocker l'ID utilisateur lors de la connexion

        if (userRole && userId) {
          const response = await axios.get("/api/notifications/notifications", {
            params: {
              userRole: userRole,
              userId: userId,
            },
          });

          setNotifications(response.data.notifications);
          setUnreadCount(
            response.data.notifications.filter((n) => !n.read).length
          );
        }
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };

    fetchNotifications();
  }, []);

  // Set up Socket.IO connection
  useEffect(() => {
    // Replace with your backend URL
    const newSocket = io("http://localhost:3000");

    // Listen for new notifications
    newSocket.on("notificationReceived", (notification) => {
      setNotifications((prevNotifications) => [
        notification,
        ...prevNotifications,
      ]);
      setUnreadCount((prev) => prev + 1);
    });

    setSocket(newSocket);

    // Cleanup socket connection
    return () => newSocket.close();
  }, []);

  // Handle notification click (mark as read)
  const handleNotificationClick = async (notificationId) => {
    try {
      await axios.delete(`/api/notifications/${notificationId}`);
      setNotifications((prevNotifications) =>
        prevNotifications.filter((n) => n.id_notification !== notificationId)
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (error) {
      console.error("Error deleting notification:", error);
    }
  };

  return (
    <div className="navbar dark:bg-slate-900 duration-300 ease-in-out dark:text-white fixed row-[1] h-[60px] md:pr-[250px] w-full flex items-center justify-between px-6 shadow ">
      {routes.map(
        (item) =>
          item.path === pathname && (
            <h1 className="text-2xl font-bold" key={item.path}>
              {item.title}
            </h1>
          )
      )}
      <div className="flex items-center">
        <div
          onClick={toggleTheme}
          className="mr-3 size-8 bg-slate-100 dark:bg-slate-950 rounded-full flex items-center justify-center"
        >
          {theme === "light" ? (
            <LuSun className="text-2xl" />
          ) : (
            <GiMoon className="text-2xl" />
          )}
        </div>
        <div className="mr-3">
          <div className="notification-container">
            <BsBell onClick={() => setShowNotifications(!showNotifications)} />
            {unreadCount > 0 && (
              <span className="notification-badge">{unreadCount}</span>
            )}
            {showNotifications && (
              <div className="notifications-dropdown">
                {notifications.map((notification) => (
                  <div
                    key={notification.id_notification}
                    onClick={() =>
                      handleNotificationClick(notification.id_notification)
                    }
                  >
                    {notification.contenu_notification}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        <UserButton />
      </div>
    </div>
  );
};

export default Navbar;
