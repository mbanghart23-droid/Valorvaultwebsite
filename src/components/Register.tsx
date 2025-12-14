import { useState, useEffect } from 'react';
import { Shield, Check } from 'lucide-react';
import { getActiveTiers, MembershipTier } from '../utils/membershipTiers';

interface RegisterProps {
  onRegister: (name: string, email: string, password: string, membershipTier: string) => Promise<void>;
  onSwitchToLogin: () => void;
}

export function Register({ onRegister, onSwitchToLogin }: RegisterProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [captchaAnswer, setCaptchaAnswer] = useState('');
  const [captchaQuestion, setCaptchaQuestion] = useState({ num1: 0, num2: 0, answer: 0 });
  const [honeypot, setHoneypot] = useState(''); // Spam trap
  const [passwordError, setPasswordError] = useState('');
  const [membershipTiers, setMembershipTiers] = useState<MembershipTier[]>([]);

  useEffect(() => {
    // Generate new CAPTCHA on mount
    generateCaptcha();
    // Load active membership tiers
    setMembershipTiers(getActiveTiers());
  }, []);

  const generateCaptcha = () => {
    const num1 = Math.floor(Math.random() * 10) + 1;
    const num2 = Math.floor(Math.random() * 10) + 1;
    setCaptchaQuestion({ num1, num2, answer: num1 + num2 });
    setCaptchaAnswer('');
  };

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError('');

    // Check honeypot (should be empty)
    if (honeypot !== '') {
      console.log('Spam detected');
      return;
    }

    // Check CAPTCHA
    if (parseInt(captchaAnswer) !== captchaQuestion.answer) {
      alert('Incorrect answer to security question. Please try again.');
      generateCaptcha();
      return;
    }

    // Validate password complexity
    const validationError = validatePassword(password);
    if (validationError) {
      setPasswordError(validationError);
      return;
    }

    if (password !== confirmPassword) {
      setPasswordError('Passwords do not match');
      return;
    }
    onRegister(name, email, password, membershipTiers[0].id);
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-black rounded-lg mb-4">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-black mb-2">Valor Registry</h1>
          <p className="text-neutral-600">Preserve the legacy of courage</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-8 border border-neutral-200">
          <h2 className="text-black mb-6">Create Account</h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Honeypot field - hidden from real users */}
            <div className="hidden">
              <input
                type="text"
                value={honeypot}
                onChange={(e) => setHoneypot(e.target.value)}
                tabIndex={-1}
                autoComplete="off"
              />
            </div>

            <div>
              <label htmlFor="name" className="block text-neutral-700 mb-2">
                Full Name
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2.5 bg-white border border-neutral-300 rounded-lg text-black placeholder-neutral-400 focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-colors"
                placeholder="John Doe"
                required
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-neutral-700 mb-2">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2.5 bg-white border border-neutral-300 rounded-lg text-black placeholder-neutral-400 focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-colors"
                placeholder="your@email.com"
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-neutral-700 mb-2">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2.5 bg-white border border-neutral-300 rounded-lg text-black placeholder-neutral-400 focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-colors"
                placeholder="••••••••"
                required
              />
              <p className="text-neutral-600 text-sm mt-2">
                Must be at least 8 characters with uppercase, lowercase, and numbers
              </p>
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-neutral-700 mb-2">
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-2.5 bg-white border border-neutral-300 rounded-lg text-black placeholder-neutral-400 focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-colors"
                placeholder="••••••••"
                required
              />
            </div>

            {passwordError && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {passwordError}
              </div>
            )}

            {/* Membership Tier Selection */}
            {membershipTiers.length > 0 && (
              <div>
                <label className="block text-neutral-700 mb-3">
                  Membership Plan
                </label>
                <div className="space-y-3">
                  {membershipTiers.map((tier) => (
                    <div
                      key={tier.id}
                      className="border-2 border-black bg-neutral-50 rounded-lg p-4"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="text-black">{tier.name}</h3>
                          <p className="text-neutral-600 text-sm">{tier.description}</p>
                        </div>
                        {tier.price === 0 && (
                          <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
                            Free
                          </span>
                        )}
                      </div>
                      <ul className="space-y-2 mt-3">
                        {tier.features.map((feature, index) => (
                          <li key={index} className="flex items-center gap-2 text-sm text-neutral-700">
                            <Check className="w-4 h-4 text-green-600 flex-shrink-0" />
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* CAPTCHA */}
            <div>
              <label htmlFor="captcha" className="block text-neutral-700 mb-2">
                Security Check: What is {captchaQuestion.num1} + {captchaQuestion.num2}?
              </label>
              <input
                id="captcha"
                type="number"
                value={captchaAnswer}
                onChange={(e) => setCaptchaAnswer(e.target.value)}
                className="w-full px-4 py-2.5 bg-white border border-neutral-300 rounded-lg text-black placeholder-neutral-400 focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-colors"
                placeholder="Enter answer"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-black hover:bg-neutral-800 text-white py-3 rounded-lg transition-colors"
            >
              Create Account
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-neutral-600">
              Already have an account?{' '}
              <button
                onClick={onSwitchToLogin}
                className="text-black hover:underline transition-colors"
              >
                Sign In
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}