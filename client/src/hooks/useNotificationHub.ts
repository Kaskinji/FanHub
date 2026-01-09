import { useEffect, useRef, useState, useCallback } from "react";
import * as signalR from "@microsoft/signalr";
import { SERVER_CONFIG } from "../config/apiConfig";
import { fandomNotificationApi } from "../api/FandomNotificationApi";
import type { FandomNotificationReadDto } from "../types/Notification";

interface UseNotificationHubReturn {
  hasNewNotification: boolean;
  clearNewNotification: () => void;
  checkUnreadNotifications: () => Promise<void>;
  isConnected: boolean;
}

export const useNotificationHub = (
  isAuthenticated: boolean,
  userId: number | undefined
): UseNotificationHubReturn => {
  const [hasNewNotification, setHasNewNotification] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const connectionRef = useRef<signalR.HubConnection | null>(null);

  const clearNewNotification = useCallback(() => {
    setHasNewNotification(false);
  }, []);

  // Функция для проверки непрочитанных уведомлений
  const checkUnreadNotifications = useCallback(async () => {
    if (!isAuthenticated || !userId) {
      return;
    }

    try {
      const notifications = await fandomNotificationApi.getNotificationsWithViewed(false);
      // Проверяем, есть ли непрочитанные уведомления
      const hasUnread = notifications.some((notification) => !notification.isViewed);
      setHasNewNotification(hasUnread);
    } catch (error) {
      console.error("Failed to check unread notifications:", error);
      // В случае ошибки не устанавливаем флаг
    }
  }, [isAuthenticated, userId]);

  useEffect(() => {
    if (!isAuthenticated || !userId) {
      // Если пользователь не авторизован, закрываем соединение если оно есть
      if (connectionRef.current) {
        connectionRef.current.stop();
        connectionRef.current = null;
        setIsConnected(false);
      }
      setHasNewNotification(false);
      return;
    }

    // Проверяем непрочитанные уведомления при подключении
    checkUnreadNotifications();

    // Создаем соединение
    const connection = new signalR.HubConnectionBuilder()
      .withUrl(`${SERVER_CONFIG.BASE_URL}/notificationHub`, {
        withCredentials: true,
      })
      .withAutomaticReconnect()
      .build();

    connectionRef.current = connection;

    // Обработчик получения уведомления
    connection.on("ReceiveNotification", (notification: FandomNotificationReadDto) => {
      console.log("Received notification:", notification);
      setHasNewNotification(true);
      // Обновляем список уведомлений
      checkUnreadNotifications();
    });

    // Обработчики состояния соединения
    connection.onclose(() => {
      setIsConnected(false);
    });

    connection.onreconnecting(() => {
      setIsConnected(false);
    });

    connection.onreconnected(() => {
      setIsConnected(true);
      checkUnreadNotifications();
    });

    // Подключаемся
    connection
      .start()
      .then(() => {
        setIsConnected(true);
      })
      .catch(() => {
        setIsConnected(false);
      });

    // Cleanup при размонтировании или изменении зависимостей
    return () => {
      if (connectionRef.current) {
        connectionRef.current.stop();
        connectionRef.current = null;
        setIsConnected(false);
      }
    };
  }, [isAuthenticated, userId, checkUnreadNotifications]);

  return {
    hasNewNotification,
    clearNewNotification,
    checkUnreadNotifications,
    isConnected,
  };
};

