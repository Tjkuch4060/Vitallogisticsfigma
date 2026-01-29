import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Checkbox } from '../components/ui/checkbox';
import { Store, Eye, EyeOff, Mail, Lock, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';

const DEMO_CREDENTIALS = {
  retailer: {
    email: 'sarah@greenleaf.com',
    password: 'password123',
    role: 'retailer'
  },
  admin: {
    email: 'admin@vitalogistics.com',
    password: 'admin123',
    role: 'admin'
  }
};

export function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleDemoCredentials = (type: 'retailer' | 'admin') => {
    const creds = DEMO_CREDENTIALS[type];
    setEmail(creds.email);
    setPassword(creds.password);
    toast.success(`${type === 'retailer' ? 'Retailer' : 'Admin'} credentials loaded`, {
      description: 'Click Sign in to continue'
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Check credentials
    const isRetailer = email === DEMO_CREDENTIALS.retailer.email && password === DEMO_CREDENTIALS.retailer.password;
    const isAdmin = email === DEMO_CREDENTIALS.admin.email && password === DEMO_CREDENTIALS.admin.password;

    if (isRetailer || isAdmin) {
      toast.success('Login successful!', {
        description: `Welcome back${isAdmin ? ', Admin' : ''}!`
      });

      // Store auth state (in a real app, this would be handled by auth context)
      if (rememberMe) {
        localStorage.setItem('vl_user', JSON.stringify({ email, role: isAdmin ? 'admin' : 'retailer' }));
      } else {
        sessionStorage.setItem('vl_user', JSON.stringify({ email, role: isAdmin ? 'admin' : 'retailer' }));
      }

      // Navigate to dashboard
      setTimeout(() => {
        navigate('/dashboard');
      }, 500);
    } else {
      toast.error('Invalid credentials', {
        description: 'Please check your email and password'
      });
    }

    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-emerald-50 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        {/* Login Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 space-y-6">
          {/* Logo */}
          <div className="flex justify-center">
            <div className="w-16 h-16 bg-emerald-600 rounded-2xl flex items-center justify-center shadow-lg">
              <Store className="w-8 h-8 text-white" />
            </div>
          </div>

          {/* Header */}
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold text-slate-900">Welcome back</h1>
            <p className="text-slate-600">Sign in to your VitaLogistics account</p>
          </div>

          {/* Demo Credentials */}
          <div className="space-y-3">
            <p className="text-sm font-medium text-slate-500">Demo Credentials (click to fill):</p>
            <div className="grid grid-cols-2 gap-3">
              {/* Retailer */}
              <button
                type="button"
                onClick={() => handleDemoCredentials('retailer')}
                className="p-4 border-2 border-slate-200 rounded-lg hover:border-emerald-500 hover:bg-emerald-50 transition-all text-left group"
              >
                <div className="font-semibold text-slate-900 mb-1">Retailer:</div>
                <div className="text-xs text-slate-600 break-all">
                  sarah@greenleaf.com / password123
                </div>
              </button>

              {/* Admin */}
              <button
                type="button"
                onClick={() => handleDemoCredentials('admin')}
                className="p-4 border-2 border-slate-200 rounded-lg hover:border-emerald-500 hover:bg-emerald-50 transition-all text-left group"
              >
                <div className="font-semibold text-slate-900 mb-1">Admin:</div>
                <div className="text-xs text-slate-600 break-all">
                  admin@vitalogistics.com / admin123
                </div>
              </button>
            </div>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email">Email address</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
                <Input
                  id="email"
                  type="email"
                  placeholder="sarah@greenleaf.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 transition-colors"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="remember"
                  checked={rememberMe}
                  onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                />
                <label
                  htmlFor="remember"
                  className="text-sm text-slate-700 cursor-pointer select-none"
                >
                  Remember me
                </label>
              </div>
              <Link
                to="/forgot-password"
                className="text-sm text-emerald-600 hover:text-emerald-700 font-medium"
              >
                Forgot password?
              </Link>
            </div>

            {/* Sign In Button */}
            <Button
              type="submit"
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white h-12 text-base font-semibold"
              disabled={isLoading}
            >
              {isLoading ? 'Signing in...' : 'Sign in'}
            </Button>
          </form>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-slate-500">New to VitaLogistics?</span>
            </div>
          </div>

          {/* Apply for Access */}
          <Button
            type="button"
            variant="outline"
            className="w-full h-12 text-base font-semibold border-2 hover:bg-slate-50"
            onClick={() => navigate('/apply')}
          >
            Apply for Wholesale Access
          </Button>
        </div>

        {/* Back to Home */}
        <div className="text-center mt-6">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900 font-medium transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to home
          </Link>
        </div>
      </div>
    </div>
  );
}
