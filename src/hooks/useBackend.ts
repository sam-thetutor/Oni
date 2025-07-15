import { useState, useCallback } from 'react';
import { BackendError } from '../types/backend';
import { usePrivy } from '@privy-io/react-auth';
import { BACKEND_URL } from '../utils/constants';

interface BackendContextType {
  loading: boolean;
  error: BackendError | null;
  sendMessage: (message: string, walletAddress?: string) => Promise<any>;
  authFetch: (url: string, options?: RequestInit) => Promise<Response>;
  clearError: () => void;
}

export const useBackend = (): BackendContextType => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<BackendError | null>(null);
  const { user, authenticated, getAccessToken } = usePrivy();

  const handleError = (err: any): BackendError => {
    const error: BackendError = {
      message: err.message || 'An unexpected error occurred',
      code: err.code
    };
    setError(error);
    return error;
  };

  const sendMessage = useCallback(async (message: string, walletAddress?: string): Promise<any> => {
    setLoading(true);
    setError(null);
    
    try {
      // Check if user is authenticated
      if (!authenticated || !user) {
        throw new Error('User must be authenticated to access the API');
      }

      // Get Privy access token for authentication
      const accessToken = await getAccessToken();
      
      console.log('Sending message to backend:', message);
      
      const requestBody = { 
        message
      };

      const response = await fetch(`${BACKEND_URL}/message`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Authentication failed. Please reconnect your wallet.');
        }
        if (response.status === 403) {
          throw new Error('Access denied. You are not authorized to perform this action.');
        }
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
  }, [authenticated, user, getAccessToken]);

  const authFetch = useCallback(async (url: string, options: RequestInit = {}): Promise<Response> => {
    // Check if user is authenticated
    if (!authenticated || !user) {
      throw new Error('User must be authenticated to access the API');
    }

    // Get Privy access token for authentication
    const accessToken = await getAccessToken();
    
    // Prepare headers
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`,
      ...options.headers,
    };

    // Make the request
    const fullUrl = url.startsWith('http') ? url : `${BACKEND_URL}${url}`;
    const response = await fetch(fullUrl, {
      ...options,
      headers,
    });

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('Authentication failed. Please reconnect your wallet.');
      }
      if (response.status === 403) {
        throw new Error('Access denied. You are not authorized to perform this action.');
      }
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || 'Failed to process request');
    }

    return response;
  }, [authenticated, user, getAccessToken]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    loading,
    error,
    sendMessage,
    authFetch,
    clearError,
  };
}; 