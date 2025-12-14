import { useState } from 'react';
import { Person } from '../App';
import { ArrowLeft, Edit2, Trash2, Calendar, MapPin, Award, User, Mail, CheckCircle, XCircle, Hash, DollarSign, Package, FileText, Image as ImageIcon } from 'lucide-react';

interface PersonDetailProps {
  person: Person;
  onBack: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  onContactOwner?: (personId: string, message: string) => void;
}

export function PersonDetail({ person, onBack, onEdit, onDelete, onContactOwner }: PersonDetailProps) {
  const [showContactForm, setShowContactForm] = useState(false);
  const [message, setMessage] = useState('');

  const handleDelete = () => {
    if (onDelete && confirm(`Are you sure you want to delete "${person.name}"?`)) {
      onDelete();
    }
  };

  const handleSendRequest = () => {
    if (onContactOwner && message.trim()) {
      onContactOwner(person.id, message);
      setShowContactForm(false);
      setMessage('');
    }
  };

  const isOwnPerson = onEdit !== undefined;
  const medalsInCollection = person.medals.filter(m => m.inCollection);
  const medalsNotInCollection = person.medals.filter(m => !m.inCollection);

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-neutral-600 hover:text-black transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Collection
          </button>
        </div>

        <div className="bg-white border border-neutral-200 rounded-xl overflow-hidden">
          {/* Header */}
          <div className="bg-black p-6">
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-white mb-2">{person.name}</h1>
                {person.rank && (
                  <p className="text-white/80 mb-3">{person.rank}, {person.branch}</p>
                )}
                <div className="flex flex-wrap gap-2">
                  <span className="inline-block px-3 py-1 bg-white/20 text-white rounded-full text-sm">
                    {person.country}
                  </span>
                  <span className="inline-block px-3 py-1 bg-white/20 text-white rounded-full text-sm">
                    {person.era}
                  </span>
                </div>
                {!isOwnPerson && person.ownerName && (
                  <div className="flex items-center gap-2 text-white/90 mt-3">
                    <User className="w-4 h-4" />
                    <span>Collection Owner: {person.ownerName}</span>
                  </div>
                )}
              </div>
              <div className="flex gap-2">
                {isOwnPerson ? (
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
          {showContactForm && !isOwnPerson && (
            <div className="bg-neutral-50 border-b border-neutral-200 p-6">
              <h3 className="text-black mb-3">Send Contact Request</h3>
              <p className="text-neutral-600 text-sm mb-4">
                Introduce yourself and explain your interest in this service member's record. The owner will decide whether to share their contact information.
              </p>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Example: I noticed you have records for Sgt. James Mitchell from the 29th Infantry Division. I'm researching soldiers from that unit and would love to discuss your collection."
                rows={4}
                className="w-full px-4 py-3 bg-white border border-neutral-300 rounded-lg text-black placeholder-neutral-400 focus:outline-none focus:border-black focus:ring-1 focus:ring-black mb-4"
              />
              <div className="flex gap-3">
                <button
                  onClick={handleSendRequest}
                  disabled={!message.trim()}
                  className="px-6 py-2 bg-black hover:bg-neutral-800 disabled:bg-neutral-200 disabled:text-neutral-400 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
                >
                  Send Request
                </button>
                <button
                  onClick={() => {
                    setShowContactForm(false);
                    setMessage('');
                  }}
                  className="px-6 py-2 bg-neutral-100 hover:bg-neutral-200 text-black rounded-lg transition-colors"
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
                {/* Service Details */}
                <div>
                  <h3 className="text-black mb-4">Service Details</h3>
                  <div className="grid grid-cols-2 gap-4">
                    {person.serviceNumber && (
                      <div>
                        <p className="text-neutral-600 text-sm mb-1">Service Number</p>
                        <p className="text-black">{person.serviceNumber}</p>
                      </div>
                    )}
                    {person.unit && (
                      <div>
                        <p className="text-neutral-600 text-sm mb-1">Unit</p>
                        <p className="text-black">{person.unit}</p>
                      </div>
                    )}
                    <div>
                      <p className="text-neutral-600 text-sm mb-1">Branch</p>
                      <p className="text-black">{person.branch}</p>
                    </div>
                    <div>
                      <p className="text-neutral-600 text-sm mb-1">Country</p>
                      <p className="text-black">{person.country}</p>
                    </div>
                    <div>
                      <p className="text-neutral-600 text-sm mb-1">Era/Conflict</p>
                      <p className="text-black">{person.era}</p>
                    </div>
                  </div>
                </div>

                {/* Personal Details */}
                {(person.dateOfBirth || person.dateOfDeath || person.placeOfBirth) && (
                  <div>
                    <h3 className="text-black mb-4">Personal Details</h3>
                    <div className="grid grid-cols-2 gap-4">
                      {person.dateOfBirth && (
                        <div>
                          <p className="text-neutral-600 text-sm mb-1">Date of Birth</p>
                          <p className="text-black">{new Date(person.dateOfBirth).toLocaleDateString()}</p>
                        </div>
                      )}
                      {person.dateOfDeath && (
                        <div>
                          <p className="text-neutral-600 text-sm mb-1">Date of Death</p>
                          <p className="text-black">{new Date(person.dateOfDeath).toLocaleDateString()}</p>
                        </div>
                      )}
                      {person.placeOfBirth && (
                        <div className="col-span-2">
                          <p className="text-neutral-600 text-sm mb-1">Place of Birth</p>
                          <p className="text-black">{person.placeOfBirth}</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Biography */}
                {person.biography && (
                  <div>
                    <h3 className="text-black mb-4">Biography</h3>
                    <p className="text-neutral-700 leading-relaxed">{person.biography}</p>
                  </div>
                )}

                {/* Medals In Collection */}
                {medalsInCollection.length > 0 && (
                  <div>
                    <div className="flex items-center gap-2 mb-4">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      <h3 className="text-black">Medals in Collection ({medalsInCollection.length})</h3>
                    </div>
                    <div className="space-y-4">
                      {medalsInCollection.map(medal => (
                        <div key={medal.id} className="bg-green-50 border border-green-200 rounded-lg p-4">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <h4 className="text-black mb-1">{medal.name}</h4>
                              <p className="text-neutral-600 text-sm">{medal.category}</p>
                            </div>
                            {medal.dateAwarded && (
                              <span className="text-neutral-500 text-sm">
                                {new Date(medal.dateAwarded).toLocaleDateString()}
                              </span>
                            )}
                          </div>
                          
                          {medal.description && (
                            <p className="text-neutral-700 text-sm mb-3">{medal.description}</p>
                          )}

                          <div className="grid grid-cols-2 gap-3 text-sm">
                            {medal.condition && (
                              <div className="flex items-center gap-2">
                                <span className="text-neutral-600">Condition:</span>
                                <span className="text-black">{medal.condition}</span>
                              </div>
                            )}
                            {medal.estimatedValue && (
                              <div className="flex items-center gap-2">
                                <DollarSign className="w-4 h-4 text-neutral-600" />
                                <span className="text-black">{medal.estimatedValue}</span>
                              </div>
                            )}
                            {medal.acquisitionSource && (
                              <div className="flex items-center gap-2">
                                <Package className="w-4 h-4 text-neutral-600" />
                                <span className="text-black">{medal.acquisitionSource}</span>
                              </div>
                            )}
                            {medal.serialNumber && (
                              <div className="flex items-center gap-2">
                                <Hash className="w-4 h-4 text-neutral-600" />
                                <span className="text-black">{medal.serialNumber}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Medals Not in Collection */}
                {medalsNotInCollection.length > 0 && (
                  <div>
                    <div className="flex items-center gap-2 mb-4">
                      <XCircle className="w-5 h-5 text-neutral-500" />
                      <h3 className="text-black">Entitled Medals Not in Collection ({medalsNotInCollection.length})</h3>
                    </div>
                    <div className="space-y-3">
                      {medalsNotInCollection.map(medal => (
                        <div key={medal.id} className="bg-neutral-50 border border-neutral-200 rounded-lg p-4">
                          <div className="flex items-start justify-between">
                            <div>
                              <h4 className="text-black mb-1">{medal.name}</h4>
                              <p className="text-neutral-600 text-sm">{medal.category}</p>
                            </div>
                            {medal.dateAwarded && (
                              <span className="text-neutral-500 text-sm">
                                {new Date(medal.dateAwarded).toLocaleDateString()}
                              </span>
                            )}
                          </div>
                          {medal.description && (
                            <p className="text-neutral-700 text-sm mt-2">{medal.description}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Images */}
                {person.images && person.images.length > 0 && (
                  <div className="bg-neutral-50 border border-neutral-200 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-4">
                      <ImageIcon className="w-4 h-4 text-black" />
                      <h4 className="text-black">Images</h4>
                    </div>
                    <div className="space-y-3">
                      {person.images.map((image, index) => (
                        <img
                          key={index}
                          src={image}
                          alt={`${person.name} - ${index + 1}`}
                          className="w-full rounded-lg object-cover"
                        />
                      ))}
                    </div>
                  </div>
                )}

                {/* Notes */}
                {person.notes && (
                  <div className="bg-neutral-50 border border-neutral-200 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-4">
                      <FileText className="w-4 h-4 text-black" />
                      <h4 className="text-black">Notes</h4>
                    </div>
                    <p className="text-neutral-700 text-sm leading-relaxed">{person.notes}</p>
                  </div>
                )}

                <div className="bg-neutral-50 border border-neutral-200 rounded-lg p-4">
                  <h4 className="text-black mb-4">Collection Summary</h4>
                  <div className="space-y-3">
                    <div>
                      <p className="text-neutral-600 text-sm mb-1">Total Medals</p>
                      <p className="text-black text-xl">{person.medals.length}</p>
                    </div>
                    <div>
                      <p className="text-green-600 text-sm mb-1">In Collection</p>
                      <p className="text-green-600 text-xl">{medalsInCollection.length}</p>
                    </div>
                    {medalsNotInCollection.length > 0 && (
                      <div>
                        <p className="text-neutral-500 text-sm mb-1">Not in Collection</p>
                        <p className="text-neutral-500 text-xl">{medalsNotInCollection.length}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}