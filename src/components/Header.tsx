import React from 'react';
import { Car, MapPin, Crown } from 'lucide-react';

interface HeaderProps {
  isPremium?: boolean;
}

export const Header: React.FC<HeaderProps> = ({ isPremium = false }) => {
  return (
    <header className="text-center py-8 px-4">
      <div className="flex items-center justify-center gap-3 mb-4">
        <div className="relative">
          <Car className="w-8 h-8 text-blue-500 dark:text-blue-400" />
          <MapPin className="w-4 h-4 text-green-500 dark:text-green-400 absolute -bottom-1 -right-1" />
        </div>
        <div className="flex items-center gap-2">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-500 via-purple-500 to-green-500 bg-clip-text text-transparent">
            CityZen AI
          </h1>
          {isPremium && (
            <div className="flex items-center gap-1 px-2 py-1 bg-gradient-to-r from-yellow-400/20 to-orange-400/20 border border-yellow-400/30 rounded-lg">
              <Crown className="w-4 h-4 text-yellow-400" />
              <span className="text-xs font-bold text-yellow-400">PREMIUM</span>
            </div>
          )}
        </div>
        <span className="text-2xl">🏙️</span>
      </div>
      <p className="text-xl text-gray-700 dark:text-gray-300 font-medium">
        Your Personal NYC Mobility Advisor
      </p>
      <p className="text-gray-500 dark:text-gray-400 mt-2">
        Real-time analysis • Smart recommendations • NYC optimized
      </p>
    </header>
  );
};