import React from 'react';
import { ArrowLeft, LogOut, Shield, CheckCircle, XCircle, Trash2, AlertTriangle, Database, Edit2, GitMerge } from 'lucide-react';
import { useState, useEffect } from 'react';
import { fetchDropdownStats, renameDropdownValue, mergeDropdownValues, deleteDropdownValue } from '../utils/api/admin';

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
            {/* Introduction Banner */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-5 mb-6">
              <h3 className="text-black mb-2 flex items-center gap-2">
                <Database className="w-5 h-5 text-blue-600" />
                What is this?
              </h3>
              <p className="text-neutral-700 text-sm mb-3">
                This tool helps you maintain clean, consistent data across all user catalogs. You can standardize values 
                that appear in dropdown menus when users add service members and medals.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
                <div className="bg-white rounded-lg p-3 border border-blue-100">
                  <div className="flex items-center gap-2 text-green-700 mb-1">
                    <Edit2 className="w-4 h-4" />
                    <span className="font-medium">Rename</span>
                  </div>
                  <p className="text-neutral-600">Fix typos or standardize wording (e.g., "WWII" → "World War II")</p>
                </div>
                <div className="bg-white rounded-lg p-3 border border-blue-100">
                  <div className="flex items-center gap-2 text-blue-700 mb-1">
                    <GitMerge className="w-4 h-4" />
                    <span className="font-medium">Merge</span>
                  </div>
                  <p className="text-neutral-600">Combine duplicates (e.g., merge "US Army" and "U.S. Army")</p>
                </div>
                <div className="bg-white rounded-lg p-3 border border-blue-100">
                  <div className="flex items-center gap-2 text-red-700 mb-1">
                    <Trash2 className="w-4 h-4" />
                    <span className="font-medium">Delete</span>
                  </div>
                  <p className="text-neutral-600">Remove incorrect or test data from all records</p>
                </div>
              </div>
            </div>

            {/* Step 1: Field Selector */}
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-3">
                <div className="flex items-center justify-center w-6 h-6 bg-blue-600 text-white rounded-full text-sm font-medium">1</div>
                <label className="text-black font-medium">
                  Choose which dropdown field to manage
                </label>
              </div>
              <select
                value={selectedField}
                onChange={(e) => {
                  setSelectedField(e.target.value);
                  setEditingValue(null);
                  setMergingValue(null);
                }}
                className="w-full px-4 py-3 bg-white border border-neutral-300 rounded-lg text-black focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all"
              >
                <option value="era">Era/Conflict (e.g., "World War II", "Vietnam War")</option>
                <option value="branch">Branch of Service (e.g., "U.S. Army", "Royal Navy")</option>
                <option value="country">Country (e.g., "United States", "United Kingdom")</option>
                <option value="category">Medal Category (e.g., "Campaign", "Service")</option>
                <option value="clasp">Medal Clasp (e.g., "France", "Germany")</option>
              </select>
              <p className="text-neutral-500 text-sm mt-2">
                💡 These values appear when users create or edit service members and medals in their catalogs
              </p>
            </div>

            {/* Step 2: Values List */}
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-3">
                <div className="flex items-center justify-center w-6 h-6 bg-blue-600 text-white rounded-full text-sm font-medium">2</div>
                <h3 className="text-black font-medium">
                  Review and manage values
                </h3>
              </div>

              {/* Column Headers */}
              <div className="flex items-center justify-between px-4 py-3 bg-neutral-100 rounded-t-lg border border-neutral-200">
                <span className="text-neutral-700 font-medium text-sm">Current Value</span>
                <div className="flex items-center gap-6">
                  <span className="text-neutral-700 font-medium text-sm w-[100px] text-center">Used In</span>
                  <span className="text-neutral-700 font-medium text-sm w-[180px] text-center">Actions</span>
                </div>
              </div>

              {/* Values List */}
              <div className="border-x border-b border-neutral-200 rounded-b-lg">
                {isLoadingStats ? (
                  <div className="flex items-center justify-center py-16">
                    <div className="text-center">
                      <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
                      <p className="text-neutral-600 text-sm">Loading values...</p>
                    </div>
                  </div>
                ) : dropdownData[selectedField] && dropdownData[selectedField].length > 0 ? (
                  <div className="divide-y divide-neutral-200">
                    {dropdownData[selectedField]
                      .sort((a, b) => b.usageCount - a.usageCount)
                      .map((item, index) => (
                      <div key={index} className="px-4 py-4 bg-white hover:bg-neutral-50 transition-colors">
                        {editingValue === item.value ? (
                          /* RENAME MODE */
                          <div className="space-y-3">
                            <div className="flex items-center gap-3">
                              <Edit2 className="w-5 h-5 text-green-600 flex-shrink-0" />
                              <div className="flex-1">
                                <p className="text-sm text-neutral-600 mb-2">
                                  Renaming "<strong>{item.value}</strong>" in {item.usageCount} record{item.usageCount !== 1 ? 's' : ''}
                                </p>
                                <input
                                  type="text"
                                  value={newValueName}
                                  onChange={(e) => setNewValueName(e.target.value)}
                                  className="w-full px-4 py-2.5 bg-white border-2 border-green-300 rounded-lg text-black focus:outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100"
                                  placeholder="Enter new name..."
                                  autoFocus
                                />
                              </div>
                            </div>
                            <div className="flex items-center gap-2 justify-end">
                              <button
                                onClick={() => {
                                  setEditingValue(null);
                                  setNewValueName('');
                                }}
                                className="px-4 py-2 bg-neutral-100 hover:bg-neutral-200 text-black rounded-lg text-sm transition-colors"
                              >
                                Cancel
                              </button>
                              <button
                                onClick={async () => {
                                  if (newValueName && newValueName !== item.value) {
                                    const result = await renameDropdownValue(selectedField, item.value, newValueName, accessToken);
                                    if (result.success) {
                                      // Reload stats to show updated values
                                      const stats = await fetchDropdownStats(accessToken);
                                      setDropdownData(stats);
                                      alert(`✓ Renamed "${item.value}" to "${newValueName}" across ${result.updatedCount} records`);
                                      setEditingValue(null);
                                      setNewValueName('');
                                    } else {
                                      alert(`❌ Error: ${result.error}`);
                                    }
                                  }
                                }}
                                disabled={!newValueName || newValueName === item.value}
                                className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                              >
                                <Edit2 className="w-4 h-4" />
                                Save Rename
                              </button>
                            </div>
                          </div>
                        ) : mergingValue === item.value ? (
                          /* MERGE MODE */
                          <div className="space-y-3">
                            <div className="flex items-center gap-3">
                              <GitMerge className="w-5 h-5 text-blue-600 flex-shrink-0" />
                              <div className="flex-1">
                                <p className="text-sm text-neutral-600 mb-3">
                                  Merging "<strong>{item.value}</strong>" ({item.usageCount} record{item.usageCount !== 1 ? 's' : ''})
                                </p>
                                <div className="flex items-center gap-3">
                                  <div className="flex-1 bg-blue-50 border border-blue-200 rounded-lg px-4 py-2.5">
                                    <span className="text-blue-900 font-medium">{item.value}</span>
                                  </div>
                                  <div className="text-blue-600">→</div>
                                  <select
                                    value={mergeTargetValue}
                                    onChange={(e) => setMergeTargetValue(e.target.value)}
                                    className="flex-1 px-4 py-2.5 bg-white border-2 border-blue-300 rounded-lg text-black focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                                  >
                                    <option value="">Choose target value...</option>
                                    {dropdownData[selectedField]
                                      .filter(v => v.value !== item.value)
                                      .sort((a, b) => b.usageCount - a.usageCount)
                                      .map((v, i) => (
                                        <option key={i} value={v.value}>
                                          {v.value} ({v.usageCount} record{v.usageCount !== 1 ? 's' : ''})
                                        </option>
                                      ))
                                    }
                                  </select>
                                </div>
                                <p className="text-xs text-neutral-500 mt-2">
                                  💡 All {item.usageCount} record{item.usageCount !== 1 ? 's' : ''} will be updated to use the target value
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2 justify-end">
                              <button
                                onClick={() => {
                                  setMergingValue(null);
                                  setMergeTargetValue('');
                                }}
                                className="px-4 py-2 bg-neutral-100 hover:bg-neutral-200 text-black rounded-lg text-sm transition-colors"
                              >
                                Cancel
                              </button>
                              <button
                                onClick={async () => {
                                  if (mergeTargetValue) {
                                    const result = await mergeDropdownValues(selectedField, item.value, mergeTargetValue, accessToken);
                                    if (result.success) {
                                      // Reload stats to show updated values
                                      const stats = await fetchDropdownStats(accessToken);
                                      setDropdownData(stats);
                                      alert(`✓ Merged "${item.value}" (${result.updatedCount} records) into "${mergeTargetValue}"`);
                                      setMergingValue(null);
                                      setMergeTargetValue('');
                                    } else {
                                      alert(`❌ Error: ${result.error}`);
                                    }
                                  }
                                }}
                                disabled={!mergeTargetValue}
                                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                              >
                                <GitMerge className="w-4 h-4" />
                                Confirm Merge
                              </button>
                            </div>
                          </div>
                        ) : (
                          /* NORMAL VIEW MODE */
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <span className="text-black font-medium">{item.value}</span>
                            </div>
                            <div className="flex items-center gap-6">
                              <div className="w-[100px] text-center">
                                <span className="inline-flex items-center px-3 py-1 bg-neutral-100 text-neutral-700 rounded-full text-sm">
                                  {item.usageCount} record{item.usageCount !== 1 ? 's' : ''}
                                </span>
                              </div>
                              <div className="flex items-center gap-2 w-[180px] justify-end">
                                <button
                                  onClick={() => {
                                    setEditingValue(item.value);
                                    setNewValueName(item.value);
                                  }}
                                  className="px-3 py-2 bg-green-50 hover:bg-green-100 text-green-700 rounded-lg transition-colors flex items-center gap-1.5 text-sm"
                                  title="Rename this value across all records"
                                >
                                  <Edit2 className="w-4 h-4" />
                                  Rename
                                </button>
                                <button
                                  onClick={() => {
                                    setMergingValue(item.value);
                                    setMergeTargetValue('');
                                  }}
                                  className="px-3 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg transition-colors flex items-center gap-1.5 text-sm"
                                  title="Merge with another value"
                                >
                                  <GitMerge className="w-4 h-4" />
                                  Merge
                                </button>
                                <button
                                  onClick={async () => {
                                    if (confirm(`⚠️ Delete "${item.value}"?\n\nThis will remove this value from ${item.usageCount} record${item.usageCount !== 1 ? 's' : ''}.\n\nThis action cannot be undone.`)) {
                                      const result = await deleteDropdownValue(selectedField, item.value, accessToken);
                                      if (result.success) {
                                        // Reload stats to show updated values
                                        const stats = await fetchDropdownStats(accessToken);
                                        setDropdownData(stats);
                                        alert(`✓ Deleted "${item.value}" from ${result.updatedCount} record${result.updatedCount !== 1 ? 's' : ''}`);
                                      } else {
                                        alert(`❌ Error: ${result.error}`);
                                      }
                                    }
                                  }}
                                  className="p-2 bg-red-50 hover:bg-red-100 text-red-700 rounded-lg transition-colors"
                                  title="Delete this value from all records"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex items-center justify-center py-16">
                    <div className="text-center">
                      <Database className="w-12 h-12 text-neutral-300 mx-auto mb-3" />
                      <p className="text-neutral-600">No values found for this field.</p>
                      <p className="text-neutral-400 text-sm mt-1">Values will appear here once users add data to their catalogs.</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Help Section */}
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
              <h4 className="text-black mb-2 flex items-center gap-2">
                <span className="text-lg">💡</span>
                <span className="font-medium">When to use each action</span>
              </h4>
              <div className="space-y-2 text-sm text-neutral-700">
                <div className="flex gap-3">
                  <span className="text-green-600 font-medium min-w-[60px]">Rename:</span>
                  <span>Use when the <strong>meaning is the same</strong> but the wording needs fixing (typos, capitalization, formatting)</span>
                </div>
                <div className="flex gap-3">
                  <span className="text-blue-600 font-medium min-w-[60px]">Merge:</span>
                  <span>Use when there are <strong>duplicate entries</strong> that should be combined (e.g., "WWII", "WW2", "World War 2" all mean the same thing)</span>
                </div>
                <div className="flex gap-3">
                  <span className="text-red-600 font-medium min-w-[60px]">Delete:</span>
                  <span>Use when the value is <strong>incorrect or invalid</strong> (test data, mistakes, inappropriate content)</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}