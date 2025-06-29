import React from 'react';
import { RecommendationSummary } from './RecommendationSummary';
import { DrivingCard } from './DrivingCard';
import { TransitCard } from './TransitCard';
import { AnalysisResult, TripPreferences } from '../types';

interface ResultsSectionProps {
  results: AnalysisResult;
  destination: string;
  preferences: TripPreferences;
}

export const ResultsSection: React.FC<ResultsSectionProps> = ({ 
  results, 
  destination, 
  preferences 
}) => {
  return (
    <div className="animate-fade-in">
      <RecommendationSummary 
        recommendation={results.recommendation} 
        language={preferences.language}
      />
      
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-8">
          <DrivingCard 
            data={results.driving} 
            destination={destination}
            language={preferences.language}
          />
          <TransitCard 
            data={results.transit}
            language={preferences.language}
          />
        </div>
      </div>
    </div>
  );
};