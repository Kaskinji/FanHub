import type { FandomNotificationType } from "./enums/FandomNotificationType";

export interface NotificationWithViewedDto {
  id: number;
  fandomId: number;
  notifierId: number;
  createdAt: string;
  type: FandomNotificationType;
  notificationViewedId: number | null;
  viewedAt: string | null;
  isHidden: boolean;
  isViewed: boolean;
}

export interface NotificationViewedReadDto {
  id: number;
  notificationId: number;
  userId: number;
  viewedAt: string;
  isHidden: boolean;
}

export interface NotificationViewedMarkDto {
  notificationIds: number[];
}

