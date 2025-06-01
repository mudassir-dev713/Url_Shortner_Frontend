import { createContext, useContext, useEffect, useState } from 'react';
import {
  createCustomUrl,
  createUrl,
  fetchStats,
  fetchUrls,
} from '../api/Url.api';
import { useAuth } from './AuthContext';
import { toast } from 'react-toastify';

const UrlContext = createContext();

export const useUrl = () => useContext(UrlContext);

export const UrlProvider = ({ children }) => {
  const { user } = useAuth();
  const [urls, setUrls] = useState([]);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState([]);

  useEffect(() => {
    const loadStats = async () => {
      try {
        let data;
        user ? (data = await fetchStats()) : ({ data } = await fetchStats());

        setStats(data);
      } catch (error) {
        console.log('Failed to fetch stats:', error);
      }
    };

    loadStats();
  }, []);

  const generateUrl = async (originalUrl) => {
    try {
      setLoading(true);
      let data;
      user
        ? (data = await createUrl(originalUrl))
        : ({ data } = await createUrl(originalUrl));

      return data;
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Error creating URL');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const generateCustomUrl = async (originalUrl, slug) => {
    if (!user) {
      toast.error('Please log in to create a custom URL');
      return;
    }

    try {
      setLoading(true);
      const data = await createCustomUrl(originalUrl, slug);
      return data;
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Error creating custom URL');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const fetchUserUrls = async () => {
    try {
      const fetchedUrls = await fetchUrls();

      setUrls(fetchedUrls);
    } catch (error) {
      console.error('Failed to fetch URLs', error);
    }
  };

  return (
    <UrlContext.Provider
      value={{
        urls,
        loading,
        setUrls,
        generateUrl,
        generateCustomUrl,
        fetchUserUrls,
        stats,
      }}
    >
      {children}
    </UrlContext.Provider>
  );
};
