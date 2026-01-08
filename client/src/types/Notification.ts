import type { FandomNotificationType } from "./enums/FandomNotificationType";

export interface FandomNotificationReadDto {
  id: number;
  fandomId: number;
  notifierId: number;
  createdAt: string;
  type: FandomNotificationType;
}

