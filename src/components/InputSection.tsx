import React, { useState } from 'react';
import { MapPin, Navigation, Sparkles, Clock, Globe, Camera, Crown } from 'lucide-react';
import { Location, TripPreferences } from '../types';
import { AddressAutocomplete } from './AddressAutocomplete';

interface InputSectionProps {
  onAnalyze: (origin: Location, destination: Location, preferences: TripPreferences) => void;
  isLoading: boolean;
  isPremium?: boolean;
}

export const InputSection: React.FC<InputSectionProps> = ({ onAnalyze, isLoading, isPremium = true }) => {
  const [origin, setOrigin] = useState<string>('');
  const [destination, setDestination] = useState<string>('');
  const [arrivalTime, setArrivalTime] = useState<string>('');
  const [language, setLanguage] = useState<string>('en');
  const [showAdvanced, setShowAdvanced] = useState(false);

  const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'es', name: 'Español', flag: '🇪🇸' },
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
    { code: 'zh', name: '中文', flag: '🇨🇳' },
    { code: 'ar', name: 'العربية', flag: '🇸🇦' },
    { code: 'hi', name: 'हिंदी', flag: '🇮🇳' },
    { code: 'ru', name: 'Русский', flag: '🇷🇺' },
    { code: 'ko', name: '한국어', flag: '🇰🇷' }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (origin.trim() && destination.trim()) {
      const preferences: TripPreferences = {
        arrivalTime: arrivalTime || undefined,
        language,
        notifications: true,
        isPremium: true // Always premium for demo
      };
      
      onAnalyze(
        { address: origin.trim() },
        { address: destination.trim() },
        preferences
      );
    }
  };

  const getCurrentTime = () => {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  };

  return (
    <div className="max-w-4xl mx-auto px-4 mb-12">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          <AddressAutocomplete
            value={origin}
            onChange={setOrigin}
            placeholder="Enter starting location..."
            label="From"
            icon={<MapPin className="w-4 h-4 inline mr-2" />}
            disabled={isLoading}
          />
          
          <AddressAutocomplete
            value={destination}
            onChange={setDestination}
            placeholder="Enter destination..."
            label="To"
            icon={<Navigation className="w-4 h-4 inline mr-2" />}
            disabled={isLoading}
          />
        </div>

        {/* Advanced Options Toggle */}
        <div className="text-center">
          <button
            type="button"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="text-blue-500 dark:text-blue-400 hover:text-blue-600 dark:hover:text-blue-300 text-sm font-medium transition-colors duration-200"
          >
            {showAdvanced ? 'Hide' : 'Show'} Advanced Options
          </button>
        </div>

        {/* Advanced Options */}
        {showAdvanced && (
          <div className="bg-white/5 dark:bg-gray-800/30 border border-gray-200/30 dark:border-gray-600/50 rounded-xl p-6 space-y-4">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="arrivalTime" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                  <Clock className="w-4 h-4 inline mr-2" />
                  Arrival Time (Optional)
                  <span className="ml-2 inline-flex items-center gap-1 px-2 py-1 bg-gradient-to-r from-yellow-400/20 to-orange-400/20 border border-yellow-400/30 rounded-lg">
                    <Crown className="w-3 h-3 text-yellow-400" />
                    <span className="text-xs font-bold text-yellow-400">ACTIVE</span>
                  </span>
                </label>
                <input
                  id="arrivalTime"
                  type="time"
                  value={arrivalTime}
                  onChange={(e) => setArrivalTime(e.target.value)}
                  min={getCurrentTime()}
                  className="w-full px-4 py-3 bg-white/10 dark:bg-gray-700/50 border border-gray-300/50 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 focus:outline-none transition-all duration-200"
                  disabled={isLoading}
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Leave empty for "leave now" analysis
                </p>
              </div>

              <div>
                <label htmlFor="language" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                  <Globe className="w-4 h-4 inline mr-2" />
                  Language
                </label>
                <select
                  id="language"
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="w-full px-4 py-3 bg-white/10 dark:bg-gray-700/50 border border-gray-300/50 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 focus:outline-none transition-all duration-200"
                  disabled={isLoading}
                >
                  {languages.map((lang) => (
                    <option key={lang.code} value={lang.code} className="bg-white dark:bg-gray-800">
                      {lang.flag} {lang.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        )}

        <div className="text-center">
          <button
            type="submit"
            disabled={!origin.trim() || !destination.trim() || isLoading}
            className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold text-lg rounded-xl hover:from-blue-600 hover:to-purple-700 focus:outline-none focus:ring-4 focus:ring-blue-400/30 disabled:opacity-50 disabled:cursor-not-allowed transform transition-all duration-200 hover:scale-105 shadow-lg hover:shadow-xl"
          >
            {isLoading ? (
              <>
                <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Analyzing with AI Pro...
              </>
            ) : (
              <>
                <Sparkles className="w-6 h-6" />
                <Crown className="w-5 h-5" />
                Analyze with AI Pro
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};