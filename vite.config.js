import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    sourcemap: true,
  },
});

// import { defineConfig } from 'vite';
// import react from '@vitejs/plugin-react-swc';

// // https://vitejs.dev/config/
// export default defineConfig({
//   base: '/DCgroup-React-Node-F/', // <--- Додати цей рядок
//   plugins: [react()],
//   build: {
//     sourcemap: true,
//   },
// });
