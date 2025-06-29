import React, { useState, useEffect } from 'react';
import { 
  MapPin, 
  Clock, 
  DollarSign, 
  Users, 
  Star, 
  MessageCircle, 
  CheckCircle, 
  AlertCircle,
  Navigation,
  Zap,
  Crown,
  Send,
  Timer,
  Award
} from 'lucide-react';

interface ParkingSpotRequest {
  id: string;
  requesterName: string;
  requesterRating: number;
  offerAmount: number;
  message: string;
  timeNeeded: string;
  timestamp: Date;
  status: 'pending' | 'accepted' | 'declined' | 'expired';
}

interface ParkingSpotListing {
  id: string;
  ownerName: string;
  ownerRating: number;
  location: string;
  availableAt: string;
  duration: string;
  price: number;
  description: string;
  distance: string;
  verified: boolean;
  requests: ParkingSpotRequest[];
}

interface ParkingSpotReservationProps {
  destination: string;
  userLocation?: { lat: number; lng: number };
}

export const ParkingSpotReservation: React.FC<ParkingSpotReservationProps> = ({
  destination,
  userLocation
}) => {
  const [activeTab, setActiveTab] = useState<'find' | 'offer'>('find');
  const [availableSpots, setAvailableSpots] = useState<ParkingSpotListing[]>([]);
  const [myRequests, setMyRequests] = useState<ParkingSpotRequest[]>([]);
  const [selectedSpot, setSelectedSpot] = useState<ParkingSpotListing | null>(null);
  const [showRequestForm, setShowRequestForm] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  // Request form state
  const [requestForm, setRequestForm] = useState({
    offerAmount: '',
    message: '',
    timeNeeded: ''
  });

  // Offer form state
  const [offerForm, setOfferForm] = useState({
    location: '',
    availableAt: '',
    duration: '',
    price: '',
    description: ''
  });

  useEffect(() => {
    generateMockSpots();
  }, [destination]);

  const generateMockSpots = async () => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1500));

    const spots: ParkingSpotListing[] = [
      {
        id: '1',
        ownerName: 'Sarah M.',
        ownerRating: 4.9,
        location: '42nd Street & 8th Ave',
        availableAt: '2:30 PM',
        duration: '3 hours',
        price: 15,
        description: 'Great spot right in front of office building. Very safe area with security.',
        distance: '0.2 miles',
        verified: true,
        requests: []
      },
      {
        id: '2',
        ownerName: 'Mike R.',
        ownerRating: 4.7,
        location: 'Times Square area',
        availableAt: '3:00 PM',
        duration: '2 hours',
        price: 25,
        description: 'Prime location! Leaving work early today. Meter paid until 6 PM.',
        distance: '0.1 miles',
        verified: true,
        requests: [
          {
            id: 'req1',
            requesterName: 'John D.',
            requesterRating: 4.8,
            offerAmount: 30,
            message: 'Happy to pay extra for this prime spot!',
            timeNeeded: '4 hours',
            timestamp: new Date(Date.now() - 300000),
            status: 'pending'
          }
        ]
      },
      {
        id: '3',
        ownerName: 'Lisa K.',
        ownerRating: 5.0,
        location: 'Broadway & 45th St',
        availableAt: '1:45 PM',
        duration: '4 hours',
        price: 20,
        description: 'Heading to airport. Spot is paid until 6 PM. Easy to find!',
        distance: '0.3 miles',
        verified: true,
        requests: []
      },
      {
        id: '4',
        ownerName: 'David L.',
        ownerRating: 4.6,
        location: '7th Ave & 44th St',
        availableAt: '2:15 PM',
        duration: '5 hours',
        price: 18,
        description: 'Reliable spot, I use this daily. Clean area, well-lit.',
        distance: '0.4 miles',
        verified: false,
        requests: []
      }
    ];

    setAvailableSpots(spots);
    setIsLoading(false);
  };

  const handleSendRequest = async (spotId: string) => {
    if (!requestForm.offerAmount || !requestForm.message) return;

    const newRequest: ParkingSpotRequest = {
      id: Date.now().toString(),
      requesterName: 'You',
      requesterRating: 4.8,
      offerAmount: parseFloat(requestForm.offerAmount),
      message: requestForm.message,
      timeNeeded: requestForm.timeNeeded || '2 hours',
      timestamp: new Date(),
      status: 'pending'
    };

    // Add request to the spot
    setAvailableSpots(prev => prev.map(spot => 
      spot.id === spotId 
        ? { ...spot, requests: [...spot.requests, newRequest] }
        : spot
    ));

    // Add to user's requests
    setMyRequests(prev => [...prev, newRequest]);

    // Reset form
    setRequestForm({ offerAmount: '', message: '', timeNeeded: '' });
    setShowRequestForm(false);
    setSelectedSpot(null);

    // Simulate response after 3 seconds
    setTimeout(() => {
      setMyRequests(prev => prev.map(req => 
        req.id === newRequest.id 
          ? { ...req, status: Math.random() > 0.3 ? 'accepted' : 'declined' }
          : req
      ));
    }, 3000);
  };

  const handleOfferSpot = async () => {
    if (!offerForm.location || !offerForm.availableAt || !offerForm.price) return;

    const newSpot: ParkingSpotListing = {
      id: Date.now().toString(),
      ownerName: 'You',
      ownerRating: 4.8,
      location: offerForm.location,
      availableAt: offerForm.availableAt,
      duration: offerForm.duration || '2 hours',
      price: parseFloat(offerForm.price),
      description: offerForm.description || 'Available parking spot',
      distance: '0.0 miles',
      verified: false,
      requests: []
    };

    setAvailableSpots(prev => [newSpot, ...prev]);
    setOfferForm({ location: '', availableAt: '', duration: '', price: '', description: '' });
  };

  const getStatusColor = (status: ParkingSpotRequest['status']) => {
    switch (status) {
      case 'accepted': return 'text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-500/20';
      case 'declined': return 'text-red-600 bg-red-100 dark:text-red-400 dark:bg-red-500/20';
      case 'pending': return 'text-yellow-600 bg-yellow-100 dark:text-yellow-400 dark:bg-yellow-500/20';
      case 'expired': return 'text-gray-600 bg-gray-100 dark:text-gray-400 dark:bg-gray-500/20';
      default: return 'text-gray-600 bg-gray-100 dark:text-gray-400 dark:bg-gray-500/20';
    }
  };

  const getStatusIcon = (status: ParkingSpotRequest['status']) => {
    switch (status) {
      case 'accepted': return <CheckCircle className="w-4 h-4" />;
      case 'declined': return <AlertCircle className="w-4 h-4" />;
      case 'pending': return <Timer className="w-4 h-4" />;
      case 'expired': return <Clock className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  return (
    <div className="bg-white/90 dark:bg-gray-800/30 border border-gray-200 dark:border-gray-600/30 rounded-2xl p-6 backdrop-blur-sm">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl shadow-lg">
          <Users className="w-8 h-8 text-white" />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">Spot Sharing Network</h3>
            <div className="flex items-center gap-1 px-2 py-1 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-lg shadow-sm">
              <Crown className="w-3 h-3 text-white" />
              <span className="text-xs font-bold text-white">PREMIUM</span>
            </div>
          </div>
          <p className="text-gray-600 dark:text-gray-400">Reserve spots from departing drivers • Earn money from your spot</p>
          <div className="flex items-center gap-2 mt-1">
            <Award className="w-3 h-3 text-emerald-500" />
            <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">Community-verified • Safe transactions</span>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-2 mb-6 bg-gray-100 dark:bg-gray-700/30 rounded-xl p-1">
        <button
          onClick={() => setActiveTab('find')}
          className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-medium transition-all duration-200 ${
            activeTab === 'find'
              ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
          }`}
        >
          <Navigation className="w-4 h-4" />
          Find Spots
        </button>
        <button
          onClick={() => setActiveTab('offer')}
          className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-medium transition-all duration-200 ${
            activeTab === 'offer'
              ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
          }`}
        >
          <DollarSign className="w-4 h-4" />
          Offer Spot
        </button>
      </div>

      {/* Find Spots Tab */}
      {activeTab === 'find' && (
        <div className="space-y-4">
          {isLoading ? (
            <div className="text-center py-8">
              <div className="w-8 h-8 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-600 dark:text-gray-300">Finding available spots near {destination}...</p>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Available Spots Near You
                </h4>
                <div className="flex items-center gap-1 text-xs text-emerald-400">
                  <Zap className="w-3 h-3" />
                  <span>Live updates</span>
                </div>
              </div>

              {availableSpots.map((spot) => (
                <div
                  key={spot.id}
                  className="p-4 bg-gray-50 dark:bg-gray-700/30 border border-gray-200 dark:border-gray-600/30 rounded-xl hover:border-emerald-400/50 transition-all duration-200"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-gray-900 dark:text-white">{spot.ownerName}</span>
                        <div className="flex items-center gap-1">
                          <Star className="w-3 h-3 text-yellow-400 fill-current" />
                          <span className="text-xs text-gray-600 dark:text-gray-400">{spot.ownerRating}</span>
                        </div>
                        {spot.verified && (
                          <div className="flex items-center gap-1 px-2 py-0.5 bg-green-100 dark:bg-green-500/20 rounded-full">
                            <CheckCircle className="w-3 h-3 text-green-600 dark:text-green-400" />
                            <span className="text-xs text-green-600 dark:text-green-400 font-medium">Verified</span>
                          </div>
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-2">
                        <MapPin className="w-4 h-4" />
                        <span>{spot.location}</span>
                        <span>•</span>
                        <span>{spot.distance}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xl font-bold text-emerald-600 dark:text-emerald-400">${spot.price}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">for {spot.duration}</div>
                    </div>
                  </div>

                  <p className="text-sm text-gray-700 dark:text-gray-300 mb-3">{spot.description}</p>

                  <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400 mb-3">
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span>Available at {spot.availableAt}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Timer className="w-3 h-3" />
                      <span>Duration: {spot.duration}</span>
                    </div>
                  </div>

                  {spot.requests.length > 0 && (
                    <div className="mb-3 p-2 bg-yellow-50 dark:bg-yellow-500/10 border border-yellow-200 dark:border-yellow-400/30 rounded-lg">
                      <div className="flex items-center gap-1 text-xs text-yellow-700 dark:text-yellow-300">
                        <Users className="w-3 h-3" />
                        <span>{spot.requests.length} other request(s) pending</span>
                      </div>
                    </div>
                  )}

                  <button
                    onClick={() => {
                      setSelectedSpot(spot);
                      setShowRequestForm(true);
                    }}
                    className="w-full px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white font-medium rounded-lg transition-colors duration-200"
                  >
                    Request This Spot
                  </button>
                </div>
              ))}

              {/* My Requests */}
              {myRequests.length > 0 && (
                <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-600/30">
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">My Requests</h4>
                  <div className="space-y-3">
                    {myRequests.map((request) => (
                      <div key={request.id} className="p-3 bg-gray-50 dark:bg-gray-700/30 rounded-lg">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-medium text-gray-900 dark:text-white">
                                ${request.offerAmount} offer
                              </span>
                              <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(request.status)}`}>
                                {getStatusIcon(request.status)}
                                <span className="capitalize">{request.status}</span>
                              </div>
                            </div>
                            <p className="text-sm text-gray-600 dark:text-gray-400">{request.message}</p>
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-500">
                            {Math.floor((Date.now() - request.timestamp.getTime()) / 60000)}m ago
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      )}

      {/* Offer Spot Tab */}
      {activeTab === 'offer' && (
        <div className="space-y-4">
          <div className="bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-400/30 rounded-xl p-4 mb-6">
            <div className="flex items-start gap-2">
              <DollarSign className="w-5 h-5 text-emerald-600 dark:text-emerald-400 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-emerald-700 dark:text-emerald-300 mb-1">💰 Earn Money From Your Spot</p>
                <p className="text-sm text-emerald-600 dark:text-emerald-200 leading-relaxed">
                  Leaving your parking spot? Help fellow drivers and earn $10-30 by reserving it for someone who needs it!
                </p>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Spot Location *
              </label>
              <input
                type="text"
                value={offerForm.location}
                onChange={(e) => setOfferForm(prev => ({ ...prev, location: e.target.value }))}
                placeholder="e.g., 42nd Street & Broadway"
                className="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Available At *
              </label>
              <input
                type="time"
                value={offerForm.availableAt}
                onChange={(e) => setOfferForm(prev => ({ ...prev, availableAt: e.target.value }))}
                className="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Duration Available
              </label>
              <select
                value={offerForm.duration}
                onChange={(e) => setOfferForm(prev => ({ ...prev, duration: e.target.value }))}
                className="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              >
                <option value="">Select duration</option>
                <option value="1 hour">1 hour</option>
                <option value="2 hours">2 hours</option>
                <option value="3 hours">3 hours</option>
                <option value="4 hours">4 hours</option>
                <option value="5+ hours">5+ hours</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Price ($) *
              </label>
              <input
                type="number"
                value={offerForm.price}
                onChange={(e) => setOfferForm(prev => ({ ...prev, price: e.target.value }))}
                placeholder="15"
                min="5"
                max="50"
                className="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Description (Optional)
            </label>
            <textarea
              value={offerForm.description}
              onChange={(e) => setOfferForm(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Any helpful details about the spot (safety, accessibility, etc.)"
              rows={3}
              className="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 resize-none"
            />
          </div>

          <button
            onClick={handleOfferSpot}
            disabled={!offerForm.location || !offerForm.availableAt || !offerForm.price}
            className="w-full px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-colors duration-200"
          >
            List My Spot
          </button>
        </div>
      )}

      {/* Request Form Modal */}
      {showRequestForm && selectedSpot && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 max-w-md w-full">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Request Spot</h3>
              <button
                onClick={() => {
                  setShowRequestForm(false);
                  setSelectedSpot(null);
                }}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                ✕
              </button>
            </div>

            <div className="mb-4 p-3 bg-gray-50 dark:bg-gray-700/30 rounded-lg">
              <p className="font-medium text-gray-900 dark:text-white">{selectedSpot.location}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Available at {selectedSpot.availableAt} • {selectedSpot.duration}
              </p>
              <p className="text-sm text-emerald-600 dark:text-emerald-400 font-medium">
                Asking: ${selectedSpot.price}
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Your Offer ($) *
                </label>
                <input
                  type="number"
                  value={requestForm.offerAmount}
                  onChange={(e) => setRequestForm(prev => ({ ...prev, offerAmount: e.target.value }))}
                  placeholder={selectedSpot.price.toString()}
                  min={selectedSpot.price}
                  className="w-full px-4 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  How long do you need it?
                </label>
                <select
                  value={requestForm.timeNeeded}
                  onChange={(e) => setRequestForm(prev => ({ ...prev, timeNeeded: e.target.value }))}
                  className="w-full px-4 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                >
                  <option value="">Select duration</option>
                  <option value="1 hour">1 hour</option>
                  <option value="2 hours">2 hours</option>
                  <option value="3 hours">3 hours</option>
                  <option value="4 hours">4 hours</option>
                  <option value="All day">All day</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Message to Owner *
                </label>
                <textarea
                  value={requestForm.message}
                  onChange={(e) => setRequestForm(prev => ({ ...prev, message: e.target.value }))}
                  placeholder="Hi! I'd love to reserve your spot. I'm a reliable driver with great ratings."
                  rows={3}
                  className="w-full px-4 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 resize-none"
                />
              </div>

              <button
                onClick={() => handleSendRequest(selectedSpot.id)}
                disabled={!requestForm.offerAmount || !requestForm.message}
                className="w-full px-6 py-3 bg-emerald-500 hover:bg-emerald-600 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" />
                Send Request
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};