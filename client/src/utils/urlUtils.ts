import { SERVER_CONFIG } from "../config/apiConfig";

export const getImageUrl = (imageUrl: string) => {
  return `${SERVER_CONFIG.BASE_URL}${imageUrl}`;
} 