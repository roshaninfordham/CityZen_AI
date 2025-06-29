interface TransitRoute {
  eta: number;
  cost: number;
  lines: string[];
  serviceStatus: string;
  delays: string[];
}

export class MockTransitService {
  async getTransitRoute(origin: string, destination: string): Promise<TransitRoute> {
    // Simulate MTA API delay
    await new Promise(resolve => setTimeout(resolve, 1800));

    const now = new Date();
    const hour = now.getHours();
    const isWeekend = now.getDay() === 0 || now.getDay() === 6;
    const isRushHour = (hour >= 7 && hour <= 10) || (hour >= 17 && hour <= 19);

    // Generate realistic subway lines based on common NYC routes
    const lineGroups = [
      ['4', '5', '6'], // Lexington Ave
      ['N', 'Q', 'R', 'W'], // Broadway
      ['A', 'C', 'E'], // 8th Ave
      ['B', 'D', 'F', 'M'], // 6th Ave
      ['L'], // 14th St Crosstown
      ['1', '2', '3'], // Broadway-7th Ave
      ['G'], // Brooklyn-Queens Crosstown
      ['J', 'Z'], // Nassau St
      ['7'], // Flushing
    ];

    const selectedLines = lineGroups[Math.floor(Math.random() * lineGroups.length)];
    
    // Calculate base travel time
    let baseEta = 25 + Math.floor(Math.random() * 25); // 25-50 minutes base

    // Generate realistic service conditions
    const scenarios = [
      {
        delays: [],
        serviceStatus: 'Service is running normally with good time.',
        delayMinutes: 0
      },
      {
        delays: ['Signal problems'],
        serviceStatus: 'Minor delays due to signal problems. Trains are running 5-10 minutes behind schedule.',
        delayMinutes: 7
      },
      {
        delays: ['Crowding'],
        serviceStatus: 'Heavy ridership causing slower boarding. Allow extra travel time.',
        delayMinutes: 5
      },
      {
        delays: ['Track work'],
        serviceStatus: 'Weekend track work affecting service. Some trains are running on modified schedules.',
        delayMinutes: 12
      },
      {
        delays: ['Earlier incident'],
        serviceStatus: 'Residual delays from an earlier incident. Service is gradually returning to normal.',
        delayMinutes: 8
      },
      {
        delays: ['Weather conditions'],
        serviceStatus: 'Service adjustments due to weather conditions. Trains may experience minor delays.',
        delayMinutes: 6
      }
    ];

    // Choose scenario based on time and randomness
    let selectedScenario;
    if (isWeekend) {
      // More likely to have track work on weekends
      selectedScenario = Math.random() < 0.4 ? scenarios[3] : scenarios[Math.floor(Math.random() * scenarios.length)];
    } else if (isRushHour) {
      // More likely to have crowding during rush hour
      selectedScenario = Math.random() < 0.3 ? scenarios[2] : scenarios[Math.floor(Math.random() * scenarios.length)];
    } else {
      // Random scenario for off-peak
      selectedScenario = scenarios[Math.floor(Math.random() * scenarios.length)];
    }

    const finalEta = baseEta + selectedScenario.delayMinutes;

    return {
      eta: finalEta,
      cost: 2.90, // Standard NYC subway fare
      lines: selectedLines,
      serviceStatus: selectedScenario.serviceStatus,
      delays: selectedScenario.delays
    };
  }
}