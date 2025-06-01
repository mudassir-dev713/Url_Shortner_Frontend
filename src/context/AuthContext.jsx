import { createContext, useContext, useState, useEffect } from 'react';
import { loginUser, logoutUser, registerUser, getUser } from '../api/Auth.api';
import { setLoginStatus } from '../api/AuthStatus';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const fetchedUser = await getUser();
        setUser(fetchedUser);
        setIsAuthenticated(true);
        setLoginStatus(true);
      } catch (error) {
        setUser(null);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, []);
  useEffect(() => {
    if (user) {
      setLoginStatus(true);
    } else {
      setLoginStatus(false);
    }
  }, []);

  const login = async (email, password) => {
    const user = await loginUser(email, password);
    setUser(user);

    setIsAuthenticated(true);
    setLoginStatus(true);
  };

  const signup = async (name, email, password) => {
    const newUser = await registerUser(name, email, password);
    setUser(newUser);
    setIsAuthenticated(true);
    setLoginStatus(true);
  };

  const logout = async () => {
    await logoutUser();
    setUser(null);
    setIsAuthenticated(false);
    setLoginStatus(false);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isLoading,
        login,
        signup,
        logout,
      }}
    >
      {!isLoading && children}
    </AuthContext.Provider>
  );
};
