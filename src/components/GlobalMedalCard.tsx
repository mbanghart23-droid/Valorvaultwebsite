import { useState } from 'react';
import { Medal } from '../App';
import { Eye, MapPin, Calendar, Mail, User } from 'lucide-react';

interface GlobalMedalCardProps {
  medal: Medal;
  onView: () => void;
  onSendContactRequest: (medalId: string, message: string) => void;
}

export function GlobalMedalCard({ medal, onView, onSendContactRequest }: GlobalMedalCardProps) {
  const [showContactForm, setShowContactForm] = useState(false);
  const [message, setMessage] = useState('');

  const handleSendRequest = () => {
    if (message.trim()) {
      onSendContactRequest(medal.id, message);
      setShowContactForm(false);
      setMessage('');
    }
  };

  return (
    <div className="bg-white border border-neutral-200 rounded-xl overflow-hidden hover:shadow-lg transition-shadow group">
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="text-black mb-3">{medal.name}</h3>
            <div className="flex items-center gap-2 text-neutral-600 text-sm mb-1">
              <MapPin className="w-4 h-4" />
              <span>{medal.country}</span>
            </div>
            <div className="flex items-center gap-2 text-neutral-600 text-sm mb-2">
              <Calendar className="w-4 h-4" />
              <span>{medal.era}</span>
            </div>
            <div className="flex items-center gap-2 text-black text-sm">
              <User className="w-4 h-4" />
              <span>Owner: {medal.ownerName}</span>
            </div>
          </div>
        </div>

        <div className="mb-4">
          <span className="inline-block px-3 py-1 bg-neutral-100 text-neutral-900 rounded-full text-sm">
            {medal.category}
          </span>
        </div>

        <div className="space-y-2 mb-4 text-sm">
          <div className="flex justify-between">
            <span className="text-neutral-600">Branch:</span>
            <span className="text-black">{medal.branch}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-neutral-600">Condition:</span>
            <span className="text-black">{medal.condition}</span>
          </div>
          {medal.recipient && (
            <div className="flex justify-between">
              <span className="text-neutral-600">Recipient:</span>
              <span className="text-black truncate ml-2">{medal.recipient}</span>
            </div>
          )}
        </div>

        {!showContactForm ? (
          <div className="flex gap-2">
            <button
              onClick={onView}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-neutral-100 hover:bg-neutral-200 text-black rounded-lg transition-colors"
            >
              <Eye className="w-4 h-4" />
              View
            </button>
            <button
              onClick={() => setShowContactForm(true)}
              className="flex items-center justify-center gap-2 px-4 py-2 bg-black hover:bg-neutral-800 text-white rounded-lg transition-colors"
            >
              <Mail className="w-4 h-4" />
              <span className="hidden sm:inline">Contact</span>
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Introduce yourself and explain why you're interested in this medal..."
              rows={3}
              className="w-full px-3 py-2 bg-white border border-neutral-300 rounded-lg text-black text-sm placeholder-neutral-400 focus:outline-none focus:border-black focus:ring-1 focus:ring-black"
            />
            <div className="flex gap-2">
              <button
                onClick={handleSendRequest}
                disabled={!message.trim()}
                className="flex-1 px-4 py-2 bg-black hover:bg-neutral-800 disabled:bg-neutral-200 disabled:text-neutral-400 disabled:cursor-not-allowed text-white rounded-lg transition-colors text-sm"
              >
                Send Request
              </button>
              <button
                onClick={() => {
                  setShowContactForm(false);
                  setMessage('');
                }}
                className="px-4 py-2 bg-neutral-100 hover:bg-neutral-200 text-black rounded-lg transition-colors text-sm"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
