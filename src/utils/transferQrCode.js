import axiosInstance from './AxiosInstance';

export const transferQrCodesToUser = async () => {
  const anonId = localStorage.getItem('anon_id');
  const token = localStorage.getItem('accessToken');
  if (!anonId || !token) return;

  try {
    await axiosInstance.post(
      '/api/qr/transfer',
      { anonId },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    localStorage.removeItem('anon_id');
  } catch (error) {
    console.error('QR Code transfer failed:', error);
  }
};
