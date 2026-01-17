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

  
  const checkUnreadNotifications = useCallback(async () => {
    if (!isAuthenticated || !userId) {
      return;
    }

    try {
      const notifications = await fandomNotificationApi.getNotificationsWithViewed(false);
      
      const hasUnread = notifications.some((notification) => !notification.isViewed);
      setHasNewNotification(hasUnread);
    } catch (error) {
      console.error("Failed to check unread notifications:", error);
      
    }
  }, [isAuthenticated, userId]);

  useEffect(() => {
    if (!isAuthenticated || !userId) {
      
      if (connectionRef.current) {
        connectionRef.current.stop();
        connectionRef.current = null;
        setIsConnected(false);
      }
      setHasNewNotification(false);
      return;
    }

    
    checkUnreadNotifications();

    
    const connection = new signalR.HubConnectionBuilder()
      .withUrl(`${SERVER_CONFIG.BASE_URL}/notificationHub`, {
        withCredentials: true,
      })
      .withAutomaticReconnect()
      .build();

    connectionRef.current = connection;

    
    connection.on("ReceiveNotification", (notification: FandomNotificationReadDto) => {
      console.log("Received notification:", notification);
      setHasNewNotification(true);
      
      checkUnreadNotifications();
    });

    
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

    
    connection
      .start()
      .then(() => {
        setIsConnected(true);
      })
      .catch(() => {
        setIsConnected(false);
      });

    
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

