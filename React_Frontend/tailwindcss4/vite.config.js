import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import fs from 'fs'; // Import 'fs' for reading the certificate files

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    tailwindcss(),
    react(),
  ],
  server: {
    https: {
      key: fs.readFileSync('./certs/localhost.key'), // Path to the key file
      cert: fs.readFileSync('./certs/localhost.crt'), // Path to the certificate file
    },
    host: '127.0.0.1', // Ensures it runs on localhost
    port: 3000, // You can change the port if needed
  },
});

