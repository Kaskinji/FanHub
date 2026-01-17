import axios from "axios";
import { API_CONFIG } from "../config/apiConfig";
import type {
  NotificationWithViewedDto,
  NotificationViewedReadDto,
  NotificationViewedMarkDto,
} from "../types/NotificationViewed";

export class FandomNotificationApi {
  private readonly baseUrl: string;

  constructor(baseUrl: string = API_CONFIG.BASE_URL) {
    this.baseUrl = baseUrl;
  }

  async getViewedNotifications(isHidden?: boolean | null): Promise<NotificationViewedReadDto[]> {
    try {
      const response = await axios.get<NotificationViewedReadDto[]>(
        `${this.baseUrl}/notifications/viewed`,
        {
          params: isHidden !== undefined && isHidden !== null ? { isHidden } : {},
          withCredentials: true,
          timeout: 10000,
        }
      );

      return response.data;
    } catch (error) {
      this.handleNotificationError(error, "Failed to fetch viewed notifications");
    }
  }

  async markNotificationsAsViewed(dto: NotificationViewedMarkDto): Promise<void> {
    try {
      await axios.post(
        `${this.baseUrl}/notifications/viewed`,
        dto,
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
          timeout: 10000,
        }
      );
    } catch (error) {
      this.handleNotificationError(error, "Failed to mark notifications as viewed");
    }
  }

  async unmarkNotificationsAsViewed(dto: NotificationViewedMarkDto): Promise<void> {
    try {
      await axios.delete(
        `${this.baseUrl}/notifications/viewed`,
        {
          data: dto,
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
          timeout: 10000,
        }
      );
    } catch (error) {
      this.handleNotificationError(error, "Failed to unmark notifications as viewed");
    }
  }

  async hideNotifications(dto: NotificationViewedMarkDto): Promise<void> {
    try {
      await axios.post(
        `${this.baseUrl}/notifications/viewed/hide`,
        dto,
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
          timeout: 10000,
        }
      );
    } catch (error) {
      this.handleNotificationError(error, "Failed to hide notifications");
    }
  }

  async unhideNotifications(dto: NotificationViewedMarkDto): Promise<void> {
    try {
      await axios.post(
        `${this.baseUrl}/notifications/viewed/unhide`,
        dto,
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
          timeout: 10000,
        }
      );
    } catch (error) {
      this.handleNotificationError(error, "Failed to unhide notifications");
    }
  }

  async getNotificationsWithViewed(isHidden?: boolean | null): Promise<NotificationWithViewedDto[]> {
    try {
      const response = await axios.get<NotificationWithViewedDto[]>(
        `${this.baseUrl}/notifications/viewed/with-viewed`,
        {
          params: isHidden !== undefined && isHidden !== null ? { isHidden } : {},
          withCredentials: true
        }
      );

      return response.data;
    } catch (error) {
      this.handleNotificationError(error, "Failed to fetch notifications with viewed status");
    }
  }

  async getNotificationWithViewed(notificationId: number): Promise<NotificationWithViewedDto> {
    try {
      const response = await axios.get<NotificationWithViewedDto>(
        `${this.baseUrl}/notifications/viewed/with-viewed/${notificationId}`,
        {
          withCredentials: true,
          timeout: 10000,
        }
      );

      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        throw new Error("Notification not found.");
      }
      this.handleNotificationError(error, `Failed to fetch notification with ID ${notificationId}`);
    }
  }

  private handleNotificationError(error: unknown, defaultMessage: string): never {
    if (axios.isAxiosError(error)) {
      if (error.response) {
        const status = error.response.status;
        const message = error.response.data?.message || defaultMessage;

        switch (status) {
          case 400:
            throw new Error("Invalid notification data.");
          case 401:
            throw new Error("Unauthorized. Please login again.");
          case 403:
            throw new Error("Forbidden. You don't have permission.");
          case 404:
            throw new Error("Notification not found.");
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

export const fandomNotificationApi = new FandomNotificationApi();

export default FandomNotificationApi;

