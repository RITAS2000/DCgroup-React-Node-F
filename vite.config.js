import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
<<<<<<< HEAD
import svgr from 'vite-plugin-svgr';
=======
>>>>>>> 05f9c51b96af056cfdf0b760b5315d5a4df935d0

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), svgr()],
  build: {
    sourcemap: true,
  },
});
