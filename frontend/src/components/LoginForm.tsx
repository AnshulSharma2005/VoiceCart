import React, { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, LogIn, Loader2 } from 'lucide-react';

interface LoginFormProps {
  onLogin: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  onSwitchToSignup: () => void;
  isLoading: boolean;
  error?: string;
}

export function LoginForm({ onLogin, onSwitchToSignup, isLoading, error }: LoginFormProps) {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const errors: Record<string, string> = {};

    if (!formData.email) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Please enter a valid email';
    }

    if (!formData.password) {
      errors.password = 'Password is required';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    const result = await onLogin(formData.email, formData.password);
    if (!result.success) {
      // Error is handled by the parent component
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear validation error when user starts typing
    if (validationErrors[field]) {
      setValidationErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <div className="w-full max-w-md">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <LogIn className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
          Welcome Back
        </h1>
        <p className="text-gray-600 mt-2">Sign in to your voice shopping assistant</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="p-4 bg-red-100 border border-red-200 rounded-xl">
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        )}

        {/* Email Field */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
            Email Address
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Mail className="h-5 w-5 text-gray-400" />
            </div>
            <input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              className={`
                block w-full pl-10 pr-3 py-3 border rounded-xl
                focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent
                transition-all duration-200
                ${validationErrors.email 
                  ? 'border-red-300 bg-red-50' 
                  : 'border-gray-300 bg-white hover:border-gray-400'
                }
              `}
              placeholder="Enter your email"
              disabled={isLoading}
            />
          </div>
          {validationErrors.email && (
            <p className="mt-1 text-sm text-red-600">{validationErrors.email}</p>
          )}
        </div>

        {/* Password Field */}
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
            Password
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Lock className="h-5 w-5 text-gray-400" />
            </div>
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              value={formData.password}
              onChange={(e) => handleInputChange('password', e.target.value)}
              className={`
                block w-full pl-10 pr-12 py-3 border rounded-xl
                focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent
                transition-all duration-200
                ${validationErrors.password 
                  ? 'border-red-300 bg-red-50' 
                  : 'border-gray-300 bg-white hover:border-gray-400'
                }
              `}
              placeholder="Enter your password"
              disabled={isLoading}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
              disabled={isLoading}
            >
              {showPassword ? (
                <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
              ) : (
                <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
              )}
            </button>
          </div>
          {validationErrors.password && (
            <p className="mt-1 text-sm text-red-600">{validationErrors.password}</p>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="
            w-full flex items-center justify-center px-4 py-3 
            bg-gradient-to-r from-purple-600 to-pink-600 
            hover:from-purple-700 hover:to-pink-700
            text-white font-medium rounded-xl
            focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2
            disabled:opacity-50 disabled:cursor-not-allowed
            transition-all duration-200 transform hover:scale-[1.02]
          "
        >
          {isLoading ? (
            <>
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              Signing In...
            </>
          ) : (
            <>
              <LogIn className="w-5 h-5 mr-2" />
              Sign In
            </>
          )}
        </button>
      </form>

      {/* Switch to Signup */}
      <div className="mt-8 text-center">
        <p className="text-gray-600">
          Don't have an account?{' '}
          <button
            onClick={onSwitchToSignup}
            className="text-purple-600 hover:text-purple-700 font-medium transition-colors"
            disabled={isLoading}
          >
            Sign up here
          </button>
        </p>
      </div>
    </div>
  );
}