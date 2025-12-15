import React from 'react';
import { ArrowLeft, LogOut, Shield, CheckCircle, XCircle, Trash2, AlertTriangle } from 'lucide-react';
import { User } from '../App';

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
      </div>
    </div>
  );
}