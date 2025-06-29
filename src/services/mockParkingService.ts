interface ParkingAnalysis {
  parkingScore: number;
  timeToFindParking: number;
  analysis: string;
}

export class MockParkingService {
  async analyzeParkingDifficulty(
    destination: string,
    coordinates: { lat: number; lng: number }
  ): Promise<ParkingAnalysis> {
    // Simulate AI analysis delay
    await new Promise(resolve => setTimeout(resolve, 1200));

    const now = new Date();
    const dayOfWeek = now.toLocaleDateString('en-US', { weekday: 'long' });
    const hour = now.getHours();
    const isWeekend = dayOfWeek === 'Saturday' || dayOfWeek === 'Sunday';
    const isRushHour = (hour >= 7 && hour <= 10) || (hour >= 17 && hour <= 19);
    const isBusinessHours = hour >= 9 && hour <= 17;

    // Determine area type based on destination keywords
    let areaType = 'residential';
    const destLower = destination.toLowerCase();
    
    if (destLower.includes('manhattan') || destLower.includes('midtown') || 
        destLower.includes('downtown') || destLower.includes('times square') ||
        destLower.includes('wall street') || destLower.includes('soho')) {
      areaType = 'manhattan_busy';
    } else if (destLower.includes('brooklyn') || destLower.includes('queens') ||
               destLower.includes('bronx') || destLower.includes('staten island')) {
      areaType = 'outer_borough';
    } else if (destLower.includes('avenue') || destLower.includes('broadway') ||
               destLower.includes('street')) {
      areaType = 'commercial';
    }

    // Calculate base parking score
    let baseScore = 5;
    let searchTime = 8;

    switch (areaType) {
      case 'manhattan_busy':
        baseScore = 2;
        searchTime = 15;
        break;
      case 'commercial':
        baseScore = 4;
        searchTime = 10;
        break;
      case 'outer_borough':
        baseScore = 7;
        searchTime = 5;
        break;
      case 'residential':
        baseScore = 6;
        searchTime = 6;
        break;
    }

    // Apply time-based modifiers
    if (isWeekend) {
      baseScore += 2;
      searchTime -= 3;
    }

    if (isRushHour && !isWeekend) {
      baseScore -= 2;
      searchTime += 5;
    }

    if (isBusinessHours && !isWeekend) {
      baseScore -= 1;
      searchTime += 2;
    }

    // Add some randomness for realism
    baseScore += Math.floor(Math.random() * 3) - 1; // -1 to +1
    searchTime += Math.floor(Math.random() * 5) - 2; // -2 to +2

    // Ensure reasonable bounds
    baseScore = Math.max(1, Math.min(10, baseScore));
    searchTime = Math.max(2, Math.min(25, searchTime));

    // Generate contextual analysis
    let analysis = '';
    if (baseScore >= 8) {
      analysis = 'Excellent parking availability! Street parking should be easy to find with minimal circling required.';
    } else if (baseScore >= 6) {
      analysis = 'Good parking situation. You should find a spot within a reasonable time, though you may need to walk a block or two.';
    } else if (baseScore >= 4) {
      analysis = 'Moderate parking difficulty. Allow extra time and consider paid parking options as backup.';
    } else {
      analysis = 'Challenging parking area. High demand with limited street parking. Paid garages strongly recommended.';
    }

    return {
      parkingScore: baseScore,
      timeToFindParking: searchTime,
      analysis
    };
  }
}