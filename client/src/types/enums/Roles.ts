export const Role = {
  Admin: 0,
  User: 1,
} as const;

export type Role = typeof Role[keyof typeof Role];