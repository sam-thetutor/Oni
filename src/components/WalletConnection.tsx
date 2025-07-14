import React, { useState, useEffect } from "react";
import {
  Wallet,
  Shield,
  Sparkles,
  LogOut,
  User,
  RefreshCw,
} from "lucide-react";
import { Wallet as WalletType } from "../types/wallet";
import { usePrivy, useWallets } from "@privy-io/react-auth";
import { useWalletBalance } from "../hooks/useWalletBalance";
import oniLogo from "../assets/logos.png";
import { useBackendWallet } from "../hooks/useBackendWallet";

interface WalletConnectionProps {
  onConnect: (wallet: WalletType) => void;
}

export const WalletConnection: React.FC<WalletConnectionProps> = ({
  onConnect,
}) => {
  const { login, logout, authenticated, user, ready } = usePrivy();
  const { wallets } = useWallets();
  const { backendWallet, loading } = useBackendWallet();

  const { xfi, mpx, tUSDC, isLoading, error, refreshBalances } =
    useWalletBalance(backendWallet || null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [walletData, setWalletData] = useState<WalletType | null>(null);

  console.log("wallets", wallets);
  // Get chain name from chain ID
  const getChainName = (chainId: number): WalletType["chain"] => {
    switch (chainId) {
      case 4157:
        return "crossfi";
      case 1:
        return "ethereum";
      case 137:
        return "polygon";
      case 56:
        return "bsc";
      case 42161:
        return "arbitrum";
      default:
        return "crossfi";
    }
  };

  // Handle wallet connection
  useEffect(() => {
    const initializeWallet = async () => {
      if (authenticated && wallets.length > 0 && ready) {
        setIsConnecting(true);
        try {
          const wallet = wallets[0]; // Get the first connected wallet
          const address = wallet.address;

          // Create wallet data object
          const walletInfo: WalletType = {
            address,
            balance: {
              eth: xfi,
              usdc: mpx, // MPX balance
              usdt: 0,
            },
            chain: getChainName(Number(wallet.chainId)),
            connectionType: "privy",
          };

          setWalletData(walletInfo);
          onConnect(walletInfo);
        } catch (error) {
          console.error("Error initializing wallet:", error);
        } finally {
          setIsConnecting(false);
        }
      } else {
        setWalletData(null);
      }
    };

    initializeWallet();
  }, [authenticated, wallets, ready, onConnect, xfi, mpx]);

  // Handle login
  const handleLogin = async () => {
    try {
      setIsConnecting(true);
      await login();
    } catch (error) {
      console.error("Login error:", error);
    } finally {
      setIsConnecting(false);
    }
  };

  // Handle logout
  const handleLogout = async () => {
    try {
      await logout();
      setWalletData(null);
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  // Handle refresh balance
  const handleRefreshBalance = async () => {
    await refreshBalances();
  };

  if (!ready) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p className="text-gray-300">Initializing wallet connection...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-full max-w-md">
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 p-6 shadow-2xl">
          {isConnecting ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
              <p className="text-gray-300">Connecting wallet...</p>
            </div>
          ) : authenticated && walletData ? (
            <div className="text-center py-8">
              <div className="text-center mb-8 flex flex-col items-center justify-center">
                <div className="flex items-center justify-center">
                  <img src={oniLogo} alt="Oni Logo" className="w-16 h-16" />
                  <div className="flex text-left flex-col">
                    <h1 className="text-2xl font-bold text-white">
                      Oni Wallet
                    </h1>
                    <p className="text-gray-300 text-xs">
                      Your AI-powered crypto assistant
                    </p>
                  </div>
                </div>
              </div>

              {user?.email?.address && (
                <div className="flex items-center justify-center mb-4">
                  <User className="w-4 h-4 text-gray-400 mr-2" />
                  <p className="text-gray-300 text-sm">{user.email.address}</p>
                </div>
              )}

              <div className="bg-gray-800/50 rounded-lg p-3 text-left mb-4">
                <p className="text-sm text-gray-400">Address:</p>
                {!loading && backendWallet ? (
                  <div className="flex items-center space-x-2">
                    <div className="h-5 w-32 bg-gray-700 rounded animate-pulse"></div>
                  </div>
                ) : (
                  <p className="text-white font-mono text-sm break-all">
                    {/* shorten the address to 4 characters from the start and 4 characters from the end */}
                    {backendWallet?.slice(0, 4) +
                      "..." +
                      backendWallet?.slice(-4)}
                  </p>
                )}
              </div>

              <div className="bg-gray-800/50 rounded-lg p-3 text-left mb-4">
                <div className="flex justify-between items-center mb-2">
                  <div>
                    <p className="text-sm text-gray-400">XFI Balance:</p>
                    {isLoading ? (
                      <div className="flex items-center space-x-2">
                        <div className="h-6 w-16 bg-gray-700 rounded animate-pulse"></div>
                        <span className="text-gray-500 text-sm">XFI</span>
                      </div>
                    ) : (
                      <p className="text-white text-lg font-semibold">
                        {xfi.toFixed(4)} XFI
                      </p>
                    )}
                  </div>
                  <button
                    onClick={handleRefreshBalance}
                    disabled={isLoading}
                    className="p-2 text-gray-400 hover:text-white transition-colors"
                  >
                    <RefreshCw
                      className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`}
                    />
                  </button>
                </div>
                <div className="mb-2">
                  <p className="text-sm text-gray-400">MPX Balance:</p>
                  {isLoading ? (
                    <div className="flex items-center space-x-2">
                      <div className="h-5 w-14 bg-gray-700 rounded animate-pulse"></div>
                      <span className="text-gray-500 text-sm">MPX</span>
                    </div>
                  ) : (
                    <p className="text-white text-md font-semibold">
                      {mpx.toFixed(4)} MPX
                    </p>
                  )}
                </div>
                <div>
                  <p className="text-sm text-gray-400">USDC Balance:</p>
                  {isLoading ? (
                    <div className="flex items-center space-x-2">
                      <div className="h-5 w-14 bg-gray-700 rounded animate-pulse"></div>
                      <span className="text-gray-500 text-sm">USDC</span>
                    </div>
                  ) : (
                    <p className="text-white text-md font-semibold">
                      {tUSDC.toFixed(4)} USDC
                    </p>
                  )}
                </div>
              </div>

              {/* {error && (
                <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-3 mb-4">
                  <p className="text-red-400 text-sm">{error}</p>
                </div>
              )} */}

              <div className="bg-gray-800/50 rounded-lg p-3 text-left mb-6">
                <p className="text-sm text-gray-400">Network:</p>
                <p className="text-white text-sm capitalize">
                  {walletData.chain === "crossfi"
                    ? "CrossFi Testnet"
                    : walletData.chain}
                </p>
              </div>

              <button
                onClick={handleLogout}
                className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-200 flex items-center justify-center"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Disconnect Wallet
              </button>
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="inline-block p-3 bg-purple-500/20 rounded-full mb-4">
                <Sparkles className="w-6 h-6 text-purple-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-4">
                Connect Your Wallet
              </h3>
              <p className="text-gray-300 mb-6">
                Choose your preferred login method to access the AI-powered
                crypto assistant
              </p>

              <button
                onClick={handleLogin}
                disabled={isConnecting}
                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-gray-900"
              >
                {isConnecting ? "Connecting..." : "Connect Wallet"}
              </button>

              <div className="mt-6 text-center">
                <p className="text-xs text-gray-400">
                  Supports MetaMask, WalletConnect, and embedded wallets
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="mt-8 text-center">
          <p className="text-xs text-gray-500">
            Powered by Privy • Secure • Non-custodial
          </p>
        </div>
      </div>
    </div>
  );
};
