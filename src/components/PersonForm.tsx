import { useState } from 'react';
import { Person, PersonMedal } from '../App';
import { ArrowLeft, Save, Plus, Edit, Trash2, Award, X, Upload, AlertCircle, CheckCircle, XCircle } from 'lucide-react';
import { ComboBox } from './ComboBox';

interface PersonFormProps {
  person?: Person;
  onSubmit: (person: any) => void;
  onCancel: () => void;
}

const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB
const MAX_IMAGES = 2;

// Mock existing values for autocomplete (in production, these would come from database)
const existingBranches = ['Army', 'Navy', 'Air Force', 'Marines', 'Coast Guard', 'U.S. Army', 'USAF'];
const existingCountries = ['United States', 'United Kingdom', 'Germany', 'France', 'Canada', 'USA', 'Australia'];
const existingEras = ['World War II', 'Vietnam War', 'Korean War', 'Iraq War', 'Afghanistan War', 'WW2', 'WWII', 'Gulf War', 'Cold War'];
const existingCategories = ['Combat Decoration', 'Valor Decoration', 'Service Medal', 'Campaign Medal', 'Commemorative Medal', 'Other'];

export function PersonForm({ person, onSubmit, onCancel }: PersonFormProps) {
  const [formData, setFormData] = useState({
    name: person?.name || '',
    rank: person?.rank || [] as string[],
    serviceNumber: person?.serviceNumber || '',
    branch: person?.branch || '',
    country: person?.country || [] as string[],
    era: person?.era || [] as string[],
    dateOfBirth: person?.dateOfBirth || '',
    dateOfDeath: person?.dateOfDeath || '',
    placeOfBirth: person?.placeOfBirth || '',
    unit: person?.unit || [] as string[],
    biography: person?.biography || '',
    notes: person?.notes || '',
    images: person?.images || [] as string[],
    profileImage: person?.profileImage || '',
    medals: person?.medals || [] as PersonMedal[]
  });

  const [showMedalForm, setShowMedalForm] = useState(false);
  const [editingMedalIndex, setEditingMedalIndex] = useState<number | null>(null);
  const [medalFormData, setMedalFormData] = useState<Partial<PersonMedal>>({
    name: '',
    country: '',
    branch: '',
    era: '',
    category: '',
    inCollection: false,
    clasps: []
  });
  const [claspInput, setClaspInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // State for adding new array items
  const [rankInput, setRankInput] = useState('');
  const [unitInput, setUnitInput] = useState('');
  const [eraInput, setEraInput] = useState('');
  const [countryInput, setCountryInput] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];

    // Check file size
    if (file.size > MAX_IMAGE_SIZE) {
      alert(`Image size must be less than ${MAX_IMAGE_SIZE / 1024 / 1024}MB`);
      return;
    }

    // Check max images
    if (formData.images.length >= MAX_IMAGES) {
      alert(`Maximum ${MAX_IMAGES} images allowed`);
      return;
    }

    // Convert to base64 for mockup purposes
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      setFormData({
        ...formData,
        images: [...formData.images, base64String]
      });
    };
    reader.readAsDataURL(file);

    // Reset input
    e.target.value = '';
  };

  const handleRemoveImage = (index: number) => {
    setFormData({
      ...formData,
      images: formData.images.filter((_, i) => i !== index)
    });
  };

  const handleProfileImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];

    // Check file size
    if (file.size > MAX_IMAGE_SIZE) {
      alert(`Image size must be less than ${MAX_IMAGE_SIZE / 1024 / 1024}MB`);
      return;
    }

    // Convert to base64
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      setFormData({
        ...formData,
        profileImage: base64String
      });
    };
    reader.readAsDataURL(file);

    // Reset input
    e.target.value = '';
  };

  const handleRemoveProfileImage = () => {
    setFormData({
      ...formData,
      profileImage: ''
    });
  };

  const handleMedalChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const value = e.target.type === 'checkbox' ? (e.target as HTMLInputElement).checked : e.target.value;
    setMedalFormData({
      ...medalFormData,
      [e.target.name]: value
    });
  };

  const handleAddMedal = () => {
    // Validate required fields
    const errors: string[] = [];
    
    if (!medalFormData.name || medalFormData.name.trim() === '') {
      errors.push('Medal name is required');
    }
    
    if (!medalFormData.category || medalFormData.category.trim() === '') {
      errors.push('Category is required');
    }
    
    if (errors.length > 0) {
      alert(`Please fix the following errors:\n\n${errors.join('\n')}`);
      return;
    }
    
    const newMedal: PersonMedal = {
      id: `m${Date.now()}`,
      name: medalFormData.name,
      country: medalFormData.country || (Array.isArray(formData.country) ? formData.country.join(', ') : ''),
      branch: medalFormData.branch || formData.branch,
      era: medalFormData.era || (Array.isArray(formData.era) ? formData.era.join(', ') : ''),
      category: medalFormData.category,
      inCollection: medalFormData.inCollection || false,
      dateAwarded: medalFormData.dateAwarded,
      condition: medalFormData.condition,
      description: medalFormData.description,
      acquisitionDate: medalFormData.acquisitionDate,
      acquisitionSource: medalFormData.acquisitionSource,
      estimatedValue: medalFormData.estimatedValue,
      serialNumber: medalFormData.serialNumber,
      medalNumber: medalFormData.medalNumber,
      isNamed: medalFormData.isNamed,
      clasps: medalFormData.clasps || []
    };

    if (editingMedalIndex !== null) {
      const updatedMedals = [...formData.medals];
      updatedMedals[editingMedalIndex] = newMedal;
      setFormData({ ...formData, medals: updatedMedals });
      setEditingMedalIndex(null);
    } else {
      setFormData({ ...formData, medals: [...formData.medals, newMedal] });
    }

    setMedalFormData({
      name: '',
      country: '',
      branch: '',
      era: '',
      category: '',
      inCollection: false,
      clasps: []
    });
    setClaspInput('');
    setShowMedalForm(false);
  };

  const handleEditMedal = (index: number) => {
    const medal = formData.medals[index];
    setMedalFormData(medal);
    setEditingMedalIndex(index);
    setShowMedalForm(true);
  };

  const handleDeleteMedal = (index: number) => {
    setFormData({
      ...formData,
      medals: formData.medals.filter((_, i) => i !== index)
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    if (person) {
      onSubmit({ ...person, ...formData });
    } else {
      onSubmit(formData);
    }
    setIsSubmitting(false);
  };

  // Prevent Enter key from submitting the form (except on buttons)
  const handleKeyDown = (e: React.KeyboardEvent<HTMLFormElement>) => {
    if (e.key === 'Enter' && (e.target as HTMLElement).tagName !== 'BUTTON') {
      e.preventDefault();
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <button
            onClick={onCancel}
            className="flex items-center gap-2 text-neutral-600 hover:text-black transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Collection
          </button>
        </div>

        <div className="bg-white border border-neutral-200 rounded-xl p-8">
          <h2 className="text-black mb-6">{person ? 'Edit Service Member' : 'Add Service Member'}</h2>
          
          <form onSubmit={handleSubmit} onKeyDown={handleKeyDown} className="space-y-6">
            {/* Personal Information */}
            <div>
              <h3 className="text-black mb-4">Personal Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label htmlFor="name" className="block text-neutral-700 mb-2">
                    Full Name *
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 bg-white border border-neutral-300 rounded-lg text-black placeholder-neutral-400 focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-colors"
                    placeholder="e.g., Sgt. James Mitchell"
                    required
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-neutral-700 mb-2">
                    Profile Photo
                  </label>
                  {formData.profileImage ? (
                    <div className="flex items-center gap-4">
                      <img
                        src={formData.profileImage}
                        alt="Profile"
                        className="w-24 h-24 rounded-full object-cover border-2 border-neutral-200"
                      />
                      <button
                        type="button"
                        onClick={handleRemoveProfileImage}
                        className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 border border-red-200 rounded-lg transition-colors"
                      >
                        <X className="w-4 h-4" />
                        Remove Photo
                      </button>
                    </div>
                  ) : (
                    <div>
                      <input
                        type="file"
                        id="profileImage"
                        accept="image/*"
                        onChange={handleProfileImageUpload}
                        className="hidden"
                      />
                      <label
                        htmlFor="profileImage"
                        className="inline-flex items-center gap-2 px-4 py-2.5 bg-white border border-neutral-300 rounded-lg text-neutral-700 hover:bg-neutral-50 cursor-pointer transition-colors"
                      >
                        <Upload className="w-4 h-4" />
                        Upload Photo
                      </label>
                      <p className="text-neutral-500 text-sm mt-2">
                        Optional. Max 5MB. JPG, PNG, or GIF.
                      </p>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-neutral-700 mb-2">
                    Rank
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={rankInput}
                      onChange={(e) => setRankInput(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          if (rankInput.trim()) {
                            setFormData({
                              ...formData,
                              rank: [...formData.rank, rankInput.trim()]
                            });
                            setRankInput('');
                          }
                        }
                      }}
                      placeholder="e.g., Sergeant"
                      className="flex-1 px-4 py-2.5 bg-white border border-neutral-300 rounded-lg text-black placeholder-neutral-400 focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-colors"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        if (rankInput.trim()) {
                          setFormData({
                            ...formData,
                            rank: [...formData.rank, rankInput.trim()]
                          });
                          setRankInput('');
                        }
                      }}
                      className="px-4 py-2.5 bg-black hover:bg-neutral-800 text-white rounded-lg transition-colors"
                    >
                      Add Rank
                    </button>
                  </div>
                  {formData.rank && formData.rank.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {formData.rank.map((rank, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center gap-1 px-3 py-1 bg-neutral-100 text-black rounded-full text-sm"
                        >
                          {rank}
                          <button
                            type="button"
                            onClick={() => {
                              setFormData({
                                ...formData,
                                rank: formData.rank?.filter((_, i) => i !== index)
                              });
                            }}
                            className="ml-1 text-neutral-500 hover:text-black"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div>
                  <label htmlFor="serviceNumber" className="block text-neutral-700 mb-2">
                    Service Number
                  </label>
                  <input
                    id="serviceNumber"
                    name="serviceNumber"
                    type="text"
                    value={formData.serviceNumber}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 bg-white border border-neutral-300 rounded-lg text-black placeholder-neutral-400 focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-colors"
                    placeholder="e.g., 12345678"
                  />
                </div>

                <div>
                  <ComboBox
                    name="branch"
                    value={formData.branch}
                    onChange={(value) => setFormData({ ...formData, branch: value })}
                    options={existingBranches}
                    label="Branch of Service"
                    placeholder="e.g., Army"
                  />
                </div>

                <div>
                  <label className="block text-neutral-700 mb-2">
                    Country
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={countryInput}
                      onChange={(e) => setCountryInput(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          if (countryInput.trim()) {
                            setFormData({
                              ...formData,
                              country: [...formData.country, countryInput.trim()]
                            });
                            setCountryInput('');
                          }
                        }
                      }}
                      placeholder="e.g., United States"
                      className="flex-1 px-4 py-2.5 bg-white border border-neutral-300 rounded-lg text-black placeholder-neutral-400 focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-colors"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        if (countryInput.trim()) {
                          setFormData({
                            ...formData,
                            country: [...formData.country, countryInput.trim()]
                          });
                          setCountryInput('');
                        }
                      }}
                      className="px-4 py-2.5 bg-black hover:bg-neutral-800 text-white rounded-lg transition-colors"
                    >
                      Add Country
                    </button>
                  </div>
                  {formData.country && formData.country.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {formData.country.map((country, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center gap-1 px-3 py-1 bg-neutral-100 text-black rounded-full text-sm"
                        >
                          {country}
                          <button
                            type="button"
                            onClick={() => {
                              setFormData({
                                ...formData,
                                country: formData.country?.filter((_, i) => i !== index)
                              });
                            }}
                            className="ml-1 text-neutral-500 hover:text-black"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-neutral-700 mb-2">
                    Era/Conflict
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={eraInput}
                      onChange={(e) => setEraInput(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          if (eraInput.trim()) {
                            setFormData({
                              ...formData,
                              era: [...formData.era, eraInput.trim()]
                            });
                            setEraInput('');
                          }
                        }
                      }}
                      placeholder="e.g., World War II"
                      className="flex-1 px-4 py-2.5 bg-white border border-neutral-300 rounded-lg text-black placeholder-neutral-400 focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-colors"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        if (eraInput.trim()) {
                          setFormData({
                            ...formData,
                            era: [...formData.era, eraInput.trim()]
                          });
                          setEraInput('');
                        }
                      }}
                      className="px-4 py-2.5 bg-black hover:bg-neutral-800 text-white rounded-lg transition-colors"
                    >
                      Add Era
                    </button>
                  </div>
                  {formData.era && formData.era.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {formData.era.map((era, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center gap-1 px-3 py-1 bg-neutral-100 text-black rounded-full text-sm"
                        >
                          {era}
                          <button
                            type="button"
                            onClick={() => {
                              setFormData({
                                ...formData,
                                era: formData.era?.filter((_, i) => i !== index)
                              });
                            }}
                            className="ml-1 text-neutral-500 hover:text-black"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-neutral-700 mb-2">
                    Unit/Division
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={unitInput}
                      onChange={(e) => setUnitInput(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          if (unitInput.trim()) {
                            setFormData({
                              ...formData,
                              unit: [...formData.unit, unitInput.trim()]
                            });
                            setUnitInput('');
                          }
                        }
                      }}
                      placeholder="e.g., 29th Infantry Division"
                      className="flex-1 px-4 py-2.5 bg-white border border-neutral-300 rounded-lg text-black placeholder-neutral-400 focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-colors"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        if (unitInput.trim()) {
                          setFormData({
                            ...formData,
                            unit: [...formData.unit, unitInput.trim()]
                          });
                          setUnitInput('');
                        }
                      }}
                      className="px-4 py-2.5 bg-black hover:bg-neutral-800 text-white rounded-lg transition-colors"
                    >
                      Add Unit
                    </button>
                  </div>
                  {formData.unit && formData.unit.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {formData.unit.map((unit, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center gap-1 px-3 py-1 bg-neutral-100 text-black rounded-full text-sm"
                        >
                          {unit}
                          <button
                            type="button"
                            onClick={() => {
                              setFormData({
                                ...formData,
                                unit: formData.unit?.filter((_, i) => i !== index)
                              });
                            }}
                            className="ml-1 text-neutral-500 hover:text-black"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div>
                  <label htmlFor="dateOfBirth" className="block text-neutral-700 mb-2">
                    Date of Birth
                  </label>
                  <input
                    id="dateOfBirth"
                    name="dateOfBirth"
                    type="date"
                    value={formData.dateOfBirth}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 bg-white border border-neutral-300 rounded-lg text-black placeholder-neutral-400 focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-colors"
                  />
                </div>

                <div>
                  <label htmlFor="dateOfDeath" className="block text-neutral-700 mb-2">
                    Date of Death
                  </label>
                  <input
                    id="dateOfDeath"
                    name="dateOfDeath"
                    type="date"
                    value={formData.dateOfDeath}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 bg-white border border-neutral-300 rounded-lg text-black placeholder-neutral-400 focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-colors"
                  />
                </div>

                <div>
                  <label htmlFor="placeOfBirth" className="block text-neutral-700 mb-2">
                    Place of Birth
                  </label>
                  <input
                    id="placeOfBirth"
                    name="placeOfBirth"
                    type="text"
                    value={formData.placeOfBirth}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 bg-white border border-neutral-300 rounded-lg text-black placeholder-neutral-400 focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-colors"
                    placeholder="e.g., New York, NY"
                  />
                </div>

                <div className="md:col-span-2">
                  <label htmlFor="biography" className="block text-neutral-700 mb-2">
                    Biography
                  </label>
                  <textarea
                    id="biography"
                    name="biography"
                    value={formData.biography}
                    onChange={handleChange}
                    rows={4}
                    className="w-full px-4 py-2.5 bg-white border border-neutral-300 rounded-lg text-black placeholder-neutral-400 focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-colors"
                    placeholder="Describe their service history and notable achievements..."
                  />
                </div>

                <div className="md:col-span-2">
                  <label htmlFor="notes" className="block text-neutral-700 mb-2">
                    Notes
                  </label>
                  <textarea
                    id="notes"
                    name="notes"
                    value={formData.notes}
                    onChange={handleChange}
                    rows={4}
                    className="w-full px-4 py-2.5 bg-white border border-neutral-300 rounded-lg text-black placeholder-neutral-400 focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-colors"
                    placeholder="Any additional notes or information..."
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-neutral-700 mb-2">
                    Images
                  </label>
                  <div className="flex items-center gap-4">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      id="imageUpload"
                    />
                    <label
                      htmlFor="imageUpload"
                      className="flex items-center gap-2 px-4 py-2 bg-black hover:bg-neutral-800 text-white rounded-lg transition-colors text-sm"
                    >
                      <Upload className="w-4 h-4" />
                      Upload Image
                    </label>
                  </div>
                  {formData.images.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                      {formData.images.map((image, index) => (
                        <div key={index} className="relative">
                          <img
                            src={image}
                            alt={`Uploaded ${index + 1}`}
                            className="w-full h-40 object-cover rounded-lg"
                          />
                          <button
                            type="button"
                            onClick={() => handleRemoveImage(index)}
                            className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 transition-colors"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Medals Section */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-black">Medals & Decorations</h3>
                <button
                  type="button"
                  onClick={() => {
                    setMedalFormData({
                      name: '',
                      country: formData.country,
                      branch: formData.branch,
                      era: formData.era,
                      category: '',
                      inCollection: false,
                      clasps: []
                    });
                    setEditingMedalIndex(null);
                    setShowMedalForm(true);
                  }}
                  className="flex items-center gap-2 px-4 py-2 bg-black hover:bg-neutral-800 text-white rounded-lg transition-colors text-sm"
                >
                  <Plus className="w-4 h-4" />
                  Add Medal
                </button>
              </div>

              {/* Medal List */}
              {formData.medals.length > 0 && (
                <div className="space-y-3 mb-4">
                  {formData.medals.map((medal, index) => (
                    <div key={medal.id} className="bg-neutral-50 border border-neutral-200 rounded-lg p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="text-black">{medal.name}</h4>
                            {medal.inCollection ? (
                              <CheckCircle className="w-4 h-4 text-green-600" title="In Collection" />
                            ) : (
                              <XCircle className="w-4 h-4 text-neutral-400" title="Not in Collection" />
                            )}
                          </div>
                          <p className="text-neutral-600 text-sm">{medal.category}</p>
                          {medal.dateAwarded && (
                            <p className="text-neutral-500 text-xs mt-1">Awarded: {medal.dateAwarded}</p>
                          )}
                        </div>
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() => handleEditMedal(index)}
                            className="px-3 py-1 bg-neutral-100 hover:bg-neutral-200 text-black rounded text-sm transition-colors"
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteMedal(index)}
                            className="px-3 py-1 bg-red-50 hover:bg-red-100 text-red-600 rounded text-sm transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Medal Form */}
              {showMedalForm && (
                <div className="bg-neutral-50 border border-neutral-300 rounded-lg p-6 mb-4">
                  <h4 className="text-black mb-4">{editingMedalIndex !== null ? 'Edit Medal' : 'Add New Medal'}</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <label className="block text-neutral-700 mb-2">
                        Medal Name *
                      </label>
                      <input
                        name="name"
                        type="text"
                        value={medalFormData.name}
                        onChange={handleMedalChange}
                        className="w-full px-4 py-2.5 bg-white border border-neutral-300 rounded-lg text-black placeholder-neutral-400 focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-colors"
                        placeholder="e.g., Purple Heart"
                      />
                    </div>

                    <div>
                      <label className="block text-neutral-700 mb-2">
                        Category *
                      </label>
                      <select
                        name="category"
                        value={medalFormData.category}
                        onChange={handleMedalChange}
                        className="w-full px-4 py-2.5 bg-white border border-neutral-300 rounded-lg text-black focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-colors"
                      >
                        <option value="">Select Category</option>
                        {existingCategories.map(category => (
                          <option key={category} value={category}>{category}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-neutral-700 mb-2">
                        Date Awarded
                      </label>
                      <input
                        name="dateAwarded"
                        type="date"
                        value={medalFormData.dateAwarded || ''}
                        onChange={handleMedalChange}
                        className="w-full px-4 py-2.5 bg-white border border-neutral-300 rounded-lg text-black placeholder-neutral-400 focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-colors"
                      />
                    </div>

                    {/* Clasps Section */}
                    <div className="md:col-span-2">
                      <label className="block text-neutral-700 mb-2">
                        Clasps
                      </label>
                      <div className="flex gap-2 mb-2">
                        <input
                          type="text"
                          value={claspInput}
                          onChange={(e) => setClaspInput(e.target.value)}
                          onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              if (claspInput.trim()) {
                                setMedalFormData({
                                  ...medalFormData,
                                  clasps: [...(medalFormData.clasps || []), claspInput.trim()]
                                });
                                setClaspInput('');
                              }
                            }
                          }}
                          placeholder="e.g., 1939-1945, Burma, Atlantic"
                          className="flex-1 px-4 py-2.5 bg-white border border-neutral-300 rounded-lg text-black placeholder-neutral-400 focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-colors"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            if (claspInput.trim()) {
                              setMedalFormData({
                                ...medalFormData,
                                clasps: [...(medalFormData.clasps || []), claspInput.trim()]
                              });
                              setClaspInput('');
                            }
                          }}
                          className="px-4 py-2.5 bg-black hover:bg-neutral-800 text-white rounded-lg transition-colors"
                        >
                          Add Clasp
                        </button>
                      </div>
                      {medalFormData.clasps && medalFormData.clasps.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {medalFormData.clasps.map((clasp, index) => (
                            <span
                              key={index}
                              className="inline-flex items-center gap-1 px-3 py-1 bg-neutral-100 text-black rounded-full text-sm"
                            >
                              {clasp}
                              <button
                                type="button"
                                onClick={() => {
                                  setMedalFormData({
                                    ...medalFormData,
                                    clasps: medalFormData.clasps?.filter((_, i) => i !== index)
                                  });
                                }}
                                className="ml-1 text-neutral-500 hover:text-black"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            </span>
                          ))}
                        </div>
                      )}
                      <p className="text-neutral-500 text-sm mt-2">
                        Some medals have clasps (also called bars) that are awarded for specific campaigns, dates, or achievements.
                      </p>
                    </div>

                    <div className="md:col-span-2">
                      <label className="flex items-center gap-3 cursor-pointer">
                        <input
                          name="inCollection"
                          type="checkbox"
                          checked={medalFormData.inCollection || false}
                          onChange={handleMedalChange}
                          className="w-5 h-5 bg-white border-neutral-300 rounded text-black focus:ring-black focus:ring-offset-white"
                        />
                        <span className="text-neutral-900">I have this medal in my collection</span>
                      </label>
                    </div>

                    {medalFormData.inCollection && (
                      <>
                        <div>
                          <label className="block text-neutral-700 mb-2">
                            Condition
                          </label>
                          <select
                            name="condition"
                            value={medalFormData.condition || ''}
                            onChange={handleMedalChange}
                            className="w-full px-4 py-2.5 bg-white border border-neutral-300 rounded-lg text-black focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-colors"
                          >
                            <option value="">Select Condition</option>
                            <option value="Mint">Mint</option>
                            <option value="Excellent">Excellent</option>
                            <option value="Good">Good</option>
                            <option value="Fair">Fair</option>
                            <option value="Poor">Poor</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-neutral-700 mb-2">
                            Acquisition Date
                          </label>
                          <input
                            name="acquisitionDate"
                            type="date"
                            value={medalFormData.acquisitionDate || ''}
                            onChange={handleMedalChange}
                            className="w-full px-4 py-2.5 bg-white border border-neutral-300 rounded-lg text-black placeholder-neutral-400 focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-colors"
                          />
                        </div>

                        <div>
                          <label className="block text-neutral-700 mb-2">
                            Acquisition Source
                          </label>
                          <input
                            name="acquisitionSource"
                            type="text"
                            value={medalFormData.acquisitionSource || ''}
                            onChange={handleMedalChange}
                            className="w-full px-4 py-2.5 bg-white border border-neutral-300 rounded-lg text-black placeholder-neutral-400 focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-colors"
                            placeholder="e.g., Estate Sale"
                          />
                        </div>

                        <div>
                          <label className="block text-neutral-700 mb-2">
                            Estimated Value
                          </label>
                          <input
                            name="estimatedValue"
                            type="text"
                            value={medalFormData.estimatedValue || ''}
                            onChange={handleMedalChange}
                            className="w-full px-4 py-2.5 bg-white border border-neutral-300 rounded-lg text-black placeholder-neutral-400 focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-colors"
                            placeholder="e.g., $450"
                          />
                        </div>

                        <div>
                          <label className="block text-neutral-700 mb-2">
                            Serial Number
                          </label>
                          <input
                            name="serialNumber"
                            type="text"
                            value={medalFormData.serialNumber || ''}
                            onChange={handleMedalChange}
                            className="w-full px-4 py-2.5 bg-white border border-neutral-300 rounded-lg text-black placeholder-neutral-400 focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-colors"
                            placeholder="e.g., PH-44-12456"
                          />
                        </div>

                        <div>
                          <label className="block text-neutral-700 mb-2">
                            Medal Number
                          </label>
                          <input
                            name="medalNumber"
                            type="text"
                            value={medalFormData.medalNumber || ''}
                            onChange={handleMedalChange}
                            className="w-full px-4 py-2.5 bg-white border border-neutral-300 rounded-lg text-black placeholder-neutral-400 focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-colors"
                            placeholder="e.g., 12345"
                          />
                        </div>

                        <div className="md:col-span-2">
                          <label className="flex items-center gap-3 cursor-pointer">
                            <input
                              name="isNamed"
                              type="checkbox"
                              checked={medalFormData.isNamed || false}
                              onChange={handleMedalChange}
                              className="w-5 h-5 bg-white border-neutral-300 rounded text-black focus:ring-black focus:ring-offset-white"
                            />
                            <span className="text-neutral-900">Named medal (engraved or officially attributed to recipient)</span>
                          </label>
                        </div>

                        <div className="md:col-span-2">
                          <label className="block text-neutral-700 mb-2">
                            Description/Notes
                          </label>
                          <textarea
                            name="description"
                            value={medalFormData.description || ''}
                            onChange={handleMedalChange}
                            rows={2}
                            className="w-full px-4 py-2.5 bg-white border border-neutral-300 rounded-lg text-black placeholder-neutral-400 focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-colors"
                            placeholder="Any additional details about this medal..."
                          />
                        </div>
                      </>
                    )}
                  </div>

                  <div className="flex gap-3 mt-4">
                    <button
                      type="button"
                      onClick={handleAddMedal}
                      className="px-6 py-2 bg-black hover:bg-neutral-800 text-white rounded-lg transition-colors"
                    >
                      {editingMedalIndex !== null ? 'Update Medal' : 'Add Medal'}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowMedalForm(false);
                        setEditingMedalIndex(null);
                        setMedalFormData({
                          name: '',
                          country: '',
                          branch: '',
                          era: '',
                          category: '',
                          inCollection: false,
                          clasps: []
                        });
                        setClaspInput('');
                      }}
                      className="px-6 py-2 bg-neutral-100 hover:bg-neutral-200 text-black rounded-lg transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Form Actions */}
            <div className="flex gap-4 pt-6 border-t border-neutral-200">
              <button
                type="submit"
                className="flex items-center gap-2 px-6 py-3 bg-black hover:bg-neutral-800 text-white rounded-lg transition-colors"
              >
                <Save className="w-5 h-5" />
                {person ? 'Update Service Member' : 'Add Service Member'}
              </button>
              <button
                type="button"
                onClick={onCancel}
                className="px-6 py-3 bg-neutral-100 hover:bg-neutral-200 text-black rounded-lg transition-colors"
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