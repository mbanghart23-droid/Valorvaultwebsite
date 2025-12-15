import { useState } from 'react';
import { Medal } from '../App';
import { ArrowLeft, Edit2, Trash2, Calendar, MapPin, Award, DollarSign, Package, Hash, Mail, User } from 'lucide-react';

interface MedalDetailProps {
  medal: Medal;
  onBack: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  onContactOwner?: (medalId: string, message: string) => void;
}

export function MedalDetail({ medal, onBack, onEdit, onDelete, onContactOwner }: MedalDetailProps) {
  const [showContactForm, setShowContactForm] = useState(false);
  const [message, setMessage] = useState('');

  const handleDelete = () => {
    if (onDelete && confirm(`Are you sure you want to delete "${medal.name}"?`)) {
      onDelete();
    }
  };

  const handleSendRequest = () => {
    if (onContactOwner && message.trim()) {
      onContactOwner(medal.id, message);
      setShowContactForm(false);
      setMessage('');
    }
  };

  const isOwnMedal = onEdit !== undefined;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Collection
          </button>
        </div>

        <div className="bg-slate-800 border border-slate-700 rounded-lg overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-amber-600 to-amber-700 p-6">
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-white mb-2">{medal.name}</h1>
                <div className="flex flex-wrap gap-2 mb-3">
                  <span className="inline-block px-3 py-1 bg-white/20 text-white rounded-full text-sm">
                    {medal.category}
                  </span>
                  <span className="inline-block px-3 py-1 bg-white/20 text-white rounded-full text-sm">
                    {medal.condition}
                  </span>
                </div>
                {!isOwnMedal && medal.ownerName && (
                  <div className="flex items-center gap-2 text-white/90">
                    <User className="w-4 h-4" />
                    <span>Owned by {medal.ownerName}</span>
                  </div>
                )}
              </div>
              <div className="flex gap-2">
                {isOwnMedal ? (
                  <>
                    <button
                      onClick={onEdit}
                      className="flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-lg transition-colors"
                    >
                      <Edit2 className="w-4 h-4" />
                      Edit
                    </button>
                    <button
                      onClick={handleDelete}
                      className="flex items-center gap-2 px-4 py-2 bg-red-600/80 hover:bg-red-600 text-white rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => setShowContactForm(!showContactForm)}
                    className="flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-lg transition-colors"
                  >
                    <Mail className="w-4 h-4" />
                    Contact Owner
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Contact Form */}
          {showContactForm && !isOwnMedal && (
            <div className="bg-amber-600/10 border-b border-amber-600/20 p-6">
              <h3 className="text-white mb-3">Send Contact Request</h3>
              <p className="text-slate-300 text-sm mb-4">
                Introduce yourself and explain why you're interested in this medal. The owner will decide whether to share their contact information.
              </p>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Example: I noticed you have a Purple Heart from the Normandy invasion. I'm researching medals from that campaign and would love to discuss it with you."
                rows={4}
                className="w-full px-4 py-3 bg-slate-900 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 mb-4"
              />
              <div className="flex gap-3">
                <button
                  onClick={handleSendRequest}
                  disabled={!message.trim()}
                  className="px-6 py-2 bg-amber-600 hover:bg-amber-700 disabled:bg-slate-700 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
                >
                  Send Request
                </button>
                <button
                  onClick={() => {
                    setShowContactForm(false);
                    setMessage('');
                  }}
                  className="px-6 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {/* Content */}
          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Main Info */}
              <div className="lg:col-span-2 space-y-6">
                {/* Description */}
                <div>
                  <h3 className="text-white mb-3">Description</h3>
                  <p className="text-slate-300">{medal.description}</p>
                </div>

                {/* Award Details */}
                <div>
                  <h3 className="text-white mb-3">Award Details</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex items-start gap-3 p-4 bg-slate-900 rounded-lg">
                      <MapPin className="w-5 h-5 text-amber-500 mt-0.5" />
                      <div>
                        <p className="text-slate-400 text-sm">Country</p>
                        <p className="text-white">{medal.country}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 p-4 bg-slate-900 rounded-lg">
                      <Award className="w-5 h-5 text-amber-500 mt-0.5" />
                      <div>
                        <p className="text-slate-400 text-sm">Branch</p>
                        <p className="text-white">{medal.branch}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 p-4 bg-slate-900 rounded-lg">
                      <Calendar className="w-5 h-5 text-amber-500 mt-0.5" />
                      <div>
                        <p className="text-slate-400 text-sm">Era</p>
                        <p className="text-white">{medal.era}</p>
                      </div>
                    </div>

                    {medal.dateAwarded && (
                      <div className="flex items-start gap-3 p-4 bg-slate-900 rounded-lg">
                        <Calendar className="w-5 h-5 text-amber-500 mt-0.5" />
                        <div>
                          <p className="text-slate-400 text-sm">Date Awarded</p>
                          <p className="text-white">
                            {new Date(medal.dateAwarded).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </p>
                        </div>
                      </div>
                    )}

                    {medal.recipient && (
                      <div className="flex items-start gap-3 p-4 bg-slate-900 rounded-lg sm:col-span-2">
                        <Award className="w-5 h-5 text-amber-500 mt-0.5" />
                        <div>
                          <p className="text-slate-400 text-sm">Recipient</p>
                          <p className="text-white">{medal.recipient}</p>
                        </div>
                      </div>
                    )}

                    {medal.serialNumber && (
                      <div className="flex items-start gap-3 p-4 bg-slate-900 rounded-lg sm:col-span-2">
                        <Hash className="w-5 h-5 text-amber-500 mt-0.5" />
                        <div>
                          <p className="text-slate-400 text-sm">Serial Number</p>
                          <p className="text-white">{medal.serialNumber}</p>
                        </div>
                      </div>
                    )}

                    {medal.clasps && medal.clasps.length > 0 && (
                      <div className="flex items-start gap-3 p-4 bg-slate-900 rounded-lg sm:col-span-2">
                        <Award className="w-5 h-5 text-amber-500 mt-0.5" />
                        <div>
                          <p className="text-slate-400 text-sm">Clasps</p>
                          <div className="flex flex-wrap gap-2 mt-2">
                            {medal.clasps.map((clasp, index) => (
                              <span key={index} className="inline-block px-3 py-1 bg-amber-600/20 text-amber-300 rounded-full text-sm">
                                {clasp}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Acquisition Info */}
                <div className="bg-slate-900 rounded-lg p-6">
                  <h3 className="text-white mb-4">Acquisition</h3>
                  <div className="space-y-4">
                    {medal.acquisitionDate && (
                      <div>
                        <p className="text-slate-400 text-sm mb-1">Date Acquired</p>
                        <p className="text-white">
                          {new Date(medal.acquisitionDate).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </p>
                      </div>
                    )}

                    {medal.acquisitionSource && (
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <Package className="w-4 h-4 text-amber-500" />
                          <p className="text-slate-400 text-sm">Source</p>
                        </div>
                        <p className="text-white">{medal.acquisitionSource}</p>
                      </div>
                    )}

                    {medal.estimatedValue && (
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <DollarSign className="w-4 h-4 text-amber-500" />
                          <p className="text-slate-400 text-sm">Estimated Value</p>
                        </div>
                        <p className="text-white">{medal.estimatedValue}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Image Placeholder */}
                {medal.imageUrl ? (
                  <div className="bg-slate-900 rounded-lg overflow-hidden">
                    <img src={medal.imageUrl} alt={medal.name} className="w-full h-auto" />
                  </div>
                ) : (
                  <div className="bg-slate-900 rounded-lg p-6">
                    <div className="aspect-square flex items-center justify-center bg-slate-800 rounded-lg">
                      <Award className="w-16 h-16 text-slate-600" />
                    </div>
                    <p className="text-center text-slate-500 text-sm mt-4">No image available</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}