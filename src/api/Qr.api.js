import axiosInstance from '../utils/AxiosInstance';

export const createQRCode = async (url, anonId) => {
  const data = await axiosInstance.post('/api/qr', { url, anonId });

  return data;
};
export const fetchQRCodeForAnonymousUser = async (anonId) => {
  const data = await axiosInstance.get(`/api/qr/anon/${anonId}`);

  return data;
};
export const fetchQRCodeForUser = async (userId) => {
  const data = await axiosInstance.get(`/api/qr/${userId}`);

  return data;
};
export const deleteQrCodeById = async (id) => {
  const data = await axiosInstance.delete(`/api/qr/delete/${id}`);

  return data;
};
