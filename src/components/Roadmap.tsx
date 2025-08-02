import React from 'react';
import { CheckCircle, Target, Rocket, Star } from 'lucide-react';

export const Roadmap: React.FC = () => {
  return (
    <div className="mb-16 mt-32">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold text-white mb-6 font-mono">Development Roadmap</h2>
        <p className="text-xl text-green-300 max-w-4xl mx-auto font-mono">
          Our journey to revolutionize DeFi on CrossFi one prompt at a time
        </p>
      </div>

      <div className="relative">
        {/* Timeline Line */}
        <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-gradient-to-b from-green-400 via-green-400 to-green-400/30"></div>
        
        {/* Phase 1 - Completed */}
        <div className="relative mb-12">
          <div className="flex items-center justify-between">
            <div className="w-5/12 pr-8 text-right">
              <div className="bg-black/20 backdrop-blur-xl border-2 border-green-400/30 rounded-2xl p-6 hover:border-green-400 transition-colors duration-300">
                <div className="flex items-center justify-end mb-3">
                  <CheckCircle className="w-6 h-6 text-green-400 mr-2" />
                  <h3 className="text-xl font-bold text-green-400 font-mono">Phase 1: Foundation</h3>
                </div>
                <p className="text-green-300 font-mono text-sm">
                  Core AI Agent, wallet integration, and basic DeFi operations
                </p>
                <div className="mt-4 space-y-2">
                  <div className="flex items-center justify-end text-green-300 text-xs font-mono">
                    <span className="w-2 h-2 bg-green-400 rounded-full mr-2"></span>
                    AI Chat Interface
                  </div>
                  <div className="flex items-center justify-end text-green-300 text-xs font-mono">
                    <span className="w-2 h-2 bg-green-400 rounded-full mr-2"></span>
                    Metamask Integration
                  </div>
                  <div className="flex items-center justify-end text-green-300 text-xs font-mono">
                    <span className="w-2 h-2 bg-green-400 rounded-full mr-2"></span>
                    Generate Payment Links and invoices
                  </div>
                  <div className="flex items-center justify-end text-green-300 text-xs font-mono">
                    <span className="w-2 h-2 bg-green-400 rounded-full mr-2"></span>
                    Transfer XLM through prompts
                  </div>
                  <div className="flex items-center justify-end text-green-300 text-xs font-mono">
                    <span className="w-2 h-2 bg-green-400 rounded-full mr-2"></span>
                    Create DCA Orders
                  </div>
                </div>
              </div>
            </div>
            
            {/* Timeline Node */}
            <div className="absolute left-1/2 transform -translate-x-1/2 w-6 h-6 bg-green-400 rounded-full border-4 border-black shadow-lg">
              <div className="w-6 h-6 bg-green-400 rounded-full animate-ping"></div>
            </div>
            
            <div className="w-5/12 pl-8">
              <div className="text-left">
                <span className="text-green-400 font-mono text-sm">Q2 2024</span>
              </div>
            </div>
          </div>
        </div>

        {/* Phase 2 - Current */}
        <div className="relative mb-12">
          <div className="flex items-center justify-between">
            <div className="w-5/12 pr-8 text-right">
              <div className="text-right">
                <span className="text-green-400 font-mono text-sm">Q3 2024</span>
              </div>
            </div>
            
            {/* Timeline Node */}
            <div className="absolute left-1/2 transform -translate-x-1/2 w-6 h-6 bg-green-400 rounded-full border-4 border-black shadow-lg">
              <div className="w-6 h-6 bg-green-400 rounded-full animate-pulse"></div>
            </div>
            
            <div className="w-5/12 pl-8">
              <div className="bg-black/20 backdrop-blur-xl border-2 border-green-400 rounded-2xl p-6 hover:border-green-300 transition-colors duration-300">
                <div className="flex items-center mb-3">
                  <Target className="w-6 h-6 text-green-400 mr-2" />
                  <h3 className="text-xl font-bold text-green-400 font-mono">Phase 2: Enhancement</h3>
                </div>
                <p className="text-green-300 font-mono text-sm">
                  Advanced trading features, DCA automation, and portfolio analytics
                </p>
                <div className="mt-4 space-y-2">
                  <div className="flex items-center text-green-300 text-xs font-mono">
                    <span className="w-2 h-2 bg-green-400 rounded-full mr-2"></span>
                    DCA Automation
                  </div>
                  <div className="flex items-center text-green-300 text-xs font-mono">
                    <span className="w-2 h-2 bg-green-400 rounded-full mr-2"></span>
                    Swap features
                  </div>
                  <div className="flex items-center text-green-300 text-xs font-mono">
                    <span className="w-2 h-2 bg-green-400 rounded-full mr-2"></span>
                    Portfolio Analytics
                  </div>
                  <div className="flex items-center text-green-300 text-xs font-mono">
                    <span className="w-2 h-2 bg-green-400 rounded-full mr-2"></span>
                    Advanced Trading
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Phase 3 - Future */}
        <div className="relative mb-12">
          <div className="flex items-center justify-between">
            <div className="w-5/12 pr-8 text-right">
              <div className="bg-black/20 backdrop-blur-xl border-2 border-green-400/20 rounded-2xl p-6 hover:border-green-400/40 transition-colors duration-300">
                <div className="flex items-center justify-end mb-3">
                  <Rocket className="w-6 h-6 text-green-400/60 mr-2" />
                  <h3 className="text-xl font-bold text-green-400/60 font-mono">Phase 3: Expansion</h3>
                </div>
                <p className="text-green-300/60 font-mono text-sm">
                  Multi-chain support, advanced AI features, and ecosystem integration
                </p>
                <div className="mt-4 space-y-2">
                  <div className="flex items-center justify-end text-green-300/60 text-xs font-mono">
                    <span className="w-2 h-2 bg-green-400/60 rounded-full mr-2"></span>
                    Multi-chain Support
                  </div>
                  <div className="flex items-center justify-end text-green-300/60 text-xs font-mono">
                    <span className="w-2 h-2 bg-green-400/60 rounded-full mr-2"></span>
                    Advanced AI
                  </div>
                  <div className="flex items-center justify-end text-green-300/60 text-xs font-mono">
                    <span className="w-2 h-2 bg-green-400/60 rounded-full mr-2"></span>
                    Ecosystem Integration
                  </div>
                </div>
              </div>
            </div>
            
            {/* Timeline Node */}
            <div className="absolute left-1/2 transform -translate-x-1/2 w-6 h-6 bg-green-400/30 rounded-full border-4 border-black shadow-lg">
              <div className="w-6 h-6 bg-green-400/30 rounded-full"></div>
            </div>
            
            <div className="w-5/12 pl-8">
              <div className="text-left">
                <span className="text-green-400/60 font-mono text-sm">Q4 2024</span>
              </div>
            </div>
          </div>
        </div>

        {/* Phase 4 - Future */}
        <div className="relative">
          <div className="flex items-center justify-between">
            <div className="w-5/12 pr-8 text-right">
              <div className="text-right">
                <span className="text-green-400/60 font-mono text-sm">Q1 2025</span>
              </div>
            </div>
            
            {/* Timeline Node */}
            <div className="absolute left-1/2 transform -translate-x-1/2 w-6 h-6 bg-green-400/20 rounded-full border-4 border-black shadow-lg">
              <div className="w-6 h-6 bg-green-400/20 rounded-full"></div>
            </div>
            
            <div className="w-5/12 pl-8">
              <div className="bg-black/20 backdrop-blur-xl border-2 border-green-400/10 rounded-2xl p-6 hover:border-green-400/30 transition-colors duration-300">
                <div className="flex items-center mb-3">
                  <Star className="w-6 h-6 text-green-400/40 mr-2" />
                  <h3 className="text-xl font-bold text-green-400/40 font-mono">Phase 4: Innovation</h3>
                </div>
                <p className="text-green-300/40 font-mono text-sm">
                  Revolutionary AI features, governance, and community-driven development
                </p>
                <div className="mt-4 space-y-2">
                  <div className="flex items-center text-green-300/40 text-xs font-mono">
                    <span className="w-2 h-2 bg-green-400/40 rounded-full mr-2"></span>
                    AI Governance
                  </div>
                  <div className="flex items-center text-green-300/40 text-xs font-mono">
                    <span className="w-2 h-2 bg-green-400/40 rounded-full mr-2"></span>
                    Community DAO
                  </div>
                  <div className="flex items-center text-green-300/40 text-xs font-mono">
                    <span className="w-2 h-2 bg-green-400/40 rounded-full mr-2"></span>
                    Revolutionary Features
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}; 