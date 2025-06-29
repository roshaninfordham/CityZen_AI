import React from 'react';
import { Trophy, Car, Train, Clock, TrendingUp } from 'lucide-react';
import { AIRecommendation } from '../types';

interface RecommendationSummaryProps {
  recommendation: AIRecommendation;
  language: string;
}

export const RecommendationSummary: React.FC<RecommendationSummaryProps> = ({ 
  recommendation, 
  language 
}) => {
  const isWinnerDriving = recommendation.winner === 'driving';
  
  const getConfidenceColor = (confidence: string) => {
    switch (confidence) {
      case 'high': return 'text-green-400 bg-green-400/10';
      case 'medium': return 'text-yellow-400 bg-yellow-400/10';
      case 'low': return 'text-orange-400 bg-orange-400/10';
      default: return 'text-blue-400 bg-blue-400/10';
    }
  };

  const getLocalizedText = (key: string) => {
    const translations: { [key: string]: { [lang: string]: string } } = {
      title: {
        en: 'AI Recommendation',
        es: 'Recomendación de IA',
        fr: 'Recommandation IA',
        zh: 'AI推荐',
        ar: 'توصية الذكاء الاصطناعي',
        hi: 'AI सिफारिश',
        ru: 'Рекомендация ИИ',
        ko: 'AI 추천'
      },
      driving: {
        en: 'Drive & Park',
        es: 'Conducir y Aparcar',
        fr: 'Conduire et Se Garer',
        zh: '开车停车',
        ar: 'القيادة والوقوف',
        hi: 'ड्राइव और पार्क',
        ru: 'Ехать и парковаться',
        ko: '운전 및 주차'
      },
      transit: {
        en: 'Public Transit',
        es: 'Transporte Público',
        fr: 'Transport Public',
        zh: '公共交通',
        ar: 'النقل العام',
        hi: 'सार्वजनिक परिवहन',
        ru: 'Общественный транспорт',
        ko: '대중교통'
      },
      confidence: {
        en: 'confidence',
        es: 'confianza',
        fr: 'confiance',
        zh: '置信度',
        ar: 'الثقة',
        hi: 'विश्वास',
        ru: 'уверенность',
        ko: '신뢰도'
      }
    };

    return translations[key]?.[language] || translations[key]?.['en'] || key;
  };

  return (
    <div className="max-w-4xl mx-auto px-4 mb-8">
      <div className="bg-gradient-to-r from-green-500/10 to-blue-500/10 border border-green-400/30 rounded-2xl p-6 backdrop-blur-sm">
        <div className="flex items-center gap-3 mb-4">
          <Trophy className="w-8 h-8 text-yellow-400" />
          <h2 className="text-2xl font-bold text-white">{getLocalizedText('title')}</h2>
          <span className={`px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide ${getConfidenceColor(recommendation.confidence)}`}>
            {recommendation.confidence} {getLocalizedText('confidence')}
          </span>
        </div>
        
        <div className="flex items-center gap-4 mb-4">
          <div className="flex items-center gap-2">
            {isWinnerDriving ? (
              <Car className="w-6 h-6 text-blue-400" />
            ) : (
              <Train className="w-6 h-6 text-green-400" />
            )}
            <span className="text-xl font-bold text-white">
              {isWinnerDriving ? getLocalizedText('driving') : getLocalizedText('transit')}
            </span>
          </div>
          <TrendingUp className="w-5 h-5 text-green-400" />
        </div>
        
        <p className="text-lg text-gray-200 leading-relaxed mb-4">
          {recommendation.summary}
        </p>
        
        <div className="bg-gray-800/50 rounded-xl p-4">
          <div className="flex items-start gap-3">
            <Clock className="w-5 h-5 text-gray-400 mt-0.5" />
            <p className="text-gray-300 leading-relaxed">
              {recommendation.reasoning}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};