import React, { useState } from "react";
import { LogOut, Wallet, LogIn, Menu, X } from "lucide-react";
import { usePrivy } from "@privy-io/react-auth";
import { Link, useNavigate } from "react-router-dom";
import { TestModal } from "./TestModal";
import oniLogo from "../assets/logos.png";

export const Header: React.FC = () => {
  const navigate = useNavigate();
  const { logout, login, authenticated } = usePrivy();
  const [isTestModalOpen, setIsTestModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  return (
    <>
      <header className="border-b border-white/10 bg-main-gradient font-mono text-text backdrop-blur-lg relative">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
            {/* Logo and Brand */}
            <div className="flex items-center space-x-3">
              <div className="flex items-center">
                <img src={oniLogo} alt="Oni" className="w-8 h-6 sm:w-12 sm:h-8" />
                <Link to="/" className="hover:opacity-80 transition-opacity">
                  <h1 className="text-lg sm:text-xl font-bold text-white font-mono ml-2">Oni</h1>
                </Link>
            </div>
          </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                  {authenticated && (
                    <button
                      onClick={() => setIsTestModalOpen(true)}
                      className="px-3 py-2 text-gray-300 hover:text-white transition-colors rounded-lg hover:bg-white/10 flex items-center space-x-2"
                    >
                      <span>Chat</span>
                    </button>
                  )}
                <Link 
                  to="/leaderboard" 
                  className="px-3 py-2 text-gray-300 hover:text-white transition-colors rounded-lg hover:bg-white/10"
                  >
                  Leaderboard
                </Link>
                  {authenticated && (
                    <Link 
                      to="/wallet" 
                      className="px-3 py-2 text-gray-300 hover:text-white transition-colors rounded-lg hover:bg-white/10 flex items-center space-x-1"
                    >
                      <Wallet className="w-4 h-4" />
                      <span>Wallet</span>
                    </Link>
                  )}
              </div>
              
              {/* Desktop Auth Button */}
              {authenticated ? (
            <button
                  onClick={() => {logout(); navigate('/')}}
              className="flex items-center space-x-2 px-4 py-2 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 rounded-lg text-red-400 hover:text-red-300 transition-all duration-200"
            >
              <LogOut className="w-4 h-4" />
              <span className="text-sm font-medium">Disconnect</span>
            </button>
              ) : (
                <button
                  onClick={() => login()}
                  className="flex items-center space-x-2 px-4 py-2 bg-green-500/10 hover:bg-green-500/20 border border-green-500/20 rounded-lg text-green-400 hover:text-green-300 transition-all duration-200"
                >
                  <LogIn className="w-4 h-4" />
                  <span className="text-sm font-medium">Connect</span>
                </button>
              )}
          </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center space-x-2">
              {/* Mobile Auth Button - Show only icon on very small screens */}
              {authenticated ? (
                <button
                  onClick={() => {logout(); navigate('/')}}
                  className="flex items-center space-x-1 px-2 sm:px-3 py-2 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 rounded-lg text-red-400 hover:text-red-300 transition-all duration-200"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="hidden sm:inline text-sm font-medium">Disconnect</span>
                </button>
              ) : (
                <button
                  onClick={() => login()}
                  className="flex items-center space-x-1 px-2 sm:px-3 py-2 bg-green-500/10 hover:bg-green-500/20 border border-green-500/20 rounded-lg text-green-400 hover:text-green-300 transition-all duration-200"
                >
                  <LogIn className="w-4 h-4" />
                  <span className="hidden sm:inline text-sm font-medium">Connect</span>
                </button>
              )}
              
              {/* Hamburger Menu Button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 text-gray-300 hover:text-white transition-colors rounded-lg hover:bg-white/10"
                aria-label="Toggle mobile menu"
              >
                {isMobileMenuOpen ? (
                  <X className="w-6 h-6" />
                ) : (
                  <Menu className="w-6 h-6" />
                )}
              </button>
            </div>
          </div>

          {/* Mobile Navigation Menu */}
          {isMobileMenuOpen && (
            <div className="md:hidden mt-4 py-4 border-t border-white/10">
              <div className="flex flex-col space-y-3">
                {authenticated && (
                  <button
                    onClick={() => {
                      setIsTestModalOpen(true);
                      closeMobileMenu();
                    }}
                    className="px-3 py-2 text-gray-300 hover:text-white transition-colors rounded-lg hover:bg-white/10 text-left"
                  >
                    Chat
                  </button>
                )}
                <Link 
                  to="/leaderboard" 
                  onClick={closeMobileMenu}
                  className="px-3 py-2 text-gray-300 hover:text-white transition-colors rounded-lg hover:bg-white/10"
                >
                  Leaderboard
                </Link>
                {authenticated && (
                  <Link 
                    to="/wallet" 
                    onClick={closeMobileMenu}
                    className="px-3 py-2 text-gray-300 hover:text-white transition-colors rounded-lg hover:bg-white/10 flex items-center space-x-2"
                  >
                    <Wallet className="w-4 h-4" />
                    <span>Wallet</span>
                  </Link>
                )}
              </div>
            </div>
          )}
      </div>
    </header>

      {/* Test Modal */}
      <TestModal 
        isOpen={isTestModalOpen} 
        onClose={() => setIsTestModalOpen(false)} 
      />
    </>
  );
};
