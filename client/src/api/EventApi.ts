import axios from "axios";
import { API_CONFIG } from "../config/apiConfig";

export interface EventReadDto {
  id: number;
  fandomId: number;
  organizerId: number;
  title: string;
  description: string;
  startDate: string; 
  endDate: string;  
  imageUrl?: string | null;
}

export interface EventCreateDto {
  fandomId: number;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  imageUrl?: string | null;
}

export interface EventUpdateDto {
  title?: string;
  description?: string;
  startDate?: string;
  endDate?: string;
  imageUrl?: string | null;
  fandomId?: number;
}

export class EventApi {
  private readonly baseUrl: string;

  constructor(baseUrl: string = API_CONFIG.BASE_URL) {
    this.baseUrl = baseUrl;
  }

  async getEvents(fandomId?: number): Promise<EventReadDto[]> {
    try {
      const response = await axios.get<EventReadDto[]>(`${this.baseUrl}/events`, {
        params: fandomId ? { fandomId } : {},
        withCredentials: true,
        timeout: 10000,
      });

      return response.data;
    } catch (error) {
      this.handleEventError(error, "Failed to fetch events");
    }
  }

  async getEventById(id: number): Promise<EventReadDto> {
    try {
      const response = await axios.get<EventReadDto>(`${this.baseUrl}/events/${id}`, {
        withCredentials: true,
        timeout: 10000,
      });

      return response.data;
    } catch (error) {
      this.handleEventError(error, `Failed to fetch event with ID ${id}`);
    }
  }

  async createEvent(eventData: EventCreateDto): Promise<number> {
    try {
      const response = await axios.post<number>(`${this.baseUrl}/events`, eventData, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      });

      return response.data;
    } catch (error) {
      this.handleEventError(error, "Failed to create event");
    }
  }

  async updateEvent(id: number, eventData: EventUpdateDto): Promise<void> {
    try {
      await axios.put(`${this.baseUrl}/events/${id}`, eventData, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      });
    } catch (error) {
      this.handleEventError(error, `Failed to update event with ID ${id}`);
    }
  }

  async deleteEvent(id: number): Promise<void> {
    try {
      await axios.delete(`${this.baseUrl}/events/${id}`, {
        withCredentials: true,
        timeout: 10000,
      });
    } catch (error) {
      this.handleEventError(error, `Failed to delete event with ID ${id}`);
    }
  }

  private handleEventError(error: unknown, defaultMessage: string): never {
    if (axios.isAxiosError(error)) {
      if (error.response) {
        const status = error.response.status;
        const message = error.response.data?.message || defaultMessage;

        switch (status) {
          case 400:
            throw new Error("Invalid event data.");
          case 401:
            throw new Error("Unauthorized. Please login again.");
          case 403:
            throw new Error("Forbidden. You don't have permission.");
          case 404:
            throw new Error("Event not found.");
          case 409:
            throw new Error("Conflict. Resource already exists.");
          case 422:
            throw new Error("Validation error. Please check your data.");
          case 500:
            throw new Error("Server error. Please try again later.");
          default:
            throw new Error(message);
        }
      } else if (error.request) {
        throw new Error("Network error. Please check your connection.");
      }
    }

    throw new Error(defaultMessage);
  }
}

export const eventApi = new EventApi();

export default EventApi;