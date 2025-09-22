import { useEffect, useState } from "react";
import { createContext, useContext } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [authReady, setaAuthReady] = useState(false);
  const [getbooks, setBooks] = useState([]);

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.log("failed to fetch user from loclStorage", error);
    } finally {
      setaAuthReady(true);
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, setUser, getbooks, setBooks, authReady, setaAuthReady }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
