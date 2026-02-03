import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'motion/react';
import { Leaf, ArrowLeft, Loader2, Mail, Lock, Eye, EyeOff, Shield } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Checkbox } from '../components/ui/checkbox';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../components/ui/form';
import { loginSchema, LoginFormData } from '../schemas/login.schema';
import { useAuth } from '../context/AuthContext';
import { ROUTES } from '../utils/constants';
import { UserRole } from '../types';

const DEMO_CREDENTIALS = {
  admin: { email: 'admin@vital.com', role: UserRole.Admin as const, label: 'Administrator' },
  retailer: { email: 'retailer@vital.com', role: UserRole.Customer as const, label: 'Retailer' },
};

export function Login() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirectParam = searchParams.get('redirect');
  const redirect = redirectParam ? decodeURIComponent(redirectParam) : null;
  const { login, isAuthenticated } = useAuth();
  const [submitError, setSubmitError] = useState<string | null>(null);

  const [showPassword, setShowPassword] = useState(false);
  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
      role: undefined,
      rememberMe: true,
    },
    mode: 'onSubmit',
  });

  const applyDemoCredentials = (type: 'admin' | 'retailer') => {
    const cred = DEMO_CREDENTIALS[type];
    form.setValue('email', cred.email);
    form.setValue('role', cred.role);
    form.clearErrors();
  };

  const onSubmit = async (data: LoginFormData) => {
    setSubmitError(null);
    try {
      const user = await login(data.email, data.password, data.role || undefined, data.rememberMe ?? true);
      const defaultRedirect = user.role === UserRole.Admin ? ROUTES.DASHBOARD : ROUTES.CATALOG;
      navigate(redirect ?? defaultRedirect, { replace: true });
    } catch (err) {
      setSubmitError('Invalid email or password. Please try again.');
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      const defaultRedirect = ROUTES.DASHBOARD;
      navigate(redirect ?? defaultRedirect, { replace: true });
    }
  }, [isAuthenticated, navigate, redirect]);

  if (isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-emerald-50 via-white to-teal-50/30 p-4">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md"
      >
        <Card className="border-emerald-100 shadow-xl shadow-emerald-900/5 overflow-hidden">
          <CardHeader className="space-y-4 pb-6 pt-10">
            <Link
              to={ROUTES.HOME}
              className="inline-flex items-center gap-2 text-emerald-600 hover:text-emerald-700 transition-colors w-fit"
            >
              <Leaf size={24} className="shrink-0" />
              <span className="font-bold text-xl tracking-tight text-emerald-950">
                VitalLogistics
              </span>
            </Link>
            <div>
              <CardTitle className="text-2xl font-extrabold text-slate-900 tracking-tight">
                Welcome back
              </CardTitle>
              <CardDescription className="text-slate-600 mt-1">
                Sign in to your B2B wholesale portal
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent className="pb-10 space-y-5">
            {/* Demo credentials section */}
            <div className="rounded-lg bg-slate-100/80 border border-emerald-200/60 p-4 space-y-3">
              <p className="text-xs font-semibold text-slate-600 uppercase tracking-wide flex items-center gap-1.5">
                <Shield size={14} className="text-emerald-600" />
                Demo credentials
              </p>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => applyDemoCredentials('admin')}
                  className="text-left rounded-lg border-2 border-slate-200 bg-white p-3 hover:border-emerald-400 hover:bg-emerald-50/50 transition-all focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-1"
                >
                  <p className="font-semibold text-slate-800 text-sm">Administrator</p>
                  <p className="text-xs text-slate-500 mt-0.5 font-mono">admin@vital.com</p>
                  <p className="text-[11px] text-slate-400/70 mt-0.5">any password</p>
                </button>
                <button
                  type="button"
                  onClick={() => applyDemoCredentials('retailer')}
                  className="text-left rounded-lg border-2 border-slate-200 bg-white p-3 hover:border-emerald-400 hover:bg-emerald-50/50 transition-all focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-1"
                >
                  <p className="font-semibold text-slate-800 text-sm">Retailer</p>
                  <p className="text-xs text-slate-500 mt-0.5 font-mono">retailer@vital.com</p>
                  <p className="text-[11px] text-slate-400/70 mt-0.5">any password</p>
                </button>
              </div>
              <p className="text-xs text-slate-500">
                Custom role: Enter any email + choose role below
              </p>
            </div>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5 pt-0">
                {submitError && (
                  <div
                    role="alert"
                    className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700"
                  >
                    {submitError}
                  </div>
                )}
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400 pointer-events-none" />
                          <Input
                            type="email"
                            placeholder="you@company.com"
                            autoComplete="email"
                            className="h-11 pl-10"
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400 pointer-events-none" />
                          <Input
                            type={showPassword ? 'text' : 'password'}
                            placeholder="Enter any password (demo mode)"
                            autoComplete="current-password"
                            className="h-11 pl-10 pr-10"
                            {...field}
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none focus:text-slate-600"
                            aria-label={showPassword ? 'Hide password' : 'Show password'}
                            tabIndex={-1}
                          >
                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                          </button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="rememberMe"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex items-center gap-2">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={(checked) => field.onChange(checked === true)}
                          />
                        </FormControl>
                        <FormLabel className="font-normal cursor-pointer !mt-0" onClick={() => field.onChange(!field.value)}>
                          Remember me
                        </FormLabel>
                      </div>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="role"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Role</FormLabel>
                      <FormControl>
                        <div
                          role="radiogroup"
                          aria-label="Role"
                          className="grid grid-cols-2 gap-3"
                        >
                          <button
                            type="button"
                            role="radio"
                            aria-checked={field.value === UserRole.Admin}
                            onClick={() => field.onChange(UserRole.Admin)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter' || e.key === ' ') {
                                e.preventDefault();
                                field.onChange(UserRole.Admin);
                              }
                            }}
                            className={`flex min-h-[44px] w-full cursor-pointer items-center justify-center rounded-lg border-2 px-4 py-3 text-sm font-semibold transition-all focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-1 ${
                              field.value === UserRole.Admin
                                ? 'border-emerald-500 bg-emerald-50 text-emerald-800'
                                : 'border-slate-200 bg-white text-slate-700 hover:border-emerald-300 hover:bg-emerald-50/50'
                            }`}
                          >
                            Administrator
                          </button>
                          <button
                            type="button"
                            role="radio"
                            aria-checked={field.value === UserRole.Customer}
                            onClick={() => field.onChange(UserRole.Customer)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter' || e.key === ' ') {
                                e.preventDefault();
                                field.onChange(UserRole.Customer);
                              }
                            }}
                            className={`flex min-h-[44px] w-full cursor-pointer items-center justify-center rounded-lg border-2 px-4 py-3 text-sm font-semibold transition-all focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-1 ${
                              field.value === UserRole.Customer
                                ? 'border-emerald-500 bg-emerald-50 text-emerald-800'
                                : 'border-slate-200 bg-white text-slate-700 hover:border-emerald-300 hover:bg-emerald-50/50'
                            }`}
                          >
                            Retailer
                          </button>
                        </div>
                      </FormControl>
                      <p className="text-xs text-slate-500">
                        Demo mode accepts any email/password
                      </p>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex flex-col gap-4 pt-2">
                  <Button
                    type="submit"
                    size="lg"
                    className="w-full h-12 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl"
                    disabled={form.formState.isSubmitting}
                  >
                    {form.formState.isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Signing in...
                      </>
                    ) : (
                      'Sign in'
                    )}
                  </Button>
                  <Link
                    to="#"
                    className="text-sm text-slate-500 hover:text-emerald-600 transition-colors text-center"
                  >
                    Forgot password?
                  </Link>

                  <div className="flex flex-col gap-3 pt-4 border-t border-slate-200">
                    <p className="text-center text-sm text-slate-500">New to VitalLogistics?</p>
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full border-slate-300 text-slate-700 hover:bg-slate-50 hover:border-emerald-300 hover:text-emerald-700"
                      asChild
                    >
                      <Link to="#">Apply for Wholesale Access</Link>
                    </Button>
                  </div>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
        <Link
          to={ROUTES.HOME}
          className="mt-6 flex items-center justify-center gap-2 text-slate-600 hover:text-emerald-700 transition-colors text-sm font-medium"
        >
          <ArrowLeft size={16} />
          Back to home
        </Link>
      </motion.div>
    </div>
  );
}
