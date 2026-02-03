import { AlertTriangle, ArrowRight } from 'lucide-react';
import { useUser } from '../context/UserContext';
import { LicenseStatus } from '../types';
import { Button } from './ui/button';
import { Link } from 'react-router-dom';

export function LicenseAlert() {
    const { daysRemaining, status } = useUser();

    // Only show if expiring soon (< 30 days) and NOT suspended (suspended has its own screen/banner)
    // Actually, prompt says "Prominent alert... < 30 days".
    // If suspended, we might want a different banner if they are browsing "allowed" pages.

    if (status === LicenseStatus.Suspended) {
        return (
            <div className="bg-red-600 text-white px-4 py-3 shadow-md relative z-40">
                <div className="container mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="bg-white/20 p-1.5 rounded-full">
                            <AlertTriangle className="w-5 h-5 text-white" />
                        </div>
                        <div className="font-medium">
                            <span className="font-bold mr-2">ACCOUNT SUSPENDED:</span>
                            License expired. Ordering is disabled.
                        </div>
                    </div>
                    <Link to="/orders">
                        <Button size="sm" variant="outline" className="text-white border-white/40 hover:bg-white/10 hover:text-white h-8">
                            View Invoices
                        </Button>
                    </Link>
                </div>
            </div>
        );
    }

    if (daysRemaining <= 30 && daysRemaining > 0) {
        return (
            <div className="bg-amber-100 border-b border-amber-200 text-amber-900 px-4 py-3 relative z-40">
                <div className="container mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <AlertTriangle className="w-5 h-5 text-amber-600" />
                        <span className="text-sm font-medium">
                            <span className="font-bold">Action Required:</span> Your license expires in {daysRemaining} days. Renew now to avoid service interruption.
                        </span>
                    </div>
                    <Button size="sm" variant="ghost" className="text-amber-900 hover:bg-amber-200 hover:text-amber-950 h-8 font-semibold">
                        Renew License <ArrowRight className="w-4 h-4 ml-1" />
                    </Button>
                </div>
            </div>
        );
    }

    return null;
}
