import React, { useEffect, useRef, useState } from 'react';
import { MapPin, Navigation, Zap, RotateCcw, Maximize2, Layers } from 'lucide-react';

interface LiveMapProps {
  origin?: string;
  destination?: string;
  showRoute?: boolean;
  className?: string;
}

// Extend the global interface to include Google Maps Extended Components
declare global {
  namespace JSX {
    interface IntrinsicElements {
      'gmpx-api-loader': any;
      'gmp-map': any;
      'gmp-advanced-marker': any;
      'gmpx-place-picker': any;
    }
  }
  interface Window {
    google: any;
  }
}

export const LiveMap: React.FC<LiveMapProps> = ({ 
  origin, 
  destination, 
  showRoute = false,
  className = "h-96"
}) => {
  const mapRef = useRef<any>(null);
  const originMarkerRef = useRef<any>(null);
  const destinationMarkerRef = useRef<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mapType, setMapType] = useState<'roadmap' | 'satellite'>('roadmap');
  const [directionsRenderer, setDirectionsRenderer] = useState<any>(null);

  useEffect(() => {
    const initializeMap = async () => {
      try {
        // Wait for the Google Maps Extended Components to be defined
        await customElements.whenDefined('gmp-map');
        await customElements.whenDefined('gmp-advanced-marker');
        
        if (mapRef.current) {
          const map = mapRef.current;
          
          // Configure map options
          if (map.innerMap) {
            map.innerMap.setOptions({
              mapTypeControl: true,
              streetViewControl: true,
              fullscreenControl: true,
              zoomControl: true,
              mapTypeId: mapType,
              styles: [
                {
                  featureType: 'poi',
                  elementType: 'labels',
                  stylers: [{ visibility: 'on' }]
                },
                {
                  featureType: 'transit.station',
                  elementType: 'labels',
                  stylers: [{ visibility: 'on' }]
                }
              ]
            });

            // Add traffic layer
            const trafficLayer = new window.google.maps.TrafficLayer();
            trafficLayer.setMap(map.innerMap);

            // Add transit layer
            const transitLayer = new window.google.maps.TransitLayer();
            transitLayer.setMap(map.innerMap);

            // Initialize directions renderer
            const renderer = new window.google.maps.DirectionsRenderer({
              draggable: true,
              suppressMarkers: true, // We'll use our custom markers
            });
            renderer.setMap(map.innerMap);
            setDirectionsRenderer(renderer);
          }
          
          setIsLoading(false);
        }
      } catch (err) {
        console.error('Map initialization error:', err);
        setError('Failed to initialize map');
        setIsLoading(false);
      }
    };

    // Small delay to ensure DOM is ready
    const timer = setTimeout(initializeMap, 1000);
    return () => clearTimeout(timer);
  }, [mapType]);

  useEffect(() => {
    if (mapRef.current && origin && destination && showRoute && directionsRenderer) {
      calculateAndDisplayRoute();
    }
  }, [origin, destination, showRoute, directionsRenderer]);

  const calculateAndDisplayRoute = async () => {
    if (!window.google || !directionsRenderer) return;

    try {
      const directionsService = new window.google.maps.DirectionsService();
      
      const request = {
        origin: origin,
        destination: destination,
        travelMode: window.google.maps.TravelMode.DRIVING,
        avoidHighways: false,
        avoidTolls: false,
        drivingOptions: {
          departureTime: new Date(),
          trafficModel: window.google.maps.TrafficModel.BEST_GUESS
        }
      };

      directionsService.route(request, (response: any, status: any) => {
        if (status === 'OK') {
          directionsRenderer.setDirections(response);
          
          // Add custom markers for origin and destination
          addCustomMarkers(response.routes[0]);
        } else {
          console.error('Directions request failed:', status);
          // Fallback to showing individual markers
          addFallbackMarkers();
        }
      });
    } catch (error) {
      console.error('Route calculation error:', error);
      addFallbackMarkers();
    }
  };

  const addCustomMarkers = (route: any) => {
    if (!mapRef.current || !route.legs.length) return;

    const leg = route.legs[0];
    
    // Update origin marker
    if (originMarkerRef.current) {
      originMarkerRef.current.position = leg.start_location;
    }

    // Update destination marker
    if (destinationMarkerRef.current) {
      destinationMarkerRef.current.position = leg.end_location;
    }
  };

  const addFallbackMarkers = async () => {
    if (!window.google || !mapRef.current) return;

    const geocoder = new window.google.maps.Geocoder();
    
    try {
      if (origin && originMarkerRef.current) {
        const originResult = await geocodeAddress(geocoder, origin);
        if (originResult) {
          originMarkerRef.current.position = originResult.geometry.location;
        }
      }

      if (destination && destinationMarkerRef.current) {
        const destResult = await geocodeAddress(geocoder, destination);
        if (destResult) {
          destinationMarkerRef.current.position = destResult.geometry.location;
          mapRef.current.center = destResult.geometry.location;
          mapRef.current.zoom = 14;
        }
      }
    } catch (error) {
      console.error('Geocoding error:', error);
    }
  };

  const geocodeAddress = (geocoder: any, address: string): Promise<any> => {
    return new Promise((resolve, reject) => {
      geocoder.geocode({ address }, (results: any, status: any) => {
        if (status === 'OK' && results.length > 0) {
          resolve(results[0]);
        } else {
          reject(new Error(`Geocoding failed: ${status}`));
        }
      });
    });
  };

  const changeMapType = (type: typeof mapType) => {
    setMapType(type);
    if (mapRef.current?.innerMap) {
      mapRef.current.innerMap.setMapTypeId(type);
    }
  };

  const recenterMap = () => {
    if (mapRef.current) {
      mapRef.current.center = { lat: 40.7589, lng: -73.9851 }; // NYC center
      mapRef.current.zoom = 13;
    }
  };

  const toggleFullscreen = () => {
    if (mapRef.current) {
      if (document.fullscreenElement) {
        document.exitFullscreen();
      } else {
        mapRef.current.requestFullscreen();
      }
    }
  };

  if (error) {
    return (
      <div className={`${className} bg-gray-100 dark:bg-gray-800 rounded-xl flex items-center justify-center`}>
        <div className="text-center">
          <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400 font-medium">Map unavailable</p>
          <p className="text-sm text-gray-500 dark:text-gray-500">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Map Container */}
      <div className={`${className} rounded-xl overflow-hidden relative`}>
        <gmp-map
          ref={mapRef}
          center="40.7589,-73.9851"
          zoom="13"
          map-id="DEMO_MAP_ID"
          style={{ width: '100%', height: '100%' }}
        >
          {/* Origin Marker */}
          <gmp-advanced-marker
            ref={originMarkerRef}
            title="Origin"
          >
            <div className="w-8 h-8 bg-green-500 rounded-full border-2 border-white shadow-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">A</span>
            </div>
          </gmp-advanced-marker>

          {/* Destination Marker */}
          <gmp-advanced-marker
            ref={destinationMarkerRef}
            title="Destination"
          >
            <div className="w-8 h-8 bg-red-500 rounded-full border-2 border-white shadow-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">B</span>
            </div>
          </gmp-advanced-marker>
        </gmp-map>

        {isLoading && (
          <div className="absolute inset-0 bg-gray-100 dark:bg-gray-800 flex items-center justify-center z-10">
            <div className="text-center">
              <div className="w-8 h-8 border-2 border-blue-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-600 dark:text-gray-400">Loading live map...</p>
            </div>
          </div>
        )}
      </div>

      {/* Map Controls */}
      {!isLoading && !error && (
        <div className="absolute top-4 right-4 z-20 space-y-2">
          {/* Map Type Selector */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-600 overflow-hidden">
            <button
              onClick={() => changeMapType('roadmap')}
              className={`px-3 py-2 text-xs font-medium transition-colors ${
                mapType === 'roadmap' 
                  ? 'bg-blue-500 text-white' 
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              Map
            </button>
            <button
              onClick={() => changeMapType('satellite')}
              className={`px-3 py-2 text-xs font-medium transition-colors ${
                mapType === 'satellite' 
                  ? 'bg-blue-500 text-white' 
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              Satellite
            </button>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-2">
            <button
              onClick={recenterMap}
              className="p-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              title="Recenter map"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
            
            <button
              onClick={toggleFullscreen}
              className="p-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              title="Toggle fullscreen"
            >
              <Maximize2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Live Indicator */}
      {!isLoading && !error && (
        <div className="absolute top-4 left-4 z-20">
          <div className="flex items-center gap-2 px-3 py-2 bg-green-500 text-white rounded-lg shadow-lg">
            <Zap className="w-4 h-4" />
            <span className="text-sm font-medium">LIVE</span>
            <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
          </div>
        </div>
      )}

      {/* Route Info */}
      {showRoute && origin && destination && !isLoading && (
        <div className="absolute bottom-4 left-4 right-4 z-20">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-600 p-4">
            <div className="flex items-center gap-3">
              <Navigation className="w-5 h-5 text-blue-500" />
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  Route: {origin} → {destination}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Real-time traffic • Live updates
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};