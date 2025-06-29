import React, { useState, useEffect } from 'react';
import { Navigation, MapPin, Route, Clock, Zap, ExternalLink, Smartphone } from 'lucide-react';
import { LiveMap } from './LiveMap';

interface NavigationIntegrationProps {
  origin: string;
  destination: string;
  onNavigationStart?: () => void;
}

export const NavigationIntegration: React.FC<NavigationIntegrationProps> = ({
  origin,
  destination,
  onNavigationStart
}) => {
  const [isNavigating, setIsNavigating] = useState(false);
  const [showInAppNavigation, setShowInAppNavigation] = useState(false);
  const [navigationMethod, setNavigationMethod] = useState<'google' | 'apple' | 'waze' | 'inapp'>('inapp');

  const generateNavigationUrls = () => {
    const encodedOrigin = encodeURIComponent(origin);
    const encodedDestination = encodeURIComponent(destination);

    return {
      google: `https://www.google.com/maps/dir/${encodedOrigin}/${encodedDestination}`,
      apple: `http://maps.apple.com/?saddr=${encodedOrigin}&daddr=${encodedDestination}&dirflg=d`,
      waze: `https://waze.com/ul?q=${encodedDestination}&navigate=yes`,
      googleMobile: `comgooglemaps://?saddr=${encodedOrigin}&daddr=${encodedDestination}&directionsmode=driving`,
      appleMobile: `maps://maps.apple.com/?saddr=${encodedOrigin}&daddr=${encodedDestination}&dirflg=d`
    };
  };

  const handleStartNavigation = (method: typeof navigationMethod) => {
    setIsNavigating(true);
    setNavigationMethod(method);
    
    if (method === 'inapp') {
      setShowInAppNavigation(true);
    } else {
      const urls = generateNavigationUrls();
      let url = '';
      
      switch (method) {
        case 'google':
          // Try mobile app first, fallback to web
          url = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent) 
            ? urls.googleMobile 
            : urls.google;
          break;
        case 'apple':
          url = urls.apple;
          break;
        case 'waze':
          url = urls.waze;
          break;
      }
      
      if (url) {
        window.open(url, '_blank');
      }
    }
    
    onNavigationStart?.();
  };

  const navigationOptions = [
    {
      id: 'inapp',
      name: 'CityZen Navigation',
      icon: Route,
      description: 'Built-in navigation with real-time traffic',
      color: 'from-blue-500 to-purple-600',
      available: true
    },
    {
      id: 'google',
      name: 'Google Maps',
      icon: MapPin,
      description: 'Open in Google Maps app or web',
      color: 'from-green-500 to-emerald-600',
      available: true
    },
    {
      id: 'apple',
      name: 'Apple Maps',
      icon: Navigation,
      description: 'Open in Apple Maps (iOS/macOS)',
      color: 'from-gray-500 to-gray-700',
      available: /iPhone|iPad|iPod|Mac/i.test(navigator.userAgent)
    },
    {
      id: 'waze',
      name: 'Waze',
      icon: Zap,
      description: 'Community-driven navigation',
      color: 'from-blue-400 to-cyan-500',
      available: true
    }
  ];

  return (
    <div className="bg-white/90 dark:bg-gray-800/30 border border-gray-200 dark:border-gray-600/30 rounded-2xl p-6 backdrop-blur-sm">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl shadow-lg">
          <Navigation className="w-8 h-8 text-white" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">Smart Navigation</h3>
          <p className="text-gray-600 dark:text-gray-400">Get turn-by-turn directions to your destination</p>
        </div>
      </div>

      {!showInAppNavigation ? (
        <>
          {/* Route Summary */}
          <div className="bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-400/30 rounded-xl p-4 mb-6">
            <div className="flex items-center gap-2 mb-2">
              <Route className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <span className="font-medium text-blue-700 dark:text-blue-300">Navigation Route</span>
            </div>
            <div className="space-y-1 text-sm text-blue-600 dark:text-blue-200">
              <p><strong>From:</strong> {origin}</p>
              <p><strong>To:</strong> {destination}</p>
            </div>
          </div>

          {/* Navigation Options */}
          <div className="space-y-3 mb-6">
            <h4 className="text-lg font-semibold text-gray-900 dark:text-white">Choose Navigation App</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {navigationOptions
                .filter(option => option.available)
                .map((option) => {
                  const IconComponent = option.icon;
                  return (
                    <button
                      key={option.id}
                      onClick={() => handleStartNavigation(option.id as any)}
                      disabled={isNavigating}
                      className={`p-4 rounded-xl border-2 border-gray-200 dark:border-gray-600 hover:border-blue-400 dark:hover:border-blue-500 transition-all duration-200 text-left group ${
                        isNavigating ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-lg'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg bg-gradient-to-r ${option.color} shadow-sm`}>
                          <IconComponent className="w-5 h-5 text-white" />
                        </div>
                        <div className="flex-1">
                          <div className="font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                            {option.name}
                          </div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">
                            {option.description}
                          </div>
                        </div>
                        <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-blue-500 transition-colors" />
                      </div>
                    </button>
                  );
                })}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => handleStartNavigation('inapp')}
              disabled={isNavigating}
              className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-all duration-200 flex items-center justify-center gap-2"
            >
              <Route className="w-5 h-5" />
              Start Navigation
            </button>
            
            <button
              onClick={() => handleStartNavigation('google')}
              disabled={isNavigating}
              className="px-6 py-3 bg-green-500 hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-all duration-200 flex items-center justify-center gap-2"
            >
              <ExternalLink className="w-5 h-5" />
              Open in Maps
            </button>
          </div>

          {isNavigating && navigationMethod !== 'inapp' && (
            <div className="mt-4 p-4 bg-green-50 dark:bg-green-500/10 border border-green-200 dark:border-green-400/30 rounded-xl">
              <div className="flex items-center gap-2 text-green-700 dark:text-green-300">
                <Clock className="w-4 h-4" />
                <span className="font-medium">Navigation started in {navigationOptions.find(opt => opt.id === navigationMethod)?.name}</span>
              </div>
              <p className="text-sm text-green-600 dark:text-green-200 mt-1">
                Follow the directions in your navigation app. Drive safely!
              </p>
            </div>
          )}
        </>
      ) : (
        <>
          {/* In-App Navigation Header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 px-3 py-1 bg-green-500 text-white rounded-lg">
                <Zap className="w-4 h-4" />
                <span className="text-sm font-medium">NAVIGATING</span>
                <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
              </div>
            </div>
            <button
              onClick={() => {
                setShowInAppNavigation(false);
                setIsNavigating(false);
              }}
              className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg text-sm transition-colors"
            >
              Exit Navigation
            </button>
          </div>

          {/* Live Navigation Map */}
          <LiveMap
            origin={origin}
            destination={destination}
            showRoute={true}
            className="h-96 mb-4"
          />

          {/* Navigation Instructions */}
          <div className="bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-400/30 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <Navigation className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <span className="font-semibold text-blue-700 dark:text-blue-300">Turn-by-Turn Directions</span>
            </div>
            <div className="space-y-2 text-sm text-blue-600 dark:text-blue-200">
              <div className="flex items-center gap-2 p-2 bg-white/50 dark:bg-gray-800/30 rounded-lg">
                <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold">1</div>
                <span>Head <strong>northeast</strong> on your current street</span>
              </div>
              <div className="flex items-center gap-2 p-2 bg-white/50 dark:bg-gray-800/30 rounded-lg">
                <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold">2</div>
                <span>Turn <strong>right</strong> onto the main avenue</span>
              </div>
              <div className="flex items-center gap-2 p-2 bg-white/50 dark:bg-gray-800/30 rounded-lg">
                <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold">3</div>
                <span>Continue straight for 0.8 miles</span>
              </div>
              <div className="flex items-center gap-2 p-2 bg-green-100 dark:bg-green-500/20 rounded-lg">
                <div className="w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-xs font-bold">🏁</div>
                <span><strong>Destination</strong> will be on your right</span>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};