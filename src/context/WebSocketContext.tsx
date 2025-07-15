import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';
import { usePrivy } from '@privy-io/react-auth';
import { BACKEND_URL } from '../utils/constants';

interface WebSocketContextType {
  socket: Socket | null;
  isConnected: boolean;
  isConnecting: boolean;
  connect: () => void;
  disconnect: () => void;
  emit: (event: string, data?: any) => void;
}

const WebSocketContext = createContext<WebSocketContextType | undefined>(undefined);

export const useWebSocket = () => {
  const context = useContext(WebSocketContext);
  if (context === undefined) {
    throw new Error('useWebSocket must be used within a WebSocketProvider');
  }
  return context;
};

interface WebSocketProviderProps {
  children: React.ReactNode;
}

export const WebSocketProvider: React.FC<WebSocketProviderProps> = ({ children }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const { user, authenticated, getAccessToken } = usePrivy();
  

  //const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3030';
  
  // Only enable WebSocket in development or when explicitly configured
  const isWebSocketEnabled = import.meta.env.DEV || 
    BACKEND_URL.includes('localhost') || 
    BACKEND_URL.includes('railway') ||
    import.meta.env.VITE_ENABLE_WEBSOCKET === 'true';

  const connect = useCallback(async () => {
    if (!authenticated || !user || socket?.connected || !isWebSocketEnabled) {
      return;
    }

    try {
      setIsConnecting(true);
      
      // Get access token for authentication
      const accessToken = await getAccessToken();
      
      if (!accessToken) {
        console.error('No access token available');
        return;
      }

      // Create socket connection (temporarily without authentication for testing)
      const newSocket = io(BACKEND_URL, {
        // auth: {
        //   token: accessToken
        // },
        transports: ['websocket', 'polling'],
        autoConnect: true,
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
        timeout: 20000,
        query: {
          walletAddress: "0x4C969435f82Dd15E8F7E242A45476065b1a74fc0"
        }
      });

      // Connection event handlers
      newSocket.on('connect', () => {
        console.log('🔌 WebSocket connected successfully');
        console.log('🔌 Socket ID:', newSocket.id);
        console.log('🔌 Connected to:', BACKEND_URL);
        setIsConnected(true);
        setIsConnecting(false);
      });

      newSocket.on('disconnect', (reason) => {
        console.log('🔌 WebSocket disconnected:', reason);
        setIsConnected(false);
        setIsConnecting(false);
      });

      newSocket.on('connect_error', (error) => {
        console.error('🔌 WebSocket connection error:', error);
        setIsConnected(false);
        setIsConnecting(false);
        
        // Log specific error details for debugging
        if (error.message) {
          console.log('Connection error details:', error.message);
        }
      });

      newSocket.on('error', (error) => {
        console.error('🔌 WebSocket error:', error);
      });

      setSocket(newSocket);
    } catch (error) {
      console.error('Error connecting to WebSocket:', error);
      setIsConnecting(false);
    }
  }, [authenticated, user, getAccessToken, BACKEND_URL, socket?.connected]);

  const disconnect = useCallback(() => {
    if (socket) {
      socket.disconnect();
      setSocket(null);
      setIsConnected(false);
      setIsConnecting(false);
    }
  }, [socket]);

  const emit = useCallback((event: string, data?: any) => {
    if (socket?.connected) {
      socket.emit(event, data);
    } else {
      console.warn('WebSocket not connected, cannot emit event:', event);
    }
  }, [socket]);

  // Auto-connect when user is authenticated
  useEffect(() => {
    if (authenticated && user && !socket && isWebSocketEnabled) {
      connect();
    } else if (!authenticated && socket) {
      disconnect();
    }
  }, [authenticated, user, socket, connect, disconnect, isWebSocketEnabled]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  }, [socket]);

  const value: WebSocketContextType = {
    socket,
    isConnected,
    isConnecting,
    connect,
    disconnect,
    emit
  };

  return (
    <WebSocketContext.Provider value={value}>
      {children}
    </WebSocketContext.Provider>
  );
}; 