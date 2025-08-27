import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { logout } from '../../redux/auth/operations.js';

export default function UnauthorizedHandler({ error }) {
  const dispatch = useDispatch();
  const [handled, setHandled] = useState(false);

  useEffect(() => {
    if (error?.status === 401 && !handled) {
      dispatch(logout());
      toast.error('Unauthorized — you have been logged out');
      setHandled(true);
    }
  }, [error, handled, dispatch]);

  return null; // компонент нічого не рендерить
}
