import React from 'react';
import { Activity } from 'lucide-react';

export const Navbar: React.FC = () => {
  return (
    <nav className="bg-gray-900 border-b border-gray-800 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="bg-blue-600 p-1.5 rounded-lg text-white">
            <Activity size={20} />
          </div>
          <span className="font-bold text-xl tracking-tight text-white">InstaTrack<span className="text-blue-500">Pro</span></span>
        </div>
        <div className="hidden md:flex items-center space-x-6 text-sm font-medium text-gray-400">
          <a href="#" className="hover:text-white transition-colors">Dashboard</a>
          <a href="#" className="hover:text-white transition-colors">Analytics</a>
          <a href="#" className="hover:text-white transition-colors">Reports</a>
          <div className="h-4 w-px bg-gray-700"></div>
          <div className="flex items-center gap-2">
             <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
             <span className="text-green-500 text-xs uppercase tracking-wider">System Online</span>
          </div>
        </div>
      </div>
    </nav>
  );
};