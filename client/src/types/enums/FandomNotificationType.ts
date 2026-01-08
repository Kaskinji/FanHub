export const FandomNotificationType = {
  EventCreated: 0,
  PostCreated: 1,
} as const;

export type FandomNotificationType = typeof FandomNotificationType[keyof typeof FandomNotificationType];