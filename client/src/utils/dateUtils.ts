export const formatDateTime = (dateInput: string | Date): string => {
  const date = typeof dateInput === "string" ? new Date(dateInput) : dateInput;

  if (isNaN(date.getTime())) {
    return "Invalid date";
  }

  return date
    .toLocaleString("ru-RU", {
      hour: "2-digit",
      minute: "2-digit",
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    })
    .replace(",", "");
};

export const formatDateOnly = (dateInput: string | Date): string => {
  const date = new Date(dateInput);
  return date.toLocaleDateString("ru-RU"); // 24.12.2025
};

export const formatTimeOnly = (dateInput: string | Date): string => {
  const date = new Date(dateInput);
  return date.toLocaleTimeString("ru-RU", {
    hour: "2-digit",
    minute: "2-digit",
  }); // 20:28
};
