export interface Location {
  address: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
}

export interface DrivingData {
  eta: number;
  distance: string;
  trafficStatus: 'light' | 'moderate' | 'heavy';
  parkingScore: number;
  timeToFindParking: number;
  totalTime: number;
  arrivalTime?: string;
  constructionAlerts?: string[];
  eventAlerts?: string[];
}

export interface TransitData {
  eta: number;
  cost: number;
  lines: string[];
  serviceStatus: string;
  delays: string[];
  arrivalTime?: string;
}

export interface AIRecommendation {
  winner: 'driving' | 'transit';
  confidence: 'high' | 'medium' | 'low';
  reasoning: string;
  summary: string;
}

export interface AnalysisResult {
  driving: DrivingData;
  transit: TransitData;
  recommendation: AIRecommendation;
  departureTime?: string;
  arrivalTime?: string;
}

export interface ParkingSpot {
  id: string;
  lat: number;
  lng: number;
  availability: 'high' | 'medium' | 'low';
  maxDuration: string;
  restrictions: string[];
  walkingDistance: string;
  score: number;
  safetyRating: number;
  userReports: UserReport[];
  predictedAvailability?: {
    nextHour: 'high' | 'medium' | 'low';
    confidence: number;
  };
}

export interface ParkingSignAnalysis {
  canPark: boolean;
  maxDuration: string;
  restrictions: string[];
  removalTime?: string;
  confidence: number;
  warnings: string[];
  weatherAdjustments?: string[];
  signLanguage?: string;
}

export interface TripPreferences {
  arrivalTime?: string;
  language: string;
  notifications: boolean;
  isPremium?: boolean;
}

export interface UserReport {
  id: string;
  type: 'safety' | 'availability' | 'enforcement' | 'accessibility';
  description: string;
  severity: 'low' | 'medium' | 'high';
  timestamp: Date;
  verified: boolean;
}

export interface ThemeContextType {
  isDark: boolean;
  toggleTheme: () => void;
}

export interface SafetyAlert {
  id: string;
  location: string;
  type: 'construction' | 'accident' | 'crime' | 'weather' | 'event';
  severity: 'low' | 'medium' | 'high';
  description: string;
  timestamp: Date;
  active: boolean;
}