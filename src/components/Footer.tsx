import React from 'react';
import { Github, Twitter, Mail, Globe } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className=" py-8 relative z-10">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="col-span-2">
            <h3 className="text-2xl font-bold text-green-400 mb-4 font-mono">Oni</h3>
            <p className="text-green-300 mb-4 font-mono">
            Prompt, DeFi - your AI portal to CrossFi
            </p>
            <div className="flex space-x-4">
              <a 
                href="#" 
                className="text-green-400 hover:text-green-300 transition-colors duration-200"
                aria-label="GitHub"
              >
                <Github className="w-6 h-6" />
              </a>
              <a 
                href="#" 
                className="text-green-400 hover:text-green-300 transition-colors duration-200"
                aria-label="Twitter"
              >
                <Twitter className="w-6 h-6" />
              </a>
              <a 
                href="#" 
                className="text-green-400 hover:text-green-300 transition-colors duration-200"
                aria-label="Email"
              >
                <Mail className="w-6 h-6" />
              </a>
              <a 
                href="#" 
                className="text-green-400 hover:text-green-300 transition-colors duration-200"
                aria-label="Website"
              >
                <Globe className="w-6 h-6" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-4 font-mono">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-green-300 hover:text-green-400 transition-colors duration-200 font-mono">
                  AI Interface
                </a>
              </li>
              <li>
                <a href="#" className="text-green-300 hover:text-green-400 transition-colors duration-200 font-mono">
                  Wallet Management
                </a>
              </li>
              <li>
                <a href="#" className="text-green-300 hover:text-green-400 transition-colors duration-200 font-mono">
                  Trading Tools
                </a>
              </li>
              <li>
                <a href="#" className="text-green-300 hover:text-green-400 transition-colors duration-200 font-mono">
                  Analytics
                </a>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-4 font-mono">Support</h4>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-green-300 hover:text-green-400 transition-colors duration-200 font-mono">
                  Documentation
                </a>
              </li>
              <li>
                <a href="#" className="text-green-300 hover:text-green-400 transition-colors duration-200 font-mono">
                  Community
                </a>
              </li>
              <li>
                <a href="#" className="text-green-300 hover:text-green-400 transition-colors duration-200 font-mono">
                  Contact Us
                </a>
              </li>
              <li>
                <a href="#" className="text-green-300 hover:text-green-400 transition-colors duration-200 font-mono">
                  Bug Report
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className=" mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-green-300 text-sm font-mono">
            © 2025 Oni. All rights reserved. Powered by CrossFi blockchain technology.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="#" className="text-green-300 hover:text-green-400 text-sm transition-colors duration-200 font-mono">
              Privacy Policy
            </a>
            <a href="#" className="text-green-300 hover:text-green-400 text-sm transition-colors duration-200 font-mono">
              Terms of Service
            </a>
            <a href="#" className="text-green-300 hover:text-green-400 text-sm transition-colors duration-200 font-mono">
              Cookie Policy
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}; 