import React, { useEffect } from 'react';
import { Wallet as WalletType } from '../types/wallet';
import { Header } from '../components/Header';
import { WalletOverview } from '../components/WalletOverview';
import { usePrivy, useWallets } from '@privy-io/react-auth';
import { useNavigate } from 'react-router-dom';
import { Bot, Wallet, TrendingUp, Activity, ArrowRight, Sparkles, Shield, Zap, Globe, Users } from 'lucide-react';
import oniLogo from "../assets/logos.png";

export const HomePage= () => {
  const navigate = useNavigate();
  const { authenticated, login } = usePrivy();
  const { wallets } = useWallets();
  const wallet = wallets[0];

  // Redirect authenticated users to AI interface
  // useEffect(() => {
  //   if (authenticated && wallets.length > 0) {
  //     navigate('/ai');
  //   }
  // }, [authenticated, wallets, navigate]);

  // Show landing page for non-authenticated users
  
    return (
      <div className="min-h-screen bg-main-gradient font-mono text-text">
        <Header />
        
        {/* Hero Section */}
        <div className="container mx-auto px-4 py-16">
          <div className="text-center mb-16">
            <div className="flex items-center justify-center mb-6">
              <h1 className="text-5xl md:text-7xl font-bold text-white">
                Oni
              </h1>
            </div>
            <p className="text-2xl md:text-3xl text-blue-200 max-w-4xl mx-auto mb-8">
              The Future of AI-Powered DeFi on CrossFi
            </p>
            <p className="text-lg text-blue-300 max-w-3xl mx-auto mb-12">
              Experience seamless blockchain interactions with our intelligent AI assistant. 
              Trade, manage, and explore DeFi with unprecedented ease and security.
            </p>
            <button
              onClick={() => login()}
              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold py-4 px-12 rounded-xl transition-all duration-200 transform hover:scale-105 text-lg flex items-center mx-auto"
            >
              <img src={oniLogo} alt="Oni" className="w-12 h-8" />
              Get Started with Oni
            </button>
          </div>

          {/* Features Section */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 text-center">
              <Bot className="w-16 h-16 text-blue-400 mx-auto mb-4" />
              <h3 className="text-2xl font-semibold text-white mb-4">AI-Powered Trading</h3>
              <p className="text-blue-200">
                Intelligent trading suggestions and automated portfolio management powered by advanced AI algorithms.
              </p>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 text-center">
              <Shield className="w-16 h-16 text-green-400 mx-auto mb-4" />
              <h3 className="text-2xl font-semibold text-white mb-4">Enhanced Security</h3>
              <p className="text-blue-200">
                Multi-layer security with real-time threat detection and secure wallet integration.
              </p>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 text-center">
              <Globe className="w-16 h-16 text-purple-400 mx-auto mb-4" />
              <h3 className="text-2xl font-semibold text-white mb-4">CrossFi Integration</h3>
              <p className="text-blue-200">
                Native support for CrossFi blockchain with XFI and MPX token management.
              </p>
            </div>
          </div>

          {/* Vision Section */}
          <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-12 mb-16">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-white mb-6">Our Vision</h2>
              <p className="text-xl text-blue-200 max-w-4xl mx-auto">
                To democratize DeFi by making blockchain technology accessible to everyone through intelligent AI assistance.
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="bg-blue-500 rounded-full p-2 mr-4 mt-1">
                    <TrendingUp className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h4 className="text-xl font-semibold text-white mb-2">Simplified Trading</h4>
                    <p className="text-blue-200">
                      Complex DeFi operations made simple with natural language commands and AI guidance.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="bg-green-500 rounded-full p-2 mr-4 mt-1">
                    <Users className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h4 className="text-xl font-semibold text-white mb-2">Community Driven</h4>
                    <p className="text-blue-200">
                      Built for the community, with continuous improvements based on user feedback and needs.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="bg-purple-500 rounded-full p-2 mr-4 mt-1">
                    <Activity className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h4 className="text-xl font-semibold text-white mb-2">Real-time Analytics</h4>
                    <p className="text-blue-200">
                      Advanced portfolio tracking and market analysis with predictive insights.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="bg-yellow-500 rounded-full p-2 mr-4 mt-1">
                    <Zap className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h4 className="text-xl font-semibold text-white mb-2">Lightning Fast</h4>
                    <p className="text-blue-200">
                      Optimized performance with instant transaction processing and real-time updates.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    );
  

  // // Show loading state for authenticated users (this will redirect to /ai)
  // return (
  //   <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900">
  //     <Header />
  //     <div className="container mx-auto px-4 py-8">
  //       <div className="text-center">
  //         <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-white mx-auto"></div>
  //         <p className="text-white mt-4">Redirecting to AI Interface...</p>
  //       </div>
  //     </div>
  //   </div>
  // );
}; 