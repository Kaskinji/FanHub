export const SERVER_CONFIG = {
  BASE_URL: "http://localhost:5080",
} as const;

export const API_CONFIG = {
  BASE_URL: `${SERVER_CONFIG.BASE_URL}/api`,
  TIMEOUT: 10000,
} as const;