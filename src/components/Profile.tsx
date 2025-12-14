import { useState } from 'react';
import { UserProfile } from '../App';
import { ArrowLeft, Save, User, LogOut, Globe, Eye, EyeOff } from 'lucide-react';

interface ProfileProps {
  profile: UserProfile;
  onUpdate: (profile: UserProfile) => void;
  onBack: () => void;
  onLogout: () => void;
}

export function Profile({ profile, onUpdate, onBack, onLogout }: ProfileProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(profile);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.checked
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdate(formData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData(profile);
    setIsEditing(false);
  };

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6 flex items-center justify-between">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-neutral-600 hover:text-black transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Dashboard
          </button>
          <button
            onClick={onLogout}
            className="flex items-center gap-2 px-4 py-2 bg-neutral-100 hover:bg-neutral-200 text-black rounded-lg transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>

        <div className="bg-white border border-neutral-200 rounded-xl overflow-hidden">
          {/* Header */}
          <div className="bg-black p-6">
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center">
                <User className="w-10 h-10 text-white" />
              </div>
              <div>
                <h1 className="text-white mb-1">{profile.name}</h1>
                <p className="text-white/80">{profile.email}</p>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            {!isEditing ? (
              <div className="space-y-6">
                {/* Privacy Settings */}
                <div className="bg-neutral-50 border border-neutral-200 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Globe className="w-5 h-5 text-black" />
                        <h3 className="text-black">Collection Discoverability</h3>
                      </div>
                      <p className="text-neutral-600 text-sm mb-3">
                        {profile.isDiscoverable 
                          ? 'Your collection is currently visible to other collectors in global search.'
                          : 'Your collection is currently private and not visible in global search.'}
                      </p>
                      <div className="flex items-center gap-2">
                        {profile.isDiscoverable ? (
                          <>
                            <Eye className="w-4 h-4 text-green-600" />
                            <span className="text-green-600">Discoverable</span>
                          </>
                        ) : (
                          <>
                            <EyeOff className="w-4 h-4 text-neutral-500" />
                            <span className="text-neutral-500">Private</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <p className="text-neutral-600 text-sm mb-1">Full Name</p>
                    <p className="text-black">{profile.name || 'Not set'}</p>
                  </div>

                  <div>
                    <p className="text-neutral-600 text-sm mb-1">Email</p>
                    <p className="text-black">{profile.email || 'Not set'}</p>
                  </div>

                  <div>
                    <p className="text-neutral-600 text-sm mb-1">Collecting Since</p>
                    <p className="text-black">{profile.collectorSince || 'Not set'}</p>
                  </div>

                  <div>
                    <p className="text-neutral-600 text-sm mb-1">Location</p>
                    <p className="text-black">{profile.location || 'Not set'}</p>
                  </div>

                  <div className="md:col-span-2">
                    <p className="text-neutral-600 text-sm mb-1">Specialization</p>
                    <p className="text-black">{profile.specialization || 'Not set'}</p>
                  </div>
                </div>

                {profile.bio && (
                  <div>
                    <p className="text-neutral-600 text-sm mb-1">Bio</p>
                    <p className="text-black">{profile.bio}</p>
                  </div>
                )}

                <div className="pt-4">
                  <button
                    onClick={() => setIsEditing(true)}
                    className="px-6 py-3 bg-black hover:bg-neutral-800 text-white rounded-lg transition-colors"
                  >
                    Edit Profile
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Privacy Settings */}
                <div className="bg-neutral-50 border border-neutral-200 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Globe className="w-5 h-5 text-black" />
                    <h3 className="text-black">Privacy Settings</h3>
                  </div>
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      name="isDiscoverable"
                      checked={formData.isDiscoverable || false}
                      onChange={handleCheckboxChange}
                      className="w-5 h-5 mt-0.5 bg-white border-neutral-300 rounded text-black focus:ring-black focus:ring-offset-white"
                    />
                    <div>
                      <p className="text-black mb-1">Make my collection discoverable</p>
                      <p className="text-neutral-600 text-sm">
                        Allow other collectors to find your records in global search and send you contact requests.
                      </p>
                    </div>
                  </label>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="name" className="block text-neutral-700 mb-2">
                      Full Name
                    </label>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 bg-white border border-neutral-300 rounded-lg text-black placeholder-neutral-400 focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-colors"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-neutral-700 mb-2">
                      Email
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 bg-white border border-neutral-300 rounded-lg text-black placeholder-neutral-400 focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-colors"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="collectorSince" className="block text-neutral-700 mb-2">
                      Collecting Since (Year)
                    </label>
                    <input
                      id="collectorSince"
                      name="collectorSince"
                      type="text"
                      value={formData.collectorSince}
                      onChange={handleChange}
                      placeholder="e.g., 2015"
                      className="w-full px-4 py-2.5 bg-white border border-neutral-300 rounded-lg text-black placeholder-neutral-400 focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-colors"
                    />
                  </div>

                  <div>
                    <label htmlFor="location" className="block text-neutral-700 mb-2">
                      Location
                    </label>
                    <input
                      id="location"
                      name="location"
                      type="text"
                      value={formData.location}
                      onChange={handleChange}
                      placeholder="e.g., Washington, D.C."
                      className="w-full px-4 py-2.5 bg-white border border-neutral-300 rounded-lg text-black placeholder-neutral-400 focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-colors"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label htmlFor="specialization" className="block text-neutral-700 mb-2">
                      Specialization
                    </label>
                    <input
                      id="specialization"
                      name="specialization"
                      type="text"
                      value={formData.specialization}
                      onChange={handleChange}
                      placeholder="e.g., WWII Allied Decorations"
                      className="w-full px-4 py-2.5 bg-white border border-neutral-300 rounded-lg text-black placeholder-neutral-400 focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="bio" className="block text-neutral-700 mb-2">
                    Bio
                  </label>
                  <textarea
                    id="bio"
                    name="bio"
                    value={formData.bio}
                    onChange={handleChange}
                    rows={4}
                    className="w-full px-4 py-2.5 bg-white border border-neutral-300 rounded-lg text-black placeholder-neutral-400 focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-colors"
                    placeholder="Tell us about your collecting interests and experience..."
                  />
                </div>

                <div className="flex gap-4 pt-4">
                  <button
                    type="submit"
                    className="flex items-center gap-2 px-6 py-3 bg-black hover:bg-neutral-800 text-white rounded-lg transition-colors"
                  >
                    <Save className="w-5 h-5" />
                    Save Changes
                  </button>
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="px-6 py-3 bg-neutral-100 hover:bg-neutral-200 text-black rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
