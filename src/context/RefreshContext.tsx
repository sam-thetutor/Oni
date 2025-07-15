import React, { createContext, useContext, useState, useCallback } from 'react';

interface RefreshContextType {
  refreshWallet: () => void;
  refreshTransactions: () => void;
  refreshDCAOrders: () => void;
  refreshPaymentLinks: () => void;
  refreshAll: () => void;
  onWalletRefresh: (callback: () => void) => void;
  onTransactionRefresh: (callback: () => void) => void;
  onDCAOrdersRefresh: (callback: () => void) => void;
  onPaymentLinksRefresh: (callback: () => void) => void;
}

const RefreshContext = createContext<RefreshContextType | undefined>(undefined);

export const useRefresh = () => {
  const context = useContext(RefreshContext);
  if (context === undefined) {
    throw new Error('useRefresh must be used within a RefreshProvider');
  }
  return context;
};

interface RefreshProviderProps {
  children: React.ReactNode;
}

export const RefreshProvider: React.FC<RefreshProviderProps> = ({ children }) => {
  const [walletCallbacks, setWalletCallbacks] = useState<(() => void)[]>([]);
  const [transactionCallbacks, setTransactionCallbacks] = useState<(() => void)[]>([]);
  const [dcaCallbacks, setDCACallbacks] = useState<(() => void)[]>([]);
  const [paymentLinkCallbacks, setPaymentLinkCallbacks] = useState<(() => void)[]>([]);

  const refreshWallet = useCallback(() => {
    console.log('🔄 Triggering wallet refresh...');
    walletCallbacks.forEach(callback => callback());
  }, [walletCallbacks]);

  const refreshTransactions = useCallback(() => {
    console.log('🔄 Triggering transaction refresh...');
    transactionCallbacks.forEach(callback => callback());
  }, [transactionCallbacks]);

  const refreshDCAOrders = useCallback(() => {
    console.log('🔄 Triggering DCA orders refresh...');
    dcaCallbacks.forEach(callback => callback());
  }, [dcaCallbacks]);

  const refreshPaymentLinks = useCallback(() => {
    console.log('🔄 Triggering payment links refresh...');
    paymentLinkCallbacks.forEach(callback => callback());
  }, [paymentLinkCallbacks]);

  const refreshAll = useCallback(() => {
    console.log('🔄 Triggering all refreshes...');
    refreshWallet();
    refreshTransactions();
    refreshDCAOrders();
    refreshPaymentLinks();
  }, [refreshWallet, refreshTransactions, refreshDCAOrders, refreshPaymentLinks]);

  const onWalletRefresh = useCallback((callback: () => void) => {
    setWalletCallbacks(prev => [...prev, callback]);
  }, []);

  const onTransactionRefresh = useCallback((callback: () => void) => {
    setTransactionCallbacks(prev => [...prev, callback]);
  }, []);

  const onDCAOrdersRefresh = useCallback((callback: () => void) => {
    setDCACallbacks(prev => [...prev, callback]);
  }, []);

  const onPaymentLinksRefresh = useCallback((callback: () => void) => {
    setPaymentLinkCallbacks(prev => [...prev, callback]);
  }, []);

  const value: RefreshContextType = {
    refreshWallet,
    refreshTransactions,
    refreshDCAOrders,
    refreshPaymentLinks,
    refreshAll,
    onWalletRefresh,
    onTransactionRefresh,
    onDCAOrdersRefresh,
    onPaymentLinksRefresh,
  };

  return (
    <RefreshContext.Provider value={value}>
      {children}
    </RefreshContext.Provider>
  );
}; 