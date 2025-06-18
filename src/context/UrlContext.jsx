import { createContext, useContext, useEffect, useState } from 'react';
import {
  createCustomUrl,
  createUrl,
  fetchStats,
  fetchUrls,
  fetchUrlsWithAnonId,
} from '../api/Url.api';
import { useAuth } from './AuthContext';
import { toast } from 'react-toastify';
import { getAnonymousId } from '../utils/anonymousId';

const UrlContext = createContext();

export const useUrl = () => useContext(UrlContext);

export const UrlProvider = ({ children }) => {
  const { user } = useAuth();
  const [urls, setUrls] = useState([]);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({
    urls: 0,
    users: 0,
    clicks: 0,
  });
  const [statsLoading, setStatsLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      try {
        setStatsLoading(true);
        let data;
        user ? (data = await fetchStats()) : (data = await fetchStats());

        // Ensure data has the expected structure with fallbacks
        setStats({
          urls: data?.urls || 0,
          users: data?.users || 0,
          clicks: data?.clicks || 0,
        });
      } catch (error) {
        console.log('Failed to fetch stats:', error);
        // Set default values on error
        setStats({
          urls: 0,
          users: 0,
          clicks: 0,
        });
      } finally {
        setStatsLoading(false);
      }
    };

    loadStats();
  }, []);

  const generateUrl = async (originalUrl) => {
    try {
      setLoading(true);
      let data;
      if (user) {
        data = await createUrl(originalUrl);
      } else {
        const id = getAnonymousId();
        data = await createUrl(originalUrl, id);
      }
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
      let fetchedUrls;
      let id;
      if (user) {
        fetchedUrls = await fetchUrls();
      } else {
        id = getAnonymousId();
        fetchedUrls = await fetchUrlsWithAnonId(id);
      }

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
        statsLoading,
      }}
    >
      {children}
    </UrlContext.Provider>
  );
};
