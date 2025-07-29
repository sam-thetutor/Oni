import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { PrivyProvider } from '@privy-io/react-auth';
import { PrivyConfig } from './config/privy';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { HomePage } from './pages/HomePage';
import { WalletPage } from './pages/WalletPage';
import LeaderboardPage from './pages/LeaderboardPage';
import { LitepaperPage } from './pages/LitepaperPage';
import GlobalPayLinkPage from './pages/GlobalPayLinkPage';
import PayLinkPage from './pages/PayLinkPage';
import { BackendProvider } from './context/BackendContext';
import { RefreshProvider } from './context/RefreshContext';
import { WebSocketProvider } from './context/WebSocketContext';
import { usePrivy } from '@privy-io/react-auth';
import oniLogo from './assets/logos.png';

function AppContent() {
  const { ready, authenticated } = usePrivy();
  const [showInitializing, setShowInitializing] = useState(true);

  useEffect(() => {
    // Show initializing page for 6 seconds
    const timer = setTimeout(() => {
      setShowInitializing(false);
    }, 6000);

    return () => clearTimeout(timer);
  }, []);

  // Show initializing page
  if (!ready || showInitializing) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%2310b981' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }} />
        </div>

        <div className="relative z-10 text-center">
          {/* Logo */}
          <div className="mb-8">
            <img src={oniLogo} alt="Oni" className="w-24 h-20 mx-auto mb-4" />
            <h1 className="text-4xl font-bold text-green-400 font-mono mb-2">Oni</h1>
            <p className="text-green-300 font-mono">AI Agent Platform for CrossFi DeFi</p>
          </div>

          {/* Loading Animation */}
          <div className="flex items-center justify-center space-x-2 mb-6">
            <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
            <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
            <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
          </div>

          {/* Status Messages */}
          <div className="space-y-2 text-green-300 font-mono">
            <p>Initializing Oni Platform...</p>
            <p className="text-sm opacity-70">Connecting to CrossFi Network</p>
            <p className="text-sm opacity-50">Loading AI Assistant</p>
            <p className="text-sm opacity-30">Preparing DeFi Tools</p>
          </div>

          {/* Progress Bar */}
          <div className="w-64 h-1 bg-green-400/20 rounded-full mt-6 mx-auto overflow-hidden">
            <div className="h-full bg-green-400 rounded-full animate-pulse" style={{
              width: '60%',
              animation: 'pulse 2s infinite'
            }}></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <BackendProvider>
        <RefreshProvider>
          <WebSocketProvider>
            <div className="min-h-screen relative">
              {/* <Header /> */}
              <main>
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/wallet" element={<WalletPage />} />
                  <Route path="/leaderboard" element={<LeaderboardPage />} />
                  <Route path="/litepaper" element={<LitepaperPage />} />
                  <Route path="/pay/:linkId" element={<PayLinkPage />} />
                  <Route path="/paylink/:linkId" element={<PayLinkPage />} />
                  <Route path="/global/:linkId" element={<GlobalPayLinkPage />} />
                </Routes>
              </main>
              <Footer />
            </div>
          </WebSocketProvider>
        </RefreshProvider>
      </BackendProvider>
    </Router>
  );
}

function App() {
  return (
    <PrivyProvider appId={PrivyConfig.appId} config={PrivyConfig.config}>
      <AppContent />
    </PrivyProvider>
  );
}

export default App;