import React, { createContext, useContext, useState, useEffect } from 'react';

type LicenseStatus = 'Active' | 'Suspended' | 'Expired';

interface UserContextType {
    licenseExpirationDate: Date;
    status: LicenseStatus;
    daysRemaining: number;
    renewLicense: () => void;
    simulateExpiration: () => void; // For demo purposes
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
    // Default to a date > 30 days in the future for "Happy Path"
    // Mock: January 7, 2026 -> Set to April 1, 2026 (~84 days)
    const [expirationDate, setExpirationDate] = useState<Date>(new Date('2026-04-01'));
    const [status, setStatus] = useState<LicenseStatus>('Active');

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

    return (
        <UserContext.Provider value={{ 
            licenseExpirationDate: expirationDate, 
            status: daysRemaining <= 0 ? 'Suspended' : status, // Auto-suspend if expired
            daysRemaining,
            renewLicense,
            simulateExpiration
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
