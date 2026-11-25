
import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.utpl.seguimientoretos',
  appName: 'Seguimiento de Retos',
  webDir: 'dist/frontend/browser',
  server: {
    androidScheme: 'http',
    cleartext: true,
  },
};

export default config;
