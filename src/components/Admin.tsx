import { User } from '../App';
import { ArrowLeft, LogOut, Shield, CheckCircle, XCircle, Trash2, AlertTriangle, Database, Edit2, GitMerge } from 'lucide-react';
import { useState, useEffect } from 'react';
import { fetchDropdownStats } from '../utils/api/admin';

interface AdminProps {
  users: User[];
  accessToken: string;
  onActivateUser: (userId: string) => void;
  onDeactivateUser: (userId: string) => void;
  onDeleteUser: (userId: string) => void;
  onBack: () => void;
  onLogout: () => void;
}

export function Admin({ 
  users,
  accessToken,
  onActivateUser, 
  onDeactivateUser, 
  onDeleteUser, 
  onBack, 
  onLogout 
}: AdminProps) {
  const [selectedField, setSelectedField] = useState<string>('era');
  const [editingValue, setEditingValue] = useState<string | null>(null);
  const [newValueName, setNewValueName] = useState<string>('');
  const [mergingValue, setMergingValue] = useState<string | null>(null);
  const [mergeTargetValue, setMergeTargetValue] = useState<string>('');
  const [dropdownData, setDropdownData] = useState<Record<string, { value: string; usageCount: number }[]>>({
    era: [],
    branch: [],
    country: [],
    category: []
  });
  const [isLoadingStats, setIsLoadingStats] = useState(true);

  // Load real dropdown statistics from the database
  useEffect(() => {
    const loadDropdownStats = async () => {
      setIsLoadingStats(true);
      const stats = await fetchDropdownStats(accessToken);
      setDropdownData(stats);
      setIsLoadingStats(false);
    };
    
    loadDropdownStats();
  }, [accessToken]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const activeUsers = users.filter(u => u.isActive);
  const pendingUsers = users.filter(u => !u.isActive);

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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

        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Shield className="w-6 h-6 text-black" />
            <h1 className="text-black">Admin Panel</h1>
          </div>
          <p className="text-neutral-600">
            Manage user accounts and permissions
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-white border border-neutral-200 rounded-xl p-6">
            <p className="text-neutral-600 text-sm mb-1">Total Users</p>
            <p className="text-black text-2xl">{users.length}</p>
          </div>
          <div className="bg-white border border-neutral-200 rounded-xl p-6">
            <p className="text-neutral-600 text-sm mb-1">Active Users</p>
            <p className="text-green-600 text-2xl">{activeUsers.length}</p>
          </div>
          <div className="bg-white border border-neutral-200 rounded-xl p-6">
            <p className="text-neutral-600 text-sm mb-1">Pending Activation</p>
            <p className="text-amber-600 text-2xl">{pendingUsers.length}</p>
          </div>
        </div>

        {/* Pending Users */}
        {pendingUsers.length > 0 && (
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <AlertTriangle className="w-5 h-5 text-amber-600" />
              <h2 className="text-black">Pending Activation ({pendingUsers.length})</h2>
            </div>
            <div className="space-y-4">
              {pendingUsers.map(user => (
                <div key={user.id} className="bg-white border border-amber-200 rounded-xl p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-black mb-1">{user.name}</h3>
                      <p className="text-neutral-600 text-sm mb-1">{user.email}</p>
                      <p className="text-neutral-500 text-xs">
                        Registered {formatDate(user.registeredAt)}
                      </p>
                    </div>
                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-sm">
                      <AlertTriangle className="w-3 h-3" />
                      Pending
                    </span>
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={() => onActivateUser(user.id)}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
                    >
                      <CheckCircle className="w-4 h-4" />
                      Activate Account
                    </button>
                    <button
                      onClick={() => onDeleteUser(user.id)}
                      className="flex items-center justify-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Active Users */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <h2 className="text-black">Active Users ({activeUsers.length})</h2>
          </div>
          <div className="space-y-4">
            {activeUsers.map(user => (
              <div key={user.id} className="bg-white border border-neutral-200 rounded-xl p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-black">{user.name}</h3>
                      {user.isAdmin && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-black text-white rounded text-xs">
                          <Shield className="w-3 h-3" />
                          Admin
                        </span>
                      )}
                    </div>
                    <p className="text-neutral-600 text-sm mb-1">{user.email}</p>
                    <p className="text-neutral-500 text-xs">
                      Registered {formatDate(user.registeredAt)}
                    </p>
                  </div>
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">
                    <CheckCircle className="w-3 h-3" />
                    Active
                  </span>
                </div>

                {!user.isAdmin && (
                  <div className="flex gap-3">
                    <button
                      onClick={() => onDeactivateUser(user.id)}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-neutral-100 hover:bg-neutral-200 text-black rounded-lg transition-colors"
                    >
                      <XCircle className="w-4 h-4" />
                      Deactivate
                    </button>
                    <button
                      onClick={() => onDeleteUser(user.id)}
                      className="flex items-center justify-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Manage Dropdown Values */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Database className="w-5 h-5 text-blue-600" />
            <h2 className="text-black">Manage Dropdown Values</h2>
          </div>
          
          <div className="bg-white border border-neutral-200 rounded-xl p-6 mb-4">
            <p className="text-neutral-600 mb-4">
              Control the values available in dropdown fields across the application. Merge duplicates, 
              rename values, or remove unused entries to maintain data quality.
            </p>
            
            {/* Field Selector */}
            <div className="mb-6">
              <label className="block text-neutral-700 mb-2">
                Select Field to Manage
              </label>
              <select
                value={selectedField}
                onChange={(e) => {
                  setSelectedField(e.target.value);
                  setEditingValue(null);
                  setMergingValue(null);
                }}
                className="w-full px-4 py-2.5 bg-white border border-neutral-300 rounded-lg text-black focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-colors"
              >
                <option value="era">Era/Conflict</option>
                <option value="branch">Branch of Service</option>
                <option value="country">Country</option>
                <option value="category">Medal Category</option>
              </select>
            </div>

            {/* Values List */}
            <div className="space-y-2">
              <div className="flex items-center justify-between px-4 py-2 bg-neutral-50 rounded-lg text-sm">
                <span className="text-neutral-600">Value</span>
                <div className="flex items-center gap-4">
                  <span className="text-neutral-600">Usage Count</span>
                  <span className="text-neutral-600 w-[140px]">Actions</span>
                </div>
              </div>

              {isLoadingStats ? (
                <div className="flex items-center justify-center py-12">
                  <div className="text-center">
                    <div className="w-12 h-12 border-4 border-black border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
                    <p className="text-neutral-600 text-sm">Loading dropdown statistics...</p>
                  </div>
                </div>
              ) : dropdownData[selectedField] && dropdownData[selectedField].length > 0 ? (
                dropdownData[selectedField]
                  .sort((a, b) => b.usageCount - a.usageCount)
                  .map((item, index) => (
                  <div key={index} className="flex items-center justify-between px-4 py-3 bg-white border border-neutral-200 rounded-lg hover:bg-neutral-50 transition-colors">
                    {editingValue === item.value ? (
                      <>
                        <input
                          type="text"
                          value={newValueName}
                          onChange={(e) => setNewValueName(e.target.value)}
                          className="flex-1 px-3 py-1.5 bg-white border border-neutral-300 rounded text-black focus:outline-none focus:border-black focus:ring-1 focus:ring-black"
                          placeholder="New value name"
                        />
                        <div className="flex items-center gap-2 ml-3">
                          <button
                            onClick={() => {
                              // Mock save action
                              alert(`Renamed "${item.value}" to "${newValueName}" across ${item.usageCount} records`);
                              setEditingValue(null);
                              setNewValueName('');
                            }}
                            className="px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white rounded text-sm transition-colors"
                          >
                            Save
                          </button>
                          <button
                            onClick={() => {
                              setEditingValue(null);
                              setNewValueName('');
                            }}
                            className="px-3 py-1.5 bg-neutral-100 hover:bg-neutral-200 text-black rounded text-sm transition-colors"
                          >
                            Cancel
                          </button>
                        </div>
                      </>
                    ) : mergingValue === item.value ? (
                      <>
                        <div className="flex-1 flex items-center gap-2">
                          <span className="text-black">{item.value}</span>
                          <span className="text-neutral-400">→</span>
                          <select
                            value={mergeTargetValue}
                            onChange={(e) => setMergeTargetValue(e.target.value)}
                            className="px-3 py-1.5 bg-white border border-neutral-300 rounded text-black focus:outline-none focus:border-black focus:ring-1 focus:ring-black text-sm"
                          >
                            <option value="">Select target value...</option>
                            {dropdownData[selectedField]
                              .filter(v => v.value !== item.value)
                              .map((v, i) => (
                                <option key={i} value={v.value}>{v.value}</option>
                              ))
                            }
                          </select>
                        </div>
                        <div className="flex items-center gap-2 ml-3">
                          <button
                            onClick={() => {
                              if (mergeTargetValue) {
                                alert(`Merged "${item.value}" (${item.usageCount} records) into "${mergeTargetValue}"`);
                                setMergingValue(null);
                                setMergeTargetValue('');
                              }
                            }}
                            disabled={!mergeTargetValue}
                            className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            Merge
                          </button>
                          <button
                            onClick={() => {
                              setMergingValue(null);
                              setMergeTargetValue('');
                            }}
                            className="px-3 py-1.5 bg-neutral-100 hover:bg-neutral-200 text-black rounded text-sm transition-colors"
                          >
                            Cancel
                          </button>
                        </div>
                      </>
                    ) : (
                      <>
                        <span className="flex-1 text-black">{item.value}</span>
                        <div className="flex items-center gap-4">
                          <span className="text-neutral-600 text-sm w-[80px] text-right">
                            {item.usageCount} records
                          </span>
                          <div className="flex items-center gap-2 w-[140px]">
                            <button
                              onClick={() => {
                                setEditingValue(item.value);
                                setNewValueName(item.value);
                              }}
                              className="p-1.5 bg-neutral-100 hover:bg-neutral-200 text-black rounded transition-colors"
                              title="Rename"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => {
                                setMergingValue(item.value);
                                setMergeTargetValue('');
                              }}
                              className="p-1.5 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded transition-colors"
                              title="Merge with another value"
                            >
                              <GitMerge className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => {
                                if (confirm(`Delete "${item.value}"? This will affect ${item.usageCount} records.`)) {
                                  alert(`Deleted "${item.value}" from ${item.usageCount} records`);
                                }
                              }}
                              className="p-1.5 bg-red-100 hover:bg-red-200 text-red-700 rounded transition-colors"
                              title="Delete"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                ))
              ) : (
                <div className="flex items-center justify-center py-12">
                  <div className="text-center">
                    <p className="text-neutral-600 text-sm">No values found for this field.</p>
                  </div>
                </div>
              )}
            </div>

            {/* Info Box */}
            <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="text-black mb-2 flex items-center gap-2">
                <Database className="w-4 h-4 text-blue-600" />
                Data Quality Tips
              </h4>
              <ul className="text-sm text-neutral-700 space-y-1">
                <li>• <strong>Rename:</strong> Update a value across all records (e.g., fix typos or standardize formatting)</li>
                <li>• <strong>Merge:</strong> Combine duplicate entries (e.g., merge "WWII" and "WW2" into "World War II")</li>
                <li>• <strong>Delete:</strong> Remove unused or incorrect values from the system</li>
                <li>• Usage counts show how many records will be affected by changes</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}