import { createContext, useContext, useState, useEffect } from 'react';
import { loginUser, logoutUser, registerUser, getUser } from '../api/Auth.api';
import { setLoginStatus } from '../api/AuthStatus';
import { transferQrCodesToUser } from '../utils/transferQrCode';
import Loader from '../components/Loader';

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
    const { user, accessToken, refreshToken } = await loginUser(
      email,
      password
    );
    if (user) {
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
    }
    await transferQrCodesToUser();
    setUser(user);

    setIsAuthenticated(true);
    setLoginStatus(true);
  };

  const signup = async (name, email, password) => {
    const { newUser, accessToken, refreshToken } = await registerUser(
      name,
      email,
      password
    );
    if (newUser) {
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
    }
    await transferQrCodesToUser();

    setUser(newUser);
    setIsAuthenticated(true);
    setLoginStatus(true);
  };

  const logout = async () => {
    await logoutUser();
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
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
      {children}
    </AuthContext.Provider>
  );
};
