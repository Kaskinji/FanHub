import axios from 'axios';
import { API_CONFIG } from '../config/apiConfig';
import type { GamePreview } from '../types/AllGamesPageData';

export interface GameReadDto {
  id: number;
  title: string;
  description: string;
  releaseDate: string;
  developer: string;
  publisher: string;
  coverImage: string;
  genre: string;
}

export interface GameCreateDto {
  title: string;
  description: string;
  releaseDate: string;
  developer: string;
  publisher: string;
  coverImage: string;
  genre: string;
}

export interface GameUpdateDto {
  title?: string;
  description?: string;
  releaseDate?: string;
  developer?: string;
  publisher?: string;
  coverImage?: string;
  genre?: string;
}

export class GameApi {
  private readonly baseUrl: string;

  constructor(baseUrl: string = API_CONFIG.BASE_URL) {
    this.baseUrl = baseUrl;
  }


  getGameImageUrl(game: GameReadDto): string {
    if (!game.coverImage) {
      return `${this.baseUrl}/images/default-game.jpg`;
    }
    
    if (game.coverImage.startsWith('http')) {
      return game.coverImage;
    }
    
    if (game.coverImage.startsWith('/')) {
      return `${this.baseUrl}${game.coverImage}`;
    }
    
    return `${this.baseUrl}/images/games/${game.coverImage}`;
  }

   adaptToGamePreview(game: GameReadDto): GamePreview {
    return {
      id: game.id,
      name: game.title,
      imageUrl: this.getGameImageUrl(game)
    };
  }

   adaptToGamePreviews(games: GameReadDto[]): GamePreview[] {
    return games.map(game => this.adaptToGamePreview(game));
  }


  async getGames(): Promise<GameReadDto[]> {
  try {
    console.log('Fetching games from:', `${this.baseUrl}/api/games`);
    
    const response = await axios.get<GameReadDto[]>(
      `${this.baseUrl}/api/games`,
      {
        withCredentials: true,
        timeout: 10000,
      }
    );

    console.log('Games fetched:', response.data.length);
    return response.data;
  } catch (error) {
    console.error('Error fetching games:', error);
    this.handleGameError(error, 'Failed to fetch games');
  }
}


  async searchGamesByName(name: string): Promise<GameReadDto[]> {
    try {
      const response = await axios.get<GameReadDto[]>(
        `${this.baseUrl}/game/name`,
        {
          params: { name },
          withCredentials: true,
          timeout: 10000,
        }
      );

      return response.data;
    } catch (error) {
      this.handleGameError(error, `Failed to search games by name: ${name}`);
    }
  }


  async searchGamesByGenre(genre: string): Promise<GameReadDto[]> {
  try {
    const response = await axios.get<GameReadDto[]>(
      `${this.baseUrl}/game/genre`,
      {
        params: { name: genre }, 
        withCredentials: true,
        timeout: 10000,
      }
    );

    return response.data;
  } catch (error) {
    this.handleGameError(error, `Failed to search games by genre: ${genre}`);
  }
}


  async getGameById(id: number): Promise<GameReadDto> {
    try {
      const response = await axios.get<GameReadDto>(
        `${this.baseUrl}/api/games/${id}`,
        {
          withCredentials: true,
          timeout: 10000,
        }
      );

      return response.data;
    } catch (error) {
      this.handleGameError(error, `Failed to fetch game with ID ${id}`);
    }
  }


  async createGame(gameData: GameCreateDto): Promise<number> {
    try {
      const response = await axios.post<number>(
        `${this.baseUrl}/api/games`,
        gameData,
        {
          headers: {
            'Content-Type': 'application/json',
          },
          withCredentials: true,
          timeout: 10000,
        }
      );

      return response.data;
    } catch (error) {
      this.handleGameError(error, 'Failed to create game');
    }
  }

 
  async updateGame(id: number, gameData: GameUpdateDto): Promise<void> {
    try {
      await axios.put(
        `${this.baseUrl}/api/games/${id}`,
        gameData,
        {
          headers: {
            'Content-Type': 'application/json',
          },
          withCredentials: true,
          timeout: 10000,
        }
      );
    } catch (error) {
      this.handleGameError(error, `Failed to update game with ID ${id}`);
    }
  }


  async deleteGame(id: number): Promise<void> {
    try {
      await axios.delete(
        `${this.baseUrl}/api/games/${id}`,
        {
          withCredentials: true,
          timeout: 10000,
        }
      );
    } catch (error) {
      this.handleGameError(error, `Failed to delete game with ID ${id}`);
    }
  }

 
  private handleGameError(error: unknown, defaultMessage: string): never {
    if (axios.isAxiosError(error)) {
      if (error.response) {
        const status = error.response.status;
        const message = error.response.data?.message || defaultMessage;

        switch (status) {
          case 400:
            throw new Error('Invalid game data.');
          case 401:
            throw new Error('Unauthorized. Please login again.');
          case 403:
            throw new Error('Forbidden. Admin access required.');
          case 404:
            throw new Error('Game not found.');
          case 409:
            throw new Error('Game with this title already exists.');
          case 422:
            throw new Error('Validation error. Please check your data.');
          case 500:
            throw new Error('Server error. Please try again later.');
          default:
            throw new Error(message);
        }
      } else if (error.request) {
        throw new Error('Network error. Please check your connection.');
      }
    }

    throw new Error(defaultMessage);
  }
}

export const gameApi = new GameApi();

export default GameApi;