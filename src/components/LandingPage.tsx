import { Shield, Users, Award, Search, Lock, Globe, CheckCircle, ArrowLeft, LogOut, AlertTriangle } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface LandingPageProps {
  onBack: () => void;
  onLogout: () => void;
  onViewTermsOfService?: () => void;
  onViewPrivacyPolicy?: () => void;
  onGetStarted?: () => void;
  onSignIn?: () => void;
}

export function LandingPage({ onBack, onLogout, onViewTermsOfService, onViewPrivacyPolicy, onGetStarted, onSignIn }: LandingPageProps) {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-neutral-200 sticky top-0 bg-white z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 bg-black rounded-lg">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-black">Valor Vault</h1>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={onSignIn || onBack}
                className="px-6 py-2 text-black hover:text-neutral-600 transition-colors"
              >
                Sign In
              </button>
              <button
                onClick={onGetStarted || onBack}
                className="px-6 py-2 bg-black hover:bg-neutral-800 text-white rounded-lg transition-colors"
              >
                Get Started
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-black text-white py-20 relative overflow-hidden">
        {/* Hero Background Image */}
        <div className="absolute inset-0 opacity-20">
          <ImageWithFallback
            src="https://images.unsplash.com/photo-1621255243199-6696f1883bdf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtaWxpdGFyeSUyMGhvbm9yJTIwbWVtb3JpYWx8ZW58MXx8fHwxNzY1NjcwMTM2fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
            alt="Military memorial"
            className="w-full h-full object-cover"
          />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Important Disclaimer Banner */}
          <div className="bg-amber-600 text-white rounded-xl p-6 mb-8">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-6 h-6 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="text-white mb-2">Important Demonstration Notice</h3>
                <p className="text-white/90 text-sm mb-2">
                  This is a mockup application created for developer quotes and planning purposes. It demonstrates 
                  the intended functionality of Valor Vault but is not a production system.
                </p>
                <p className="text-white/90 text-sm">
                  <strong>Data Security Notice:</strong> Valor Vault is designed for cataloging military medal collections 
                  and is NOT intended for storing highly sensitive Personally Identifiable Information (PII), financial data, 
                  or information requiring GDPR/HIPAA compliance. Use responsibly.
                </p>
              </div>
            </div>
          </div>

          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl mb-6">Preserve the Legacy of Courage</h1>
            <p className="text-xl text-white/80 mb-6">
              Valor Vault is a secure platform for cataloging and preserving military medal collections, 
              documenting the service members who earned them, and connecting with fellow collectors.
            </p>
            <p className="text-lg text-white/90 mb-2">
              <strong>Important:</strong> Do not upload sensitive, illegal, or personally identifiable information. 
              This platform is designed for historical cataloging purposes only.
            </p>
            <p className="text-sm text-white/80">
              Any inappropriate content will be reported to the appropriate authorities.
            </p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-neutral-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-black mb-4">Everything You Need to Preserve History</h2>
            <p className="text-neutral-600 max-w-2xl mx-auto">
              Built specifically for military medal collectors, historians, and researchers who want to 
              document service members and their decorations.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-white border border-neutral-200 rounded-xl p-6">
              <div className="w-12 h-12 bg-black rounded-lg flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-black mb-3">Person-Focused Cataloging</h3>
              <p className="text-neutral-600">
                Document service members with detailed biographical information, service history, and 
                complete medal records—both medals you own and those they were entitled to.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white border border-neutral-200 rounded-xl p-6">
              <div className="w-12 h-12 bg-black rounded-lg flex items-center justify-center mb-4">
                <Award className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-black mb-3">Complete Medal Tracking</h3>
              <p className="text-neutral-600">
                Track medals in your collection with condition reports, acquisition details, and estimated 
                values. Also catalog entitled medals you're still searching for.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white border border-neutral-200 rounded-xl p-6">
              <div className="w-12 h-12 bg-black rounded-lg flex items-center justify-center mb-4">
                <Search className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-black mb-3">Advanced Search</h3>
              <p className="text-neutral-600">
                Filter by country, era, branch, unit, and more. Search across your collection or 
                explore discoverable collections from other verified collectors.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="bg-white border border-neutral-200 rounded-xl p-6">
              <div className="w-12 h-12 bg-black rounded-lg flex items-center justify-center mb-4">
                <Globe className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-black mb-3">Global Discovery</h3>
              <p className="text-neutral-600">
                Optionally make your collection discoverable to other verified collectors. Connect with 
                researchers and enthusiasts who share your interests.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="bg-white border border-neutral-200 rounded-xl p-6">
              <div className="w-12 h-12 bg-black rounded-lg flex items-center justify-center mb-4">
                <Lock className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-black mb-3">Privacy Controls</h3>
              <p className="text-neutral-600">
                Your collection is private by default. Control exactly what's visible and who can contact 
                you. All contact requests require your approval.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="bg-white border border-neutral-200 rounded-xl p-6">
              <div className="w-12 h-12 bg-black rounded-lg flex items-center justify-center mb-4">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-black mb-3">Admin Verified</h3>
              <p className="text-neutral-600">
                All new accounts require admin activation to maintain a trusted community. Spam protection 
                on all forms keeps your experience clean and professional.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-black mb-4">How Valor Vault Works</h2>
            <p className="text-neutral-600 max-w-2xl mx-auto">
              Getting started is simple. Here's how to begin cataloging your collection.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-black text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl">
                1
              </div>
              <h4 className="text-black mb-2">Register</h4>
              <p className="text-neutral-600 text-sm">
                Create your account with spam-protected registration
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-black text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl">
                2
              </div>
              <h4 className="text-black mb-2">Wait for Activation</h4>
              <p className="text-neutral-600 text-sm">
                Admin reviews and activates your account (usually within 24-48 hours)
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-black text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl">
                3
              </div>
              <h4 className="text-black mb-2">Add Service Members</h4>
              <p className="text-neutral-600 text-sm">
                Document the people behind the medals with full biographical details
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-black text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl">
                4
              </div>
              <h4 className="text-black mb-2">Catalog Medals</h4>
              <p className="text-neutral-600 text-sm">
                Add medals you own and track those you're still searching for
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* What You Can Track */}
      <section className="py-20 bg-neutral-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="order-2 lg:order-1">
              <h2 className="text-black mb-6">Comprehensive Documentation</h2>
              <p className="text-neutral-600 mb-8">
                Valor Vault allows you to maintain detailed records that go far beyond simple inventory. 
                Document the full story of each service member and their decorations.
              </p>

              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="text-black mb-1">Service Member Details</h4>
                    <p className="text-neutral-600 text-sm">
                      Name, rank, service number, branch, unit, dates of service, biography, notes, and up to 2 images per record
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="text-black mb-1">Medal Information</h4>
                    <p className="text-neutral-600 text-sm">
                      Medal name, category, date awarded, country, branch, era, and detailed descriptions
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="text-black mb-1">Collection Management</h4>
                    <p className="text-neutral-600 text-sm">
                      Condition, acquisition details, source, estimated value, serial numbers, and notes
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="text-black mb-1">Wishlist Tracking</h4>
                    <p className="text-neutral-600 text-sm">
                      Track medals the service member was entitled to that you don't yet have in your collection
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="order-1 lg:order-2">
              <div className="relative rounded-xl overflow-hidden shadow-2xl">
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1613825787641-2dbbd4f96a1c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtaWxpdGFyeSUyMG1lZGFscyUyMGNvbGxlY3Rpb258ZW58MXx8fHwxNzY1NjcwMTM2fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                  alt="Military medals collection"
                  className="w-full h-[400px] object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Privacy & Security */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-black mb-4">Privacy & Security First</h2>
            <p className="text-neutral-600 max-w-2xl mx-auto">
              Your collection and personal information are protected with multiple layers of security and privacy controls.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="bg-neutral-50 border border-neutral-200 rounded-xl p-6">
              <Lock className="w-8 h-8 text-black mb-3" />
              <h4 className="text-black mb-2">Private by Default</h4>
              <p className="text-neutral-600 text-sm">
                Your collection is completely private unless you choose to make it discoverable. 
                You control what information is visible to others.
              </p>
            </div>

            <div className="bg-neutral-50 border border-neutral-200 rounded-xl p-6">
              <Shield className="w-8 h-8 text-black mb-3" />
              <h4 className="text-black mb-2">Admin Moderation</h4>
              <p className="text-neutral-600 text-sm">
                All accounts are manually reviewed and activated by administrators to ensure a 
                trusted, professional community of collectors and researchers.
              </p>
            </div>

            <div className="bg-neutral-50 border border-neutral-200 rounded-xl p-6">
              <Users className="w-8 h-8 text-black mb-3" />
              <h4 className="text-black mb-2">Controlled Contact</h4>
              <p className="text-neutral-600 text-sm">
                Other users can only contact you through approval-based requests. You decide 
                whether to share your contact information with interested parties.
              </p>
            </div>

            <div className="bg-neutral-50 border border-neutral-200 rounded-xl p-6">
              <Globe className="w-8 h-8 text-black mb-3" />
              <h4 className="text-black mb-2">Spam Protection</h4>
              <p className="text-neutral-600 text-sm">
                All forms include CAPTCHA and honeypot protection to keep spam and automated 
                bots away from the community.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="flex items-center justify-center w-10 h-10 bg-white/20 rounded-lg">
                  <Shield className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-white">Valor Vault</h3>
              </div>
              <p className="text-white/70 text-sm">
                Preserving the legacy of courage through secure, detailed cataloging of military medals and the service members who earned them.
              </p>
            </div>

            <div>
              <h4 className="text-white mb-4">Platform</h4>
              <ul className="space-y-2 text-white/70 text-sm">
                <li>• Person-focused cataloging</li>
                <li>• Advanced search & filtering</li>
                <li>• Global discovery network</li>
                <li>• Admin verified accounts</li>
              </ul>
            </div>

            <div>
              <h4 className="text-white mb-4">Important Notes</h4>
              <ul className="space-y-2 text-white/70 text-sm">
                <li>• Not for PII or sensitive data</li>
                <li>• Mockup for developer quotes</li>
                <li>• All features are demonstrations</li>
                <li>• Contact admin for questions</li>
              </ul>
            </div>
          </div>

          <div className="border-t border-white/20 mt-8 pt-8 text-center text-white/70 text-sm">
            <p>© 2024 Valor Vault. Built for military medal collectors and historians.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}