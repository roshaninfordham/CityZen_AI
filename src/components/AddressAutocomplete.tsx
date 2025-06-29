import React, { useState, useRef, useEffect } from 'react';
import { MapPin, Search, Clock, Star } from 'lucide-react';

interface AddressSuggestion {
  placeId: string;
  description: string;
  mainText: string;
  secondaryText: string;
  types: string[];
}

interface AddressAutocompleteProps {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  label: string;
  icon: React.ReactNode;
  disabled?: boolean;
}

// Extend global interface for Google Maps Extended Components
declare global {
  namespace JSX {
    interface IntrinsicElements {
      'gmpx-place-picker': any;
    }
  }
}

export const AddressAutocomplete: React.FC<AddressAutocompleteProps> = ({
  value,
  onChange,
  placeholder,
  label,
  icon,
  disabled = false
}) => {
  const [suggestions, setSuggestions] = useState<AddressSuggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [useGoogleComponent, setUseGoogleComponent] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const placePickerRef = useRef<any>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  // Load recent searches from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('cityzen-recent-searches');
    if (saved) {
      try {
        setRecentSearches(JSON.parse(saved));
      } catch (error) {
        console.error('Error loading recent searches:', error);
      }
    }

    // Check if Google Maps Extended Components are available
    customElements.whenDefined('gmpx-place-picker').then(() => {
      setUseGoogleComponent(true);
    }).catch(() => {
      console.log('Google Maps Extended Components not available, using fallback');
    });
  }, []);

  // Handle Google Place Picker events
  useEffect(() => {
    if (useGoogleComponent && placePickerRef.current) {
      const placePicker = placePickerRef.current;
      
      const handlePlaceChange = (event: any) => {
        const place = event.target.value;
        if (place && place.displayName) {
          const address = place.formattedAddress || place.displayName;
          onChange(address);
          
          // Save to recent searches
          const updated = [address, ...recentSearches.filter(s => s !== address)].slice(0, 5);
          setRecentSearches(updated);
          localStorage.setItem('cityzen-recent-searches', JSON.stringify(updated));
        }
      };

      placePicker.addEventListener('gmpx-placechange', handlePlaceChange);
      
      return () => {
        placePicker.removeEventListener('gmpx-placechange', handlePlaceChange);
      };
    }
  }, [useGoogleComponent, onChange, recentSearches]);

  // Google Places Autocomplete API call (fallback)
  const fetchSuggestions = async (input: string) => {
    if (input.length < 2) {
      setSuggestions([]);
      return;
    }

    setIsLoading(true);
    
    try {
      // Use Google Places Autocomplete API
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/place/autocomplete/json?` +
        `input=${encodeURIComponent(input)}&` +
        `location=40.7589,-73.9851&` + // NYC coordinates for bias
        `radius=50000&` + // 50km radius
        `components=country:us&` +
        `types=address&` +
        `key=AIzaSyAsx6Ef_cDUJtIPT7bkwOycsRrD4ubx76Y`,
        {
          mode: 'cors',
        }
      );

      if (response.ok) {
        const data = await response.json();
        
        if (data.status === 'OK' && data.predictions) {
          const formattedSuggestions: AddressSuggestion[] = data.predictions.map((prediction: any) => ({
            placeId: prediction.place_id,
            description: prediction.description,
            mainText: prediction.structured_formatting.main_text,
            secondaryText: prediction.structured_formatting.secondary_text,
            types: prediction.types
          }));
          
          setSuggestions(formattedSuggestions);
        } else {
          // Fallback to mock NYC suggestions
          setSuggestions(generateMockSuggestions(input));
        }
      } else {
        // Fallback to mock suggestions
        setSuggestions(generateMockSuggestions(input));
      }
    } catch (error) {
      console.error('Autocomplete API error:', error);
      // Fallback to mock suggestions
      setSuggestions(generateMockSuggestions(input));
    } finally {
      setIsLoading(false);
    }
  };

  // Generate mock NYC suggestions as fallback
  const generateMockSuggestions = (input: string): AddressSuggestion[] => {
    const nycLocations = [
      { main: 'Times Square', secondary: 'Manhattan, NY, USA', types: ['tourist_attraction'] },
      { main: 'Central Park', secondary: 'Manhattan, NY, USA', types: ['park'] },
      { main: 'Brooklyn Bridge', secondary: 'Brooklyn, NY, USA', types: ['tourist_attraction'] },
      { main: 'Wall Street', secondary: 'Financial District, Manhattan, NY, USA', types: ['route'] },
      { main: 'Empire State Building', secondary: 'Midtown Manhattan, NY, USA', types: ['tourist_attraction'] },
      { main: 'Grand Central Terminal', secondary: 'Midtown Manhattan, NY, USA', types: ['transit_station'] },
      { main: 'One World Trade Center', secondary: 'Financial District, Manhattan, NY, USA', types: ['establishment'] },
      { main: 'High Line', secondary: 'Chelsea, Manhattan, NY, USA', types: ['park'] },
      { main: 'Williamsburg Bridge', secondary: 'Lower East Side, Manhattan, NY, USA', types: ['establishment'] },
      { main: 'Coney Island', secondary: 'Brooklyn, NY, USA', types: ['neighborhood'] }
    ];

    const filtered = nycLocations
      .filter(location => 
        location.main.toLowerCase().includes(input.toLowerCase()) ||
        location.secondary.toLowerCase().includes(input.toLowerCase())
      )
      .slice(0, 5)
      .map((location, index) => ({
        placeId: `mock_${index}`,
        description: `${location.main}, ${location.secondary}`,
        mainText: location.main,
        secondaryText: location.secondary,
        types: location.types
      }));

    return filtered;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    onChange(newValue);
    
    if (newValue.trim()) {
      fetchSuggestions(newValue);
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (suggestion: AddressSuggestion) => {
    onChange(suggestion.description);
    setShowSuggestions(false);
    
    // Save to recent searches
    const updated = [suggestion.description, ...recentSearches.filter(s => s !== suggestion.description)].slice(0, 5);
    setRecentSearches(updated);
    localStorage.setItem('cityzen-recent-searches', JSON.stringify(updated));
  };

  const handleInputFocus = () => {
    if (value.trim()) {
      fetchSuggestions(value);
    }
    setShowSuggestions(true);
  };

  const handleInputBlur = () => {
    // Delay hiding suggestions to allow clicks
    setTimeout(() => setShowSuggestions(false), 200);
  };

  const getLocationIcon = (types: string[]) => {
    if (types.includes('transit_station')) return '🚇';
    if (types.includes('tourist_attraction')) return '🏛️';
    if (types.includes('park')) return '🌳';
    if (types.includes('establishment')) return '🏢';
    if (types.includes('neighborhood')) return '🏘️';
    return '📍';
  };

  return (
    <div className="relative">
      <label htmlFor={`address-${label}`} className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
        {icon}
        {label}
      </label>
      
      <div className="relative">
        {useGoogleComponent ? (
          // Use Google Maps Extended Component when available
          <div className="relative">
            <gmpx-place-picker
              ref={placePickerRef}
              placeholder={placeholder}
              style={{
                width: '100%',
                padding: '16px',
                paddingRight: '48px',
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                border: '1px solid rgba(156, 163, 175, 0.5)',
                borderRadius: '12px',
                fontSize: '16px',
                color: 'inherit',
                outline: 'none',
                transition: 'all 0.2s',
              }}
              disabled={disabled}
            />
            <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
              <Search className="w-5 h-5 text-gray-400" />
            </div>
          </div>
        ) : (
          // Fallback to regular input with manual autocomplete
          <>
            <input
              ref={inputRef}
              id={`address-${label}`}
              type="text"
              value={value}
              onChange={handleInputChange}
              onFocus={handleInputFocus}
              onBlur={handleInputBlur}
              placeholder={placeholder}
              className="w-full px-4 py-4 pr-12 bg-white/10 dark:bg-gray-800/50 border border-gray-300/50 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 focus:outline-none transition-all duration-200 backdrop-blur-sm"
              disabled={disabled}
            />
            
            <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <Search className="w-5 h-5 text-gray-400" />
              )}
            </div>

            {/* Suggestions Dropdown */}
            {showSuggestions && !useGoogleComponent && (
              <div 
                ref={suggestionsRef}
                className="absolute z-50 w-full mt-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-xl shadow-xl backdrop-blur-sm max-h-80 overflow-y-auto"
              >
                {/* Recent Searches */}
                {!value.trim() && recentSearches.length > 0 && (
                  <div className="p-3 border-b border-gray-200 dark:border-gray-600">
                    <div className="flex items-center gap-2 mb-2">
                      <Clock className="w-4 h-4 text-gray-500" />
                      <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Recent Searches</span>
                    </div>
                    {recentSearches.slice(0, 3).map((search, index) => (
                      <button
                        key={index}
                        onClick={() => handleSuggestionClick({
                          placeId: `recent_${index}`,
                          description: search,
                          mainText: search.split(',')[0],
                          secondaryText: search.split(',').slice(1).join(','),
                          types: ['establishment']
                        })}
                        className="w-full text-left px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors duration-150"
                      >
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-gray-700 dark:text-gray-300">{search}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                )}

                {/* Address Suggestions */}
                {suggestions.length > 0 && (
                  <div className="p-2">
                    {suggestions.map((suggestion, index) => (
                      <button
                        key={suggestion.placeId}
                        onClick={() => handleSuggestionClick(suggestion)}
                        className="w-full text-left px-3 py-3 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors duration-150 group"
                      >
                        <div className="flex items-start gap-3">
                          <span className="text-lg mt-0.5">{getLocationIcon(suggestion.types)}</span>
                          <div className="flex-1 min-w-0">
                            <div className="font-medium text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                              {suggestion.mainText}
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-400 truncate">
                              {suggestion.secondaryText}
                            </div>
                          </div>
                          <MapPin className="w-4 h-4 text-gray-400 group-hover:text-blue-500 transition-colors mt-1" />
                        </div>
                      </button>
                    ))}
                  </div>
                )}

                {/* No Results */}
                {value.trim() && suggestions.length === 0 && !isLoading && (
                  <div className="p-6 text-center">
                    <Search className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-500 dark:text-gray-400">No addresses found</p>
                    <p className="text-sm text-gray-400 dark:text-gray-500">Try a different search term</p>
                  </div>
                )}

                {/* Powered by Google */}
                <div className="p-2 border-t border-gray-200 dark:border-gray-600">
                  <div className="flex items-center justify-center gap-1 text-xs text-gray-400">
                    <span>Powered by</span>
                    <span className="font-semibold">Google Maps</span>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};