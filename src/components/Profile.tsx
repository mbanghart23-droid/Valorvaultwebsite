import { useState } from 'react';
import { UserProfile } from '../App';
import { ArrowLeft, Save, User, LogOut, Globe, Eye, EyeOff, Lock, Trash2, AlertTriangle } from 'lucide-react';

interface ProfileProps {
  profile: UserProfile;
  onUpdate: (profile: UserProfile) => void;
  onBack: () => void;
  onLogout: () => void;
  onChangePassword: (currentPassword: string, newPassword: string) => Promise<void>;
  onDeleteAccount: (password: string) => Promise<void>;
}

export function Profile({ profile, onUpdate, onBack, onLogout, onChangePassword, onDeleteAccount }: ProfileProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(profile);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [showDeleteAccount, setShowDeleteAccount] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [deleteConfirmation, setDeleteConfirmation] = useState({
    password: '',
    confirmText: ''
  });
  const [passwordError, setPasswordError] = useState('');
  const [deleteError, setDeleteError] = useState('');

  // Password validation
  const validatePassword = (password: string): string | null => {
    if (password.length < 8) {
      return 'Password must be at least 8 characters long';
    }
    if (!/[A-Z]/.test(password)) {
      return 'Password must contain at least one uppercase letter';
    }
    if (!/[a-z]/.test(password)) {
      return 'Password must contain at least one lowercase letter';
    }
    if (!/[0-9]/.test(password)) {
      return 'Password must contain at least one number';
    }
    return null;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleToggleDiscoverable = () => {
    setFormData({
      ...formData,
      isDiscoverable: !formData.isDiscoverable
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

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError('');

    // Validate new password
    const validationError = validatePassword(passwordData.newPassword);
    if (validationError) {
      setPasswordError(validationError);
      return;
    }

    // Check if passwords match
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError('New passwords do not match');
      return;
    }

    try {
      await onChangePassword(passwordData.currentPassword, passwordData.newPassword);
      setShowChangePassword(false);
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error: any) {
      setPasswordError(error.message || 'Failed to change password');
    }
  };

  const handleDeleteAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    setDeleteError('');

    // Check if user typed DELETE correctly
    if (deleteConfirmation.confirmText !== 'DELETE') {
      setDeleteError('Please type DELETE to confirm');
      return;
    }

    try {
      await onDeleteAccount(deleteConfirmation.password);
      // Account deleted, user will be logged out
    } catch (error: any) {
      setDeleteError(error.message || 'Failed to delete account');
    }
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
                </div>

                <div className="pt-4 space-y-3">
                  <button
                    onClick={() => setIsEditing(true)}
                    className="px-6 py-3 bg-black hover:bg-neutral-800 text-white rounded-lg transition-colors"
                  >
                    Edit Profile
                  </button>

                  <div className="border-t border-neutral-200 pt-6 mt-6">
                    <h3 className="text-black mb-4">Security Settings</h3>
                    
                    <button
                      onClick={() => setShowChangePassword(!showChangePassword)}
                      className="flex items-center gap-2 px-4 py-2 bg-neutral-100 hover:bg-neutral-200 text-black rounded-lg transition-colors mb-3"
                    >
                      <Lock className="w-4 h-4" />
                      Change Password
                    </button>

                    {showChangePassword && (
                      <div className="bg-neutral-50 border border-neutral-200 rounded-lg p-4 mb-4">
                        <form onSubmit={handlePasswordChange} className="space-y-4">
                          <div>
                            <label className="block text-neutral-700 mb-2">Current Password</label>
                            <input
                              type="password"
                              value={passwordData.currentPassword}
                              onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                              className="w-full px-4 py-2.5 bg-white border border-neutral-300 rounded-lg text-black focus:outline-none focus:border-black focus:ring-1 focus:ring-black"
                              required
                            />
                          </div>

                          <div>
                            <label className="block text-neutral-700 mb-2">New Password</label>
                            <input
                              type="password"
                              value={passwordData.newPassword}
                              onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                              className="w-full px-4 py-2.5 bg-white border border-neutral-300 rounded-lg text-black focus:outline-none focus:border-black focus:ring-1 focus:ring-black"
                              required
                            />
                            <p className="text-neutral-600 text-sm mt-2">
                              Must be at least 8 characters with uppercase, lowercase, and numbers
                            </p>
                          </div>

                          <div>
                            <label className="block text-neutral-700 mb-2">Confirm New Password</label>
                            <input
                              type="password"
                              value={passwordData.confirmPassword}
                              onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                              className="w-full px-4 py-2.5 bg-white border border-neutral-300 rounded-lg text-black focus:outline-none focus:border-black focus:ring-1 focus:ring-black"
                              required
                            />
                          </div>

                          {passwordError && (
                            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                              {passwordError}
                            </div>
                          )}

                          <div className="flex gap-3">
                            <button
                              type="submit"
                              className="px-4 py-2 bg-black hover:bg-neutral-800 text-white rounded-lg transition-colors"
                            >
                              Update Password
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setShowChangePassword(false);
                                setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
                                setPasswordError('');
                              }}
                              className="px-4 py-2 bg-neutral-100 hover:bg-neutral-200 text-black rounded-lg transition-colors"
                            >
                              Cancel
                            </button>
                          </div>
                        </form>
                      </div>
                    )}
                  </div>

                  <div className="border-t border-neutral-200 pt-6 mt-6">
                    <h3 className="text-red-600 mb-2 flex items-center gap-2">
                      <AlertTriangle className="w-5 h-5" />
                      Danger Zone
                    </h3>
                    <p className="text-neutral-600 text-sm mb-4">
                      Once you delete your account, there is no going back. All your data will be permanently deleted.
                    </p>
                    
                    <button
                      onClick={() => setShowDeleteAccount(!showDeleteAccount)}
                      className="flex items-center gap-2 px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete Account
                    </button>

                    {showDeleteAccount && (
                      <div className="bg-red-50 border border-red-200 rounded-lg p-4 mt-4">
                        <div className="flex items-start gap-3 mb-4">
                          <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                          <div>
                            <h4 className="text-red-900 mb-2">Are you absolutely sure?</h4>
                            <p className="text-red-800 text-sm mb-2">
                              This action <strong>cannot be undone</strong>. This will permanently delete:
                            </p>
                            <ul className="text-red-800 text-sm list-disc list-inside space-y-1 mb-4">
                              <li>Your account and profile</li>
                              <li>All service members in your collection</li>
                              <li>All medals and documentation</li>
                              <li>All uploaded images</li>
                              <li>All contact requests and notifications</li>
                            </ul>
                          </div>
                        </div>

                        <form onSubmit={handleDeleteAccount} className="space-y-4">
                          <div>
                            <label className="block text-red-900 mb-2">
                              Type <strong>DELETE</strong> to confirm
                            </label>
                            <input
                              type="text"
                              value={deleteConfirmation.confirmText}
                              onChange={(e) => setDeleteConfirmation({ ...deleteConfirmation, confirmText: e.target.value })}
                              className="w-full px-4 py-2.5 bg-white border border-red-300 rounded-lg text-black focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500"
                              placeholder="DELETE"
                              required
                            />
                          </div>

                          <div>
                            <label className="block text-red-900 mb-2">Enter your password to confirm</label>
                            <input
                              type="password"
                              value={deleteConfirmation.password}
                              onChange={(e) => setDeleteConfirmation({ ...deleteConfirmation, password: e.target.value })}
                              className="w-full px-4 py-2.5 bg-white border border-red-300 rounded-lg text-black focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500"
                              required
                            />
                          </div>

                          {deleteError && (
                            <div className="bg-red-100 border border-red-300 text-red-900 px-4 py-3 rounded-lg">
                              {deleteError}
                            </div>
                          )}

                          <div className="flex gap-3">
                            <button
                              type="submit"
                              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                            >
                              Delete My Account Permanently
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setShowDeleteAccount(false);
                                setDeleteConfirmation({ password: '', confirmText: '' });
                                setDeleteError('');
                              }}
                              className="px-4 py-2 bg-neutral-100 hover:bg-neutral-200 text-black rounded-lg transition-colors"
                            >
                              Cancel
                            </button>
                          </div>
                        </form>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Privacy Settings with Toggle */}
                <div className="bg-neutral-50 border border-neutral-200 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Globe className="w-5 h-5 text-black" />
                        <h3 className="text-black">Collection Discoverability</h3>
                      </div>
                      <p className="text-neutral-600 text-sm">
                        {formData.isDiscoverable 
                          ? 'Your collection will be visible to other collectors in global search.'
                          : 'Your collection will remain private and not visible in global search.'}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={handleToggleDiscoverable}
                      className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 ${
                        formData.isDiscoverable ? 'bg-green-600' : 'bg-neutral-300'
                      }`}
                    >
                      <span
                        className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${
                          formData.isDiscoverable ? 'translate-x-7' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>
                  {formData.isDiscoverable && (
                    <p className="text-amber-600 text-sm mt-3 flex items-start gap-2">
                      <span>⚠️</span>
                      <span>Other collectors will be able to see your records and send you contact requests.</span>
                    </p>
                  )}
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