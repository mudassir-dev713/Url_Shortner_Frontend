import axiosInstance from '../utils/AxiosInstance';

export const createUrl = async (url, anonId) => {
  const data = await axiosInstance.post('/api/create', {
    url,
    anonId,
  });

  return data;
};
export const createCustomUrl = async (url, slug) => {
  const data = await axiosInstance.post('/api/create/customUrl', {
    url,
    slug,
  });

  return data;
};
export const deleteUrl = async (id) => {
  const data = await axiosInstance.delete(`/api/delete/${id}`);

  return data;
};
export const fetchUrls = async () => {
  const { urls } = await axiosInstance.get('/user/geturl');

  return urls;
};
export const fetchUrlsWithAnonId = async (anonId) => {
  const urls = await axiosInstance.get(`/api/url/${anonId}`);

  return urls;
};

export const fetchStats = async () => {
  const data = await axiosInstance.get('/stats');

  return data;
};
export const fetchAnalytics = async (id) => {
  const data = await axiosInstance.get(`/analytics/summary/${id}`);

  return data;
};
