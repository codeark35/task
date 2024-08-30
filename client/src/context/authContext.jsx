import { useEffect, useState, createContext, useContext } from "react";
import { loginRequest, registerRequest, verifyTokenRequest } from "../api/auth";
import Cookies from "js-cookie";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within a AuthProvider");
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [errors, setErrors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (errors.length > 0) {
      const timer = setTimeout(() => {
        setErrors([]);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [errors]);

  const signup = async (user) => {
    try {
      const res = await registerRequest(user);
      if (res.status === 200) {
        Cookies.set("token", res.data.token); // Almacena el token en una cookie
        setUser(res.data.user);
        setIsAuthenticated(true);
        
      }
    } catch (error) {
      console.log(error.response.data);
      setErrors(error.response.data.message);
    }
  };

  const signin = async (user) => {
    try {
      const res = await loginRequest(user);
      Cookies.set("token", res.data.token); // Almacena el token en una cookie
      setUser(res.data.user);
      setIsAuthenticated(true);
    } catch (error) {
      console.log(error.message);
      setErrors(error.message || "Error en el inicio de sesión");
    }
  };

  const logout = () => {
    Cookies.remove("token");
    setUser(null);
    setIsAuthenticated(false);
  };

  useEffect(() => {
    const checkLogin = async () => {
      const token = Cookies.get("token");
  
      // Verificar si el token existe
      if (!token) {
        console.warn("No token found in cookies.");
        setIsAuthenticated(false);
        setLoading(false);
        return;
      }
  
      try {
        const res = await verifyTokenRequest(token);
        console.log("Token verification response:", res);
  
        // Verificar si la respuesta contiene datos
        if (!res.data) {
          console.warn("Token verification failed, no data received.");
          setIsAuthenticated(false);
        } else {
          setIsAuthenticated(true);
          setUser(res.data);
        }
      } catch (error) {
        console.error("Error verifying token: ", error);
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };
  
    checkLogin();
  }, []);
  

  return (
    <AuthContext.Provider
      value={{
        user,
        signup,
        signin,
        logout,
        isAuthenticated,
        errors,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
