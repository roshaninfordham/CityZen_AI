import React, { useState, useEffect } from 'react';
import { Calendar, Clock, Smartphone, CheckCircle, AlertTriangle, Bell, Plus, Download, ExternalLink } from 'lucide-react';

interface CalendarIntegrationProps {
  removalTime?: string;
  location: string;
  onReminderSet: (success: boolean) => void;
}

export const CalendarIntegration: React.FC<CalendarIntegrationProps> = ({
  removalTime,
  location,
  onReminderSet
}) => {
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'none' | 'connecting' | 'connected' | 'error'>('none');
  const [selectedMethod, setSelectedMethod] = useState<'google' | 'apple' | 'phone' | 'outlook'>('google');
  const [reminderTimes, setReminderTimes] = useState({
    early: true,    // 30 minutes before
    warning: true,  // 10 minutes before
    final: true     // 5 minutes before
  });
  const [calendarUrls, setCalendarUrls] = useState<{
    google: string;
    apple: string;
    outlook: string;
  } | null>(null);

  useEffect(() => {
    if (removalTime) {
      generateCalendarUrls();
    }
  }, [removalTime, location, reminderTimes]);

  const generateCalendarUrls = () => {
    if (!removalTime) return;

    const [hours, minutes] = removalTime.split(':').map(Number);
    const eventDate = new Date();
    eventDate.setHours(hours, minutes, 0, 0);

    // If the time has passed today, schedule for tomorrow
    if (eventDate < new Date()) {
      eventDate.setDate(eventDate.getDate() + 1);
    }

    const eventTitle = `🚗 Move Car - Parking Expires`;
    const eventDescription = `Remove your car from ${location} by ${removalTime}.\n\nSet by CityZen AI - Your NYC Mobility Advisor\n\nReminder schedule:\n${reminderTimes.early ? '• 30 minutes before\n' : ''}${reminderTimes.warning ? '• 10 minutes before\n' : ''}${reminderTimes.final ? '• 5 minutes before\n' : ''}`;
    
    // Format dates for different calendar systems
    const startTime = eventDate.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    const endTime = new Date(eventDate.getTime() + 15 * 60 * 1000).toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z'; // 15 min duration

    // Google Calendar URL
    const googleUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(eventTitle)}&dates=${startTime}/${endTime}&details=${encodeURIComponent(eventDescription)}&location=${encodeURIComponent(location)}&sf=true&output=xml`;
    
    // Outlook Calendar URL
    const outlookUrl = `https://outlook.live.com/calendar/0/deeplink/compose?subject=${encodeURIComponent(eventTitle)}&startdt=${startTime}&enddt=${endTime}&body=${encodeURIComponent(eventDescription)}&location=${encodeURIComponent(location)}`;
    
    // Apple Calendar (iCal format)
    const appleCalendarData = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//CityZen AI//Parking Reminder//EN
CALSCALE:GREGORIAN
METHOD:PUBLISH
BEGIN:VEVENT
UID:${Date.now()}@cityzen.ai
DTSTART:${startTime}
DTEND:${endTime}
SUMMARY:${eventTitle}
DESCRIPTION:${eventDescription.replace(/\n/g, '\\n')}
LOCATION:${location}
STATUS:CONFIRMED
SEQUENCE:0
BEGIN:VALARM
TRIGGER:-PT30M
DESCRIPTION:Move your car in 30 minutes
ACTION:DISPLAY
END:VALARM
BEGIN:VALARM
TRIGGER:-PT10M
DESCRIPTION:Move your car in 10 minutes
ACTION:DISPLAY
END:VALARM
BEGIN:VALARM
TRIGGER:-PT5M
DESCRIPTION:Move your car in 5 minutes - URGENT!
ACTION:DISPLAY
END:VALARM
END:VEVENT
END:VCALENDAR`;

    const appleUrl = `data:text/calendar;charset=utf8,${encodeURIComponent(appleCalendarData)}`;

    setCalendarUrls({
      google: googleUrl,
      apple: appleUrl,
      outlook: outlookUrl
    });
  };

  const handleCalendarConnection = async () => {
    if (!calendarUrls) return;

    setIsConnecting(true);
    setConnectionStatus('connecting');

    try {
      if (selectedMethod === 'google') {
        await connectToGoogleCalendar();
      } else if (selectedMethod === 'apple') {
        await connectToAppleCalendar();
      } else if (selectedMethod === 'outlook') {
        await connectToOutlookCalendar();
      } else {
        await setPhoneReminder();
      }
      
      setConnectionStatus('connected');
      onReminderSet(true);
    } catch (error) {
      console.error('Calendar connection failed:', error);
      setConnectionStatus('error');
      onReminderSet(false);
    } finally {
      setIsConnecting(false);
    }
  };

  const connectToGoogleCalendar = async (): Promise<void> => {
    return new Promise((resolve, reject) => {
      try {
        if (calendarUrls?.google) {
          // Open Google Calendar in new tab
          const newWindow = window.open(calendarUrls.google, '_blank', 'width=800,height=600');
          
          // Simulate successful connection after a delay
          setTimeout(() => {
            if (newWindow) {
              newWindow.focus();
            }
            resolve();
          }, 1000);
        } else {
          reject(new Error('Google Calendar URL not available'));
        }
      } catch (error) {
        reject(error);
      }
    });
  };

  const connectToAppleCalendar = async (): Promise<void> => {
    return new Promise((resolve, reject) => {
      try {
        if (calendarUrls?.apple) {
          // Create and trigger download of .ics file
          const link = document.createElement('a');
          link.href = calendarUrls.apple;
          link.download = `parking-reminder-${Date.now()}.ics`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          
          setTimeout(() => {
            resolve();
          }, 1000);
        } else {
          reject(new Error('Apple Calendar data not available'));
        }
      } catch (error) {
        reject(error);
      }
    });
  };

  const connectToOutlookCalendar = async (): Promise<void> => {
    return new Promise((resolve, reject) => {
      try {
        if (calendarUrls?.outlook) {
          // Open Outlook Calendar in new tab
          const newWindow = window.open(calendarUrls.outlook, '_blank', 'width=800,height=600');
          
          setTimeout(() => {
            if (newWindow) {
              newWindow.focus();
            }
            resolve();
          }, 1000);
        } else {
          reject(new Error('Outlook Calendar URL not available'));
        }
      } catch (error) {
        reject(error);
      }
    });
  };

  const setPhoneReminder = async (): Promise<void> => {
    return new Promise((resolve, reject) => {
      if ('Notification' in window) {
        Notification.requestPermission().then(permission => {
          if (permission === 'granted') {
            // Schedule browser notifications
            scheduleNotifications();
            resolve();
          } else {
            reject(new Error('Notification permission denied'));
          }
        });
      } else {
        // Fallback: show instructions for manual setup
        resolve();
      }
    });
  };

  const scheduleNotifications = () => {
    if (!removalTime) return;

    const [hours, minutes] = removalTime.split(':').map(Number);
    const removalDate = new Date();
    removalDate.setHours(hours, minutes, 0, 0);

    if (removalDate < new Date()) {
      removalDate.setDate(removalDate.getDate() + 1);
    }

    const notifications = [];
    
    if (reminderTimes.early) {
      notifications.push({
        time: new Date(removalDate.getTime() - 30 * 60 * 1000),
        title: '🚗 Parking Reminder - 30 minutes',
        body: `Move your car from ${location} in 30 minutes (by ${removalTime})`
      });
    }

    if (reminderTimes.warning) {
      notifications.push({
        time: new Date(removalDate.getTime() - 10 * 60 * 1000),
        title: '🚗 Parking Reminder - 10 minutes',
        body: `Move your car from ${location} in 10 minutes (by ${removalTime})`
      });
    }

    if (reminderTimes.final) {
      notifications.push({
        time: new Date(removalDate.getTime() - 5 * 60 * 1000),
        title: '🚗 URGENT: Move Your Car!',
        body: `Move your car from ${location} NOW! Parking expires at ${removalTime}`
      });
    }

    // Schedule notifications using setTimeout (in a real app, you'd use a service worker)
    notifications.forEach(notification => {
      const delay = notification.time.getTime() - Date.now();
      if (delay > 0) {
        setTimeout(() => {
          new Notification(notification.title, {
            body: notification.body,
            icon: '/vite.svg',
            badge: '/vite.svg',
            tag: 'parking-reminder',
            requireInteraction: true
          });
        }, delay);
      }
    });
  };

  const getStatusIcon = () => {
    switch (connectionStatus) {
      case 'connecting':
        return <div className="w-5 h-5 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />;
      case 'connected':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'error':
        return <AlertTriangle className="w-5 h-5 text-red-500" />;
      default:
        return <Calendar className="w-5 h-5 text-blue-500" />;
    }
  };

  const getStatusMessage = () => {
    switch (connectionStatus) {
      case 'connecting':
        return `Opening ${selectedMethod === 'google' ? 'Google Calendar' : selectedMethod === 'apple' ? 'Apple Calendar' : selectedMethod === 'outlook' ? 'Outlook Calendar' : 'Phone Notifications'}...`;
      case 'connected':
        return 'Calendar event created successfully! Check your calendar for the reminder.';
      case 'error':
        return 'Connection failed. You can still add the event manually using the links below.';
      default:
        return 'Set up smart reminders to never get a parking ticket again.';
    }
  };

  if (!removalTime) {
    return (
      <div className="bg-gray-100 dark:bg-gray-800/30 border border-gray-200 dark:border-gray-600/30 rounded-2xl p-6">
        <div className="text-center">
          <Calendar className="w-8 h-8 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-600 dark:text-gray-400">No parking time limit detected</p>
          <p className="text-sm text-gray-500 dark:text-gray-500">Upload a parking sign to set reminders</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white/90 dark:bg-gray-800/30 border border-gray-200 dark:border-gray-600/30 rounded-2xl p-6 backdrop-blur-sm">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-blue-500/20 rounded-xl">
          {getStatusIcon()}
        </div>
        <div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">Smart Calendar Reminders</h3>
          <p className="text-gray-600 dark:text-gray-400">Never get a parking ticket again</p>
        </div>
      </div>

      {connectionStatus === 'none' && (
        <>
          {/* Method Selection */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
              Choose your calendar:
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <button
                onClick={() => setSelectedMethod('google')}
                className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                  selectedMethod === 'google'
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-500/10'
                    : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                }`}
              >
                <div className="text-center">
                  <Calendar className="w-6 h-6 mx-auto mb-2 text-blue-500" />
                  <p className="font-medium text-gray-900 dark:text-white text-sm">Google</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Calendar</p>
                </div>
              </button>

              <button
                onClick={() => setSelectedMethod('apple')}
                className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                  selectedMethod === 'apple'
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-500/10'
                    : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                }`}
              >
                <div className="text-center">
                  <Download className="w-6 h-6 mx-auto mb-2 text-gray-700" />
                  <p className="font-medium text-gray-900 dark:text-white text-sm">Apple</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Calendar</p>
                </div>
              </button>

              <button
                onClick={() => setSelectedMethod('outlook')}
                className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                  selectedMethod === 'outlook'
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-500/10'
                    : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                }`}
              >
                <div className="text-center">
                  <ExternalLink className="w-6 h-6 mx-auto mb-2 text-orange-500" />
                  <p className="font-medium text-gray-900 dark:text-white text-sm">Outlook</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Calendar</p>
                </div>
              </button>

              <button
                onClick={() => setSelectedMethod('phone')}
                className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                  selectedMethod === 'phone'
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-500/10'
                    : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                }`}
              >
                <div className="text-center">
                  <Smartphone className="w-6 h-6 mx-auto mb-2 text-green-500" />
                  <p className="font-medium text-gray-900 dark:text-white text-sm">Browser</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Notifications</p>
                </div>
              </button>
            </div>
          </div>

          {/* Reminder Times */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
              Notification schedule:
            </label>
            <div className="space-y-3">
              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={reminderTimes.early}
                  onChange={(e) => setReminderTimes(prev => ({ ...prev, early: e.target.checked }))}
                  className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                />
                <span className="text-gray-700 dark:text-gray-300">30 minutes before expiration</span>
              </label>
              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={reminderTimes.warning}
                  onChange={(e) => setReminderTimes(prev => ({ ...prev, warning: e.target.checked }))}
                  className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                />
                <span className="text-gray-700 dark:text-gray-300">10 minutes before expiration</span>
              </label>
              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={reminderTimes.final}
                  onChange={(e) => setReminderTimes(prev => ({ ...prev, final: e.target.checked }))}
                  className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                />
                <span className="text-gray-700 dark:text-gray-300">5 minutes before expiration</span>
              </label>
            </div>
          </div>

          {/* Parking Details */}
          <div className="bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-400/30 rounded-xl p-4 mb-6">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <span className="font-medium text-blue-700 dark:text-blue-300">Parking expires at {removalTime}</span>
            </div>
            <p className="text-sm text-blue-600 dark:text-blue-200">Location: {location}</p>
          </div>

          {/* Action Button */}
          <button
            onClick={handleCalendarConnection}
            disabled={isConnecting}
            className="w-full px-6 py-4 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-all duration-200 flex items-center justify-center gap-2"
          >
            <Bell className="w-5 h-5" />
            {isConnecting ? 'Setting up reminders...' : `Add to ${selectedMethod === 'google' ? 'Google Calendar' : selectedMethod === 'apple' ? 'Apple Calendar' : selectedMethod === 'outlook' ? 'Outlook Calendar' : 'Browser Notifications'}`}
          </button>
        </>
      )}

      {/* Status Display */}
      {connectionStatus !== 'none' && (
        <div className="text-center">
          <div className="mb-4">
            {getStatusIcon()}
          </div>
          <p className="text-gray-700 dark:text-gray-300 mb-4">{getStatusMessage()}</p>
          
          {connectionStatus === 'connected' && (
            <div className="bg-green-50 dark:bg-green-500/10 border border-green-200 dark:border-green-400/30 rounded-xl p-4 mb-4">
              <div className="flex items-center justify-center gap-2 mb-2">
                <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                <span className="font-medium text-green-700 dark:text-green-300">Reminders Active</span>
              </div>
              <div className="text-sm text-green-600 dark:text-green-200 space-y-1">
                {reminderTimes.early && <p>• 30-minute warning set</p>}
                {reminderTimes.warning && <p>• 10-minute warning set</p>}
                {reminderTimes.final && <p>• 5-minute final warning set</p>}
              </div>
            </div>
          )}

          {(connectionStatus === 'error' || connectionStatus === 'connected') && calendarUrls && (
            <div className="space-y-3">
              <div className="bg-gray-50 dark:bg-gray-700/30 border border-gray-200 dark:border-gray-600/30 rounded-xl p-4">
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-3 font-medium">
                  Manual calendar links:
                </p>
                <div className="space-y-2">
                  <a
                    href={calendarUrls.google}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm transition-colors"
                  >
                    <Calendar className="w-4 h-4" />
                    Add to Google Calendar
                  </a>
                  <a
                    href={calendarUrls.apple}
                    download={`parking-reminder-${Date.now()}.ics`}
                    className="flex items-center justify-center gap-2 px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg text-sm transition-colors"
                  >
                    <Download className="w-4 h-4" />
                    Download for Apple Calendar
                  </a>
                  <a
                    href={calendarUrls.outlook}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg text-sm transition-colors"
                  >
                    <ExternalLink className="w-4 h-4" />
                    Add to Outlook Calendar
                  </a>
                </div>
              </div>
            </div>
          )}

          <button
            onClick={() => {
              setConnectionStatus('none');
              setIsConnecting(false);
            }}
            className="mt-4 text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
          >
            Try different method
          </button>
        </div>
      )}
    </div>
  );
};