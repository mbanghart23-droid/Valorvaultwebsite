import { useState, useEffect } from 'react';
import { ArrowLeft, LogOut, Mail, Send } from 'lucide-react';
import { sendSupportMessage } from '../utils/api/support';
import { toast } from 'sonner@2.0.3';

interface ContactSupportProps {
  accessToken: string;
  onBack: () => void;
  onLogout: () => void;
}

export function ContactSupport({ accessToken, onBack, onLogout }: ContactSupportProps) {
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [captchaAnswer, setCaptchaAnswer] = useState('');
  const [captchaQuestion, setCaptchaQuestion] = useState({ num1: 0, num2: 0, answer: 0 });
  const [honeypot, setHoneypot] = useState(''); // Spam trap
  const [submitted, setSubmitted] = useState(false);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Check honeypot (should be empty)
    if (honeypot !== '') {
      console.log('Spam detected');
      return;
    }

    // Check CAPTCHA
    if (parseInt(captchaAnswer) !== captchaQuestion.answer) {
      toast.error('Incorrect answer to security question. Please try again.');
      generateCaptcha();
      return;
    }

    // Send support request to backend
    const result = await sendSupportMessage(subject, message, accessToken);
    
    if (result.success) {
      toast.success('Support request sent successfully! We will respond via email.');
      setSubmitted(true);
      
      // Reset form after a delay
      setTimeout(() => {
        setSubject('');
        setMessage('');
        setCaptchaAnswer('');
        setSubmitted(false);
        generateCaptcha();
      }, 3000);
    } else {
      toast.error(result.error || 'Failed to send support request. Please try again.');
      generateCaptcha(); // Regenerate CAPTCHA on error
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
            <Mail className="w-6 h-6 text-black" />
            <h1 className="text-black">Contact Support</h1>
          </div>
          <p className="text-neutral-600">
            Have questions or experiencing issues? Send us a message and we'll get back to you as soon as possible.
          </p>
        </div>

        <div className="bg-white border border-neutral-200 rounded-xl p-8">
          {submitted ? (
            <div className="text-center py-12">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                <Send className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-black mb-2">Message Sent!</h3>
              <p className="text-neutral-600">
                Thank you for contacting us. We'll review your message and respond shortly.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
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
                <label htmlFor="subject" className="block text-neutral-700 mb-2">
                  Subject *
                </label>
                <select
                  id="subject"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full px-4 py-2.5 bg-white border border-neutral-300 rounded-lg text-black focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-colors"
                  required
                >
                  <option value="">Select a subject</option>
                  <option value="account">Account Issues</option>
                  <option value="technical">Technical Problems</option>
                  <option value="feature">Feature Request</option>
                  <option value="data">Data/Collection Issues</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label htmlFor="message" className="block text-neutral-700 mb-2">
                  Message *
                </label>
                <textarea
                  id="message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={8}
                  className="w-full px-4 py-2.5 bg-white border border-neutral-300 rounded-lg text-black placeholder-neutral-400 focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-colors"
                  placeholder="Please describe your issue or question in detail..."
                  required
                />
              </div>

              {/* CAPTCHA */}
              <div>
                <label htmlFor="captcha" className="block text-neutral-700 mb-2">
                  Security Check: What is {captchaQuestion.num1} + {captchaQuestion.num2}? *
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
                className="w-full flex items-center justify-center gap-2 bg-black hover:bg-neutral-800 text-white py-3 rounded-lg transition-colors"
              >
                <Send className="w-5 h-5" />
                Send Message
              </button>
            </form>
          )}
        </div>

        <div className="mt-8 bg-neutral-100 border border-neutral-200 rounded-xl p-6">
          <h3 className="text-black mb-3">Additional Resources</h3>
          <ul className="space-y-2 text-neutral-700">
            <li>• For account activation issues, please allow 24-48 hours for admin review</li>
            <li>• Make sure your collection is set to "discoverable" in your profile settings to appear in global searches</li>
            <li>• Contact requests are sent directly to collection owners for privacy</li>
            <li>• All data is stored securely and is only visible to you unless you enable discoverability</li>
          </ul>
        </div>
      </div>
    </div>
  );
}