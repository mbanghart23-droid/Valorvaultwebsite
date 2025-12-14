import { useState, useEffect } from 'react';
import { Lock, Eye, EyeOff, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface ResetPasswordProps {
  token: string;
  onSuccess: () => void;
  onBack: () => void;
}

export function ResetPassword({ token, onSuccess, onBack }: ResetPasswordProps) {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');
  const [passwordErrors, setPasswordErrors] = useState<string[]>([]);

  useEffect(() => {
    // Validate password as user types
    validatePassword(newPassword);
  }, [newPassword]);

  const validatePassword = (password: string): boolean => {
    const errors: string[] = [];

    if (password.length > 0) {
      if (password.length < 8) {
        errors.push('At least 8 characters');
      }
      if (!/[a-z]/.test(password)) {
        errors.push('One lowercase letter');
      }
      if (!/[A-Z]/.test(password)) {
        errors.push('One uppercase letter');
      }
      if (!/\d/.test(password)) {
        errors.push('One number');
      }
    }

    setPasswordErrors(errors);
    return errors.length === 0 && password.length >= 8;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!newPassword || !confirmPassword) {
      setError('Please fill in all fields');
      return;
    }

    if (!validatePassword(newPassword)) {
      setError('Password does not meet requirements');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(
        `https://${import.meta.env.VITE_SUPABASE_PROJECT_ID || 'placeholder'}.supabase.co/functions/v1/make-server-8db4ea83/auth/reset-password`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            token,
            newPassword,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to reset password');
      }

      setIsSuccess(true);
      toast.success('Password successfully reset!');
      
      // Redirect to login after 2 seconds
      setTimeout(() => {
        onSuccess();
      }, 2000);
    } catch (err: any) {
      console.error('Reset password error:', err);
      const errorMessage = err.message || 'Failed to reset password. Please try again.';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-2xl mb-4">Password Reset Successful!</h2>
            <p className="text-gray-600 mb-6">
              Your password has been successfully changed. You can now log in with your new password.
            </p>
            <div className="text-sm text-gray-500">
              Redirecting to login page...
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
            <Lock className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-2xl mb-2">Reset Your Password</h2>
          <p className="text-gray-600">
            Choose a strong password for your account
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-md flex items-start">
              <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <div>
            <label className="block text-sm mb-2">New Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter new password"
                className="w-full pl-10 pr-12 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-red-500"
                disabled={isLoading}
                autoFocus
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            
            {/* Password requirements */}
            <div className="mt-2 space-y-1">
              <p className="text-xs text-gray-600">Password must contain:</p>
              <ul className="text-xs space-y-1">
                <li className={newPassword.length >= 8 ? 'text-green-600' : 'text-gray-500'}>
                  {newPassword.length >= 8 ? '✓' : '○'} At least 8 characters
                </li>
                <li className={/[a-z]/.test(newPassword) ? 'text-green-600' : 'text-gray-500'}>
                  {/[a-z]/.test(newPassword) ? '✓' : '○'} One lowercase letter
                </li>
                <li className={/[A-Z]/.test(newPassword) ? 'text-green-600' : 'text-gray-500'}>
                  {/[A-Z]/.test(newPassword) ? '✓' : '○'} One uppercase letter
                </li>
                <li className={/\d/.test(newPassword) ? 'text-green-600' : 'text-gray-500'}>
                  {/\d/.test(newPassword) ? '✓' : '○'} One number
                </li>
              </ul>
            </div>
          </div>

          <div>
            <label className="block text-sm mb-2">Confirm New Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm new password"
                className="w-full pl-10 pr-12 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-red-500"
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            {confirmPassword && newPassword !== confirmPassword && (
              <p className="text-xs text-red-600 mt-1">Passwords do not match</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading || passwordErrors.length > 0 || !newPassword || !confirmPassword}
            className="w-full bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Resetting Password...
              </>
            ) : (
              'Reset Password'
            )}
          </button>

          <div className="text-center text-sm text-gray-600">
            <button
              type="button"
              onClick={onBack}
              className="text-red-600 hover:text-red-700 font-medium"
            >
              Back to Login
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
