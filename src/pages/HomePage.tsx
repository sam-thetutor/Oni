import React, { useEffect } from 'react';
import { Wallet as WalletType } from '../types/wallet';
import { Header } from '../components/Header';
import { WalletOverview } from '../components/WalletOverview';
import { Footer } from '../components/Footer';
import { Roadmap } from '../components/Roadmap';
import { AnalyticsOverview } from '../components/AnalyticsOverview';
import { usePrivy, useWallets } from '@privy-io/react-auth';
import { useNavigate } from 'react-router-dom';
import { Bot, Wallet, TrendingUp, Activity, ArrowRight, Sparkles, Shield, Zap, Globe, Users } from 'lucide-react';
import oniLogo from "../assets/logos.png";

export const HomePage= () => {
  const navigate = useNavigate();
  const { authenticated, login } = usePrivy();
  const { wallets } = useWallets();
  const wallet = wallets[0];


  
  return (
    <div className="relative">
      <Header />
      
      {/* Hero Section - Full Screen Height */}
      <div className="relative z-10 min-h-screen flex items-center justify-center">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center flex-col justify-center mb-6">
            <img src={oniLogo} alt="Oni" className="w-16 h-12 md:w-32 md:h-36 mr-4" />
            <h1 className="text-5xl md:text-7xl font-bold text-green-400 font-mono tracking-wider">
              Oni
            </h1>
          </div>
          <p className="text-2xl md:text-3xl text-green-300 max-w-4xl mx-auto mb-8 font-mono">
            Prompt, DeFi - your AI portal to CrossFi
          </p>
          <p className="text-lg text-green-300 max-w-3xl mx-auto mb-12 font-mono">
            Experience seamless blockchain interactions with our intelligent personalized AI Agent. 
            Trade, manage, and explore DeFi with unprecedented ease and security.
          </p>
          <button
            onClick={() => login()}
            className="bg-black/20 backdrop-blur-xl border-2 border-green-400 text-green-400 font-semibold py-3 px-8 rounded-md transition-all duration-200 transform hover:scale-105 text-base hover:bg-green-400 hover:text-black font-mono"
          >
            Get Started with Oni
          </button>
        </div>
      </div>

      {/* Content Sections - Below Hero */}
      <div className="container mx-auto px-4 py-1">
        {/* Analytics Section */}
        <AnalyticsOverview />

        {/* Features Section */}
        {/* <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          <div className=" p-8 text-center hover:border-green-400 transition-colors duration-300">
            <Bot className="w-16 h-16 text-green-400 mx-auto mb-4" />
            <h3 className="text-2xl font-semibold text-white mb-4 font-mono">AI-Powered Trading</h3>
            <p className="text-green-300 font-mono">
              Intelligent trading suggestions and automated portfolio management powered by advanced AI algorithms.
            </p>
          </div>
          
          <div className=" p-8 text-center hover:border-green-400 transition-colors duration-300">
            <Shield className="w-16 h-16 text-green-400 mx-auto mb-4" />
            <h3 className="text-2xl font-semibold text-white mb-4 font-mono">Enhanced Security</h3>
            <p className="text-green-300 font-mono">
              Multi-layer security with real-time threat detection and secure wallet integration.
            </p>
          </div>
          
          <div className=" p-8 text-center hover:border-green-400 transition-colors duration-300">
            <Globe className="w-16 h-16 text-green-400 mx-auto mb-4" />
            <h3 className="text-2xl font-semibold text-white mb-4 font-mono">CrossFi Integration</h3>
            <p className="text-green-300 font-mono">
              Native support for CrossFi blockchain with XFI and MPX token management.
            </p>
          </div>
        </div> */}

        {/* Vision Section */}
        <div className=" rounded-3xl p-12 mt-32 mb-16">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-white mb-3 font-mono">Our Vision</h2>
            <p className="text-xl text-green-300 max-w-4xl mx-auto font-mono">
              If you can prompt, you can DeFi
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="flex items-start">
                <div className="bg-green-400 rounded-full p-2 mr-4 mt-1">
                  <TrendingUp className="w-5 h-5 text-black" />
                </div>
                <div>
                  <h4 className="text-xl font-semibold text-white mb-2 font-mono">Universal Access</h4>
                  <p className="text-green-300 font-mono">
                    No technical expertise required. If you can type a message, you can trade, manage portfolios, and explore DeFi on CrossFi.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="bg-green-400 rounded-full p-2 mr-4 mt-1">
                  <Users className="w-5 h-5 text-black" />
                </div>
                <div>
                  <h4 className="text-xl font-semibold text-white mb-2 font-mono">Inclusive Design</h4>
                  <p className="text-green-300 font-mono">
                    Built for everyone - from crypto beginners to DeFi veterans. Natural language makes blockchain accessible to all.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="space-y-6">
              <div className="flex items-start">
                <div className="bg-green-400 rounded-full p-2 mr-4 mt-1">
                  <Activity className="w-5 h-5 text-black" />
                </div>
                <div>
                  <h4 className="text-xl font-semibold text-white mb-2 font-mono">Intelligent Guidance</h4>
                  <p className="text-green-300 font-mono">
                    AI-powered insights and real-time analytics help you make informed decisions on CrossFi, regardless of your experience level.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="bg-green-400 rounded-full p-2 mr-4 mt-1">
                  <Zap className="w-5 h-5 text-black" />
                </div>
                <div>
                  <h4 className="text-xl font-semibold text-white mb-2 font-mono">Seamless Experience</h4>
                  <p className="text-green-300 font-mono">
                    Complex DeFi operations simplified through natural language. Trade, stake, and manage assets with simple prompts.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Roadmap Section */}
        <Roadmap />
      </div>

    </div>
  );
 

  // // Show loading state for authenticated users (this will redirect to /ai)
  // return (
  //   <div className="min-h-screen">
  //     <Header />
  //     <div className="container mx-auto px-4 py-8">
  //       <div className="text-center">
  //         <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-400 mx-auto"></div>
  //         <p className="text-green-400 mt-4 font-mono">Redirecting to AI Interface...</p>
  //       </div>
  //     </div>
  //   </div>
  // );
}; 