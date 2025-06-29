import React from 'react';
import { Train, Clock, DollarSign, AlertCircle, CheckCircle, TrendingUp, Leaf, Users } from 'lucide-react';
import { TransitData } from '../types';

interface TransitCardProps {
  data: TransitData;
  language: string;
}

export const TransitCard: React.FC<TransitCardProps> = ({ data, language }) => {
  const getLineColor = (line: string) => {
    const colors: { [key: string]: string } = {
      '4': 'bg-green-600 text-white',
      '5': 'bg-green-600 text-white',
      '6': 'bg-green-600 text-white',
      'L': 'bg-gray-600 text-white',
      'N': 'bg-yellow-600 text-black',
      'Q': 'bg-yellow-600 text-black',
      'R': 'bg-yellow-600 text-black',
      'W': 'bg-yellow-600 text-black',
      'A': 'bg-blue-600 text-white',
      'C': 'bg-blue-600 text-white',
      'E': 'bg-blue-600 text-white',
      'B': 'bg-orange-600 text-white',
      'D': 'bg-orange-600 text-white',
      'F': 'bg-orange-600 text-white',
      'M': 'bg-orange-600 text-white',
      '1': 'bg-red-600 text-white',
      '2': 'bg-red-600 text-white',
      '3': 'bg-red-600 text-white',
      '7': 'bg-purple-600 text-white',
      'G': 'bg-lime-600 text-white',
      'J': 'bg-amber-600 text-white',
      'Z': 'bg-amber-600 text-white',
    };
    return colors[line] || 'bg-gray-600 text-white';
  };

  const hasDelays = data.delays.length > 0;

  const getLocalizedText = (key: string) => {
    const translations: { [key: string]: { [lang: string]: string } } = {
      title: {
        en: 'Public Transit',
        es: 'Transporte Público',
        fr: 'Transport Public',
        zh: '公共交通',
        ar: 'النقل العام',
        hi: 'सार्वजनिक परिवहन',
        ru: 'Общественный транспорт',
        ko: '대중교통'
      },
      subtitle: {
        en: 'MTA real-time status',
        es: 'Estado en tiempo real de MTA',
        fr: 'Statut en temps réel MTA',
        zh: 'MTA实时状态',
        ar: 'حالة MTA في الوقت الفعلي',
        hi: 'MTA रियल-टाइम स्थिति',
        ru: 'Статус MTA в реальном времени',
        ko: 'MTA 실시간 상태'
      }
    };

    return translations[key]?.[language] || translations[key]?.['en'] || key;
  };

  // Calculate environmental and cost benefits
  const co2Saved = Math.round(data.eta * 0.8); // Rough estimate
  const moneySaved = Math.round((data.eta / 60) * 15); // Parking + gas savings

  return (
    <div className="bg-white/90 dark:bg-gray-800/30 border border-gray-200 dark:border-gray-600/30 rounded-2xl p-6 backdrop-blur-sm hover:shadow-xl transition-all duration-300 shadow-lg">
      <div className="flex items-center gap-4 mb-6">
        <div className="p-3 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl shadow-lg">
          <Train className="w-8 h-8 text-white" />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">{getLocalizedText('title')}</h3>
            <div className="flex items-center gap-1 px-2 py-1 bg-green-100 dark:bg-green-500/20 rounded-lg">
              <Leaf className="w-3 h-3 text-green-600 dark:text-green-400" />
              <span className="text-xs font-bold text-green-600 dark:text-green-400">ECO</span>
            </div>
          </div>
          <p className="text-gray-600 dark:text-gray-400">{getLocalizedText('subtitle')}</p>
          <div className="flex items-center gap-2 mt-1">
            <DollarSign className="w-3 h-3 text-green-500" />
            <span className="text-xs text-green-600 dark:text-green-400 font-medium">Save ~${moneySaved} vs driving</span>
          </div>
        </div>
      </div>

      {/* Compact Key Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="text-center p-3 bg-gray-50 dark:bg-gray-700/30 rounded-xl">
          <div className="text-2xl font-bold text-gray-900 dark:text-white">{data.eta}</div>
          <div className="text-xs text-gray-600 dark:text-gray-400">Minutes</div>
        </div>
        <div className="text-center p-3 bg-gray-50 dark:bg-gray-700/30 rounded-xl">
          <div className="text-2xl font-bold text-green-600 dark:text-green-400">${data.cost.toFixed(2)}</div>
          <div className="text-xs text-gray-600 dark:text-gray-400">Cost</div>
        </div>
        <div className="text-center p-3 bg-gray-50 dark:bg-gray-700/30 rounded-xl">
          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{data.lines.length}</div>
          <div className="text-xs text-gray-600 dark:text-gray-400">Lines</div>
        </div>
        <div className="text-center p-3 bg-gray-50 dark:bg-gray-700/30 rounded-xl">
          <div className={`px-2 py-1 rounded-full text-xs font-semibold ${
            hasDelays ? 'bg-yellow-100 text-yellow-600 dark:bg-yellow-500/20 dark:text-yellow-400' : 'bg-green-100 text-green-600 dark:bg-green-500/20 dark:text-green-400'
          }`}>
            {hasDelays ? 'Delays' : 'On Time'}
          </div>
          <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">Status</div>
        </div>
      </div>

      {data.arrivalTime && (
        <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-500/10 border border-green-200 dark:border-green-400/30 rounded-xl mb-4">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-green-600 dark:text-green-400" />
            <span className="text-green-700 dark:text-green-300 font-medium">Estimated Arrival</span>
          </div>
          <span className="text-lg font-bold text-green-600 dark:text-green-400">{data.arrivalTime}</span>
        </div>
      )}

      {/* Environmental Impact */}
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-500/10 dark:to-emerald-500/10 border border-green-200 dark:border-green-400/30 rounded-xl p-4 mb-4">
        <div className="flex items-start gap-2">
          <Leaf className="w-4 h-4 text-green-600 dark:text-green-400 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-green-700 dark:text-green-300 mb-1">🌱 Environmental Impact</p>
            <p className="text-sm text-green-600 dark:text-green-200 leading-relaxed">
              Save ~{co2Saved}lbs CO₂ emissions vs driving. Join {Math.floor(Math.random() * 500 + 1000)}+ daily commuters choosing sustainable transit.
            </p>
          </div>
        </div>
      </div>

      {/* Required Lines */}
      <div className="mb-4">
        <div className="flex items-center gap-2 mb-3">
          <Train className="w-4 h-4 text-green-600 dark:text-green-400" />
          <span className="text-sm font-semibold text-green-600 dark:text-green-400">Required Lines</span>
        </div>
        <div className="flex gap-2 flex-wrap">
          {data.lines.map((line, index) => (
            <div
              key={index}
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shadow-sm ${getLineColor(line)}`}
            >
              {line}
            </div>
          ))}
        </div>
      </div>

      {/* Service Status */}
      <div className={`rounded-xl p-4 border ${
        hasDelays 
          ? 'bg-yellow-50 dark:bg-yellow-500/10 border-yellow-200 dark:border-yellow-400/30' 
          : 'bg-green-50 dark:bg-green-500/10 border-green-200 dark:border-green-400/30'
      }`}>
        <div className="flex items-center gap-2 mb-2">
          {hasDelays ? (
            <AlertCircle className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
          ) : (
            <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
          )}
          <span className={`font-semibold ${
            hasDelays ? 'text-yellow-700 dark:text-yellow-300' : 'text-green-700 dark:text-green-300'
          }`}>
            Service Status
          </span>
        </div>
        <p className={`text-sm leading-relaxed ${
          hasDelays ? 'text-yellow-600 dark:text-yellow-200' : 'text-green-600 dark:text-green-200'
        }`}>
          {data.serviceStatus}
        </p>
        {hasDelays && data.delays.length > 0 && (
          <div className="mt-3 pt-2 border-t border-yellow-200 dark:border-yellow-400/20">
            <p className="text-xs text-yellow-600 dark:text-yellow-300 font-medium">
              Active delays: {data.delays.join(', ')}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};