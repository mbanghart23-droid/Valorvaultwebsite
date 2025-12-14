import { useState, useEffect } from 'react';
import { Shield } from 'lucide-react';

interface RegisterProps {
  onRegister: (name: string, email: string, password: string) => Promise<void>;
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

  useEffect(() => {
    // Generate new CAPTCHA on mount
    generateCaptcha();
  }, []);

  const generateCaptcha = () => {
    const num1 = Math.floor(Math.random() * 10) + 1;
    const num2 = Math.floor(Math.random() * 10) + 1;
    setCaptchaQuestion({ num1, num2, answer: num1 + num2 });
    setCaptchaAnswer('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

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

    if (password !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }
    onRegister(name, email, password);
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-black rounded-lg mb-4">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-black mb-2">Valor Vault</h1>
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