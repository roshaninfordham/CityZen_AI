import React, { useState, useEffect } from 'react';
import { MapPin, Navigation, Clock, Star, AlertCircle, Users, Shield, Zap } from 'lucide-react';
import { ParkingSpot, UserReport } from '../types';

interface EnhancedParkingMapProps {
  destination: string;
  userLocation?: { lat: number; lng: number };
  isPremium?: boolean;
}

export const EnhancedParkingMap: React.FC<EnhancedParkingMapProps> = ({ 
  destination, 
  userLocation,
  isPremium = false 
}) => {
  const [parkingSpots, setParkingSpots] = useState<ParkingSpot[]>([]);
  const [selectedSpot, setSelectedSpot] = useState<ParkingSpot | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [animationFrame, setAnimationFrame] = useState(0);

  useEffect(() => {
    generateEnhancedParkingSpots();
    
    // Animation for live updates
    const interval = setInterval(() => {
      setAnimationFrame(prev => prev + 1);
    }, 2000);

    return () => clearInterval(interval);
  }, [destination]);

  const generateEnhancedParkingSpots = async () => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1500));

    const spots: ParkingSpot[] = [
      {
        id: '1',
        lat: 40.7589,
        lng: -73.9851,
        availability: 'high',
        maxDuration: '2 hours',
        restrictions: ['Meter required 8AM-6PM'],
        walkingDistance: '2 min walk',
        score: 9,
        safetyRating: 8,
        userReports: [
          {
            id: '1',
            type: 'availability',
            description: 'Just left this spot, plenty of space',
            severity: 'low',
            timestamp: new Date(Date.now() - 300000),
            verified: true
          }
        ],
        predictedAvailability: {
          nextHour: 'medium',
          confidence: 85
        }
      },
      {
        id: '2',
        lat: 40.7591,
        lng: -73.9849,
        availability: 'medium',
        maxDuration: '1 hour',
        restrictions: ['1hr parking Mon-Fri 9AM-6PM'],
        walkingDistance: '3 min walk',
        score: 7,
        safetyRating: 9,
        userReports: [],
        predictedAvailability: {
          nextHour: 'low',
          confidence: 72
        }
      },
      {
        id: '3',
        lat: 40.7587,
        lng: -73.9853,
        availability: 'low',
        maxDuration: '30 minutes',
        restrictions: ['Loading zone 7AM-7PM', 'Meter required'],
        walkingDistance: '1 min walk',
        score: 4,
        safetyRating: 6,
        userReports: [
          {
            id: '2',
            type: 'enforcement',
            description: 'Saw traffic officer here 20 mins ago',
            severity: 'medium',
            timestamp: new Date(Date.now() - 1200000),
            verified: true
          }
        ],
        predictedAvailability: {
          nextHour: 'high',
          confidence: 91
        }
      },
      {
        id: '4',
        lat: 40.7593,
        lng: -73.9847,
        availability: 'high',
        maxDuration: 'Unlimited',
        restrictions: ['Residential parking only'],
        walkingDistance: '5 min walk',
        score: 8,
        safetyRating: 10,
        userReports: [],
        predictedAvailability: {
          nextHour: 'high',
          confidence: 95
        }
      },
      {
        id: '5',
        lat: 40.7585,
        lng: -73.9855,
        availability: 'medium',
        maxDuration: '3 hours',
        restrictions: ['No parking street cleaning Tue 11AM-12:30PM'],
        walkingDistance: '4 min walk',
        score: 6,
        safetyRating: 7,
        userReports: [
          {
            id: '3',
            type: 'safety',
            description: 'Well-lit area, feels safe',
            severity: 'low',
            timestamp: new Date(Date.now() - 3600000),
            verified: true
          }
        ],
        predictedAvailability: {
          nextHour: 'medium',
          confidence: 78
        }
      }
    ];

    setParkingSpots(spots);
    setIsLoading(false);
  };

  const getAvailabilityColor = (availability: string) => {
    switch (availability) {
      case 'high': return 'bg-green-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 8) return 'text-green-500';
    if (score >= 6) return 'text-yellow-500';
    return 'text-red-500';
  };

  const getSafetyColor = (rating: number) => {
    if (rating >= 8) return 'text-green-500';
    if (rating >= 6) return 'text-yellow-500';
    return 'text-red-500';
  };

  return (
    <div className="bg-white/5 dark:bg-gray-800/30 border border-gray-200/30 dark:border-gray-600/30 rounded-2xl p-6 backdrop-blur-sm">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-green-500/20 rounded-xl">
          <MapPin className="w-8 h-8 text-green-400" />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">Smart Parking Map</h3>
            {isPremium && (
              <div className="flex items-center gap-1 px-2 py-1 bg-gradient-to-r from-yellow-400/20 to-orange-400/20 border border-yellow-400/30 rounded-lg">
                <Zap className="w-3 h-3 text-yellow-400" />
                <span className="text-xs font-bold text-yellow-400">LIVE</span>
              </div>
            )}
          </div>
          <p className="text-gray-600 dark:text-gray-400">Real-time parking availability with community insights</p>
        </div>
      </div>

      {isLoading ? (
        <div className="text-center py-8">
          <div className="w-8 h-8 border-2 border-green-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">Scanning parking spots...</p>
        </div>
      ) : (
        <>
          {/* Enhanced Map Visualization */}
          <div className="bg-gray-100 dark:bg-gray-900/50 rounded-xl p-4 mb-6 relative overflow-hidden">
            <div className="text-center text-gray-600 dark:text-gray-400 mb-4">
              <MapPin className="w-6 h-6 mx-auto mb-2" />
              <p className="text-sm">Live Parking Map - Updated {Math.floor(animationFrame / 3) + 1} seconds ago</p>
            </div>
            
            {/* Simulated map with enhanced animations */}
            <div className="relative h-64 bg-gradient-to-br from-blue-100 to-green-100 dark:from-gray-800 dark:to-gray-700 rounded-lg overflow-hidden">
              {/* Street grid pattern */}
              <div className="absolute inset-0 opacity-20">
                <div className="grid grid-cols-8 grid-rows-8 h-full">
                  {Array.from({ length: 64 }).map((_, i) => (
                    <div key={i} className="border border-gray-400 dark:border-gray-600"></div>
                  ))}
                </div>
              </div>
              
              {/* Destination marker */}
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10">
                <div className="w-6 h-6 bg-blue-500 rounded-full border-2 border-white shadow-lg animate-pulse"></div>
                <p className="text-xs text-gray-900 dark:text-white mt-1 text-center font-semibold">Destination</p>
              </div>
              
              {/* Parking spot markers with enhanced animations */}
              {parkingSpots.map((spot, index) => (
                <div
                  key={spot.id}
                  className={`absolute cursor-pointer transform transition-all duration-500 hover:scale-150 z-20 ${
                    selectedSpot?.id === spot.id ? 'scale-150 z-30' : ''
                  }`}
                  style={{
                    top: `${20 + index * 15}%`,
                    left: `${15 + index * 18}%`,
                    animation: `pulse 2s infinite ${index * 0.5}s`
                  }}
                  onClick={() => setSelectedSpot(spot)}
                >
                  <div className={`w-4 h-4 rounded-full border-2 border-white shadow-lg ${getAvailabilityColor(spot.availability)}`}>
                    {isPremium && spot.userReports.length > 0 && (
                      <div className="absolute -top-1 -right-1 w-2 h-2 bg-orange-400 rounded-full animate-ping"></div>
                    )}
                  </div>
                  {selectedSpot?.id === spot.id && (
                    <div className="absolute top-6 left-1/2 transform -translate-x-1/2 bg-white dark:bg-gray-800 rounded-lg p-2 shadow-lg border border-gray-200 dark:border-gray-600 min-w-32">
                      <p className="text-xs font-semibold text-gray-900 dark:text-white">Spot #{spot.id}</p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">{spot.walkingDistance}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
            
            {/* Legend with enhanced features */}
            <div className="flex justify-center gap-6 mt-4 text-xs">
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-gray-600 dark:text-gray-400">High availability</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                <span className="text-gray-600 dark:text-gray-400">Medium</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                <span className="text-gray-600 dark:text-gray-400">Low</span>
              </div>
              {isPremium && (
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-orange-400 rounded-full animate-ping"></div>
                  <span className="text-gray-600 dark:text-gray-400">Community reports</span>
                </div>
              )}
            </div>
          </div>

          {/* Enhanced Parking Spots List */}
          <div className="space-y-3">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-lg font-semibold text-gray-900 dark:text-white">Nearby Parking Spots</h4>
              {isPremium && (
                <div className="flex items-center gap-1 text-xs text-green-400">
                  <Zap className="w-3 h-3" />
                  <span>Live updates</span>
                </div>
              )}
            </div>
            
            {parkingSpots
              .sort((a, b) => b.score - a.score)
              .map((spot) => (
                <div
                  key={spot.id}
                  className={`p-4 rounded-xl border cursor-pointer transition-all duration-200 ${
                    selectedSpot?.id === spot.id
                      ? 'border-blue-400/50 bg-blue-500/10 dark:bg-blue-500/5'
                      : 'border-gray-200/50 dark:border-gray-600/50 bg-white/5 dark:bg-gray-700/20 hover:border-gray-300/70 dark:hover:border-gray-500/70'
                  }`}
                  onClick={() => setSelectedSpot(spot)}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${getAvailabilityColor(spot.availability)}`}></div>
                      <span className="text-gray-900 dark:text-white font-semibold">Spot #{spot.id}</span>
                      <div className="flex items-center gap-1">
                        <Star className={`w-4 h-4 ${getScoreColor(spot.score)}`} />
                        <span className={`text-sm font-bold ${getScoreColor(spot.score)}`}>
                          {spot.score}/10
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Shield className={`w-4 h-4 ${getSafetyColor(spot.safetyRating)}`} />
                        <span className={`text-sm ${getSafetyColor(spot.safetyRating)}`}>
                          {spot.safetyRating}/10
                        </span>
                      </div>
                    </div>
                    <span className="text-gray-500 dark:text-gray-400 text-sm">{spot.walkingDistance}</span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 dark:text-gray-300 mb-3">
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>{spot.maxDuration}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Navigation className="w-4 h-4" />
                      <span className="capitalize">{spot.availability} availability</span>
                    </div>
                  </div>

                  {isPremium && spot.predictedAvailability && (
                    <div className="bg-blue-500/10 border border-blue-400/30 rounded-lg p-2 mb-3">
                      <div className="flex items-center gap-2 text-xs">
                        <Zap className="w-3 h-3 text-blue-400" />
                        <span className="text-blue-300">
                          Predicted next hour: {spot.predictedAvailability.nextHour} availability 
                          ({spot.predictedAvailability.confidence}% confidence)
                        </span>
                      </div>
                    </div>
                  )}
                  
                  {spot.restrictions.length > 0 && (
                    <div className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                      <AlertCircle className="w-3 h-3 inline mr-1" />
                      {spot.restrictions.join(', ')}
                    </div>
                  )}

                  {isPremium && spot.userReports.length > 0 && (
                    <div className="border-t border-gray-200/30 dark:border-gray-600/30 pt-2">
                      <div className="flex items-center gap-1 mb-1">
                        <Users className="w-3 h-3 text-orange-400" />
                        <span className="text-xs font-semibold text-orange-400">Community Reports</span>
                      </div>
                      {spot.userReports.slice(0, 2).map((report) => (
                        <div key={report.id} className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                          <span className="font-medium">{report.type}:</span> {report.description}
                          <span className="text-gray-500 dark:text-gray-500 ml-1">
                            ({Math.floor((Date.now() - report.timestamp.getTime()) / 60000)}m ago)
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
          </div>
        </>
      )}
    </div>
  );
};