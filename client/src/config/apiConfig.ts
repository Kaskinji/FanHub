export const SERVER_CONFIG = {
  BASE_URL: import.meta.env.VITE_SERVER_BASE_URL ?? "http://localhost:5000",
} as const;

export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_BASE_URL ?? `${SERVER_CONFIG.BASE_URL}/api`,
  TIMEOUT: 10000,
} as const;