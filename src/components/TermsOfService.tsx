import { ArrowLeft, LogOut, Shield } from 'lucide-react';

interface TermsOfServiceProps {
  onBack: () => void;
  onLogout: () => void;
}

export function TermsOfService({ onBack, onLogout }: TermsOfServiceProps) {
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
            <Shield className="w-6 h-6 text-black" />
            <h1 className="text-black">Terms of Service</h1>
          </div>

          <div className="prose prose-neutral max-w-none">
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
              <p className="text-amber-900 text-sm mb-0">
                <strong>Important Notice:</strong> This is a demonstration mockup created for developer quotes and planning purposes. 
                These terms represent what would be implemented in a production version of Valor Vault.
              </p>
            </div>

            <p className="text-neutral-600 mb-6">
              Last Updated: December 13, 2024
            </p>

            <section className="mb-8">
              <h2 className="text-black mb-4">1. Acceptance of Terms</h2>
              <p className="text-neutral-700 mb-4">
                By accessing and using Valor Vault ("the Service"), you accept and agree to be bound by the terms 
                and provision of this agreement. If you do not agree to these Terms of Service, please do not use the Service.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-black mb-4">2. Service Description</h2>
              <p className="text-neutral-700 mb-4">
                Valor Vault is a web-based platform designed to help military medal collectors catalog and document 
                service members and their decorations. The Service allows users to:
              </p>
              <ul className="text-neutral-700 mb-4 space-y-2">
                <li>• Create detailed records of service members and their medals</li>
                <li>• Track medals in their physical collection and entitled medals not yet acquired</li>
                <li>• Optionally make their collection discoverable to other verified users</li>
                <li>• Connect with other collectors through moderated contact requests</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-black mb-4">3. Account Registration and Activation</h2>
              <p className="text-neutral-700 mb-4">
                To use the Service, you must:
              </p>
              <ul className="text-neutral-700 mb-4 space-y-2">
                <li>• Provide accurate and complete registration information</li>
                <li>• Maintain the security of your account credentials</li>
                <li>• Wait for administrator approval before accessing the full platform</li>
                <li>• Notify us immediately of any unauthorized use of your account</li>
              </ul>
              <p className="text-neutral-700 mb-4">
                We reserve the right to reject or revoke account activation at our sole discretion.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-black mb-4">4. Prohibited Uses and Data Restrictions</h2>
              <p className="text-neutral-700 mb-4">
                <strong>IMPORTANT:</strong> Valor Vault is NOT designed or intended for:
              </p>
              <ul className="text-neutral-700 mb-4 space-y-2">
                <li>• Storage of Personally Identifiable Information (PII) beyond basic collector profiles</li>
                <li>• Sensitive personal data requiring GDPR, HIPAA, or similar compliance</li>
                <li>• Financial transactions or payment processing</li>
                <li>• Commercial sale or trading of medals</li>
                <li>• Any illegal activities or violation of export control laws</li>
              </ul>
              <p className="text-neutral-700 mb-4">
                You agree not to use the Service for any unlawful purpose or in any way that could damage, 
                disable, or impair the Service.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-black mb-4">5. Content and Intellectual Property</h2>
              <p className="text-neutral-700 mb-4">
                You retain ownership of the content you submit to Valor Vault. By uploading content, you grant 
                Valor Vault a limited license to store, display, and process your content solely for the purpose 
                of providing the Service.
              </p>
              <p className="text-neutral-700 mb-4">
                You represent that you have the right to upload all content and images you submit, and that 
                such content does not infringe on any third-party rights.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-black mb-4">6. Disclaimers and Limitations</h2>
              <p className="text-neutral-700 mb-4">
                <strong>Medal Valuations:</strong> Any estimated values you enter are for your personal record-keeping 
                only. Valor Vault does not provide professional appraisal services and makes no guarantees about 
                the accuracy of user-provided valuations.
              </p>
              <p className="text-neutral-700 mb-4">
                <strong>Historical Accuracy:</strong> While we encourage accurate documentation, Valor Vault does 
                not verify the historical accuracy of service records or medal entitlements. Users are responsible 
                for their own research and verification.
              </p>
              <p className="text-neutral-700 mb-4">
                <strong>Data Loss:</strong> While we implement reasonable security measures, we cannot guarantee 
                against data loss due to technical failures, security breaches, or other unforeseen circumstances. 
                Users are encouraged to maintain offline backups of critical information.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-black mb-4">7. Privacy and Discoverability</h2>
              <p className="text-neutral-700 mb-4">
                Your collection is private by default. You may opt-in to make your collection "discoverable" in 
                global search. You can change this setting at any time in your profile.
              </p>
              <p className="text-neutral-700 mb-4">
                Contact requests from other users require your approval before any contact information is shared. 
                See our Privacy Policy for more details on data handling.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-black mb-4">8. Termination</h2>
              <p className="text-neutral-700 mb-4">
                We reserve the right to terminate or suspend your account at any time for violations of these 
                Terms of Service, suspected fraudulent activity, or any other reason at our sole discretion.
              </p>
              <p className="text-neutral-700 mb-4">
                You may terminate your account at any time by contacting support. Upon termination, your data 
                will be removed in accordance with our Privacy Policy.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-black mb-4">9. Limitation of Liability</h2>
              <p className="text-neutral-700 mb-4">
                TO THE MAXIMUM EXTENT PERMITTED BY LAW, VALOR VAULT SHALL NOT BE LIABLE FOR ANY INDIRECT, 
                INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, OR ANY LOSS OF PROFITS OR REVENUES, 
                WHETHER INCURRED DIRECTLY OR INDIRECTLY, OR ANY LOSS OF DATA, USE, OR OTHER INTANGIBLE LOSSES.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-black mb-4">10. Changes to Terms</h2>
              <p className="text-neutral-700 mb-4">
                We reserve the right to modify these Terms of Service at any time. We will notify users of 
                significant changes via email or through the Service. Continued use of the Service after 
                changes constitutes acceptance of the modified terms.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-black mb-4">11. Contact Information</h2>
              <p className="text-neutral-700 mb-4">
                For questions about these Terms of Service, please use the Contact Support feature within the application.
              </p>
            </section>

            <div className="bg-neutral-100 border border-neutral-200 rounded-lg p-4 mt-8">
              <p className="text-neutral-700 text-sm mb-0">
                By creating an account and using Valor Vault, you acknowledge that you have read, understood, 
                and agree to be bound by these Terms of Service and our Privacy Policy.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
