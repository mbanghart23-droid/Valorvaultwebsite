import { useState } from 'react';
import { Medal } from '../App';
import { ArrowLeft, Save } from 'lucide-react';

interface MedalFormProps {
  medal?: Medal;
  onSubmit: (medal: Medal | Omit<Medal, 'id'>) => void;
  onCancel: () => void;
}

export function MedalForm({ medal, onSubmit, onCancel }: MedalFormProps) {
  const [formData, setFormData] = useState({
    name: medal?.name || '',
    country: medal?.country || '',
    branch: medal?.branch || '',
    era: medal?.era || '',
    dateAwarded: medal?.dateAwarded || '',
    condition: medal?.condition || '',
    description: medal?.description || '',
    inCollection: medal?.inCollection ?? true,
    imageUrl: medal?.imageUrl || '',
    acquisitionDate: medal?.acquisitionDate || '',
    acquisitionSource: medal?.acquisitionSource || '',
    acquisitionPrice: medal?.acquisitionPrice || '',
    serialNumber: medal?.serialNumber || '',
    category: medal?.category || ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (medal) {
      onSubmit({ ...formData, id: medal.id });
    } else {
      onSubmit(formData);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <button
            onClick={onCancel}
            className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Collection
          </button>
        </div>

        <div className="bg-slate-800 border border-slate-700 rounded-lg p-8">
          <h2 className="text-white mb-6">{medal ? 'Edit Medal' : 'Add New Medal'}</h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div>
              <h3 className="text-white mb-4">Basic Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="name" className="block text-slate-300 mb-2">
                    Medal Name *
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-2 bg-slate-900 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="category" className="block text-slate-300 mb-2">
                    Category *
                  </label>
                  <input
                    id="category"
                    name="category"
                    type="text"
                    value={formData.category}
                    onChange={handleChange}
                    placeholder="e.g., Combat Decoration, Service Medal"
                    className="w-full px-4 py-2 bg-slate-900 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="country" className="block text-slate-300 mb-2">
                    Country *
                  </label>
                  <input
                    id="country"
                    name="country"
                    type="text"
                    value={formData.country}
                    onChange={handleChange}
                    className="w-full px-4 py-2 bg-slate-900 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="branch" className="block text-slate-300 mb-2">
                    Military Branch *
                  </label>
                  <input
                    id="branch"
                    name="branch"
                    type="text"
                    value={formData.branch}
                    onChange={handleChange}
                    placeholder="e.g., Army, Navy, Air Force"
                    className="w-full px-4 py-2 bg-slate-900 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="era" className="block text-slate-300 mb-2">
                    Era/Conflict *
                  </label>
                  <input
                    id="era"
                    name="era"
                    type="text"
                    value={formData.era}
                    onChange={handleChange}
                    placeholder="e.g., World War II, Vietnam War"
                    className="w-full px-4 py-2 bg-slate-900 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="condition" className="block text-slate-300 mb-2">
                    Condition *
                  </label>
                  <select
                    id="condition"
                    name="condition"
                    value={formData.condition}
                    onChange={handleChange}
                    className="w-full px-4 py-2 bg-slate-900 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                    required
                  >
                    <option value="Mint">Mint</option>
                    <option value="Excellent">Excellent</option>
                    <option value="Good">Good</option>
                    <option value="Fair">Fair</option>
                    <option value="Poor">Poor</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Award Details */}
            <div>
              <h3 className="text-white mb-4">Award Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="dateAwarded" className="block text-slate-300 mb-2">
                    Date Awarded
                  </label>
                  <input
                    id="dateAwarded"
                    name="dateAwarded"
                    type="date"
                    value={formData.dateAwarded}
                    onChange={handleChange}
                    className="w-full px-4 py-2 bg-slate-900 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                  />
                </div>

                <div>
                  <label htmlFor="serialNumber" className="block text-slate-300 mb-2">
                    Serial Number
                  </label>
                  <input
                    id="serialNumber"
                    name="serialNumber"
                    type="text"
                    value={formData.serialNumber}
                    onChange={handleChange}
                    className="w-full px-4 py-2 bg-slate-900 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                  />
                </div>
              </div>
            </div>

            {/* Acquisition Information */}
            <div>
              <h3 className="text-white mb-4">Acquisition Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="acquisitionDate" className="block text-slate-300 mb-2">
                    Date Acquired
                  </label>
                  <input
                    id="acquisitionDate"
                    name="acquisitionDate"
                    type="date"
                    value={formData.acquisitionDate}
                    onChange={handleChange}
                    className="w-full px-4 py-2 bg-slate-900 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                  />
                </div>

                <div>
                  <label htmlFor="acquisitionSource" className="block text-slate-300 mb-2">
                    Acquisition Source
                  </label>
                  <input
                    id="acquisitionSource"
                    name="acquisitionSource"
                    type="text"
                    value={formData.acquisitionSource}
                    onChange={handleChange}
                    placeholder="e.g., Auction, Estate Sale, Online"
                    className="w-full px-4 py-2 bg-slate-900 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                  />
                </div>

                <div>
                  <label htmlFor="acquisitionPrice" className="block text-slate-300 mb-2">
                    Acquisition Price
                  </label>
                  <input
                    id="acquisitionPrice"
                    name="acquisitionPrice"
                    type="text"
                    value={formData.acquisitionPrice}
                    onChange={handleChange}
                    placeholder="e.g., $500"
                    className="w-full px-4 py-2 bg-slate-900 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                  />
                </div>

                <div>
                  <label htmlFor="imageUrl" className="block text-slate-300 mb-2">
                    Image URL
                  </label>
                  <input
                    id="imageUrl"
                    name="imageUrl"
                    type="url"
                    value={formData.imageUrl}
                    onChange={handleChange}
                    placeholder="https://..."
                    className="w-full px-4 py-2 bg-slate-900 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                  />
                </div>
              </div>
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-slate-300 mb-2">
                Description *
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                className="w-full px-4 py-2 bg-slate-900 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                placeholder="Describe the medal, its history, condition details, or any special notes..."
                required
              />
            </div>

            {/* Submit Buttons */}
            <div className="flex gap-4 pt-4">
              <button
                type="submit"
                className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-amber-600 hover:bg-amber-700 text-white rounded-lg transition-colors"
              >
                <Save className="w-5 h-5" />
                {medal ? 'Update Medal' : 'Add Medal'}
              </button>
              <button
                type="button"
                onClick={onCancel}
                className="px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}