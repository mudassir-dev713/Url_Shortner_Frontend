export const setLoginStatus = (status) => {
  localStorage.setItem('isLoggedIn', status ? 'true' : 'false');
};

export const getLoginStatus = () => {
  return localStorage.getItem('isLoggedIn') === 'true';
};
