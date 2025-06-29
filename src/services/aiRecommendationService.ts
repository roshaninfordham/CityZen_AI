import { DrivingData, TransitData, AIRecommendation } from '../types';
import { GeminiService } from './geminiService';

export class AIRecommendationService {
  private geminiService = new GeminiService();

  async generateRecommendation(
    driving: DrivingData,
    transit: TransitData,
    origin: string,
    destination: string
  ): Promise<AIRecommendation> {
    try {
      // Use Gemini AI for intelligent recommendations
      const recommendation = await this.geminiService.generateTravelRecommendation(
        driving,
        transit,
        origin,
        destination,
        {}
      );

      return recommendation;
    } catch (error) {
      console.error('AI recommendation failed, using fallback logic:', error);
      // Fallback to rule-based logic if Gemini fails
      return this.generateFallbackRecommendation(driving, transit, origin, destination);
    }
  }

  private generateFallbackRecommendation(
    driving: DrivingData,
    transit: TransitData,
    origin: string,
    destination: string
  ): AIRecommendation {
    const drivingTotal = driving.totalTime;
    const transitTotal = transit.eta;
    const timeDifference = Math.abs(drivingTotal - transitTotal);
    
    // Determine winner based on total time and other factors
    let winner: 'driving' | 'transit';
    let confidence: 'high' | 'medium' | 'low';
    let reasoning: string;
    let summary: string;

    // Factor in delays and parking difficulty
    const hasTransitDelays = transit.delays.length > 0;
    const hasParkingIssues = driving.parkingScore <= 4;
    const hasHeavyTraffic = driving.trafficStatus === 'heavy';

    if (timeDifference <= 5) {
      // Close call - use other factors
      confidence = 'low';
      
      if (hasTransitDelays && !hasParkingIssues) {
        winner = 'driving';
        reasoning = `It's a close call time-wise, but current transit delays tip the scales toward driving. With a parking score of ${driving.parkingScore}/10, you should be able to find a spot without too much trouble.`;
        summary = `🚗 Drive today! Transit delays make driving the slightly better choice despite similar travel times.`;
      } else if (hasParkingIssues && !hasTransitDelays) {
        winner = 'transit';
        reasoning = `Both options take about the same time, but parking will be challenging with a score of ${driving.parkingScore}/10. Transit is running smoothly and will save you the parking hassle.`;
        summary = `🚇 Take transit! Similar travel times, but parking is tough and transit is running well.`;
      } else if (hasHeavyTraffic) {
        winner = 'transit';
        reasoning = `Travel times are close, but heavy traffic makes driving unpredictable. Transit provides more reliable timing even if it's not faster.`;
        summary = `🚇 Transit wins! Heavy traffic makes driving unreliable despite similar ETAs.`;
      } else {
        winner = 'transit';
        reasoning = `It's essentially a tie on time, but transit saves money on gas and parking fees while being more environmentally friendly.`;
        summary = `🚇 Slight edge to transit. Times are similar, but you'll save money and avoid parking stress.`;
      }
    } else if (drivingTotal < transitTotal) {
      // Driving is faster
      const advantage = transitTotal - drivingTotal;
      
      if (advantage >= 15) {
        confidence = 'high';
        winner = 'driving';
        reasoning = `Driving saves you ${advantage} minutes today. Even accounting for parking (${driving.timeToFindParking} min estimated), you'll arrive significantly faster.`;
        summary = `🚗 Drive! You'll save ${advantage} minutes even with parking time included.`;
      } else if (advantage >= 8) {
        confidence = 'medium';
        winner = 'driving';
        reasoning = `Driving gives you a ${advantage}-minute advantage. With current traffic conditions and parking availability, it's the faster choice today.`;
        summary = `🚗 Drive today! ${advantage}-minute advantage makes it worth the trip.`;
      } else {
        confidence = 'low';
        if (hasParkingIssues) {
          winner = 'transit';
          reasoning = `While driving might be ${advantage} minutes faster, the parking difficulty (score: ${driving.parkingScore}/10) could easily eat up that advantage and add stress.`;
          summary = `🚇 Transit recommended. Parking challenges offset driving's small time advantage.`;
        } else {
          winner = 'driving';
          reasoning = `Driving has a modest ${advantage}-minute advantage, and parking looks manageable with a score of ${driving.parkingScore}/10.`;
          summary = `🚗 Drive! Small time advantage and decent parking make it worthwhile.`;
        }
      }
    } else {
      // Transit is faster
      const advantage = drivingTotal - transitTotal;
      
      if (advantage >= 15) {
        confidence = 'high';
        winner = 'transit';
        reasoning = `Transit is ${advantage} minutes faster today. Current traffic conditions and parking challenges make the subway your clear winner.`;
        summary = `🚇 Take the subway! ${advantage}-minute advantage plus no parking hassles.`;
      } else if (advantage >= 8) {
        confidence = 'medium';
        winner = 'transit';
        reasoning = `Transit saves you ${advantage} minutes and eliminates parking stress. With current service conditions, it's the smarter choice.`;
        summary = `🚇 Transit wins! ${advantage} minutes faster and no parking worries.`;
      } else {
        confidence = 'medium';
        winner = 'transit';
        reasoning = `Transit has a ${advantage}-minute edge and saves you from dealing with traffic and parking. The subway is your reliable choice today.`;
        summary = `🚇 Transit recommended. Faster travel time plus avoiding traffic and parking stress.`;
      }
    }

    return {
      winner,
      confidence,
      reasoning,
      summary
    };
  }
}