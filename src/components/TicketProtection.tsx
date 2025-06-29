import React, { useState } from 'react';
import { Shield, DollarSign, Camera, FileText, CheckCircle, AlertTriangle, Upload, Clock, Award } from 'lucide-react';

interface TicketClaim {
  id: string;
  ticketNumber: string;
  amount: number;
  date: Date;
  location: string;
  status: 'pending' | 'approved' | 'denied' | 'processing';
  description: string;
  evidence: string[];
}

export const TicketProtection: React.FC = () => {
  const [showClaimForm, setShowClaimForm] = useState(false);
  const [claims, setClaims] = useState<TicketClaim[]>([
    {
      id: '1',
      ticketNumber: 'NYC123456789',
      amount: 115,
      date: new Date('2024-01-15'),
      location: '42nd Street & Broadway',
      status: 'approved',
      description: 'Parking meter malfunction - paid but received ticket',
      evidence: ['meter_receipt.jpg', 'ticket_photo.jpg']
    },
    {
      id: '2',
      ticketNumber: 'NYC987654321',
      amount: 65,
      date: new Date('2024-01-10'),
      location: 'Central Park West',
      status: 'processing',
      description: 'Street cleaning sign was obscured by tree branches',
      evidence: ['sign_photo.jpg', 'street_view.jpg']
    }
  ]);
  
  const [newClaim, setNewClaim] = useState({
    ticketNumber: '',
    amount: '',
    location: '',
    description: '',
    evidence: [] as File[]
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setUploadedFiles(prev => [...prev, ...files]);
    setNewClaim(prev => ({ ...prev, evidence: [...prev.evidence, ...files] }));
  };

  const removeFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
    setNewClaim(prev => ({ ...prev, evidence: prev.evidence.filter((_, i) => i !== index) }));
  };

  const handleSubmitClaim = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newClaim.ticketNumber || !newClaim.amount || !newClaim.description) return;

    setIsSubmitting(true);

    // Simulate API submission
    await new Promise(resolve => setTimeout(resolve, 2000));

    const claim: TicketClaim = {
      id: Date.now().toString(),
      ticketNumber: newClaim.ticketNumber,
      amount: parseFloat(newClaim.amount),
      date: new Date(),
      location: newClaim.location,
      status: 'pending',
      description: newClaim.description,
      evidence: newClaim.evidence.map(file => file.name)
    };

    setClaims(prev => [claim, ...prev]);
    setNewClaim({ ticketNumber: '', amount: '', location: '', description: '', evidence: [] });
    setUploadedFiles([]);
    setShowClaimForm(false);
    setIsSubmitting(false);
  };

  const getStatusColor = (status: TicketClaim['status']) => {
    switch (status) {
      case 'approved': return 'text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-500/20';
      case 'denied': return 'text-red-600 bg-red-100 dark:text-red-400 dark:bg-red-500/20';
      case 'processing': return 'text-blue-600 bg-blue-100 dark:text-blue-400 dark:bg-blue-500/20';
      case 'pending': return 'text-yellow-600 bg-yellow-100 dark:text-yellow-400 dark:bg-yellow-500/20';
      default: return 'text-gray-600 bg-gray-100 dark:text-gray-400 dark:bg-gray-500/20';
    }
  };

  const getStatusIcon = (status: TicketClaim['status']) => {
    switch (status) {
      case 'approved': return <CheckCircle className="w-4 h-4" />;
      case 'denied': return <AlertTriangle className="w-4 h-4" />;
      case 'processing': return <Clock className="w-4 h-4" />;
      case 'pending': return <Clock className="w-4 h-4" />;
      default: return <FileText className="w-4 h-4" />;
    }
  };

  const totalClaimed = claims.reduce((sum, claim) => sum + claim.amount, 0);
  const approvedAmount = claims.filter(c => c.status === 'approved').reduce((sum, claim) => sum + claim.amount, 0);
  const successRate = claims.length > 0 ? Math.round((claims.filter(c => c.status === 'approved').length / claims.length) * 100) : 0;

  return (
    <div className="bg-white/90 dark:bg-gray-800/30 border border-gray-200 dark:border-gray-600/30 rounded-2xl p-6 backdrop-blur-sm">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl shadow-lg">
          <Shield className="w-8 h-8 text-white" />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">Ticket Protection</h3>
            <div className="flex items-center gap-1 px-2 py-1 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-lg shadow-sm">
              <Award className="w-3 h-3 text-white" />
              <span className="text-xs font-bold text-white">PREMIUM</span>
            </div>
          </div>
          <p className="text-gray-600 dark:text-gray-400">Up to $500/month coverage • Automatic claim filing</p>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="text-center p-4 bg-green-50 dark:bg-green-500/10 border border-green-200 dark:border-green-400/30 rounded-xl">
          <div className="text-2xl font-bold text-green-600 dark:text-green-400">${approvedAmount}</div>
          <div className="text-xs text-green-600 dark:text-green-400">Reimbursed</div>
        </div>
        <div className="text-center p-4 bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-400/30 rounded-xl">
          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{successRate}%</div>
          <div className="text-xs text-blue-600 dark:text-blue-400">Success Rate</div>
        </div>
        <div className="text-center p-4 bg-purple-50 dark:bg-purple-500/10 border border-purple-200 dark:border-purple-400/30 rounded-xl">
          <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">{claims.length}</div>
          <div className="text-xs text-purple-600 dark:text-purple-400">Total Claims</div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 mb-6">
        <button
          onClick={() => setShowClaimForm(true)}
          className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold rounded-xl transition-all duration-200 flex items-center justify-center gap-2"
        >
          <DollarSign className="w-5 h-5" />
          File New Claim
        </button>
        <button className="px-4 py-3 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 font-medium rounded-xl transition-colors duration-200">
          View Coverage Details
        </button>
      </div>

      {/* Claim Form */}
      {showClaimForm && (
        <div className="bg-gray-50 dark:bg-gray-700/30 border border-gray-200 dark:border-gray-600/30 rounded-xl p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-lg font-semibold text-gray-900 dark:text-white">File Reimbursement Claim</h4>
            <button
              onClick={() => setShowClaimForm(false)}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              ✕
            </button>
          </div>

          <form onSubmit={handleSubmitClaim} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Ticket Number *
                </label>
                <input
                  type="text"
                  value={newClaim.ticketNumber}
                  onChange={(e) => setNewClaim(prev => ({ ...prev, ticketNumber: e.target.value }))}
                  placeholder="NYC123456789"
                  className="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Ticket Amount *
                </label>
                <input
                  type="number"
                  value={newClaim.amount}
                  onChange={(e) => setNewClaim(prev => ({ ...prev, amount: e.target.value }))}
                  placeholder="115.00"
                  step="0.01"
                  className="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Location
              </label>
              <input
                type="text"
                value={newClaim.location}
                onChange={(e) => setNewClaim(prev => ({ ...prev, location: e.target.value }))}
                placeholder="42nd Street & Broadway"
                className="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Description *
              </label>
              <textarea
                value={newClaim.description}
                onChange={(e) => setNewClaim(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Describe why you believe this ticket was issued in error..."
                rows={3}
                className="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                required
              />
            </div>

            {/* File Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Evidence (Photos, receipts, etc.)
              </label>
              <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center">
                <input
                  type="file"
                  multiple
                  accept="image/*,.pdf"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="evidence-upload"
                />
                <label htmlFor="evidence-upload" className="cursor-pointer">
                  <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-600 dark:text-gray-400">Click to upload evidence</p>
                  <p className="text-sm text-gray-500 dark:text-gray-500">Photos, PDFs up to 10MB each</p>
                </label>
              </div>

              {/* Uploaded Files */}
              {uploadedFiles.length > 0 && (
                <div className="mt-3 space-y-2">
                  {uploadedFiles.map((file, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-gray-100 dark:bg-gray-700 rounded-lg">
                      <div className="flex items-center gap-2">
                        <Camera className="w-4 h-4 text-gray-500" />
                        <span className="text-sm text-gray-700 dark:text-gray-300">{file.name}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeFile(index)}
                        className="text-red-500 hover:text-red-700 text-sm"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 px-6 py-3 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-colors duration-200"
              >
                {isSubmitting ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Submitting Claim...
                  </div>
                ) : (
                  'Submit Claim'
                )}
              </button>
              <button
                type="button"
                onClick={() => setShowClaimForm(false)}
                className="px-6 py-3 bg-gray-300 hover:bg-gray-400 dark:bg-gray-600 dark:hover:bg-gray-500 text-gray-700 dark:text-gray-300 font-semibold rounded-lg transition-colors duration-200"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Claims History */}
      <div>
        <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Recent Claims</h4>
        <div className="space-y-3">
          {claims.map((claim) => (
            <div key={claim.id} className="p-4 bg-gray-50 dark:bg-gray-700/30 border border-gray-200 dark:border-gray-600/30 rounded-xl">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-gray-900 dark:text-white">#{claim.ticketNumber}</span>
                  <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(claim.status)}`}>
                    {getStatusIcon(claim.status)}
                    <span className="capitalize">{claim.status}</span>
                  </div>
                </div>
                <span className="font-bold text-gray-900 dark:text-white">${claim.amount}</span>
              </div>
              
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{claim.description}</p>
              
              <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-500">
                <span>{claim.location}</span>
                <span>{claim.date.toLocaleDateString()}</span>
              </div>
              
              {claim.evidence.length > 0 && (
                <div className="mt-2 flex items-center gap-1 text-xs text-gray-500 dark:text-gray-500">
                  <Camera className="w-3 h-3" />
                  <span>{claim.evidence.length} evidence file(s)</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Coverage Info */}
      <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-400/30 rounded-xl">
        <div className="flex items-start gap-2">
          <Shield className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-blue-700 dark:text-blue-300 mb-1">💡 Coverage Details</p>
            <ul className="text-sm text-blue-600 dark:text-blue-200 space-y-1">
              <li>• Up to $500 monthly reimbursement</li>
              <li>• 85% average approval rate</li>
              <li>• Automatic dispute filing</li>
              <li>• Legal support included</li>
              <li>• 24-48 hour claim processing</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};