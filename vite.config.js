import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react'; // Include this if you're using React

export default defineConfig({
  plugins: [react()], // Include this if you're using React
  server: {
    host: '0.0.0.0', // This will allow Vite to listen on all network interfaces
    port: 5173,
    strictPort: true, // Optional: ensures Vite only uses the specified port
  },
});
