import type  { FandomPreview } from "./Fandom";
export interface GamePageData {
  // Основные данные из GameReadDto
  id: number;
  title: string;
  description: string;
  coverImage: string;
  
  // Статистика (пока мок, потом с бэкенда)
  stats: {
    fandoms: number;    // Количество фандомов
    posts: number;      // Количество постов
  };
  
  // Детали игры
  details: {
    genre: string;
    publisher: string;
    developer: string;
    releaseDate: string; // В формате для отображения "06.11.2025"
  };
  
  // Фандомы (пока пустой массив, потом с бэкенда)
  fandoms: FandomPreview[];
  
  // Дополнительные поля для UI (опционально)
  tags?: string[];      // Теги для поиска
  isFavorite?: boolean; // В избранном у пользователя
}