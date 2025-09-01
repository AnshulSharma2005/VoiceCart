import React, { useState } from 'react';
import { ShoppingBag, Sparkles, Mic, Brain } from 'lucide-react';
import { LoginForm } from './LoginForm';
import { SignupForm } from './SignupForm';

interface AuthPageProps {
  onLogin: (
    email: string,
    password: string
  ) => Promise<{ success: boolean; error?: string }>;
  onSignup: (
    email: string,
    password: string,
    name: string
  ) => Promise<{ success: boolean; error?: string }>;
  isLoading: boolean;
  error?: string;
  clearError?: () => void; // <-- To reset error when switching forms
}

export function AuthPage({
  onLogin,
  onSignup,
  isLoading,
  error,
  clearError,
}: AuthPageProps) {
  const [isLoginMode, setIsLoginMode] = useState(true);

  const switchToSignup = () => {
    clearError?.();
    setIsLoginMode(false);
  };

  const switchToLogin = () => {
    clearError?.();
    setIsLoginMode(true);
  };

  const features = [
    {
      icon: <Mic className="w-6 h-6" />,
      title: 'Voice Commands',
      description:
        'Add items naturally with "Add milk" or "I need 2 apples"',
    },
    {
      icon: <Brain className="w-6 h-6" />,
      title: 'Smart Suggestions',
      description:
        'AI-powered recommendations based on your shopping patterns',
    },
    {
      icon: <Sparkles className="w-6 h-6" />,
      title: 'Intelligent Organization',
      description:
        'Automatic categorization and seasonal suggestions',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-50 to-orange-50 flex">
      {/* Left Side */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-purple-600 via-pink-600 to-orange-500 p-12 flex-col justify-center relative overflow-hidden">
        <div className="relative z-10">
          <div className="flex items-center space-x-3 mb-8">
            <div className="w-12 h-12 bg-white bg-opacity-20 backdrop-blur-sm rounded-xl flex items-center justify-center">
              <ShoppingBag className="w-7 h-7 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-white">
              Voice Shopping Assistant
            </h1>
          </div>
          <div className="mb-12">
            <h2 className="text-4xl font-bold text-white mb-4 leading-tight">
              Smart Shopping
              <br />
              Made Simple
            </h2>
            <p className="text-xl text-white text-opacity-90 leading-relaxed">
              Transform your grocery shopping with AI-powered voice commands
              and intelligent suggestions.
            </p>
          </div>
          <div className="space-y-6">
            {features.map((feature, index) => (
              <div key={index} className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-white bg-opacity-20 backdrop-blur-sm rounded-xl flex items-center justify-center flex-shrink-0">
                  <div className="text-white">{feature.icon}</div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-1">
                    {feature.title}
                  </h3>
                  <p className="text-white text-opacity-80">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Side - Auth Forms */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="lg:hidden flex items-center justify-center space-x-3 mb-8">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl flex items-center justify-center">
              <ShoppingBag className="w-7 h-7 text-white" />
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Voice Shopping
            </h1>
          </div>

          {isLoginMode ? (
            <LoginForm
              onLogin={onLogin}
              onSwitchToSignup={switchToSignup}
              isLoading={isLoading}
              error={error}
            />
          ) : (
            <SignupForm
              onSignup={async (email, password, name) => {
                const result = await onSignup(email, password, name);
                if (result.success) {
                  setIsLoginMode(true); // switch only on success
                }
                return result;
              }}
              onSwitchToLogin={switchToLogin}
              isLoading={isLoading}
              error={error}
            />
          )}

          {error && (
            <div className="mt-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm">
              {error}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
