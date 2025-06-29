// Google Maps API Integration
const GOOGLE_MAPS_API_KEY = "AIzaSyAsx6Ef_cDUJtIPT7bkwOycsRrD4ubx76Y";

interface DirectionsResult {
  distance: string;
  duration: number; // in minutes
  durationInTraffic: number; // in minutes
  trafficDelay: number; // in minutes
  trafficStatus: 'light' | 'moderate' | 'heavy';
}

export class MockGoogleMapsService {
  async getDirections(
    origin: string,
    destination: string
  ): Promise<DirectionsResult> {
    try {
      // Use CORS proxy for development or implement proper backend proxy
      const proxyUrl = 'https://cors-anywhere.herokuapp.com/';
      const apiUrl = `https://maps.googleapis.com/maps/api/directions/json?` +
        `origin=${encodeURIComponent(origin)}&` +
        `destination=${encodeURIComponent(destination)}&` +
        `departure_time=now&` +
        `traffic_model=best_guess&` +
        `key=${GOOGLE_MAPS_API_KEY}`;

      const response = await fetch(proxyUrl + apiUrl, {
        headers: {
          'X-Requested-With': 'XMLHttpRequest'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.status === 'OK' && data.routes.length > 0) {
        const route = data.routes[0].legs[0];
        const duration = Math.round(route.duration.value / 60);
        const durationInTraffic = route.duration_in_traffic 
          ? Math.round(route.duration_in_traffic.value / 60)
          : duration + Math.floor(Math.random() * 10); // Fallback if no traffic data

        const trafficDelay = durationInTraffic - duration;

        return {
          distance: route.distance.text,
          duration,
          durationInTraffic,
          trafficDelay,
          trafficStatus: this.calculateTrafficStatus(trafficDelay),
        };
      } else {
        console.warn('Google Maps API returned no routes:', data.status);
        throw new Error(`No routes found: ${data.status}`);
      }
    } catch (error) {
      console.warn('Google Maps API error, using fallback data:', error);
      // Fallback to enhanced mock data when API fails
      return this.generateEnhancedMockDirections(origin, destination);
    }
  }

  async geocodeAddress(address: string): Promise<{ lat: number; lng: number }> {
    try {
      // Use CORS proxy for development
      const proxyUrl = 'https://cors-anywhere.herokuapp.com/';
      const apiUrl = `https://maps.googleapis.com/maps/api/geocode/json?` +
        `address=${encodeURIComponent(address)}&` +
        `key=${GOOGLE_MAPS_API_KEY}`;

      const response = await fetch(proxyUrl + apiUrl, {
        headers: {
          'X-Requested-With': 'XMLHttpRequest'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.status === 'OK' && data.results.length > 0) {
        const location = data.results[0].geometry.location;
        return {
          lat: location.lat,
          lng: location.lng,
        };
      } else {
        console.warn('Geocoding API returned no results:', data.status);
        throw new Error(`Geocoding failed: ${data.status}`);
      }
    } catch (error) {
      console.warn('Geocoding API error, using fallback coordinates:', error);
      // Fallback to NYC-area coordinates based on address keywords
      return this.generateSmartMockCoordinates(address);
    }
  }

  private calculateTrafficStatus(delayMinutes: number): 'light' | 'moderate' | 'heavy' {
    if (delayMinutes <= 5) return 'light';
    if (delayMinutes <= 15) return 'moderate';
    return 'heavy';
  }

  private generateEnhancedMockDirections(origin: string, destination: string): DirectionsResult {
    // More intelligent mock data based on NYC geography
    const distance = this.estimateNYCDistance(origin, destination);
    const baseDuration = Math.max(10, Math.floor(distance * 2.5)); // ~2.5 min per mile in NYC
    
    // Add realistic traffic based on time of day
    const hour = new Date().getHours();
    const isRushHour = (hour >= 7 && hour <= 10) || (hour >= 17 && hour <= 19);
    const isWeekend = new Date().getDay() === 0 || new Date().getDay() === 6;
    
    let trafficMultiplier = 1;
    if (isRushHour && !isWeekend) {
      trafficMultiplier = 1.5; // 50% longer during rush hour
    } else if (hour >= 11 && hour <= 16 && !isWeekend) {
      trafficMultiplier = 1.2; // 20% longer during business hours
    }
    
    const durationInTraffic = Math.floor(baseDuration * trafficMultiplier);
    const trafficDelay = durationInTraffic - baseDuration;
    
    return {
      distance: `${distance.toFixed(1)} mi`,
      duration: baseDuration,
      durationInTraffic,
      trafficDelay,
      trafficStatus: this.calculateTrafficStatus(trafficDelay),
    };
  }

  private generateSmartMockCoordinates(address: string): { lat: number; lng: number } {
    const addressLower = address.toLowerCase();
    
    // Manhattan coordinates
    if (addressLower.includes('manhattan') || addressLower.includes('midtown') || 
        addressLower.includes('times square') || addressLower.includes('wall street')) {
      return {
        lat: 40.7589 + (Math.random() - 0.5) * 0.02,
        lng: -73.9851 + (Math.random() - 0.5) * 0.02,
      };
    }
    
    // Brooklyn coordinates
    if (addressLower.includes('brooklyn') || addressLower.includes('williamsburg') || 
        addressLower.includes('park slope')) {
      return {
        lat: 40.6782 + (Math.random() - 0.5) * 0.05,
        lng: -73.9442 + (Math.random() - 0.5) * 0.05,
      };
    }
    
    // Queens coordinates
    if (addressLower.includes('queens') || addressLower.includes('astoria') || 
        addressLower.includes('flushing')) {
      return {
        lat: 40.7282 + (Math.random() - 0.5) * 0.05,
        lng: -73.7949 + (Math.random() - 0.5) * 0.05,
      };
    }
    
    // Bronx coordinates
    if (addressLower.includes('bronx')) {
      return {
        lat: 40.8448 + (Math.random() - 0.5) * 0.05,
        lng: -73.8648 + (Math.random() - 0.5) * 0.05,
      };
    }
    
    // Default to Manhattan if no specific area detected
    return {
      lat: 40.7589 + (Math.random() - 0.5) * 0.05,
      lng: -73.9851 + (Math.random() - 0.5) * 0.05,
    };
  }

  private estimateNYCDistance(origin: string, destination: string): number {
    // Rough distance estimation based on NYC geography
    const originLower = origin.toLowerCase();
    const destLower = destination.toLowerCase();
    
    // Same borough = shorter distance
    const boroughs = ['manhattan', 'brooklyn', 'queens', 'bronx', 'staten island'];
    const originBorough = boroughs.find(b => originLower.includes(b));
    const destBorough = boroughs.find(b => destLower.includes(b));
    
    if (originBorough === destBorough) {
      return 2 + Math.random() * 4; // 2-6 miles within same borough
    } else {
      return 5 + Math.random() * 10; // 5-15 miles between boroughs
    }
  }
}