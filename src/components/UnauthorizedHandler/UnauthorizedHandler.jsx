import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
// import axios from 'axios';
import { logout } from '../../redux/auth/operations.js';
import { toast } from 'react-toastify';
import { selectRecipesError } from '../../redux/recipes/selectors.js';
import { selectUserProfileError } from '../../redux/userProfile/slice.js';

const UnauthorizedHandler = () => {
  const dispatch = useDispatch();
  const recipesError = useSelector(selectRecipesError);
  const usersError = useSelector(selectUserProfileError);
  // ......

  useEffect(() => {
    if (recipesError?.status === 401 || usersError?.status === 401) {
      dispatch(logout());
      toast();
    }
  }, [recipesError, usersError, dispatch]);

  return null;
};
export default UnauthorizedHandler;
// const UnauthorizedHandler = () => {
//   const dispatch = useDispatch();
//   const hasShownToast = useRef(false); // трекнемо чи показаний тост
//   const hasLoggedOut = useRef(false); // трекнемо чи вже робився logout

//   useEffect(() => {
//     const interceptor = axios.interceptors.response.use(
//       (response) => response,
//       (error) => {
//         if (error.response && error.response.status === 401) {
//           if (!hasShownToast.current) {
//             hasShownToast.current = true;
//             toast.info('Сесія закінчилась. Будь ласка, увійдіть знову.');
//           }

//           if (!hasLoggedOut.current) {
//             hasLoggedOut.current = true;
//             dispatch(logout());
//           }
//         }
//         return Promise.reject(error);
//       },
//     );

//     return () => {
//       axios.interceptors.response.eject(interceptor);
//     };
//   }, [dispatch]);

//   return null;
// };
