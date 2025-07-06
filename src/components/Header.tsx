import React, { useState } from "react";
import { LogOut, Wallet, LogIn, TestTube } from "lucide-react";
import { usePrivy } from "@privy-io/react-auth";
import { Link, useNavigate } from "react-router-dom";
import { TestModal } from "./TestModal";
import oniLogo from "../assets/logos.png";

export const Header: React.FC = () => {
  const navigate = useNavigate();
  const { logout, login, authenticated } = usePrivy();
  const [isTestModalOpen, setIsTestModalOpen] = useState(false);

  return (
    <>
      <header className="border-b border-white/10 bg-main-gradient font-mono text-text backdrop-blur-lg">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
              <div className="flex items-center ">
                <img src={oniLogo} alt="Oni" className="w-12 h-8" />
                <Link to="/" className="hover:opacity-80 transition-opacity">
                    <h1 className="text-xl font-bold text-white font-mono">Oni </h1>
                    {/* <p className="text-xs text-gray-400">
                      Personalized Ai Assistant
                    </p> */}
                </Link>
            </div>
          </div>

          <div className="flex items-center space-x-4">
              {/* Navigation Links for testing */}
              <div className="flex items-center space-x-2">
                {/* <Link 
                  to="/" 
                  className="px-3 py-2 text-gray-300 hover:text-white transition-colors rounded-lg hover:bg-white/10"
                >
                  Home
                </Link> */}
               {/* {authenticated && <Link 
                  to="/ai" 
                  className="px-3 py-2 text-gray-300 hover:text-white transition-colors rounded-lg hover:bg-white/10"
                >
                  Chat
                  </Link>} */}
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
                  {
                    authenticated && 
                    <Link 
                    to="/wallet" 
                    className="px-3 py-2 text-gray-300 hover:text-white transition-colors rounded-lg hover:bg-white/10"
                  >
                    Profile
                  </Link>
                  }
                
                {/* Test Modal Button */}
              </div>
              
            

              {/* Show connect/disconnect button */}
              {authenticated ? (
            <button
                  onClick={()=>{logout();navigate('/')}}
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
        </div>
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
