import React, { useState } from 'react';
import { Car, Clock, MapPin, AlertTriangle, ParkingCircle, Camera, Bell, Crown, Construction, Calendar, TrendingUp, DollarSign, Navigation, Users } from 'lucide-react';
import { DrivingData } from '../types';
import { ParkingCameraUpload } from './ParkingCameraUpload';
import { EnhancedParkingMap } from './EnhancedParkingMap';
import { ParkingReminder } from './ParkingReminder';
import { SafetyReporting } from './SafetyReporting';
import { LiveMap } from './LiveMap';
import { TicketProtection } from './TicketProtection';
import { ParkingSpotReservation } from './ParkingSpotReservation';
import { NavigationIntegration } from './NavigationIntegration';

interface DrivingCardProps {
  data: DrivingData;
  destination: string;
  language: string;
  isPremium?: boolean;
}

export const DrivingCard: React.FC<DrivingCardProps> = ({ data, destination, language, isPremium = true }) => {
  const [showPremiumTools, setShowPremiumTools] = useState(false);
  const [parkingAnalysis, setParkingAnalysis] = useState<any>(null);
  const [userReports, setUserReports] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'parking' | 'map' | 'protection' | 'safety' | 'spots' | 'navigate'>('parking');

  const getTrafficColor = (status: string) => {
    switch (status) {
      case 'light': return 'text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-500/20';
      case 'moderate': return 'text-yellow-600 bg-yellow-100 dark:text-yellow-400 dark:bg-yellow-500/20';
      case 'heavy': return 'text-red-600 bg-red-100 dark:text-red-400 dark:bg-red-500/20';
      default: return 'text-gray-600 bg-gray-100 dark:text-gray-400 dark:bg-gray-500/20';
    }
  };

  const getParkingScoreColor = (score: number) => {
    if (score >= 7) return 'text-green-600 dark:text-green-400';
    if (score >= 4) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
  };

  const handleReportSubmit = (report: any) => {
    setUserReports(prev => [...prev, { ...report, id: Date.now().toString(), timestamp: new Date() }]);
  };

  // Calculate estimated savings
  const estimatedSavings = Math.round((10 - data.parkingScore) * 25 + data.timeToFindParking * 2);

  const premiumTabs = [
    { id: 'parking', label: 'AI Scanner', icon: Camera },
    { id: 'map', label: 'Live Map', icon: MapPin },
    { id: 'navigate', label: 'Navigation', icon: Navigation },
    { id: 'spots', label: 'Spot Sharing', icon: Users },
    { id: 'protection', label: 'Ticket Protection', icon: Crown },
    { id: 'safety', label: 'Safety Reports', icon: AlertTriangle }
  ];

  return (
    <div className="space-y-6">
      <div className="bg-white/90 dark:bg-gray-800/30 border border-gray-200 dark:border-gray-600/30 rounded-2xl p-6 backdrop-blur-sm hover:shadow-xl transition-all duration-300 shadow-lg">
        <div className="flex items-center gap-4 mb-6">
          <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl shadow-lg">
            <Car className="w-8 h-8 text-white" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">Drive & Park Smart</h3>
              <div className="flex items-center gap-1 px-2 py-1 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-lg shadow-sm">
                <Crown className="w-3 h-3 text-white" />
                <span className="text-xs font-bold text-white">PREMIUM</span>
              </div>
            </div>
            <p className="text-gray-600 dark:text-gray-400">AI-powered route optimization with parking intelligence</p>
            <div className="flex items-center gap-2 mt-1">
              <DollarSign className="w-3 h-3 text-green-500" />
              <span className="text-xs text-green-600 dark:text-green-400 font-medium">Save ~${estimatedSavings}/month</span>
            </div>
          </div>
        </div>

        {/* Compact Key Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="text-center p-3 bg-gray-50 dark:bg-gray-700/30 rounded-xl">
            <div className="text-2xl font-bold text-gray-900 dark:text-white">{data.totalTime}</div>
            <div className="text-xs text-gray-600 dark:text-gray-400">Total Time (min)</div>
          </div>
          <div className="text-center p-3 bg-gray-50 dark:bg-gray-700/30 rounded-xl">
            <div className={`text-2xl font-bold ${getParkingScoreColor(data.parkingScore)}`}>{data.parkingScore}/10</div>
            <div className="text-xs text-gray-600 dark:text-gray-400">Parking Score</div>
          </div>
          <div className="text-center p-3 bg-gray-50 dark:bg-gray-700/30 rounded-xl">
            <div className="text-2xl font-bold text-gray-900 dark:text-white">{data.distance}</div>
            <div className="text-xs text-gray-600 dark:text-gray-400">Distance</div>
          </div>
          <div className="text-center p-3 bg-gray-50 dark:bg-gray-700/30 rounded-xl">
            <div className={`px-2 py-1 rounded-full text-xs font-semibold capitalize ${getTrafficColor(data.trafficStatus)}`}>
              {data.trafficStatus}
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">Traffic</div>
          </div>
        </div>

        {data.arrivalTime && (
          <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-400/30 rounded-xl mb-4">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <span className="text-blue-700 dark:text-blue-300 font-medium">Estimated Arrival</span>
            </div>
            <span className="text-lg font-bold text-blue-600 dark:text-blue-400">{data.arrivalTime}</span>
          </div>
        )}

        {/* Smart Insights */}
        <div className="bg-gradient-to-r from-indigo-50 to-blue-50 dark:from-indigo-500/10 dark:to-blue-500/10 border border-indigo-200 dark:border-indigo-400/30 rounded-xl p-4 mb-4">
          <div className="flex items-start gap-2">
            <TrendingUp className="w-4 h-4 text-indigo-600 dark:text-indigo-400 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-indigo-700 dark:text-indigo-300 mb-1">💡 Smart Insight</p>
              <p className="text-sm text-indigo-600 dark:text-indigo-200 leading-relaxed">
                {data.parkingScore >= 7 
                  ? `Excellent parking area! You'll likely find street parking within ${data.timeToFindParking} minutes. Consider this your best option today.`
                  : data.parkingScore >= 4
                  ? `Moderate parking challenge. Budget extra ${data.timeToFindParking} minutes for parking search. Have backup paid options ready.`
                  : `Tough parking zone! High demand area with ${data.timeToFindParking}+ min search time. Strongly recommend pre-booking a garage.`
                }
              </p>
            </div>
          </div>
        </div>

        {/* Premium Alerts - Compact */}
        {(data.constructionAlerts?.length || data.eventAlerts?.length) && (
          <div className="space-y-2 mb-4">
            {data.constructionAlerts?.map((alert, index) => (
              <div key={index} className="bg-orange-50 dark:bg-orange-500/10 border border-orange-200 dark:border-orange-400/30 rounded-lg p-3">
                <div className="flex items-center gap-2">
                  <Construction className="w-4 h-4 text-orange-600 dark:text-orange-400" />
                  <span className="text-sm font-semibold text-orange-700 dark:text-orange-300">Construction Alert</span>
                </div>
                <p className="text-sm text-orange-600 dark:text-orange-200 mt-1">{alert}</p>
              </div>
            ))}
            
            {data.eventAlerts?.map((alert, index) => (
              <div key={index} className="bg-purple-50 dark:bg-purple-500/10 border border-purple-200 dark:border-purple-400/30 rounded-lg p-3">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                  <span className="text-sm font-semibold text-purple-700 dark:text-purple-300">Event Alert</span>
                </div>
                <p className="text-sm text-purple-600 dark:text-purple-200 mt-1">{alert}</p>
              </div>
            ))}
          </div>
        )}

        {/* Premium Tools Toggle */}
        <button
          onClick={() => setShowPremiumTools(!showPremiumTools)}
          className="w-full px-4 py-3 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white font-semibold rounded-xl transition-all duration-200 flex items-center justify-center gap-2 shadow-lg"
        >
          <Camera className="w-5 h-5" />
          {showPremiumTools ? 'Hide' : 'Show'} Premium Tools
          <span className="text-xs bg-white/20 px-2 py-1 rounded-full">ACTIVE</span>
        </button>
      </div>

      {/* Premium Tools */}
      {showPremiumTools && (
        <div className="space-y-6">
          {/* Tab Navigation */}
          <div className="bg-white/90 dark:bg-gray-800/30 border border-gray-200 dark:border-gray-600/30 rounded-2xl p-2 backdrop-blur-sm">
            <div className="grid grid-cols-3 md:grid-cols-6 gap-1">
              {premiumTabs.map((tab) => {
                const IconComponent = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex flex-col items-center justify-center gap-1 px-2 py-3 rounded-xl font-medium transition-all duration-200 ${
                      activeTab === tab.id
                        ? 'bg-blue-500 text-white shadow-lg'
                        : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700/50'
                    }`}
                  >
                    <IconComponent className="w-4 h-4" />
                    <span className="text-xs">{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Tab Content */}
          {activeTab === 'parking' && (
            <ParkingCameraUpload onAnalysisComplete={setParkingAnalysis} />
          )}

          {activeTab === 'map' && (
            <div className="space-y-6">
              <LiveMap 
                origin="Current Location"
                destination={destination}
                showRoute={true}
                className="h-96"
              />
              <EnhancedParkingMap destination={destination} isPremium={true} />
            </div>
          )}

          {activeTab === 'navigate' && (
            <NavigationIntegration
              origin="Current Location"
              destination={destination}
              onNavigationStart={() => console.log('Navigation started')}
            />
          )}

          {activeTab === 'spots' && (
            <ParkingSpotReservation destination={destination} />
          )}

          {activeTab === 'protection' && (
            <TicketProtection />
          )}

          {activeTab === 'safety' && (
            <SafetyReporting 
              location={destination}
              onReportSubmit={handleReportSubmit}
            />
          )}

          {/* Parking Reminder (shows when parking analysis is available) */}
          {parkingAnalysis?.removalTime && (
            <ParkingReminder 
              removalTime={parkingAnalysis.removalTime}
              location={destination}
              language={language}
            />
          )}
        </div>
      )}
    </div>
  );
};