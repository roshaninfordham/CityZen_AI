import React, { useState } from 'react';
import { Crown, Shield, Camera, MapPin, Bell, Route, Zap, CheckCircle, Star, TrendingUp } from 'lucide-react';

export const PremiumFeatures: React.FC = () => {
  const [selectedFeature, setSelectedFeature] = useState<string | null>(null);

  const features = [
    {
      id: 'scanner',
      icon: Camera,
      title: 'AI Parking Scanner',
      subtitle: 'Instant OCR analysis of any NYC parking sign',
      benefits: [
        '95%+ accuracy with Gemini AI',
        'Multi-language support',
        'Weather-aware adjustments'
      ],
      color: 'from-purple-500 to-pink-500',
      savings: '$150/month'
    },
    {
      id: 'map',
      icon: MapPin,
      title: 'Live Parking Map',
      subtitle: 'Real-time availability with predictive intelligence',
      benefits: [
        'Street-level accuracy',
        'Community-verified spots',
        'Walking time optimization'
      ],
      color: 'from-green-500 to-emerald-500',
      savings: '$80/month'
    },
    {
      id: 'reminders',
      icon: Bell,
      title: 'Smart Reminders',
      subtitle: 'Never get a parking ticket again',
      benefits: [
        'SMS & push notifications',
        '15-min early warnings',
        'Weather-based timing'
      ],
      color: 'from-blue-500 to-cyan-500',
      savings: '$200/month'
    },
    {
      id: 'routing',
      icon: Route,
      title: 'Priority Routing',
      subtitle: 'Advanced NYC-optimized algorithms',
      benefits: [
        'Construction alerts',
        'Event-based rerouting',
        'Time-based optimization'
      ],
      color: 'from-orange-500 to-red-500',
      savings: '$60/month'
    },
    {
      id: 'insurance',
      icon: Shield,
      title: 'Ticket Protection',
      subtitle: 'Up to $500/month coverage',
      benefits: [
        'Automatic claim filing',
        'Legal dispute support',
        'Premium exclusive'
      ],
      color: 'from-yellow-500 to-amber-500',
      savings: '$500/month'
    }
  ];

  const totalSavings = features.reduce((sum, feature) => 
    sum + parseInt(feature.savings.replace('$', '').replace('/month', '')), 0
  );

  return (
    <div className="max-w-6xl mx-auto px-4 mt-16 mb-8">
      <div className="bg-white/90 dark:bg-gray-800/30 backdrop-blur-sm border border-gray-200 dark:border-gray-600/30 rounded-3xl p-8 shadow-2xl">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-2 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-xl shadow-lg">
              <Crown className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">CityZen Premium</h2>
            <div className="flex items-center gap-1 px-3 py-1 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full">
              <TrendingUp className="w-4 h-4 text-white" />
              <span className="text-sm font-bold text-white">SAVE ${totalSavings}/mo</span>
            </div>
          </div>
          <p className="text-xl text-gray-700 dark:text-gray-300 mb-3">
            The ultimate NYC mobility intelligence platform
          </p>
          <div className="flex items-center justify-center gap-4 text-sm text-gray-600 dark:text-gray-400">
            <div className="flex items-center gap-1">
              <Zap className="w-4 h-4 text-yellow-500" />
              <span>AI-Powered</span>
            </div>
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 text-yellow-500" />
              <span>4.9/5 Rating</span>
            </div>
            <div className="flex items-center gap-1">
              <Shield className="w-4 h-4 text-green-500" />
              <span>Ticket Protection</span>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {features.map((feature) => {
            const IconComponent = feature.icon;
            const isSelected = selectedFeature === feature.id;
            
            return (
              <div
                key={feature.id}
                className={`p-6 rounded-2xl border cursor-pointer transition-all duration-300 ${
                  isSelected
                    ? 'border-blue-400/50 bg-blue-50 dark:bg-blue-500/10 scale-105 shadow-lg'
                    : 'border-gray-200 dark:border-gray-600/50 bg-white/50 dark:bg-gray-700/20 hover:border-gray-300 dark:hover:border-gray-500/70 hover:shadow-lg'
                }`}
                onClick={() => setSelectedFeature(isSelected ? null : feature.id)}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className={`p-3 rounded-xl bg-gradient-to-r ${feature.color} shadow-lg`}>
                    <IconComponent className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-900 dark:text-white text-sm">
                      {feature.title}
                    </h3>
                    <div className="text-xs text-green-600 dark:text-green-400 font-semibold">
                      Save {feature.savings}
                    </div>
                  </div>
                </div>
                
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
                  {feature.subtitle}
                </p>
                
                <div className="space-y-2">
                  {feature.benefits.map((benefit, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                      <span className="text-xs text-gray-600 dark:text-gray-400">{benefit}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Pricing Section */}
        <div className="text-center bg-gradient-to-r from-gray-50 to-blue-50 dark:from-gray-800/50 dark:to-blue-900/20 rounded-2xl p-6 border border-gray-200 dark:border-gray-600/30">
          <div className="mb-4">
            <div className="flex items-center justify-center gap-2 mb-2">
              <span className="text-4xl font-bold text-gray-900 dark:text-white">$9.99</span>
              <span className="text-gray-600 dark:text-gray-400">/month</span>
              <div className="bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                SAVE ${totalSavings - 10}/mo
              </div>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Pay for itself in the first week • ROI: {Math.round(totalSavings/10)}x
            </p>
          </div>
          
          <button className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-bold text-lg rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl mb-3">
            🚀 Start 7-Day Free Trial
          </button>
          
          <div className="flex items-center justify-center gap-4 text-xs text-gray-500 dark:text-gray-400">
            <span>✓ Cancel anytime</span>
            <span>✓ No commitment</span>
            <span>✓ Full feature access</span>
          </div>
        </div>

        {/* Social Proof */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
            Join 10,000+ NYC drivers who save time and money daily
          </p>
          <div className="flex items-center justify-center gap-1">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
            ))}
            <span className="text-sm text-gray-600 dark:text-gray-400 ml-2">4.9/5 • 2,500+ reviews</span>
          </div>
        </div>
      </div>
    </div>
  );
};