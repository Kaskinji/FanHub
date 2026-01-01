// utils/gameImage.ts (замените текущий файл)
import { API_CONFIG } from '../config/apiConfig';

/**
 * Получить URL изображения игры с бэкенда
 */
export const getGameImage = (coverImage?: string, gameTitle?: string): string => {
  const baseUrl = API_CONFIG.BASE_URL;
  
  // Если есть coverImage из API - используем его
  if (coverImage) {
    // Если путь уже абсолютный
    if (coverImage.startsWith('http')) {
      return coverImage;
    }
    
    // Если путь относительный (начинается с /)
    if (coverImage.startsWith('/')) {
      return `${baseUrl}${coverImage}`;
    }
    
    // Если только имя файла
    return `${baseUrl}/images/${coverImage}`;
  }
  
  // Если нет coverImage - используем fallback на основе названия
  if (!gameTitle) {
    return `${baseUrl}/images/default-game.jpg`;
  }
  
  // Старая логика как fallback
  const gameImageMap: Record<string, string> = {
    'The Witcher 3: Wild Hunt': `${baseUrl}/images/witcher3.jpg`,
    'Minecraft': `${baseUrl}/images/minecraft.jpg`,
    'Red Dead Redemption 2': `${baseUrl}/images/rdr2.jpg`,
    'Cyberpunk 2077': `${baseUrl}/images/cyberpunk2077.jpg`,
    'Dota 2': `${baseUrl}/images/dota2.jpg`,
    'Grand Theft Auto V': `${baseUrl}/images/gta5.jpg`,
    // ... добавьте другие игры
  };
  
  // Ищем точное совпадение
  if (gameImageMap[gameTitle]) {
    return gameImageMap[gameTitle];
  }
  
  // Ищем частичное совпадение
  const foundKey = Object.keys(gameImageMap).find(key => 
    gameTitle.toLowerCase().includes(key.toLowerCase()) ||
    key.toLowerCase().includes(gameTitle.toLowerCase())
  );
  
  if (foundKey) {
    return gameImageMap[foundKey];
  }
  
  return `${baseUrl}/images/default-game.jpg`;
};