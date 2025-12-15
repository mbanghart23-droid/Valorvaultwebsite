import { Person } from '../App';
import { Eye, Edit2, Trash2, MapPin, Calendar, Award, CheckCircle, XCircle, User } from 'lucide-react';
import { useState } from 'react';

interface PersonCardProps {
  person: Person;
  isOwn?: boolean;
  onView: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export function PersonCard({ person, isOwn = true, onView, onEdit, onDelete }: PersonCardProps) {
  const [imageError, setImageError] = useState(false);
  const medalsInCollection = person.medals.filter(m => m.inCollection).length;
  const totalMedals = person.medals.length;

  return (
    <div className={`bg-white border-2 rounded-xl overflow-hidden hover:shadow-lg transition-shadow group ${
      isOwn ? 'border-black' : 'border-blue-500'
    }`}>
      <div className="p-6">
        <div className="flex items-start gap-4 mb-4">
          {person.profileImage && !imageError ? (
            <img
              src={person.profileImage}
              alt={person.name}
              className="w-16 h-16 rounded-full object-cover border-2 border-neutral-200"
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="w-16 h-16 rounded-full bg-neutral-100 flex items-center justify-center border-2 border-neutral-200">
              <User className="w-8 h-8 text-neutral-400" />
            </div>
          )}
          <div className="flex-1">
            <h3 className="text-black mb-1">{person.name}</h3>
            {person.rank && person.rank.length > 0 && (
              <p className="text-neutral-600 text-sm mb-2">{person.rank.join(', ')}{person.branch ? `, ${person.branch}` : ''}</p>
            )}
            {person.country && person.country.length > 0 && (
              <div className="flex items-center gap-2 text-neutral-600 text-sm mb-1">
                <MapPin className="w-4 h-4" />
                <span>{person.country.join(', ')}</span>
              </div>
            )}
            {person.era && person.era.length > 0 && (
              <div className="flex items-center gap-2 text-neutral-600 text-sm">
                <Calendar className="w-4 h-4" />
                <span>{person.era.join(', ')}</span>
              </div>
            )}
          </div>
        </div>

        {person.unit && person.unit.length > 0 && (
          <div className="mb-4 flex flex-wrap gap-2">
            {person.unit.map((u, i) => (
              <span key={i} className="inline-block px-3 py-1 bg-neutral-100 text-neutral-900 rounded-full text-sm">
                {u}
              </span>
            ))}
          </div>
        )}

        <div className="space-y-2 mb-4">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2 text-neutral-600">
              <Award className="w-4 h-4" />
              <span>Total Medals:</span>
            </div>
            <span className="text-black">{totalMedals}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2 text-green-600">
              <CheckCircle className="w-4 h-4" />
              <span>In Collection:</span>
            </div>
            <span className="text-green-600">{medalsInCollection}</span>
          </div>
          {totalMedals > medalsInCollection && (
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2 text-neutral-500">
                <XCircle className="w-4 h-4" />
                <span>Missing:</span>
              </div>
              <span className="text-neutral-500">{totalMedals - medalsInCollection}</span>
            </div>
          )}
        </div>

        <div className="flex gap-2">
          <button
            onClick={onView}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-neutral-100 hover:bg-neutral-200 active:bg-neutral-300 text-black rounded-lg transition-colors"
          >
            <Eye className="w-4 h-4" />
            View
          </button>
          <button
            onClick={onEdit}
            className="flex items-center justify-center px-4 py-2 bg-neutral-100 hover:bg-neutral-200 active:bg-neutral-300 text-black rounded-lg transition-colors"
          >
            <Edit2 className="w-4 h-4" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              if (confirm(`Are you sure you want to delete "${person.name}"?`)) {
                onDelete();
              }
            }}
            className="flex items-center justify-center px-4 py-2 bg-neutral-100 hover:bg-red-50 active:bg-red-100 text-red-600 rounded-lg transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}