import React, { useState } from 'react';
import { AlertTriangle, Shield, MapPin, Clock, Users, CheckCircle } from 'lucide-react';
import { UserReport } from '../types';

interface SafetyReportingProps {
  location: string;
  onReportSubmit: (report: Omit<UserReport, 'id' | 'timestamp'>) => void;
}

export const SafetyReporting: React.FC<SafetyReportingProps> = ({ location, onReportSubmit }) => {
  const [showReportForm, setShowReportForm] = useState(false);
  const [reportType, setReportType] = useState<'safety' | 'availability' | 'enforcement' | 'accessibility'>('safety');
  const [description, setDescription] = useState('');
  const [severity, setSeverity] = useState<'low' | 'medium' | 'high'>('medium');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const reportTypes = [
    { value: 'safety', label: 'Safety Concern', icon: Shield, color: 'text-red-500' },
    { value: 'availability', label: 'Parking Availability', icon: MapPin, color: 'text-blue-500' },
    { value: 'enforcement', label: 'Ticket Activity', icon: AlertTriangle, color: 'text-yellow-500' },
    { value: 'accessibility', label: 'Accessibility Issue', icon: Users, color: 'text-purple-500' }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) return;

    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    onReportSubmit({
      type: reportType,
      description: description.trim(),
      severity,
      verified: false
    });

    setSubmitted(true);
    setIsSubmitting(false);
    
    // Reset form after 3 seconds
    setTimeout(() => {
      setSubmitted(false);
      setShowReportForm(false);
      setDescription('');
      setSeverity('medium');
    }, 3000);
  };

  if (submitted) {
    return (
      <div className="bg-green-500/10 border border-green-400/30 rounded-2xl p-6 backdrop-blur-sm">
        <div className="flex items-center gap-3 mb-4">
          <CheckCircle className="w-8 h-8 text-green-400" />
          <div>
            <h3 className="text-xl font-bold text-white">Report Submitted!</h3>
            <p className="text-gray-400">Thank you for helping the community</p>
          </div>
        </div>
        <p className="text-green-300">
          Your report has been submitted and will be verified by our community moderators. 
          This helps keep everyone safe and informed.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white/5 dark:bg-gray-800/30 border border-gray-200/30 dark:border-gray-600/30 rounded-2xl p-6 backdrop-blur-sm">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-3 bg-blue-500/20 rounded-xl">
          <Shield className="w-8 h-8 text-blue-400" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">Community Safety</h3>
          <p className="text-gray-600 dark:text-gray-400">Help others with real-time updates</p>
        </div>
      </div>

      {!showReportForm ? (
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <MapPin className="w-4 h-4" />
            <span>Reporting for: {location}</span>
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            {reportTypes.map((type) => {
              const IconComponent = type.icon;
              return (
                <button
                  key={type.value}
                  onClick={() => {
                    setReportType(type.value as any);
                    setShowReportForm(true);
                  }}
                  className="p-3 bg-white/5 dark:bg-gray-700/30 border border-gray-200/30 dark:border-gray-600/30 rounded-xl hover:border-blue-400/50 transition-all duration-200 text-left"
                >
                  <div className="flex items-center gap-2 mb-1">
                    <IconComponent className={`w-4 h-4 ${type.color}`} />
                    <span className="text-sm font-semibold text-gray-900 dark:text-white">{type.label}</span>
                  </div>
                </button>
              );
            })}
          </div>
          
          <div className="bg-blue-500/10 border border-blue-400/30 rounded-lg p-3">
            <p className="text-sm text-blue-300 dark:text-blue-200">
              💡 Your reports help the community avoid tickets, find parking, and stay safe. 
              All reports are verified before being shared.
            </p>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Report Type
            </label>
            <select
              value={reportType}
              onChange={(e) => setReportType(e.target.value as any)}
              className="w-full px-4 py-3 bg-white/10 dark:bg-gray-700/50 border border-gray-300/50 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 focus:outline-none transition-all duration-200"
            >
              {reportTypes.map((type) => (
                <option key={type.value} value={type.value} className="bg-white dark:bg-gray-800">
                  {type.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Severity
            </label>
            <div className="flex gap-2">
              {(['low', 'medium', 'high'] as const).map((level) => (
                <button
                  key={level}
                  type="button"
                  onClick={() => setSeverity(level)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    severity === level
                      ? level === 'high' ? 'bg-red-500 text-white' 
                        : level === 'medium' ? 'bg-yellow-500 text-white'
                        : 'bg-green-500 text-white'
                      : 'bg-white/10 dark:bg-gray-700/30 text-gray-600 dark:text-gray-400 hover:bg-white/20 dark:hover:bg-gray-600/30'
                  }`}
                >
                  {level.charAt(0).toUpperCase() + level.slice(1)}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe what you observed..."
              rows={3}
              className="w-full px-4 py-3 bg-white/10 dark:bg-gray-700/50 border border-gray-300/50 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 focus:outline-none transition-all duration-200 resize-none"
              required
            />
          </div>

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={!description.trim() || isSubmitting}
              className="flex-1 px-4 py-3 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-500 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-all duration-200"
            >
              {isSubmitting ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Submitting...
                </div>
              ) : (
                'Submit Report'
              )}
            </button>
            <button
              type="button"
              onClick={() => setShowReportForm(false)}
              className="px-4 py-3 bg-gray-500 hover:bg-gray-600 text-white font-semibold rounded-lg transition-all duration-200"
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  );
};