// import axios from 'axios';
// import { store } from '../redux/store.js';
// import { logout } from '../redux/auth/operations.js';

// const instance = axios.create({
//   baseURL: 'http://localhost:3000/',
// });

// instance.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     if (error.response && error.response.status === 401) {
//       console.log('Token expired or invalid. Logging out.');
//       store.dispatch(logout());
//       window.location.href = '/auth/login';
//     }
//     return Promise.reject(error);
//   },
// );

// export default instance;
