import { ArrowLeft, LogOut, Lock } from 'lucide-react';

interface PrivacyPolicyProps {
  onBack: () => void;
  onLogout: () => void;
}

export function PrivacyPolicy({ onBack, onLogout }: PrivacyPolicyProps) {
  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6 flex items-center justify-between">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-neutral-600 hover:text-black transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Back
          </button>
          <button
            onClick={onLogout}
            className="flex items-center gap-2 px-4 py-2 bg-neutral-100 hover:bg-neutral-200 text-black rounded-lg transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>

        <div className="bg-white border border-neutral-200 rounded-xl p-8">
          <div className="flex items-center gap-3 mb-6">
            <Lock className="w-6 h-6 text-black" />
            <h1 className="text-black">Privacy Policy</h1>
          </div>

          <div className="prose prose-neutral max-w-none">
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
              <p className="text-amber-900 text-sm mb-0">
                <strong>Important Notice:</strong> This is a demonstration mockup created for developer quotes and planning purposes. 
                This privacy policy represents what would be implemented in a production version of Valor Registry.
              </p>
            </div>

            <p className="text-neutral-600 mb-6">
              Last Updated: December 13, 2024
            </p>

            <section className="mb-8">
              <h2 className="text-black mb-4">1. Introduction</h2>
              <p className="text-neutral-700 mb-4">
                Valor Registry ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy 
                explains how we collect, use, disclose, and safeguard your information when you use our Service.
              </p>
              <p className="text-neutral-700 mb-4">
                <strong>Please read this privacy policy carefully.</strong> If you do not agree with the terms 
                of this privacy policy, please do not access the Service.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-black mb-4">2. Information We Collect</h2>
              
              <h3 className="text-black mb-3 text-lg">Account Information</h3>
              <p className="text-neutral-700 mb-4">
                When you register for Valor Registry, we collect:
              </p>
              <ul className="text-neutral-700 mb-4 space-y-2">
                <li>• Name</li>
                <li>• Email address</li>
                <li>• Password (encrypted)</li>
                <li>• Optional profile information (location, specialization, bio)</li>
              </ul>

              <h3 className="text-black mb-3 text-lg">Collection Data</h3>
              <p className="text-neutral-700 mb-4">
                Information you voluntarily provide about your military medal collection:
              </p>
              <ul className="text-neutral-700 mb-4 space-y-2">
                <li>• Service member records (names, ranks, service numbers, biographical information)</li>
                <li>• Medal information (names, categories, dates, descriptions)</li>
                <li>• Collection details (condition, acquisition information, estimated values)</li>
                <li>• Images you upload (limited to 2 per record, max 5MB each)</li>
                <li>• Notes and descriptions</li>
              </ul>

              <h3 className="text-black mb-3 text-lg">Usage Information</h3>
              <p className="text-neutral-700 mb-4">
                We may collect information about how you access and use the Service, including:
              </p>
              <ul className="text-neutral-700 mb-4 space-y-2">
                <li>• Log data (IP address, browser type, pages visited)</li>
                <li>• Device information</li>
                <li>• Search queries within the application</li>
                <li>• Contact requests and messages sent through the platform</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-black mb-4">3. How We Use Your Information</h2>
              <p className="text-neutral-700 mb-4">
                We use the information we collect to:
              </p>
              <ul className="text-neutral-700 mb-4 space-y-2">
                <li>• Provide, maintain, and improve the Service</li>
                <li>• Create and manage your account</li>
                <li>• Process account activation requests</li>
                <li>• Enable search and discovery features (only if you opt-in to discoverability)</li>
                <li>• Facilitate contact requests between users</li>
                <li>• Send administrative notifications</li>
                <li>• Respond to support requests</li>
                <li>• Detect and prevent fraud, spam, and abuse</li>
                <li>• Comply with legal obligations</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-black mb-4">4. Information Sharing and Disclosure</h2>
              
              <h3 className="text-black mb-3 text-lg">Default Privacy</h3>
              <p className="text-neutral-700 mb-4">
                Your collection is <strong>private by default</strong>. We do not share your collection data 
                with other users unless you explicitly enable the "discoverable" setting in your profile.
              </p>

              <h3 className="text-black mb-3 text-lg">Discoverable Collections</h3>
              <p className="text-neutral-700 mb-4">
                If you enable discoverability:
              </p>
              <ul className="text-neutral-700 mb-4 space-y-2">
                <li>• Other verified users can see your service member records and medal information in global search</li>
                <li>• Your name is visible as the collection owner</li>
                <li>• Other users can send you contact requests (you approve before contact info is shared)</li>
                <li>• You can disable discoverability at any time</li>
              </ul>

              <h3 className="text-black mb-3 text-lg">We Do NOT Sell Your Data</h3>
              <p className="text-neutral-700 mb-4">
                We do not sell, rent, or trade your personal information to third parties for marketing purposes.
              </p>

              <h3 className="text-black mb-3 text-lg">Service Providers</h3>
              <p className="text-neutral-700 mb-4">
                We may share your information with trusted third-party service providers who assist in operating 
                the Service (e.g., hosting, database management, email delivery). These providers are bound by 
                confidentiality agreements.
              </p>

              <h3 className="text-black mb-3 text-lg">Legal Requirements</h3>
              <p className="text-neutral-700 mb-4">
                We may disclose your information if required by law, court order, or governmental authority.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-black mb-4">5. Data Security</h2>
              <p className="text-neutral-700 mb-4">
                We implement reasonable security measures to protect your information, including:
              </p>
              <ul className="text-neutral-700 mb-4 space-y-2">
                <li>• Encrypted passwords</li>
                <li>• Secure HTTPS connections</li>
                <li>• Admin-moderated account activation</li>
                <li>• CAPTCHA and honeypot spam protection</li>
                <li>• Regular security updates</li>
              </ul>
              <p className="text-neutral-700 mb-4">
                <strong>However,</strong> no method of transmission over the Internet is 100% secure. While we 
                strive to protect your data, we cannot guarantee absolute security.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-black mb-4">6. Data Retention</h2>
              <p className="text-neutral-700 mb-4">
                We retain your account and collection data for as long as your account is active or as needed 
                to provide the Service. If you wish to delete your account, please contact support.
              </p>
              <p className="text-neutral-700 mb-4">
                Upon account deletion, we will remove your personal information within 30 days, except where 
                retention is required by law.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-black mb-4">7. Your Privacy Rights</h2>
              <p className="text-neutral-700 mb-4">
                Depending on your location, you may have the following rights:
              </p>
              <ul className="text-neutral-700 mb-4 space-y-2">
                <li>• <strong>Access:</strong> Request a copy of the personal information we hold about you</li>
                <li>• <strong>Correction:</strong> Request correction of inaccurate information</li>
                <li>• <strong>Deletion:</strong> Request deletion of your account and data</li>
                <li>• <strong>Portability:</strong> Request export of your collection data</li>
                <li>• <strong>Opt-out:</strong> Disable discoverability at any time</li>
                <li>• <strong>Withdraw consent:</strong> Withdraw consent for data processing where applicable</li>
              </ul>
              <p className="text-neutral-700 mb-4">
                To exercise these rights, please contact us through the Support feature.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-black mb-4">8. Children's Privacy</h2>
              <p className="text-neutral-700 mb-4">
                Valor Registry is not intended for use by individuals under the age of 18. We do not knowingly 
                collect personal information from children. If you believe a child has provided us with personal 
                information, please contact us immediately.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-black mb-4">9. International Users</h2>
              <p className="text-neutral-700 mb-4">
                If you access Valor Registry from outside the United States, please be aware that your information 
                may be transferred to, stored, and processed in the United States where our servers are located.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-black mb-4">10. Cookies and Tracking</h2>
              <p className="text-neutral-700 mb-4">
                We may use cookies and similar tracking technologies to maintain your session and improve your 
                experience. You can control cookie settings through your browser preferences.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-black mb-4">11. Third-Party Links</h2>
              <p className="text-neutral-700 mb-4">
                The Service may contain links to third-party websites. We are not responsible for the privacy 
                practices of these external sites. We encourage you to review their privacy policies.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-black mb-4">12. Changes to This Privacy Policy</h2>
              <p className="text-neutral-700 mb-4">
                We may update this Privacy Policy from time to time. We will notify you of significant changes 
                via email or through a notice on the Service. The "Last Updated" date at the top of this policy 
                indicates when it was last revised.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-black mb-4">13. Contact Us</h2>
              <p className="text-neutral-700 mb-4">
                If you have questions or concerns about this Privacy Policy or our data practices, please contact 
                us using the Contact Support feature within the application.
              </p>
            </section>

            <div className="bg-neutral-100 border border-neutral-200 rounded-lg p-4 mt-8">
              <p className="text-neutral-700 text-sm mb-2">
                <strong>Important Reminder:</strong> Valor Registry is not designed for storing highly sensitive 
                personal information or PII requiring GDPR, HIPAA, or similar compliance. Please use the platform 
                responsibly and only for its intended purpose as a military medal collection catalog.
              </p>
              <p className="text-neutral-700 text-sm mb-0">
                By using Valor Registry, you acknowledge that you have read and understood this Privacy Policy.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}