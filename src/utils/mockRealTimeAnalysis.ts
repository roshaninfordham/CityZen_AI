import { MockGoogleMapsService } from '../services/mockGoogleMapsService';
import { MockParkingService } from '../services/mockParkingService';
import { MTATransitService } from '../services/mtaTransitService';
import { AIRecommendationService } from '../services/aiRecommendationService';
import { GeminiService } from '../services/geminiService';
import { AnalysisResult, Location, TripPreferences } from '../types';

export class MockRealTimeAnalysisService {
  private googleMaps: MockGoogleMapsService;
  private parking: MockParkingService;
  private transit: MTATransitService;
  private aiRecommendation: AIRecommendationService;
  private geminiService: GeminiService;

  constructor() {
    this.googleMaps = new MockGoogleMapsService();
    this.parking = new MockParkingService();
    this.transit = new MTATransitService();
    this.aiRecommendation = new AIRecommendationService();
    this.geminiService = new GeminiService();
  }

  async analyzeTrip(
    origin: Location, 
    destination: Location, 
    preferences: TripPreferences
  ): Promise<AnalysisResult> {
    try {
      // Calculate departure time based on arrival time preference
      const departureTime = this.calculateDepartureTime(preferences.arrivalTime);
      
      // Run driving and transit analysis in parallel for realistic timing
      const [drivingResult, transitResult] = await Promise.all([
        this.analyzeDriving(origin.address, destination.address, preferences),
        this.analyzeTransit(origin.address, destination.address, preferences)
      ]);

      // Generate AI recommendation using Gemini
      const recommendation = await this.aiRecommendation.generateRecommendation(
        drivingResult,
        transitResult,
        origin.address,
        destination.address
      );

      return {
        driving: drivingResult,
        transit: transitResult,
        recommendation,
        departureTime,
        arrivalTime: preferences.arrivalTime
      };
    } catch (error) {
      console.error('Error in real-time analysis:', error);
      throw new Error('Failed to analyze trip options');
    }
  }

  private calculateDepartureTime(arrivalTime?: string): string {
    if (!arrivalTime) {
      return new Date().toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: false 
      });
    }

    // Calculate departure time (simplified - subtract average travel time)
    const [hours, minutes] = arrivalTime.split(':').map(Number);
    const arrivalDate = new Date();
    arrivalDate.setHours(hours, minutes, 0, 0);
    
    // Subtract estimated travel time (30 minutes average)
    const departureDate = new Date(arrivalDate.getTime() - 30 * 60 * 1000);
    
    return departureDate.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false 
    });
  }

  private calculateArrivalTime(eta: number, arrivalTime?: string): string {
    if (arrivalTime) return arrivalTime;

    const now = new Date();
    const arrival = new Date(now.getTime() + eta * 60 * 1000);
    
    return arrival.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false 
    });
  }

  private async analyzeDriving(origin: string, destination: string, preferences: TripPreferences) {
    // Get real driving directions from Google Maps API
    const directions = await this.googleMaps.getDirections(origin, destination);
    
    // Get destination coordinates for parking analysis
    const coordinates = await this.googleMaps.geocodeAddress(destination);
    
    // Analyze parking difficulty
    const parkingAnalysis = await this.parking.analyzeParkingDifficulty(destination, coordinates);

    const totalTime = directions.durationInTraffic + parkingAnalysis.timeToFindParking;
    const arrivalTime = this.calculateArrivalTime(totalTime, preferences.arrivalTime);

    // Add premium features for premium users
    const premiumFeatures = preferences.isPremium ? {
      constructionAlerts: this.generateConstructionAlerts(),
      eventAlerts: this.generateEventAlerts()
    } : {};

    // Generate AI-powered parking insights
    let parkingInsight = parkingAnalysis.analysis;
    if (preferences.isPremium) {
      try {
        parkingInsight = await this.geminiService.generateParkingInsights(
          destination,
          parkingAnalysis.parkingScore,
          parkingAnalysis.timeToFindParking,
          ['Meter required', 'Street cleaning rules apply']
        );
      } catch (error) {
        console.log('Using fallback parking insight');
      }
    }

    return {
      eta: directions.duration,
      distance: directions.distance,
      trafficStatus: directions.trafficStatus,
      parkingScore: parkingAnalysis.parkingScore,
      timeToFindParking: parkingAnalysis.timeToFindParking,
      totalTime,
      arrivalTime,
      parkingInsight,
      ...premiumFeatures
    };
  }

  private async analyzeTransit(origin: string, destination: string, preferences: TripPreferences) {
    // Use real MTA API data
    const transitRoute = await this.transit.getTransitRoute(origin, destination);
    const arrivalTime = this.calculateArrivalTime(transitRoute.eta, preferences.arrivalTime);
    
    return {
      eta: transitRoute.eta,
      cost: transitRoute.cost,
      lines: transitRoute.lines,
      serviceStatus: transitRoute.serviceStatus,
      delays: transitRoute.delays,
      arrivalTime
    };
  }

  private generateConstructionAlerts(): string[] {
    const alerts = [
      'FDR Drive southbound lane closure near Brooklyn Bridge',
      'Water main work on 42nd Street causing delays',
      'Con Edison utility work on Madison Avenue',
      'DOT street resurfacing on 8th Avenue'
    ];
    
    return Math.random() > 0.7 ? [alerts[Math.floor(Math.random() * alerts.length)]] : [];
  }

  private generateEventAlerts(): string[] {
    const alerts = [
      'Yankees game ending at 4:30 PM - expect heavy traffic near stadium',
      'Street fair on Broadway between 14th-23rd Street',
      'Film production causing street closures in SoHo',
      'Marathon route affecting East Side traffic until 2 PM'
    ];
    
    return Math.random() > 0.8 ? [alerts[Math.floor(Math.random() * alerts.length)]] : [];
  }
}