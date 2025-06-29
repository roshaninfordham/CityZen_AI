import React, { useState } from 'react';
import { ThemeProvider } from './contexts/ThemeContext';
import { ThemeToggle } from './components/ThemeToggle';
import { Header } from './components/Header';
import { InputSection } from './components/InputSection';
import { ResultsSection } from './components/ResultsSection';
import { PremiumFeatures } from './components/PremiumFeatures';
import { Location, AnalysisResult, TripPreferences } from './types';
import { MockRealTimeAnalysisService } from './utils/mockRealTimeAnalysis';

function AppContent() {
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [destination, setDestination] = useState<string>('');
  const [preferences, setPreferences] = useState<TripPreferences>({
    language: 'en',
    notifications: true,
    isPremium: true // Always premium for demo
  });

  const analysisService = new MockRealTimeAnalysisService();

  const handleAnalyze = async (
    origin: Location, 
    destination: Location, 
    tripPreferences: TripPreferences
  ) => {
    setIsLoading(true);
    setResults(null);
    setError(null);
    setDestination(destination.address);
    setPreferences({ ...tripPreferences, isPremium: true }); // Force premium
    
    try {
      const analysisResult = await analysisService.analyzeTrip(origin, destination, { ...tripPreferences, isPremium: true });
      setResults(analysisResult);
    } catch (error) {
      console.error('Analysis failed:', error);
      setError('Failed to analyze your trip. Please check your addresses and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/40 to-indigo-50/40 dark:from-gray-900 dark:via-blue-900/20 dark:to-purple-900/20 transition-colors duration-300">
      {/* Enhanced background pattern */}
      <div className="absolute inset-0 opacity-20 dark:opacity-30">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%236366f1' fill-opacity='0.05'%3E%3Ccircle cx='30' cy='30' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}></div>
      </div>
      
      <ThemeToggle />
      
      <div className="relative z-10">
        <Header isPremium={true} />
        <InputSection 
          onAnalyze={handleAnalyze} 
          isLoading={isLoading} 
          isPremium={true}
        />
        
        {error && (
          <div className="max-w-4xl mx-auto px-4 mb-8">
            <div className="bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-400/30 rounded-2xl p-6 backdrop-blur-sm">
              <p className="text-red-700 dark:text-red-200 text-center font-medium">{error}</p>
            </div>
          </div>
        )}
        
        {results && (
          <ResultsSection 
            results={results} 
            destination={destination}
            preferences={{ ...preferences, isPremium: true }}
          />
        )}
        
        {/* Premium Features Section - Always show for demo */}
        {!results && <PremiumFeatures />}
        
        {/* Enhanced Demo Banner */}
        <div className="max-w-4xl mx-auto px-4 mt-8 mb-8">
          <div className="bg-gradient-to-r from-emerald-50 to-blue-50 dark:from-green-500/10 dark:to-blue-500/10 border border-emerald-200 dark:border-green-400/30 rounded-2xl p-6 backdrop-blur-sm text-center shadow-lg">
            <div className="flex items-center justify-center gap-2 mb-3">
              <span className="text-2xl">🚀</span>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Full Premium Demo Active</h3>
              <span className="text-2xl">💎</span>
            </div>
            <p className="text-gray-700 dark:text-gray-300 mb-4 text-lg">
              Experience the complete CityZen AI platform - Save $200+ monthly on tickets!
            </p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm text-gray-600 dark:text-gray-400 mb-4">
              <div className="flex items-center justify-center gap-1 bg-white/50 dark:bg-gray-800/30 rounded-lg p-2">
                <span className="text-green-500">✅</span>
                <span className="font-medium">AI Parking Scanner</span>
              </div>
              <div className="flex items-center justify-center gap-1 bg-white/50 dark:bg-gray-800/30 rounded-lg p-2">
                <span className="text-green-500">✅</span>
                <span className="font-medium">Live Parking Map</span>
              </div>
              <div className="flex items-center justify-center gap-1 bg-white/50 dark:bg-gray-800/30 rounded-lg p-2">
                <span className="text-green-500">✅</span>
                <span className="font-medium">Smart Reminders</span>
              </div>
              <div className="flex items-center justify-center gap-1 bg-white/50 dark:bg-gray-800/30 rounded-lg p-2">
                <span className="text-green-500">✅</span>
                <span className="font-medium">Safety Reporting</span>
              </div>
              <div className="flex items-center justify-center gap-1 bg-white/50 dark:bg-gray-800/30 rounded-lg p-2">
                <span className="text-green-500">✅</span>
                <span className="font-medium">Multi-language</span>
              </div>
              <div className="flex items-center justify-center gap-1 bg-white/50 dark:bg-gray-800/30 rounded-lg p-2">
                <span className="text-green-500">✅</span>
                <span className="font-medium">Ticket Protection</span>
              </div>
            </div>
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-2 rounded-full inline-block font-semibold">
              💰 Save Time • Save Money • Stay Safe
            </div>
          </div>
        </div>
        
        {/* Footer */}
        <footer className="text-center py-8 mt-16">
          <p className="text-gray-700 dark:text-gray-400 font-medium">
            CityZen AI • Powered by real-time NYC data • Built for New Yorkers
          </p>
          <p className="text-gray-600 dark:text-gray-500 text-sm mt-2">
            The ultimate mobility advisor that saves you time, money, and stress
          </p>
        </footer>
      </div>
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}

export default App;