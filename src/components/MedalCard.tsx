import { Medal } from '../App';
import { Eye, Edit2, Trash2, MapPin, Calendar } from 'lucide-react';

interface MedalCardProps {
  medal: Medal;
  onView: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export function MedalCard({ medal, onView, onEdit, onDelete }: MedalCardProps) {
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
            <div className="flex items-center gap-2 text-neutral-600 text-sm">
              <Calendar className="w-4 h-4" />
              <span>{medal.era}</span>
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

        <div className="flex gap-2">
          <button
            onClick={onView}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-neutral-100 hover:bg-neutral-200 text-black rounded-lg transition-colors"
          >
            <Eye className="w-4 h-4" />
            View
          </button>
          <button
            onClick={onEdit}
            className="flex items-center justify-center px-4 py-2 bg-neutral-100 hover:bg-neutral-200 text-black rounded-lg transition-colors"
          >
            <Edit2 className="w-4 h-4" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              if (confirm(`Are you sure you want to delete "${medal.name}"?`)) {
                onDelete();
              }
            }}
            className="flex items-center justify-center px-4 py-2 bg-neutral-100 hover:bg-red-50 text-red-600 rounded-lg transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
