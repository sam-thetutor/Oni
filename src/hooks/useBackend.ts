import { useState, useCallback } from 'react';
import { BackendError } from '../types/backend';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3030';

export const useBackend = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<BackendError | null>(null);

  const handleError = (err: any): BackendError => {
    const error: BackendError = {
      message: err.message || 'An unexpected error occurred',
      code: err.code
    };
    setError(error);
    return error;
  };

  const sendMessage = useCallback(async (message: string): Promise<any> => {
    setLoading(true);
    setError(null);
    try {
      console.log('Sending message to backend:', message);
      const response = await fetch(`${BACKEND_URL}/message`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: message,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to process request');
      }

      const data = await response.json();
      console.log('Backend response:', data);
      return data.response || data.message || 'Command executed successfully';
    } catch (err) {
      console.error('Backend error:', err);
      throw handleError(err);
    } finally {
      setLoading(false);
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    loading,
    error,
    sendMessage,
    clearError,
  };
}; 