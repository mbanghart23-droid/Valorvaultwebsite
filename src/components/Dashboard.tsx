import { useState } from 'react';
import { Search, Plus, User, LogOut, Users, Filter, Bell, Globe, Shield, HelpCircle, Info } from 'lucide-react';
import { Person, UserProfile } from '../App';
import { PersonCard } from './PersonCard';
import { GlobalPersonCard } from './GlobalPersonCard';

interface DashboardProps {
  persons: Person[];
  globalPersons: Person[];
  userProfile: UserProfile;
  currentUserId: string;
  isAdmin: boolean;
  pendingRequestsCount: number;
  onAddPerson: () => void;
  onViewPerson: (id: string) => void;
  onEditPerson: (id: string) => void;
  onDeletePerson: (id: string) => void;
  onViewProfile: () => void;
  onViewNotifications: () => void;
  onViewAdmin: () => void;
  onViewContactSupport: () => void;
  onViewAbout: () => void;
  onViewTermsOfService: () => void;
  onViewPrivacyPolicy: () => void;
  onLogout: () => void;
  onSendContactRequest: (personId: string, message: string) => void;
}

export function Dashboard({
  persons,
  globalPersons,
  userProfile,
  currentUserId,
  isAdmin,
  pendingRequestsCount,
  onAddPerson,
  onViewPerson,
  onEditPerson,
  onDeletePerson,
  onViewProfile,
  onViewNotifications,
  onViewAdmin,
  onViewContactSupport,
  onViewAbout,
  onViewTermsOfService,
  onViewPrivacyPolicy,
  onLogout,
  onSendContactRequest
}: DashboardProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCountry, setFilterCountry] = useState('');
  const [filterEra, setFilterEra] = useState('');
  const [filterBranch, setFilterBranch] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [filterCollectionStatus, setFilterCollectionStatus] = useState('');
  const [searchGlobal, setSearchGlobal] = useState(false);

  // Choose which person list to search
  const personsToSearch = searchGlobal ? globalPersons : persons;

  // Get unique values for filters
  const countries = Array.from(new Set(personsToSearch.map(p => p.country))).sort();
  const eras = Array.from(new Set(personsToSearch.flatMap(p => Array.isArray(p.era) ? p.era : [p.era]))).sort();
  const branches = Array.from(new Set(personsToSearch.map(p => p.branch))).sort();
  const categories = Array.from(new Set(personsToSearch.flatMap(p => p.medals.map(m => m.category)))).sort();
  const collectionStatuses = ['In Collection', 'Not in Collection'];

  // Filter persons based on search and filters
  const filteredPersons = personsToSearch.filter(person => {
    // Check if search matches person fields OR any medal fields
    const matchesPersonFields = searchQuery === '' || 
      person.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      person.country.toLowerCase().includes(searchQuery.toLowerCase()) ||
      person.branch.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (Array.isArray(person.era) && person.era.some(e => e.toLowerCase().includes(searchQuery.toLowerCase()))) ||
      (Array.isArray(person.rank) && person.rank.some(r => r.toLowerCase().includes(searchQuery.toLowerCase()))) ||
      (person.serviceNumber && person.serviceNumber.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (Array.isArray(person.unit) && person.unit.some(u => u.toLowerCase().includes(searchQuery.toLowerCase()))) ||
      (person.biography && person.biography.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (person.ownerName && person.ownerName.toLowerCase().includes(searchQuery.toLowerCase()));
    
    // Check if search matches any medal fields
    const matchesMedalFields = searchQuery === '' || person.medals.some(medal =>
      medal.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      medal.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (medal.description && medal.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (medal.clasps && medal.clasps.some(clasp => clasp.toLowerCase().includes(searchQuery.toLowerCase())))
    );

    const matchesSearch = matchesPersonFields || matchesMedalFields;

    const matchesCountry = filterCountry === '' || person.country === filterCountry;
    const matchesEra = filterEra === '' || (Array.isArray(person.era) && person.era.includes(filterEra));
    const matchesBranch = filterBranch === '' || person.branch === filterBranch;
    const matchesCategory = filterCategory === '' || person.medals.some(m => m.category === filterCategory);
    const matchesCollectionStatus = filterCollectionStatus === '' || person.medals.some(m => m.inCollection === (filterCollectionStatus === 'In Collection'));

    return matchesSearch && matchesCountry && matchesEra && matchesBranch && matchesCategory && matchesCollectionStatus;
  });

  // Calculate total medals in collection
  const totalMedals = persons.reduce((sum, p) => sum + p.medals.length, 0);
  const totalInCollection = persons.reduce((sum, p) => 
    sum + p.medals.filter(m => m.inCollection).length, 0
  );

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Header */}
      <header className="bg-white border-b border-neutral-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 bg-black rounded-lg">
                <Users className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-black">Valor Registry</h1>
                <p className="text-neutral-600 text-sm">Welcome back, {userProfile.name}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {isAdmin && (
                <button
                  onClick={onViewAdmin}
                  className="flex items-center gap-2 px-4 py-2 bg-black hover:bg-neutral-800 text-white rounded-lg transition-colors"
                >
                  <Shield className="w-4 h-4" />
                  <span className="hidden sm:inline">Admin</span>
                </button>
              )}
              <button
                onClick={onViewNotifications}
                className="relative flex items-center gap-2 px-4 py-2 bg-neutral-100 hover:bg-neutral-200 text-black rounded-lg transition-colors"
              >
                <Bell className="w-4 h-4" />
                {pendingRequestsCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-600 rounded-full flex items-center justify-center text-xs text-white">
                    {pendingRequestsCount}
                  </span>
                )}
                <span className="hidden sm:inline">Notifications</span>
              </button>
              <button
                onClick={onViewProfile}
                className="flex items-center gap-2 px-4 py-2 bg-neutral-100 hover:bg-neutral-200 text-black rounded-lg transition-colors"
              >
                <User className="w-4 h-4" />
                <span className="hidden sm:inline">Profile</span>
              </button>
              <button
                onClick={onLogout}
                className="flex items-center gap-2 px-4 py-2 bg-neutral-100 hover:bg-neutral-200 text-black rounded-lg transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Add Section */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row gap-4 mb-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-neutral-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={searchGlobal ? "Search all discoverable service members..." : "Search your collection..."}
                className="w-full pl-10 pr-4 py-3 bg-white border border-neutral-300 rounded-lg text-black placeholder-neutral-400 focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-colors"
              />
            </div>
            <button
              onClick={onAddPerson}
              className="flex items-center justify-center gap-2 px-6 py-3 bg-black hover:bg-neutral-800 text-white rounded-lg transition-colors"
            >
              <Plus className="w-5 h-5" />
              Add Service Member
            </button>
          </div>

          {/* Global Search Checkbox */}
          <div className="mb-6">
            <label className="flex items-center gap-3 cursor-pointer w-fit">
              <input
                type="checkbox"
                checked={searchGlobal}
                onChange={(e) => {
                  setSearchGlobal(e.target.checked);
                  setSearchQuery('');
                  setFilterCountry('');
                  setFilterEra('');
                  setFilterBranch('');
                  setFilterCategory('');
                  setFilterCollectionStatus('');
                }}
                className="w-5 h-5 bg-white border-neutral-300 rounded text-black focus:ring-black focus:ring-offset-white"
              />
              <div className="flex items-center gap-2">
                <Globe className="w-5 h-5 text-black" />
                <span className="text-neutral-900">Search all discoverable collections</span>
              </div>
            </label>
            {searchGlobal && (
              <p className="text-neutral-600 text-sm mt-2 ml-8">
                You are searching service members from all users who have made their collections discoverable.
              </p>
            )}
          </div>

          {/* Filters */}
          <div className="flex items-center gap-4 mb-4">
            <Filter className="w-5 h-5 text-neutral-400" />
            <span className="text-neutral-600">Filters:</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <select
              value={filterCountry}
              onChange={(e) => setFilterCountry(e.target.value)}
              className="px-4 py-2.5 bg-white border border-neutral-300 rounded-lg text-black focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-colors"
            >
              <option value="">All Countries</option>
              {countries.map(country => (
                <option key={country} value={country}>{country}</option>
              ))}
            </select>

            <select
              value={filterEra}
              onChange={(e) => setFilterEra(e.target.value)}
              className="px-4 py-2.5 bg-white border border-neutral-300 rounded-lg text-black focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-colors"
            >
              <option value="">All Eras</option>
              {eras.map(era => (
                <option key={era} value={era}>{era}</option>
              ))}
            </select>

            <select
              value={filterBranch}
              onChange={(e) => setFilterBranch(e.target.value)}
              className="px-4 py-2.5 bg-white border border-neutral-300 rounded-lg text-black focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-colors"
            >
              <option value="">All Branches</option>
              {branches.map(branch => (
                <option key={branch} value={branch}>{branch}</option>
              ))}
            </select>

            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="px-4 py-2.5 bg-white border border-neutral-300 rounded-lg text-black focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-colors"
            >
              <option value="">All Medal Categories</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>

            <select
              value={filterCollectionStatus}
              onChange={(e) => setFilterCollectionStatus(e.target.value)}
              className="px-4 py-2.5 bg-white border border-neutral-300 rounded-lg text-black focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-colors"
            >
              <option value="">All Collection Statuses</option>
              {collectionStatuses.map(status => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Collection Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-8">
          <div className="bg-white border border-neutral-200 rounded-xl p-6">
            <p className="text-neutral-600 text-sm mb-1">{searchGlobal ? 'Global Records' : 'Service Members'}</p>
            <p className="text-black text-2xl">{searchGlobal ? globalPersons.length : persons.length}</p>
          </div>
          <div className="bg-white border border-neutral-200 rounded-xl p-6">
            <p className="text-neutral-600 text-sm mb-1">Total Medals</p>
            <p className="text-black text-2xl">{totalMedals}</p>
          </div>
          <div className="bg-white border border-neutral-200 rounded-xl p-6">
            <p className="text-neutral-600 text-sm mb-1">In Collection</p>
            <p className="text-green-600 text-2xl">{totalInCollection}</p>
          </div>
          <div className="bg-white border border-neutral-200 rounded-xl p-6">
            <p className="text-neutral-600 text-sm mb-1">Search Results</p>
            <p className="text-black text-2xl">{filteredPersons.length}</p>
          </div>
        </div>

        {/* Persons Grid */}
        {filteredPersons.length === 0 ? (
          <div className="text-center py-16">
            <Users className="w-16 h-16 text-neutral-300 mx-auto mb-4" />
            <h3 className="text-neutral-600 mb-2">
              {searchQuery || filterCountry || filterEra || filterBranch || filterCategory || filterCollectionStatus ? 'No records found' : 'No service members in your collection yet'}
            </h3>
            <p className="text-neutral-500 mb-6">
              {searchQuery || filterCountry || filterEra || filterBranch || filterCategory || filterCollectionStatus ? 'Try adjusting your search or filters' : 'Start building your collection by adding your first service member'}
            </p>
            {!searchQuery && !filterCountry && !filterEra && !filterBranch && !filterCategory && !filterCollectionStatus && !searchGlobal && (
              <button
                onClick={onAddPerson}
                className="inline-flex items-center gap-2 px-6 py-3 bg-black hover:bg-neutral-800 text-white rounded-lg transition-colors"
              >
                <Plus className="w-5 h-5" />
                Add Your First Service Member
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPersons.map(person => {
              const isOwnPerson = person.ownerId === currentUserId;
              
              if (searchGlobal && !isOwnPerson) {
                return (
                  <GlobalPersonCard
                    key={person.id}
                    person={person}
                    onView={() => onViewPerson(person.id)}
                    onSendContactRequest={onSendContactRequest}
                  />
                );
              }
              
              return (
                <PersonCard
                  key={person.id}
                  person={person}
                  onView={() => onViewPerson(person.id)}
                  onEdit={() => onEditPerson(person.id)}
                  onDelete={() => onDeletePerson(person.id)}
                />
              );
            })}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-neutral-200 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-neutral-600">
            <button
              onClick={onViewAbout}
              className="flex items-center gap-2 hover:text-black transition-colors"
            >
              <Info className="w-4 h-4" />
              About Valor Registry
            </button>
            <button
              onClick={onViewContactSupport}
              className="flex items-center gap-2 hover:text-black transition-colors"
            >
              <HelpCircle className="w-4 h-4" />
              Contact Support
            </button>
            <span className="text-neutral-400">•</span>
            <span>© 2024 Valor Registry</span>
          </div>
        </div>
      </footer>
    </div>
  );
}