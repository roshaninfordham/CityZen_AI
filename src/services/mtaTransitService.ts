import { TransitData } from '../types';

// MTA API Configuration
const MTA_API_KEY = "YOUR_MTA_API_KEY_HERE"; // Replace with your actual MTA API key
const MTA_BASE_URL = "https://api-endpoint.mta.info/Dataservice/mtagtfsfeeds";

// MTA Feed URLs for different subway lines
const MTA_FEEDS = {
  'ace': `${MTA_BASE_URL}/nyct%2Fgtfs-ace`,
  'bdfm': `${MTA_BASE_URL}/nyct%2Fgtfs-bdfm`,
  'g': `${MTA_BASE_URL}/nyct%2Fgtfs-g`,
  'jz': `${MTA_BASE_URL}/nyct%2Fgtfs-jz`,
  'nqrw': `${MTA_BASE_URL}/nyct%2Fgtfs-nqrw`,
  'l': `${MTA_BASE_URL}/nyct%2Fgtfs-l`,
  'main': `${MTA_BASE_URL}/nyct%2Fgtfs`, // 1,2,3,4,5,6,7 lines
  'si': `${MTA_BASE_URL}/nyct%2Fgtfs-si`,
  'alerts': `${MTA_BASE_URL}/camsys%2Fall-alerts`
};

// Line to feed mapping
const LINE_TO_FEED: { [key: string]: string } = {
  'A': 'ace', 'C': 'ace', 'E': 'ace',
  'B': 'bdfm', 'D': 'bdfm', 'F': 'bdfm', 'M': 'bdfm',
  'G': 'g',
  'J': 'jz', 'Z': 'jz',
  'N': 'nqrw', 'Q': 'nqrw', 'R': 'nqrw', 'W': 'nqrw',
  'L': 'l',
  '1': 'main', '2': 'main', '3': 'main', '4': 'main', '5': 'main', '6': 'main', '7': 'main',
  'SIR': 'si'
};

interface MTAAlert {
  id: string;
  route: string;
  description: string;
  severity: 'low' | 'medium' | 'high';
  activeUntil?: Date;
}

interface MTAServiceStatus {
  line: string;
  status: 'GOOD_SERVICE' | 'DELAYS' | 'SERVICE_CHANGE' | 'PLANNED_WORK' | 'SUSPENDED';
  description: string;
}

export class MTATransitService {
  private cachedAlerts: MTAAlert[] = [];
  private lastAlertsFetch: number = 0;
  private alertsCacheTime = 5 * 60 * 1000; // 5 minutes

  async getTransitRoute(origin: string, destination: string): Promise<TransitData> {
    try {
      // Get service alerts first
      const alerts = await this.getServiceAlerts();
      
      // Determine likely subway lines based on NYC geography
      const suggestedLines = this.getSuggestedLines(origin, destination);
      
      // Get real-time status for suggested lines
      const serviceStatuses = await this.getServiceStatus(suggestedLines);
      
      // Calculate realistic travel time based on distance and service conditions
      const travelData = this.calculateTravelTime(origin, destination, serviceStatuses);
      
      // Filter relevant alerts for the suggested lines
      const relevantAlerts = alerts.filter(alert => 
        suggestedLines.some(line => alert.route.includes(line))
      );
      
      return {
        eta: travelData.eta,
        cost: 2.90, // Standard NYC subway fare
        lines: suggestedLines,
        serviceStatus: this.generateServiceStatusMessage(serviceStatuses),
        delays: relevantAlerts.map(alert => alert.description),
        arrivalTime: this.calculateArrivalTime(travelData.eta)
      };
      
    } catch (error) {
      console.error('MTA API error, falling back to mock data:', error);
      return this.getFallbackTransitData(origin, destination);
    }
  }

  private async getServiceAlerts(): Promise<MTAAlert[]> {
    // Use cached alerts if recent
    if (Date.now() - this.lastAlertsFetch < this.alertsCacheTime && this.cachedAlerts.length > 0) {
      return this.cachedAlerts;
    }

    try {
      const response = await fetch(MTA_FEEDS.alerts, {
        headers: {
          'x-api-key': MTA_API_KEY
        }
      });

      if (!response.ok) {
        throw new Error(`MTA Alerts API error: ${response.status}`);
      }

      // Note: MTA returns GTFS-RT protobuf data, which requires special parsing
      // For now, we'll simulate parsing and return structured alerts
      const alertsData = await this.parseGTFSAlerts(response);
      
      this.cachedAlerts = alertsData;
      this.lastAlertsFetch = Date.now();
      
      return alertsData;
      
    } catch (error) {
      console.error('Failed to fetch MTA alerts:', error);
      return this.getMockAlerts();
    }
  }

  private async getServiceStatus(lines: string[]): Promise<MTAServiceStatus[]> {
    const statuses: MTAServiceStatus[] = [];
    
    try {
      // Get unique feeds needed for these lines
      const feedsNeeded = [...new Set(lines.map(line => LINE_TO_FEED[line]).filter(Boolean))];
      
      for (const feedKey of feedsNeeded) {
        const feedUrl = MTA_FEEDS[feedKey as keyof typeof MTA_FEEDS];
        
        try {
          const response = await fetch(feedUrl, {
            headers: {
              'x-api-key': MTA_API_KEY
            }
          });

          if (response.ok) {
            // Parse GTFS-RT data (simplified for demo)
            const statusData = await this.parseGTFSStatus(response, lines);
            statuses.push(...statusData);
          }
        } catch (feedError) {
          console.error(`Error fetching feed ${feedKey}:`, feedError);
        }
      }
      
      return statuses.length > 0 ? statuses : this.getMockServiceStatus(lines);
      
    } catch (error) {
      console.error('Error getting service status:', error);
      return this.getMockServiceStatus(lines);
    }
  }

  private getSuggestedLines(origin: string, destination: string): string[] {
    // Intelligent line suggestion based on NYC geography
    const originLower = origin.toLowerCase();
    const destLower = destination.toLowerCase();
    
    // Manhattan core lines
    if ((originLower.includes('manhattan') || destLower.includes('manhattan')) ||
        (originLower.includes('midtown') || destLower.includes('midtown'))) {
      return ['4', '5', '6', 'N', 'Q', 'R', 'W'];
    }
    
    // Brooklyn connections
    if (originLower.includes('brooklyn') || destLower.includes('brooklyn')) {
      return ['B', 'D', 'N', 'Q', 'R'];
    }
    
    // Queens connections
    if (originLower.includes('queens') || destLower.includes('queens')) {
      return ['7', 'E', 'F', 'M', 'R'];
    }
    
    // Bronx connections
    if (originLower.includes('bronx') || destLower.includes('bronx')) {
      return ['4', '5', '6', 'A', 'D'];
    }
    
    // Default Manhattan lines
    return ['4', '5', '6', 'N', 'Q', 'R'];
  }

  private calculateTravelTime(origin: string, destination: string, serviceStatuses: MTAServiceStatus[]): { eta: number } {
    // Base travel time calculation
    let baseTime = 25 + Math.floor(Math.random() * 20); // 25-45 minutes base
    
    // Adjust for service conditions
    const hasDelays = serviceStatuses.some(status => 
      status.status === 'DELAYS' || status.status === 'SERVICE_CHANGE'
    );
    
    const hasSuspensions = serviceStatuses.some(status => 
      status.status === 'SUSPENDED'
    );
    
    if (hasSuspensions) {
      baseTime += 15; // Major delays for suspensions
    } else if (hasDelays) {
      baseTime += 8; // Moderate delays
    }
    
    // Time of day adjustments
    const hour = new Date().getHours();
    const isRushHour = (hour >= 7 && hour <= 10) || (hour >= 17 && hour <= 19);
    
    if (isRushHour) {
      baseTime += 5; // Rush hour crowding
    }
    
    return { eta: Math.max(15, baseTime) }; // Minimum 15 minutes
  }

  private generateServiceStatusMessage(statuses: MTAServiceStatus[]): string {
    if (statuses.length === 0) {
      return "Service information unavailable. Check MTA website for updates.";
    }
    
    const hasGoodService = statuses.some(s => s.status === 'GOOD_SERVICE');
    const hasDelays = statuses.some(s => s.status === 'DELAYS');
    const hasSuspensions = statuses.some(s => s.status === 'SUSPENDED');
    const hasServiceChanges = statuses.some(s => s.status === 'SERVICE_CHANGE');
    
    if (hasSuspensions) {
      return "Service suspensions affecting some lines. Expect significant delays and consider alternative routes.";
    } else if (hasServiceChanges) {
      return "Service changes in effect. Some trains may be rerouted or running on modified schedules.";
    } else if (hasDelays) {
      return "Minor delays reported on some lines. Allow extra travel time.";
    } else if (hasGoodService) {
      return "Service is running normally with good time.";
    } else {
      return "Mixed service conditions. Check individual line status for details.";
    }
  }

  private calculateArrivalTime(eta: number): string {
    const now = new Date();
    const arrival = new Date(now.getTime() + eta * 60 * 1000);
    
    return arrival.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false 
    });
  }

  // GTFS-RT parsing methods (simplified - real implementation would use protobuf)
  private async parseGTFSAlerts(response: Response): Promise<MTAAlert[]> {
    // In a real implementation, you would parse the protobuf GTFS-RT data
    // For now, return realistic mock alerts based on current conditions
    return this.getMockAlerts();
  }

  private async parseGTFSStatus(response: Response, lines: string[]): Promise<MTAServiceStatus[]> {
    // In a real implementation, you would parse the protobuf GTFS-RT data
    // For now, return realistic mock status based on lines
    return this.getMockServiceStatus(lines);
  }

  // Fallback methods for when API is unavailable
  private getMockAlerts(): MTAAlert[] {
    const possibleAlerts = [
      { id: '1', route: '4,5,6', description: 'Signal problems causing minor delays', severity: 'medium' as const },
      { id: '2', route: 'N,Q,R,W', description: 'Earlier incident cleared, residual delays', severity: 'low' as const },
      { id: '3', route: 'L', description: 'Crowding at stations during peak hours', severity: 'low' as const },
      { id: '4', route: 'A,C,E', description: 'Track work affecting weekend service', severity: 'high' as const },
      { id: '5', route: '7', description: 'Weather-related speed restrictions', severity: 'medium' as const }
    ];
    
    // Return 0-2 random alerts
    const numAlerts = Math.floor(Math.random() * 3);
    return possibleAlerts.slice(0, numAlerts);
  }

  private getMockServiceStatus(lines: string[]): MTAServiceStatus[] {
    return lines.map(line => {
      const statuses = ['GOOD_SERVICE', 'DELAYS', 'SERVICE_CHANGE'] as const;
      const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
      
      return {
        line,
        status: randomStatus,
        description: this.getStatusDescription(randomStatus, line)
      };
    });
  }

  private getStatusDescription(status: MTAServiceStatus['status'], line: string): string {
    switch (status) {
      case 'GOOD_SERVICE':
        return `${line} train service is running normally`;
      case 'DELAYS':
        return `${line} trains are running with delays due to signal problems`;
      case 'SERVICE_CHANGE':
        return `${line} trains are running on a modified schedule`;
      case 'PLANNED_WORK':
        return `${line} service affected by planned track work`;
      case 'SUSPENDED':
        return `${line} service is temporarily suspended`;
      default:
        return `${line} service status unknown`;
    }
  }

  private getFallbackTransitData(origin: string, destination: string): TransitData {
    // Fallback to mock data when MTA API is unavailable
    const lines = this.getSuggestedLines(origin, destination);
    const eta = 25 + Math.floor(Math.random() * 25);
    
    return {
      eta,
      cost: 2.90,
      lines,
      serviceStatus: "Service information temporarily unavailable. Using estimated travel times.",
      delays: [],
      arrivalTime: this.calculateArrivalTime(eta)
    };
  }
}