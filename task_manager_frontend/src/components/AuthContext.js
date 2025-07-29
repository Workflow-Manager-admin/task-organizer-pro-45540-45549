import React, { createContext, useState, useEffect, useContext } from "react";
import { apiLogin, apiRegister, apiGetProfile } from "../api";

// Context for authentication/session state
const AuthContext = createContext();

// PUBLIC_INTERFACE
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [authToken, setAuthToken] = useState(localStorage.getItem("auth_token"));
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (authToken) {
      localStorage.setItem("auth_token", authToken);
      apiGetProfile().then(userData => {
        setUser(userData);
        setLoading(false);
      }).catch(() => {
        logout();
      });
    } else {
      setLoading(false);
    }
    // eslint-disable-next-line
  }, [authToken]);

  // PUBLIC_INTERFACE
  const login = async (username, password) => {
    try {
      const res = await apiLogin(username, password);
      setAuthToken(res.access_token);
      setError('');
    } catch (e) {
      setError('Login failed');
    }
  };

  // PUBLIC_INTERFACE
  const register = async (username, password) => {
    try {
      const res = await apiRegister(username, password);
      setAuthToken(res.access_token);
      setError('');
    } catch (e) {
      setError('Registration failed');
    }
  };

  // PUBLIC_INTERFACE
  const logout = () => {
    setUser(null);
    setAuthToken(null);
    localStorage.removeItem("auth_token");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        error,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// PUBLIC_INTERFACE
export function useAuth() {
  return useContext(AuthContext);
}
