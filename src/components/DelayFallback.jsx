import { useEffect, useState } from 'react';
import Loader from './Loader';
export function DelayedFallbackLoader() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const timer = setTimeout(() => setShow(true), 300); // show loader only if loading > 300ms
    return () => clearTimeout(timer);
  }, []);
  return show ? <Loader /> : null;
}
