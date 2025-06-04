import axiosInstance from '../utils/AxiosInstance';
export const getUser = async () => {
  const res = await axiosInstance.get('/api/auth/me');

  return res.user;
};

export const registerUser = async (name, email, password) => {
  const data = await axiosInstance.post('/api/auth/register', {
    name,
    email,
    password,
  });

  return data;
};
export const loginUser = async (email, password) => {
  const data = await axiosInstance.post('/api/auth/login', {
    email,
    password,
  });

  return data;
};
export const logoutUser = async () => {
  const { message } = await axiosInstance.post('/api/auth/logout');
  return message;
};
