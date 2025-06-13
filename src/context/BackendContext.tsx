import React, { createContext, useContext } from 'react';
import { useBackend } from '../hooks/useBackend';

interface BackendContextType {
  loading: boolean;
  error: {
    message: string;
    code?: string;
  } | null;
  sendMessage: (message: string) => Promise<any>;
  clearError: () => void;
}

const BackendContext = createContext<BackendContextType | undefined>(undefined);

export const BackendProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const backend = useBackend();

  return (
    <BackendContext.Provider value={backend}>
      {children}
    </BackendContext.Provider>
  );
};

export const useBackendContext = () => {
  const context = useContext(BackendContext);
  if (context === undefined) {
    throw new Error('useBackendContext must be used within a BackendProvider');
  }
  return context;
}; 