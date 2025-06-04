import React, { useEffect, useState } from 'react';
import { createContext } from 'react';
import { useContext } from 'react';
import {
  createQRCode,
  deleteQrCodeById,
  fetchQRCodeForAnonymousUser,
  fetchQRCodeForUser,
} from '../api/Qr.api';
import { getAnonymousId } from '../utils/anonymousId';
import { useAuth } from './AuthContext';
const qrContext = createContext();

export const useQr = () => useContext(qrContext);
const QrProvider = ({ children }) => {
  const { user } = useAuth();
  const [qrCodes, setqrCodes] = useState([]);

  const createQr = async (url) => {
    try {
      let data;
      if (user) {
        data = await createQRCode(url);
      } else {
        const anonId = getAnonymousId();
        data = await createQRCode(url, anonId);
      }
      return data;
    } catch (error) {
      throw error;
    }
  };
  const fetchQr = async () => {
    try {
      let data;
      if (user) {
        data = await fetchQRCodeForUser(user._id);
      } else {
        const id = getAnonymousId();
        data = await fetchQRCodeForAnonymousUser(id);
      }

      setqrCodes(data);
    } catch (error) {
      console.log(error);
    }
  };
  const deleteQr = async (id) => {
    try {
      const data = await deleteQrCodeById(id);
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <qrContext.Provider value={{ createQr, qrCodes, fetchQr, deleteQr }}>
      {children}
    </qrContext.Provider>
  );
};

export default QrProvider;
