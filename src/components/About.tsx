import { Shield, ArrowLeft, LogOut } from 'lucide-react';
import { getFullVersionString, VERSION } from '../version';

interface AboutProps {
  onBack: () => void;
  onLogout: () => void;
}

export function About({ onBack, onLogout }: AboutProps) {
  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Header */}
      <header className="bg-white border-b border-neutral-200 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={onBack}
              className="flex items-center gap-2 text-neutral-600 hover:text-black transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back to Dashboard</span>
            </button>
            
            <button
              onClick={onLogout}
              className="flex items-center gap-2 text-neutral-600 hover:text-black transition-colors"
            >
              <LogOut className="w-5 h-5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-xl border-2 border-black p-8 mb-8">
          <div className="flex items-center gap-4 mb-6">
            <div className="flex items-center justify-center w-16 h-16 bg-black rounded-lg">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-black">About Valor Registry</h1>
              <p className="text-neutral-600">Military Medal Collection Management</p>
            </div>
          </div>

          <div className="space-y-6 text-neutral-700">
            <section>
              <h2 className="text-black mb-3">Our Mission</h2>
              <p>
                Valor Registry is a specialized platform designed for military medal collectors, historians, 
                and researchers. We provide a secure, organized way to catalog and preserve the stories behind 
                military decorations and the service members who earned them.
              </p>
            </section>

            <section>
              <h2 className="text-black mb-3">Key Features</h2>
              <ul className="space-y-2 list-disc list-inside">
                <li><strong>Person-Focused Cataloging:</strong> Track medals by the service member, not just the collection</li>
                <li><strong>Comprehensive Records:</strong> Document both medals in your collection and those you're seeking</li>
                <li><strong>Global Discovery Network:</strong> Connect with other collectors through our opt-in search feature</li>
                <li><strong>Secure Storage:</strong> Your data is protected with enterprise-grade security</li>
                <li><strong>Admin-Verified Accounts:</strong> Quality community maintained through account approval</li>
                <li><strong>Contact Requests:</strong> Reach out to other collectors about shared interests</li>
              </ul>
            </section>

            <section>
              <h2 className="text-black mb-3">How It Works</h2>
              <ol className="space-y-2 list-decimal list-inside">
                <li>Add service members to your registry with biographical information</li>
                <li>Document their medals, including those you own and those you're researching</li>
                <li>Optionally make your collection discoverable to other verified users</li>
                <li>Search the global registry to connect with collectors who share your interests</li>
                <li>Send and receive contact requests to collaborate and share knowledge</li>
              </ol>
            </section>

            <section>
              <h2 className="text-black mb-3">Your Membership</h2>
              <div className="bg-neutral-50 rounded-lg p-4 border border-neutral-200">
                <div className="flex items-center gap-2 mb-2">
                  <Shield className="w-5 h-5 text-black" />
                  <span className="text-black">Beta User</span>
                </div>
                <p className="text-sm text-neutral-600">
                  As a beta user, you have unlimited access to all features including unlimited 
                  catalog size, image uploads, and global search capabilities.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-black mb-3">Privacy & Security</h2>
              <p>
                We take your privacy seriously. Your collection data is private by default. Only 
                information you explicitly choose to share through the "Make Discoverable" option 
                will be visible to other users. We never sell or share your personal information 
                with third parties.
              </p>
            </section>

            <section>
              <h2 className="text-black mb-3">Support</h2>
              <p>
                Need help or have questions? Visit the Contact Support page from your dashboard 
                to send us a message. We're here to help you make the most of Valor Registry.
              </p>
            </section>
          </div>
        </div>

        <div className="text-center text-sm text-neutral-600 space-y-1">
          <p>© 2024 Valor Registry. Built for military medal collectors and historians.</p>
          <p className="font-mono text-neutral-500">{getFullVersionString()} • Released {VERSION.releaseDate}</p>
        </div>
      </main>
    </div>
  );
}