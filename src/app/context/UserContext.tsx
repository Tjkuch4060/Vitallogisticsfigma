import React, { createContext, useContext, useState, useEffect } from 'react';

type LicenseStatus = 'Active' | 'Suspended' | 'Expired';
type UserRole = 'Admin' | 'Retailer';

interface UserContextType {
    licenseExpirationDate: Date;
    status: LicenseStatus;
    daysRemaining: number;
    role: UserRole;
    businessName: string;
    renewLicense: () => void;
    simulateExpiration: () => void; // For demo purposes
    switchRole: (newRole: UserRole) => void; // For demo purposes
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
    // Default to a date > 30 days in the future for "Happy Path"
    // Mock: January 7, 2026 -> Set to April 1, 2026 (~84 days)
    const [expirationDate, setExpirationDate] = useState<Date>(new Date('2026-04-01'));
    const [status, setStatus] = useState<LicenseStatus>('Active');
    const [role, setRole] = useState<UserRole>('Admin'); // Default to Admin for demo
    const [businessName, setBusinessName] = useState<string>('Green Leaf Dispensary');

    const calculateDays = (date: Date) => {
        const today = new Date();
        const diffTime = date.getTime() - today.getTime();
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
    };

    const daysRemaining = calculateDays(expirationDate);

    useEffect(() => {
        if (daysRemaining <= 0) {
            setStatus('Expired');
        } else if (status === 'Expired' && daysRemaining > 0) {
            setStatus('Active');
        }
    }, [daysRemaining, status]);

    const renewLicense = () => {
        const newDate = new Date();
        newDate.setFullYear(newDate.getFullYear() + 1);
        setExpirationDate(newDate);
        setStatus('Active');
    };

    const simulateExpiration = () => {
        // Set to yesterday
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        setExpirationDate(yesterday);
    };

    const switchRole = (newRole: UserRole) => {
        setRole(newRole);
        // Update business name based on role
        if (newRole === 'Admin') {
            setBusinessName('Low Dose Logistics Admin');
        } else {
            setBusinessName('Green Leaf Dispensary');
        }
    };

    return (
        <UserContext.Provider value={{ 
            licenseExpirationDate: expirationDate, 
            status: daysRemaining <= 0 ? 'Suspended' : status, // Auto-suspend if expired
            daysRemaining,
            role,
            businessName,
            renewLicense,
            simulateExpiration,
            switchRole
        }}>
            {children}
        </UserContext.Provider>
    );
}

export function useUser() {
    const context = useContext(UserContext);
    if (context === undefined) {
        throw new Error('useUser must be used within a UserProvider');
    }
    return context;
}