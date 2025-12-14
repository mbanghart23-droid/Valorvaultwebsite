import { ContactRequest } from '../App';
import { ArrowLeft, LogOut, Mail, Check, X, Clock } from 'lucide-react';

interface NotificationsProps {
  requests: ContactRequest[];
  currentUserId: string;
  onApprove: (requestId: string) => void;
  onDecline: (requestId: string) => void;
  onBack: () => void;
  onLogout: () => void;
}

export function Notifications({ 
  requests, 
  currentUserId,
  onApprove, 
  onDecline, 
  onBack, 
  onLogout 
}: NotificationsProps) {
  const pendingRequests = requests.filter(r => r.status === 'pending');
  const processedRequests = requests.filter(r => r.status !== 'pending');

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
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
            Back to Collection
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
            <Mail className="w-6 h-6 text-black" />
            <h1 className="text-black">Notifications</h1>
          </div>
          <p className="text-neutral-600">
            Manage contact requests from other collectors
          </p>
        </div>

        {/* Pending Requests */}
        {pendingRequests.length > 0 && (
          <div className="mb-8">
            <h2 className="text-black mb-4 flex items-center gap-2">
              <Clock className="w-5 h-5 text-black" />
              Pending Requests ({pendingRequests.length})
            </h2>
            <div className="space-y-4">
              {pendingRequests.map(request => (
                <div key={request.id} className="bg-white border border-neutral-200 rounded-xl p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-black mb-1">{request.fromUserName}</h3>
                      <p className="text-neutral-600 text-sm">
                        Interested in your <span className="text-black">{request.medalName}</span>
                      </p>
                      <p className="text-neutral-500 text-xs mt-1">{formatDate(request.createdAt)}</p>
                    </div>
                  </div>

                  <div className="bg-neutral-50 rounded-lg p-4 mb-4">
                    <p className="text-neutral-900 text-sm">{request.message}</p>
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={() => onApprove(request.id)}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
                    >
                      <Check className="w-4 h-4" />
                      Approve & Share Email
                    </button>
                    <button
                      onClick={() => onDecline(request.id)}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                    >
                      <X className="w-4 h-4" />
                      Decline
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Processed Requests */}
        {processedRequests.length > 0 && (
          <div>
            <h2 className="text-black mb-4">Request History</h2>
            <div className="space-y-4">
              {processedRequests.map(request => (
                <div key={request.id} className="bg-white border border-neutral-200 rounded-xl p-6 opacity-75">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-black mb-1">{request.fromUserName}</h3>
                      <p className="text-neutral-600 text-sm">
                        Interested in your <span className="text-black">{request.medalName}</span>
                      </p>
                      <p className="text-neutral-500 text-xs mt-1">{formatDate(request.createdAt)}</p>
                    </div>
                    <div>
                      {request.status === 'approved' ? (
                        <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">
                          <Check className="w-3 h-3" />
                          Approved
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm">
                          <X className="w-3 h-3" />
                          Declined
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="bg-neutral-50 rounded-lg p-4 mb-4">
                    <p className="text-neutral-900 text-sm">{request.message}</p>
                  </div>

                  {request.status === 'approved' && request.fromUserEmail && (
                    <div className="bg-neutral-100 border border-neutral-200 rounded-lg p-4">
                      <p className="text-neutral-600 text-sm mb-1">Contact shared with:</p>
                      <p className="text-black">{request.fromUserEmail}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {requests.length === 0 && (
          <div className="text-center py-16">
            <Mail className="w-16 h-16 text-neutral-300 mx-auto mb-4" />
            <h3 className="text-neutral-600 mb-2">No notifications yet</h3>
            <p className="text-neutral-500">
              When other collectors are interested in your medals, you'll see their contact requests here.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}