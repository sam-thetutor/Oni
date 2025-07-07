import React from 'react';
import { Link } from 'react-router-dom';
import { Github, Twitter, ExternalLink, Heart, Zap } from 'lucide-react';
import oniLogo from '../assets/logos.png';

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-white/10 bg-main-gradient font-mono text-text backdrop-blur-lg mt-auto">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 py-6 sm:py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-1">
            <div className="flex items-center space-x-3 mb-4">
              <img src={oniLogo} alt="Oni" className="w-8 h-6 sm:w-10 sm:h-8" />
              <h3 className="text-lg sm:text-xl font-bold text-white">Oni</h3>
            </div>
            <p className="text-sm text-gray-300 mb-4 leading-relaxed">
              Your intelligent CrossFi blockchain assistant. Simplifying crypto transactions with AI-powered tools and real-time ecosystem insights.
            </p>
            <div className="flex items-center space-x-2 text-xs text-gray-400">
              <span>Built with</span>
              <Heart className="w-3 h-3 text-red-400" />
              <span>for the CrossFi community</span>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="lg:col-span-1">
            <h4 className="text-sm font-semibold text-white mb-3 sm:mb-4">Navigation</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link 
                  to="/" 
                  className="text-gray-300 hover:text-white transition-colors flex items-center space-x-1"
                >
                  <span>Home</span>
                </Link>
              </li>
              <li>
                <Link 
                  to="/wallet" 
                  className="text-gray-300 hover:text-white transition-colors flex items-center space-x-1"
                >
                  <span>Wallet</span>
                </Link>
              </li>
              <li>
                <Link 
                  to="/leaderboard" 
                  className="text-gray-300 hover:text-white transition-colors flex items-center space-x-1"
                >
                  <span>Leaderboard</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Features */}
          <div className="lg:col-span-1">
            <h4 className="text-sm font-semibold text-white mb-3 sm:mb-4">Features</h4>
            <ul className="space-y-2 text-sm">
              <li className="text-gray-300 flex items-center space-x-2">
                <Zap className="w-3 h-3 text-purple-400" />
                <span>AI-Powered Chat</span>
              </li>
              <li className="text-gray-300 flex items-center space-x-2">
                <Zap className="w-3 h-3 text-blue-400" />
                <span>Payment Links</span>
              </li>
              <li className="text-gray-300 flex items-center space-x-2">
                <Zap className="w-3 h-3 text-green-400" />
                <span>Real-time Analytics</span>
              </li>
              <li className="text-gray-300 flex items-center space-x-2">
                <Zap className="w-3 h-3 text-yellow-400" />
                <span>Ecosystem Insights</span>
              </li>
            </ul>
          </div>

          {/* CrossFi & Links */}
          <div className="lg:col-span-1">
            <h4 className="text-sm font-semibold text-white mb-3 sm:mb-4">CrossFi Ecosystem</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a 
                  href="https://test.xfiscan.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-300 hover:text-white transition-colors flex items-center space-x-1"
                >
                  <span>CrossFi Explorer</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </li>
              <li>
                <a 
                  href="https://crossfi.org" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-300 hover:text-white transition-colors flex items-center space-x-1"
                >
                  <span>CrossFi Network</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </li>
              <li>
                <a 
                  href="https://docs.crossfi.org" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-300 hover:text-white transition-colors flex items-center space-x-1"
                >
                  <span>Documentation</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-white/10 mt-6 sm:mt-8 pt-4 sm:pt-6">
          <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
            {/* Copyright */}
            <div className="text-xs sm:text-sm text-gray-400 text-center sm:text-left">
              <p>© {currentYear} Oni AI Assistant. Powered by CrossFi Network.</p>
              <p className="mt-1">Building the future of decentralized AI.</p>
            </div>

            {/* Social Links */}
            <div className="flex items-center space-x-4">
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors"
                aria-label="GitHub"
              >
                <Github className="w-5 h-5" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="w-5 h-5" />
              </a>
              <div className="flex items-center space-x-2 text-xs text-gray-500">
                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                <span>Testnet</span>
              </div>
            </div>
          </div>
        </div>

        {/* Tech Stack */}
        {/* <div className="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-white/5">
          <div className="text-center">
            <p className="text-xs text-gray-500 mb-2">Built with modern technology</p>
            <div className="flex flex-wrap justify-center items-center gap-2 sm:gap-4 text-xs text-gray-400">
              <span className="bg-white/5 px-2 py-1 rounded">React</span>
              <span className="bg-white/5 px-2 py-1 rounded">TypeScript</span>
              <span className="bg-white/5 px-2 py-1 rounded">Viem</span>
              <span className="bg-white/5 px-2 py-1 rounded">LangGraph</span>
              <span className="bg-white/5 px-2 py-1 rounded">Groq AI</span>
              <span className="bg-white/5 px-2 py-1 rounded">CrossFi</span>
            </div>
          </div>
        </div> */}
      </div>
    </footer>
  );
}; 