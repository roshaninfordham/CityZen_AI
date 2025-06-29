import React, { useState, useEffect } from 'react';
import { MapPin, Navigation, Clock, Star, AlertCircle } from 'lucide-react';
import { ParkingSpot } from '../types';

interface ParkingMapProps {
  destination: string;
  userLocation?: { lat: number; lng: number };
}

export const ParkingMap: React.FC<ParkingMapProps> = ({ destination, userLocation }) => {
  const [parkingSpots, setParkingSpots] = useState<ParkingSpot[]>([]);
  const [selectedSpot, setSelectedSpot] = useState<ParkingSpot | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    generateMockParkingSpots();
  }, [destination]);

  const generateMockParkingSpots = async () => {
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
        score: 9
      },
      {
        id: '2',
        lat: 40.7591,
        lng: -73.9849,
        availability: 'medium',
        maxDuration: '1 hour',
        restrictions: ['1hr parking Mon-Fri 9AM-6PM'],
        walkingDistance: '3 min walk',
        score: 7
      },
      {
        id: '3',
        lat: 40.7587,
        lng: -73.9853,
        availability: 'low',
        maxDuration: '30 minutes',
        restrictions: ['Loading zone 7AM-7PM', 'Meter required'],
        walkingDistance: '1 min walk',
        score: 4
      },
      {
        id: '4',
        lat: 40.7593,
        lng: -73.9847,
        availability: 'high',
        maxDuration: 'Unlimited',
        restrictions: ['Residential parking only'],
        walkingDistance: '5 min walk',
        score: 8
      },
      {
        id: '5',
        lat: 40.7585,
        lng: -73.9855,
        availability: 'medium',
        maxDuration: '3 hours',
        restrictions: ['No parking street cleaning Tue 11AM-12:30PM'],
        walkingDistance: '4 min walk',
        score: 6
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
    if (score >= 8) return 'text-green-400';
    if (score >= 6) return 'text-yellow-400';
    return 'text-red-400';
  };

  return (
    <div className="bg-gray-800/50 border border-gray-600 rounded-2xl p-6 backdrop-blur-sm">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-green-500/20 rounded-xl">
          <MapPin className="w-8 h-8 text-green-400" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-white">Smart Parking Map</h3>
          <p className="text-gray-400">Real-time parking availability near your destination</p>
        </div>
      </div>

      {isLoading ? (
        <div className="text-center py-8">
          <div className="w-8 h-8 border-2 border-green-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-300">Scanning parking spots...</p>
        </div>
      ) : (
        <>
          {/* Mock Map Visualization */}
          <div className="bg-gray-900/50 rounded-xl p-4 mb-6 relative overflow-hidden">
            <div className="text-center text-gray-400 mb-4">
              <MapPin className="w-6 h-6 mx-auto mb-2" />
              <p className="text-sm">Interactive Map View</p>
            </div>
            
            {/* Simulated map with parking spots */}
            <div className="relative h-48 bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg overflow-hidden">
              {/* Destination marker */}
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <div className="w-4 h-4 bg-blue-500 rounded-full border-2 border-white shadow-lg"></div>
                <p className="text-xs text-white mt-1 text-center">Destination</p>
              </div>
              
              {/* Parking spot markers */}
              {parkingSpots.map((spot, index) => (
                <div
                  key={spot.id}
                  className={`absolute w-3 h-3 rounded-full border border-white cursor-pointer transform hover:scale-150 transition-transform duration-200 ${getAvailabilityColor(spot.availability)}`}
                  style={{
                    top: `${20 + index * 15}%`,
                    left: `${15 + index * 18}%`
                  }}
                  onClick={() => setSelectedSpot(spot)}
                ></div>
              ))}
            </div>
            
            {/* Legend */}
            <div className="flex justify-center gap-4 mt-4 text-xs">
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-gray-400">High availability</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                <span className="text-gray-400">Medium</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                <span className="text-gray-400">Low</span>
              </div>
            </div>
          </div>

          {/* Parking Spots List */}
          <div className="space-y-3">
            <h4 className="text-lg font-semibold text-white mb-4">Nearby Parking Spots</h4>
            {parkingSpots
              .sort((a, b) => b.score - a.score)
              .map((spot) => (
                <div
                  key={spot.id}
                  className={`p-4 rounded-xl border cursor-pointer transition-all duration-200 ${
                    selectedSpot?.id === spot.id
                      ? 'border-blue-400 bg-blue-500/10'
                      : 'border-gray-600 bg-gray-700/30 hover:border-gray-500'
                  }`}
                  onClick={() => setSelectedSpot(spot)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${getAvailabilityColor(spot.availability)}`}></div>
                      <span className="text-white font-semibold">Spot #{spot.id}</span>
                      <div className="flex items-center gap-1">
                        <Star className={`w-4 h-4 ${getScoreColor(spot.score)}`} />
                        <span className={`text-sm font-bold ${getScoreColor(spot.score)}`}>
                          {spot.score}/10
                        </span>
                      </div>
                    </div>
                    <span className="text-gray-400 text-sm">{spot.walkingDistance}</span>
                  </div>
                  
                  <div className="flex items-center gap-4 text-sm text-gray-300">
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>{spot.maxDuration}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Navigation className="w-4 h-4" />
                      <span className="capitalize">{spot.availability} availability</span>
                    </div>
                  </div>
                  
                  {spot.restrictions.length > 0 && (
                    <div className="mt-2 text-xs text-gray-400">
                      <AlertCircle className="w-3 h-3 inline mr-1" />
                      {spot.restrictions.join(', ')}
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