import { Shield, Award, Users, Search, ArrowRight, Mail, Check } from 'lucide-react';
import badgeBanditLogo from 'figma:asset/515f45d68c39d27c4ecc63c260e45e06ae265dd8.png';
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
      {/* Simple Header */}
      <header className="border-b border-neutral-200 bg-white/95 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative flex items-center justify-center w-12 h-12 bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-900 rounded-xl shadow-lg">
                <Shield className="w-6 h-6 text-white" strokeWidth={2.5} />
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent rounded-xl"></div>
              </div>
              <div>
                <span className="text-black text-xl tracking-tight">Valor Registry</span>
                <div className="flex items-center gap-1 mt-0.5">
                  <div className="w-1 h-1 bg-amber-600 rounded-full"></div>
                  <div className="w-1 h-1 bg-amber-500 rounded-full"></div>
                  <div className="w-1 h-1 bg-amber-600 rounded-full"></div>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <a
                href="mailto:help@valorregistry.com"
                className="flex items-center gap-2 px-4 py-2 text-neutral-600 hover:text-black transition-colors"
              >
                <Mail className="w-4 h-4" />
                <span className="hidden sm:inline">Have Questions or Suggestions?</span>
              </a>
              <button
                onClick={onSignIn || onBack}
                className="px-5 py-2 text-black hover:text-neutral-600 transition-colors"
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

      {/* Hero Section with Historical Imagery */}
      <section className="relative bg-black text-white overflow-hidden">
        {/* Background Image Grid */}
        <div className="absolute inset-0 grid grid-cols-3 opacity-30">
          <div className="relative overflow-hidden">
            <ImageWithFallback
              src="https://images.unsplash.com/photo-1667406593453-5bc911f8dd50?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxCcml0aXNoJTIwbWlsaXRhcnklMjBtZWRhbHN8ZW58MXx8fHwxNzY1NzQ4MDExfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
              alt="British Military Medals"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="relative overflow-hidden">
            <ImageWithFallback
              src="https://images.unsplash.com/photo-1754838769624-7674168e5292?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxDb21tb253ZWFsdGglMjB3YXIlMjBncmF2ZXN8ZW58MXx8fHwxNzY1NzQ4MDEzfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
              alt="Commonwealth War Graves"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="relative overflow-hidden">
            <ImageWithFallback
              src="https://images.unsplash.com/photo-1621534864185-19a06671ed23?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxBbWVyaWNhbiUyMHZldGVyYW4lMjBtZW1vcmlhbHxlbnwxfHx8fDE3NjU3NDgwMTJ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
              alt="American Veteran Memorial"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
          <div className="max-w-3xl">
            <h1 className="text-5xl md:text-6xl mb-6 leading-tight">
              Preserve the Legacy<br />of Courage and Service
            </h1>
            <p className="text-xl text-white/90 mb-8 leading-relaxed">
              A secure platform for cataloging military medal collections and honoring the service members who earned them.
            </p>
            <div className="flex flex-wrap gap-4">
              <button
                onClick={onGetStarted || onBack}
                className="flex items-center gap-2 px-8 py-4 bg-white text-black hover:bg-neutral-100 rounded-lg transition-colors"
              >
                Start Your Collection
                <ArrowRight className="w-5 h-5" />
              </button>
              <button
                onClick={onSignIn || onBack}
                className="px-8 py-4 border-2 border-white text-white hover:bg-white/10 rounded-lg transition-colors"
              >
                Sign In
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid - Simple & Visual */}
      <section className="py-20 bg-neutral-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-white border border-neutral-200 rounded-xl p-8 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-black rounded-lg flex items-center justify-center mb-6">
                <Award className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-black mb-3">Document Every Medal</h3>
              <p className="text-neutral-600 leading-relaxed">
                Track medals in your collection and those service members were entitled to. Include detailed provenance, condition, and historical context.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white border border-neutral-200 rounded-xl p-8 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-black rounded-lg flex items-center justify-center mb-6">
                <Users className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-black mb-3">Person-Focused Records</h3>
              <p className="text-neutral-600 leading-relaxed">
                Create comprehensive profiles for each service member, documenting their service history, biography, and complete medal records.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white border border-neutral-200 rounded-xl p-8 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-black rounded-lg flex items-center justify-center mb-6">
                <Search className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-black mb-3">Re-Unite Broken Medal Groups</h3>
              <p className="text-neutral-600 leading-relaxed">
                Connect with collectors worldwide to reunite separated medal groups. Search the global registry to find missing pieces and restore complete sets to their rightful place in history.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Historical Image Showcase */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-neutral-700 mb-6 leading-relaxed">
                Catalog medals and decorations spanning multiple conflicts and eras. Whether you collect from the Anglo-Boer War, the Great War, World War II, or beyond, Valor Registry provides the tools to document and preserve these important historical artifacts.
              </p>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <p className="text-neutral-700">Track named and unnamed medals with detailed attribution</p>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <p className="text-neutral-700">Connect with collectors to reunite separated medal groups</p>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <p className="text-neutral-700">Upload historical photos and documentation</p>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <p className="text-neutral-700">Admin-approved community of verified collectors</p>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <div className="aspect-square rounded-lg overflow-hidden border border-neutral-200">
                  <ImageWithFallback
                    src="https://images.unsplash.com/photo-1603738528212-a984bf8e81f4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyZW1lbWJyYW5jZSUyMHBvcHB5JTIwbWVtb3JpYWx8ZW58MXx8fHwxNzY1NzQ4MDEzfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                    alt="Remembrance Poppy Memorial"
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="aspect-[4/3] rounded-lg overflow-hidden border border-neutral-200">
                  <ImageWithFallback
                    src="https://images.unsplash.com/photo-1720131749151-cf7d3d02a188?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtaWxpdGFyeSUyMHNlcnZpY2UlMjByaWJib25zfGVufDF8fHx8MTc2NTc0ODAxMnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                    alt="Military Service Ribbons"
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>
              </div>
              <div className="space-y-4 pt-8">
                <div className="aspect-[4/3] rounded-lg overflow-hidden border border-neutral-200">
                  <ImageWithFallback
                    src="https://images.unsplash.com/photo-1667406593453-5bc911f8dd50?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxCcml0aXNoJTIwbWlsaXRhcnklMjBtZWRhbHN8ZW58MXx8fHwxNzY1NzQ4MDExfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                    alt="British Military Medals"
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="aspect-square rounded-lg overflow-hidden border border-neutral-200">
                  <ImageWithFallback
                    src="https://images.unsplash.com/photo-1758204054877-fb1c7ba85ea1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aW50YWdlJTIwdW5pZm9ybSUyMHBvcnRyYWl0fGVufDF8fHx8MTc2NTc0ODAxM3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                    alt="Vintage Uniform Portrait"
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Simple CTA Section */}
      <section className="bg-black text-white py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-white mb-6">Ready to Start?</h2>
          <p className="text-white/80 text-xl mb-8">
            Create your account and begin cataloging your collection today. All new accounts are reviewed by administrators to maintain a trusted community.
          </p>
          <button
            onClick={onGetStarted || onBack}
            className="px-8 py-4 bg-white text-black hover:bg-neutral-100 rounded-lg transition-colors inline-flex items-center gap-2"
          >
            Create Free Account
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </section>

      {/* Partnership Section */}
      <section className="bg-white py-16 border-t border-neutral-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-center gap-8">
            <div className="text-center md:text-right">
              <p className="text-neutral-600 text-lg mb-2">Developed in partnership with</p>
              <p className="text-neutral-500 text-sm">Your trusted source for militaria, medals, and military history</p>
            </div>
            <a
              href="https://badgebandit.com"
              target="_blank"
              rel="noopener noreferrer"
              className="group"
            >
              <img
                src={badgeBanditLogo}
                alt="BadgeBandit.com - Militaria, Medals, History"
                className="h-32 w-auto transition-transform group-hover:scale-105"
              />
            </a>
          </div>
        </div>
      </section>

      {/* Simple Footer */}
      <footer className="bg-neutral-900 text-white/70 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="flex items-center justify-center w-10 h-10 bg-white/10 rounded-lg">
                  <Shield className="w-5 h-5 text-white" />
                </div>
                <span className="text-white">Valor Registry</span>
              </div>
              <p className="text-white/60 text-sm">
                Preserving the legacy of courage through secure, detailed cataloging of military medals.
              </p>
            </div>

            <div>
              <h4 className="text-white mb-4">Platform</h4>
              <ul className="space-y-2 text-sm">
                <li>Person-focused cataloging</li>
                <li>Advanced search & filtering</li>
                <li>Global discovery network</li>
                <li>Admin verified accounts</li>
              </ul>
            </div>

            <div>
              <h4 className="text-white mb-4">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <button
                    onClick={onViewTermsOfService}
                    className="text-white/70 hover:text-white transition-colors"
                  >
                    Terms of Service
                  </button>
                </li>
                <li>
                  <button
                    onClick={onViewPrivacyPolicy}
                    className="text-white/70 hover:text-white transition-colors"
                  >
                    Privacy Policy
                  </button>
                </li>
                <li className="text-white/60">Not for sensitive PII/financial data</li>
              </ul>
            </div>
          </div>

          <div className="border-t border-white/10 pt-8 text-center text-sm">
            <p>© 2024 Valor Registry. Built for military medal collectors and historians.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}