
import { API_CONFIG } from '../config/apiConfig';


export const getGameImage = (coverImage?: string, gameTitle?: string): string => {
  const baseUrl = API_CONFIG.BASE_URL;
  
  
  if (coverImage) {
    
    if (coverImage.startsWith('http')) {
      return coverImage;
    }
    
    
    if (coverImage.startsWith('/')) {
      return `${baseUrl}${coverImage}`;
    }
    
    
    return `${baseUrl}/images/${coverImage}`;
  }
  
  
  if (!gameTitle) {
    return `${baseUrl}/images/default-game.jpg`;
  }
  
  
  const gameImageMap: Record<string, string> = {
    'The Witcher 3: Wild Hunt': `${baseUrl}/images/witcher3.jpg`,
    'Minecraft': `${baseUrl}/images/minecraft.jpg`,
    'Red Dead Redemption 2': `${baseUrl}/images/rdr2.jpg`,
    'Cyberpunk 2077': `${baseUrl}/images/cyberpunk2077.jpg`,
    'Dota 2': `${baseUrl}/images/dota2.jpg`,
    'Grand Theft Auto V': `${baseUrl}/images/gta5.jpg`,
    
  };
  
  
  if (gameImageMap[gameTitle]) {
    return gameImageMap[gameTitle];
  }
  
  
  const foundKey = Object.keys(gameImageMap).find(key => 
    gameTitle.toLowerCase().includes(key.toLowerCase()) ||
    key.toLowerCase().includes(gameTitle.toLowerCase())
  );
  
  if (foundKey) {
    return gameImageMap[foundKey];
  }
  
  return `${baseUrl}/images/default-game.jpg`;
};