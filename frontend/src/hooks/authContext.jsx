import { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "@clerk/clerk-react";
import axios from "axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const { userId } = useAuth();
  const [userRole, setUserRole] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUserRole = async () => {
      if (!userId) {
        setIsLoading(false);
        return;
      }

      try {
        // Utilise le endpoint getCompteByClerkId pour récupérer le rôle
        const response = await axios.get(`/api/compte/clerk/${userId}`);
        setUserRole(response.data.role);
      } catch (error) {
        console.error("Erreur lors de la récupération du rôle:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserRole();
  }, [userId]);

  return (
    <AuthContext.Provider value={{ userRole, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthRole = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error(
      "useAuthRole doit être utilisé à l'intérieur d'un AuthProvider"
    );
  }
  return context;
};