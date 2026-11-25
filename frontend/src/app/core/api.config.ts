import { Capacitor } from '@capacitor/core';

export function urlApi(): string {
  const servidor = Capacitor.isNativePlatform()
    ? 'http://10.0.2.2:8000'
    : 'http://localhost:8000';

  return `${servidor}/api`;
}
