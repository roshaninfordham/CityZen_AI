import React, { useState, useEffect } from 'react';
import { Bell, Clock, MapPin, AlertTriangle, CheckCircle } from 'lucide-react';
import { CalendarIntegration } from './CalendarIntegration';

interface ParkingReminderProps {
  removalTime?: string;
  location: string;
  language: string;
}

export const ParkingReminder: React.FC<ParkingReminderProps> = ({ 
  removalTime, 
  location, 
  language 
}) => {
  const [timeUntilRemoval, setTimeUntilRemoval] = useState<string>('');
  const [reminderSet, setReminderSet] = useState(false);

  useEffect(() => {
    if (!removalTime) return;

    const updateCountdown = () => {
      const now = new Date();
      const removal = new Date();
      const [hours, minutes] = removalTime.split(':');
      removal.setHours(parseInt(hours), parseInt(minutes), 0, 0);
      
      // If removal time is tomorrow
      if (removal < now) {
        removal.setDate(removal.getDate() + 1);
      }

      const diff = removal.getTime() - now.getTime();
      const hoursLeft = Math.floor(diff / (1000 * 60 * 60));
      const minutesLeft = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

      if (diff > 0) {
        setTimeUntilRemoval(`${hoursLeft}h ${minutesLeft}m`);
      } else {
        setTimeUntilRemoval('Time expired!');
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 60000); // Update every minute

    return () => clearInterval(interval);
  }, [removalTime]);

  const getLocalizedText = (key: string) => {
    const translations: { [key: string]: { [lang: string]: string } } = {
      title: {
        en: 'Parking Reminder',
        es: 'Recordatorio de Estacionamiento',
        fr: 'Rappel de Stationnement',
        zh: '停车提醒',
        ar: 'تذكير الوقوف',
        hi: 'पार्किंग रिमाइंडर',
        ru: 'Напоминание о парковке',
        ko: '주차 알림'
      },
      timeLeft: {
        en: 'Time until removal:',
        es: 'Tiempo hasta la remoción:',
        fr: 'Temps avant le retrait:',
        zh: '距离移车时间：',
        ar: 'الوقت حتى الإزالة:',
        hi: 'हटाने तक का समय:',
        ru: 'Время до удаления:',
        ko: '제거까지 남은 시간:'
      }
    };

    return translations[key]?.[language] || translations[key]?.['en'] || key;
  };

  const handleReminderSet = (success: boolean) => {
    setReminderSet(success);
  };

  if (!removalTime) return null;

  return (
    <div className="space-y-6">
      {/* Time Display */}
      <div className="bg-gradient-to-r from-orange-500/10 to-red-500/10 border border-orange-400/30 rounded-2xl p-6 backdrop-blur-sm">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 bg-orange-500/20 rounded-xl">
            <Bell className="w-8 h-8 text-orange-400" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">{getLocalizedText('title')}</h3>
            <p className="text-gray-600 dark:text-gray-400">Smart notifications for your parked car</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-orange-400" />
              <span className="text-gray-700 dark:text-gray-300">{getLocalizedText('timeLeft')}</span>
            </div>
            <span className="text-xl font-bold text-orange-400">{timeUntilRemoval}</span>
          </div>

          <div className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-gray-400" />
            <span className="text-gray-700 dark:text-gray-300">Parked at: {location}</span>
          </div>

          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-yellow-400" />
            <span className="text-gray-700 dark:text-gray-300">Remove by: {removalTime}</span>
          </div>
        </div>
      </div>

      {/* Calendar Integration */}
      <CalendarIntegration
        removalTime={removalTime}
        location={location}
        onReminderSet={handleReminderSet}
      />
    </div>
  );
};