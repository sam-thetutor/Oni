import { useState, useEffect, useCallback } from 'react';
import { useBackend } from './useBackend';
import { BACKEND_URL } from '../utils/constants';
export interface PaymentLinkData {
  _id: string;
  linkId: string;
  userId: string;
  amount: number;
  status: string;
  createdAt: string;
  updatedAt: string;
  type: 'fixed' | 'global';
  blockchainStatus: string | null;
  onChainData?: {
    creator: string;
    linkId: string;
    amount?: string;
    amountInXFI?: number;
    status?: string;
    totalContributions?: string;
    totalContributionsInXFI?: number;
  };
  paymentUrl: string;
  shareableUrl: string;
}

export interface PaymentLinkStats {
  totalLinks: number;
  fixedLinks: {
    count: number;
    totalAmount: number;
    activeCount: number;
    paidCount: number;
  };
  globalLinks: {
    count: number;
    activeCount: number;
    totalContributions: number;
  };
  recentLinks: Array<{
    linkId: string;
    type: 'fixed' | 'global';
    amount: number;
    status: string;
    createdAt: string;
  }>;
}

export interface PaymentLinksResponse {
  success: boolean;
  data: {
    paymentLinks: PaymentLinkData[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
      hasNextPage: boolean;
      hasPrevPage: boolean;
    };
    summary: {
      totalLinks: number;
      fixedLinks: number;
      globalLinks: number;
    };
  };
}

export interface PaymentLinkStatsResponse {
  success: boolean;
  data: PaymentLinkStats;
}

export const usePaymentLinks = () => {
  const { authFetch } = useBackend();
  const [paymentLinks, setPaymentLinks] = useState<PaymentLinkData[]>([]);
  const [stats, setStats] = useState<PaymentLinkStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
    hasNextPage: false,
    hasPrevPage: false,
  });

  // Fetch user payment links
  const fetchPaymentLinks = useCallback(async (
    page: number = 1, 
    limit: number = 10, 
    type: 'fixed' | 'global' | 'all' = 'all'
  ) => {
    setLoading(true);
    setError(null);
    
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        type: type
      });

      const response = await authFetch(`${BACKEND_URL}/api/user/payment-links?${params}`);
      const data: PaymentLinksResponse = await response.json();
      console.log("data", data);

      if (data.success) {
        setPaymentLinks(data.data.paymentLinks);
        setPagination(data.data.pagination);
      } else {
        throw new Error('Failed to fetch payment links');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch payment links';
      setError(errorMessage);
      console.error('Error fetching payment links:', err);
    } finally {
      setLoading(false);
    }
  }, [authFetch]);

  // Fetch payment link statistics
  const fetchStats = useCallback(async () => {
    try {
      const response = await authFetch('/api/user/payment-links/stats');
      const data: PaymentLinkStatsResponse = await response.json();
      console.log("data here ", data);

      if (data.success) {
        setStats(data.data);
      } else {
        throw new Error('Failed to fetch payment link stats');
      }
    } catch (err) {
      console.error('Error fetching payment link stats:', err);
    }
  }, [authFetch]);

  // Fetch specific payment link
  const fetchPaymentLink = useCallback(async (linkId: string): Promise<PaymentLinkData | null> => {
    try {
      const response = await authFetch(`/api/user/payment-links/${linkId}`);
      const data = await response.json();

      if (data.success) {
        return data.data;
      } else {
        throw new Error(data.error || 'Failed to fetch payment link');
      }
    } catch (err) {
      console.error('Error fetching payment link:', err);
      return null;
    }
  }, [authFetch]);

  // Delete (cancel) payment link
  const deletePaymentLink = useCallback(async (linkId: string): Promise<boolean> => {
    try {
      const response = await authFetch(`/api/user/payment-links/${linkId}`, {
        method: 'DELETE'
      });
      const data = await response.json();

      if (data.success) {
        // Update local state to reflect the change
        setPaymentLinks(prev => 
          prev.map(link => 
            link.linkId === linkId 
              ? { ...link, status: 'cancelled' }
              : link
          )
        );
        return true;
      } else {
        throw new Error(data.error || 'Failed to delete payment link');
      }
    } catch (err) {
      console.error('Error deleting payment link:', err);
      return false;
    }
  }, [authFetch]);

  // Helper functions for pagination
  const goToPage = (page: number) => {
    if (page >= 1 && page <= pagination.totalPages) {
      fetchPaymentLinks(page, pagination.limit);
    }
  };

  const nextPage = () => {
    if (pagination.hasNextPage) {
      goToPage(pagination.page + 1);
    }
  };

  const prevPage = () => {
    if (pagination.hasPrevPage) {
      goToPage(pagination.page - 1);
    }
  };

  // Refresh current data
  const refresh = useCallback(() => {
    fetchPaymentLinks(pagination.page, pagination.limit);
    fetchStats();
  }, [fetchPaymentLinks, fetchStats, pagination.page, pagination.limit]);

  // Initial load
  useEffect(() => {
    fetchPaymentLinks();
    fetchStats();
  }, [fetchPaymentLinks, fetchStats]);

  return {
    // Data
    paymentLinks,
    stats,
    pagination,
    
    // State
    loading,
    error,
    
    // Actions
    fetchPaymentLinks,
    fetchStats,
    fetchPaymentLink,
    deletePaymentLink,
    refresh,
    
    // Pagination
    goToPage,
    nextPage,
    prevPage,
  };
}; 