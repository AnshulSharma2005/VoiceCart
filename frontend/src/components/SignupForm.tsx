import React, { useState } from 'react';
import { Mail, Lock, User, Eye, EyeOff, UserPlus, Loader2 } from 'lucide-react';

interface SignupFormProps {
  onSignup: (email: string, password: string, name: string) => Promise<{ success: boolean; error?: string }>;
  onSwitchToLogin: () => void;
  isLoading: boolean;
  error?: string;
}

export function SignupForm({ onSignup, onSwitchToLogin, isLoading, error }: SignupFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const errors: Record<string, string> = {};

    if (!formData.name.trim()) {
      errors.name = 'Name is required';
    } else if (formData.name.trim().length < 2) {
      errors.name = 'Name must be at least 2 characters';
    }

    if (!formData.email) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Please enter a valid email';
    }

    if (!formData.password) {
      errors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }

    if (!formData.confirmPassword) {
      errors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    const result = await onSignup(formData.email, formData.password, formData.name.trim());
    if (result.success) {
      // Success alert + redirect handled in App.tsx
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (validationErrors[field]) {
      setValidationErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <div className="w-full max-w-md">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <UserPlus className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-500 to-teal-600 bg-clip-text text-transparent">
          Create Account
        </h1>
        <p className="text-gray-600 mt-2">Join the smart shopping revolution</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="p-4 bg-red-100 border border-red-200 rounded-xl">
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        )}

        {/* Full Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
          <div className="relative">
            <User className="h-5 w-5 text-gray-400 absolute left-3 top-3" />
            <input
              type="text"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              className={`block w-full pl-10 pr-3 py-3 border rounded-xl
                focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent
                ${validationErrors.name ? 'border-red-300 bg-red-50' : 'border-gray-300 bg-white'}`}
              placeholder="Enter your full name"
              disabled={isLoading}
            />
          </div>
          {validationErrors.name && <p className="mt-1 text-sm text-red-600">{validationErrors.name}</p>}
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
          <div className="relative">
            <Mail className="h-5 w-5 text-gray-400 absolute left-3 top-3" />
            <input
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              className={`block w-full pl-10 pr-3 py-3 border rounded-xl
                focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent
                ${validationErrors.email ? 'border-red-300 bg-red-50' : 'border-gray-300 bg-white'}`}
              placeholder="Enter your email"
              disabled={isLoading}
            />
          </div>
          {validationErrors.email && <p className="mt-1 text-sm text-red-600">{validationErrors.email}</p>}
        </div>

        {/* Password */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
          <div className="relative">
            <Lock className="h-5 w-5 text-gray-400 absolute left-3 top-3" />
            <input
              type={showPassword ? 'text' : 'password'}
              value={formData.password}
              onChange={(e) => handleInputChange('password', e.target.value)}
              className={`block w-full pl-10 pr-12 py-3 border rounded-xl
                focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent
                ${validationErrors.password ? 'border-red-300 bg-red-50' : 'border-gray-300 bg-white'}`}
              placeholder="Create a password"
              disabled={isLoading}
            />
            <button type="button" onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-3">{showPassword ? <EyeOff /> : <Eye />}</button>
          </div>
          {validationErrors.password && <p className="mt-1 text-sm text-red-600">{validationErrors.password}</p>}
        </div>

        {/* Confirm Password */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Confirm Password</label>
          <div className="relative">
            <Lock className="h-5 w-5 text-gray-400 absolute left-3 top-3" />
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              value={formData.confirmPassword}
              onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
              className={`block w-full pl-10 pr-12 py-3 border rounded-xl
                focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent
                ${validationErrors.confirmPassword ? 'border-red-300 bg-red-50' : 'border-gray-300 bg-white'}`}
              placeholder="Confirm your password"
              disabled={isLoading}
            />
            <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-3">{showConfirmPassword ? <EyeOff /> : <Eye />}</button>
          </div>
          {validationErrors.confirmPassword && (
            <p className="mt-1 text-sm text-red-600">{validationErrors.confirmPassword}</p>
          )}
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full flex items-center justify-center px-4 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-medium rounded-xl hover:scale-[1.02] disabled:opacity-50 transition-all">
          {isLoading ? <><Loader2 className="w-5 h-5 mr-2 animate-spin" />Creating Account...</> : <> <UserPlus className="w-5 h-5 mr-2" /> Create Account </>}
        </button>
      </form>

      <div className="mt-8 text-center">
        <p className="text-gray-600">
          Already have an account?{' '}
          <button onClick={onSwitchToLogin} className="text-emerald-600 hover:text-emerald-700 font-medium" disabled={isLoading}>
            Sign in here
          </button>
        </p>
      </div>
    </div>
  );
}
