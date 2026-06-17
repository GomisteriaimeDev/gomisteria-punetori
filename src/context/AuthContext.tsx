import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useCallback,
} from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { getUserProfile } from "../services/api";

interface AuthContextType {
  currentUser: any;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  updateUser: (userData: any) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();
  const setSessionTimeout = (expTime: any) => {
    const currentTime = Date.now();
    const timeUntilExpiration = expTime * 1000 - currentTime;
    setTimeout(logout, timeUntilExpiration);
  };
  const login = useCallback(
    async (email: string, password: string) => {
      try {
        const response = await axios.post(
          "https://gomisteria-api.onrender.com/api/users/employee/login",
          { email, password }
        );
        const decodedToken = jwtDecode<any>(response.data.access_token);
        const user: any = {
          email: decodedToken.email,
          userId: decodedToken.sub,
        };

        localStorage.setItem("token", response.data.access_token);
        localStorage.setItem("userId", decodedToken.sub);
        localStorage.setItem("isAuthenticated", "true");

        // Load the full user (name + profile image) right away so the UI is
        // populated without needing a page reload.
        try {
          const userData = await getUserProfile(
            decodedToken.sub,
            response.data.access_token
          );
          setCurrentUser(userData);
        } catch (e) {
          console.error("Failed to load user after login:", e);
        }

        setSessionTimeout(decodedToken.exp);
        setIsAuthenticated(true);
        navigate("/statistics");
      } catch (error) {
        console.error("Failed to login:", error);
        throw error;
      }
    },
    [navigate]
  );

  const logout = useCallback(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    setCurrentUser(null);
    setIsAuthenticated(false);
    navigate("/");
  }, [navigate]);
  const updateUser = useCallback(
    async (userData: any) => {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("No token available");
        return;
      }

      try {
        const response = await axios.put(
          `https://gomisteria-api.onrender.com/api/users/${currentUser.id}`,
          userData,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const updatedUser = response.data;
        setCurrentUser(updatedUser);
      } catch (error) {
        console.error("Failed to update user:", error);
        throw error;
      }
    },
    [currentUser]
  );

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsAuthenticated(true);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const decodedToken: any = jwtDecode(token);
      if (decodedToken.exp * 1000 < Date.now()) {
        logout();
      } else {
        setSessionTimeout(decodedToken.exp);
        getUserProfile(decodedToken.sub, token)
          .then((userData) => {
            setCurrentUser(userData);
            setIsAuthenticated(true);
          })
          .catch(logout);
      }
    }
    setLoading(false);
  }, [logout]);
  const value = { currentUser, isAuthenticated, login, logout, updateUser };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
