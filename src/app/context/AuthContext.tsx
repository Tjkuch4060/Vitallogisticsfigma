import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { User, UserRole, LicenseStatus, Permission } from '../types';
import { STORAGE_KEYS } from '../utils/constants';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  role: UserRole | null;
  login: (email: string, password: string, role?: UserRole, rememberMe?: boolean) => Promise<User>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const createMockUser = (role: UserRole): User => {
  const isAdmin = role === UserRole.Admin;
  const expiration = new Date();
  expiration.setFullYear(expiration.getFullYear() + 1);
  return {
    id: isAdmin ? 'admin-1' : 'retailer-1',
    email: isAdmin ? 'admin@vital.com' : 'retailer@vital.com',
    name: isAdmin ? 'Admin User' : 'Test Hemp Dispensary',
    company: isAdmin ? 'VitalLogistics' : 'Test Hemp Dispensary',
    role,
    licenseStatus: LicenseStatus.Active,
    licenseExpiration: expiration,
    createdAt: new Date(),
    permissions: isAdmin
      ? [
          Permission.ViewCatalog,
          Permission.PlaceOrders,
          Permission.ViewOrders,
          Permission.ViewDashboard,
          Permission.ManageUsers,
          Permission.ApproveLicenses,
        ]
      : [
          Permission.ViewCatalog,
          Permission.PlaceOrders,
          Permission.ViewOrders,
          Permission.ViewDashboard,
        ],
  };
};

const MOCK_CREDENTIALS: Record<string, UserRole> = {
  'admin@vital.com': UserRole.Admin,
  'retailer@vital.com': UserRole.Customer,
};

const DEMO_LOGIN_DELAY_MS = 600;

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadStoredSession = useCallback(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.AUTH) ?? sessionStorage.getItem(STORAGE_KEYS.AUTH);
      if (stored) {
        const parsed = JSON.parse(stored) as { user: User };
        parsed.user.licenseExpiration = new Date(parsed.user.licenseExpiration);
        parsed.user.createdAt = new Date(parsed.user.createdAt);
        setUser(parsed.user);
      } else {
        setUser(null);
      }
    } catch {
      setUser(null);
      localStorage.removeItem(STORAGE_KEYS.AUTH);
      sessionStorage.removeItem(STORAGE_KEYS.AUTH);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadStoredSession();
  }, [loadStoredSession]);

  const login = useCallback(
    async (email: string, password: string, explicitRole?: UserRole, rememberMe = true): Promise<User> => {
      setIsLoading(true);
      await new Promise((resolve) => setTimeout(resolve, DEMO_LOGIN_DELAY_MS));

      const normalizedEmail = email.trim().toLowerCase();
      const role =
        explicitRole ??
        MOCK_CREDENTIALS[normalizedEmail] ??
        UserRole.Customer;

      const mockUser = createMockUser(role);
      mockUser.email = normalizedEmail;
      if (!explicitRole && !MOCK_CREDENTIALS[normalizedEmail]) {
        mockUser.name = email.split('@')[0];
      }

      setUser(mockUser);
      localStorage.removeItem(STORAGE_KEYS.AUTH);
      sessionStorage.removeItem(STORAGE_KEYS.AUTH);
      const storage = rememberMe ? localStorage : sessionStorage;
      storage.setItem(STORAGE_KEYS.AUTH, JSON.stringify({ user: mockUser }));
      setIsLoading(false);
      return mockUser;
    },
    []
  );

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem(STORAGE_KEYS.AUTH);
    sessionStorage.removeItem(STORAGE_KEYS.AUTH);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        role: user?.role ?? null,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
