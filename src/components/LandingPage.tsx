import { Shield, Award, Users, Search, ArrowRight, Mail, Check } from 'lucide-react';
import badgeBanditLogo from 'figma:asset/5891d250c1c6c6df6be229a8f7939f21cc540fbb.png';
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

      {/* Badge Bandit Partnership - Prominent Section */}
      <section className="py-16 bg-gradient-to-br from-amber-50 via-white to-amber-50 border-y border-amber-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white border-2 border-amber-200 rounded-2xl shadow-xl overflow-hidden">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div className="p-8 md:p-12">
                <div className="inline-block px-4 py-1.5 bg-amber-100 text-amber-900 rounded-full text-sm mb-4">
                  Official Partner
                </div>
                <h2 className="text-black mb-4">Developed in Partnership with BadgeBandit.com</h2>
                <p className="text-neutral-700 mb-6 leading-relaxed">
                  BadgeBandit.com is your trusted source for authentic militaria, medals, and military history.
                </p>
                <a
                  href="https://badgebandit.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-black hover:bg-neutral-800 text-white rounded-lg transition-colors"
                >
                  Visit BadgeBandit.com
                  <ArrowRight className="w-4 h-4" />
                </a>
              </div>
              <div className="bg-gradient-to-br from-neutral-50 to-neutral-100 p-8 md:p-12 flex items-center justify-center">
                <a
                  href="https://badgebandit.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group"
                >
                  <img
                    src={badgeBanditLogo}
                    alt="BadgeBandit.com - Militaria, Medals, History"
                    className="h-48 w-auto transition-transform group-hover:scale-105 filter drop-shadow-lg"
                  />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Historical Image Showcase - Redesigned */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-black mb-4">A Complete Platform for Medal Collectors</h2>
            <p className="text-neutral-600 text-xl max-w-3xl mx-auto">
              Catalog medals and decorations spanning multiple conflicts and eras—from the Anglo-Boer War to modern campaigns.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Images Grid - Now on the Left */}
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-6">
                <div className="relative group overflow-hidden rounded-xl shadow-lg border-2 border-neutral-200">
                  <div className="aspect-square overflow-hidden">
                    <ImageWithFallback
                      src="https://images.unsplash.com/photo-1667918140078-9db890beab86?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxib2VyJTIwd2FyJTIwbWVkYWx8ZW58MXx8fHwxNzY1NzU4OTY3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                      alt="Boer War Medal"
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                </div>
                <div className="relative group overflow-hidden rounded-xl shadow-lg border-2 border-neutral-200">
                  <div className="aspect-[4/3] overflow-hidden">
                    <ImageWithFallback
                      src="https://images.unsplash.com/photo-1604263368964-458cd7644b37?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aW50YWdlJTIwbWlsaXRhcnklMjB1bmlmb3JtfGVufDF8fHx8MTc2NTc1ODc4NXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                      alt="Vintage Military Uniform"
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                </div>
              </div>
              <div className="space-y-6 pt-12">
                <div className="relative group overflow-hidden rounded-xl shadow-lg border-2 border-neutral-200">
                  <div className="aspect-[4/3] overflow-hidden">
                    <ImageWithFallback
                      src="https://images.unsplash.com/photo-1603455076861-ae8174b7432d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3YXIlMjBtZW1vcmlhbCUyMHdyZWF0aHxlbnwxfHx8fDE3NjU3NTg3ODR8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                      alt="War Memorial Wreath"
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                </div>
                <div className="relative group overflow-hidden rounded-xl shadow-lg border-2 border-neutral-200">
                  <div className="aspect-square overflow-hidden">
                    <ImageWithFallback
                      src="https://images.unsplash.com/photo-1668290547575-9746bd4a20e5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyZW1lbWJyYW5jZSUyMHBvcHB5JTIwd3JlYXRofGVufDF8fHx8MTc2NTc1ODkwOXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                      alt="Remembrance Poppy Wreath"
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                </div>
              </div>
            </div>

            {/* Features List - Now on the Right */}
            <div>
              <div className="space-y-6">
                <div className="flex items-start gap-4 p-6 bg-gradient-to-br from-green-50 to-white border-2 border-green-100 rounded-xl hover:shadow-lg transition-shadow">
                  <div className="flex-shrink-0 w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center">
                    <Check className="w-6 h-6 text-white" strokeWidth={3} />
                  </div>
                  <div>
                    <h4 className="text-black mb-2">Track Named & Unnamed Medals</h4>
                    <p className="text-neutral-600">Detailed attribution, provenance tracking, and historical documentation for every piece in your collection.</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-6 bg-gradient-to-br from-blue-50 to-white border-2 border-blue-100 rounded-xl hover:shadow-lg transition-shadow">
                  <div className="flex-shrink-0 w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
                    <Check className="w-6 h-6 text-white" strokeWidth={3} />
                  </div>
                  <div>
                    <h4 className="text-black mb-2">Connect & Reunite Medal Groups</h4>
                    <p className="text-neutral-600">Join a global network of collectors working to reunite separated medal groups and restore historical integrity.</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-6 bg-gradient-to-br from-amber-50 to-white border-2 border-amber-100 rounded-xl hover:shadow-lg transition-shadow">
                  <div className="flex-shrink-0 w-12 h-12 bg-amber-600 rounded-lg flex items-center justify-center">
                    <Check className="w-6 h-6 text-white" strokeWidth={3} />
                  </div>
                  <div>
                    <h4 className="text-black mb-2">Upload Photos & Documents</h4>
                    <p className="text-neutral-600">Preserve historical context with profile images, documentation, and detailed service records for each individual.</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-6 bg-gradient-to-br from-purple-50 to-white border-2 border-purple-100 rounded-xl hover:shadow-lg transition-shadow">
                  <div className="flex-shrink-0 w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center">
                    <Check className="w-6 h-6 text-white" strokeWidth={3} />
                  </div>
                  <div>
                    <h4 className="text-black mb-2">Verified Collector Community</h4>
                    <p className="text-neutral-600">All accounts are admin-approved to maintain a trusted, professional community of serious collectors and historians.</p>
                  </div>
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