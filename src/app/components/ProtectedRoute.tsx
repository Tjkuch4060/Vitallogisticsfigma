import React from 'react';
import { Navigate } from 'react-router';
import { useUser } from '../context/UserContext';
import { AlertCircle, ShieldOff } from 'lucide-react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles: ('Admin' | 'Retailer')[];
}

export function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const { role } = useUser();

  if (!allowedRoles.includes(role)) {
    return (
      <div className="container mx-auto max-w-2xl px-4 py-20">
        <Card className="border-red-200 bg-red-50/50">
          <CardContent className="p-12 text-center">
            <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-6">
              <ShieldOff className="w-8 h-8 text-red-600" />
            </div>
            <h2 className="text-2xl font-extrabold text-slate-900 mb-3">Access Denied</h2>
            <p className="text-slate-600 mb-6">
              You don't have permission to access this page. This area is restricted to {allowedRoles.join(' and ')} users only.
            </p>
            <div className="flex items-center justify-center gap-3">
              <Button
                variant="outline"
                onClick={() => window.history.back()}
                className="rounded-xl"
              >
                Go Back
              </Button>
              <Button
                onClick={() => window.location.href = role === 'Admin' ? '/dashboard' : '/catalog'}
                className="rounded-xl bg-emerald-600 hover:bg-emerald-700"
              >
                Go to {role === 'Admin' ? 'Dashboard' : 'Catalog'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return <>{children}</>;
}
