import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { motion } from 'motion/react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog';
import { CheckCircle, AlertTriangle, ExternalLink, Calendar, RefreshCw } from 'lucide-react';
import { useUser } from '../context/UserContext';

export function LicenseStatus() {
  const { daysRemaining, licenseExpirationDate, status, simulateExpiration, renewLicense } = useUser();
  
  const license = {
    number: "HMP-MN-2024-8842",
    state: "Minnesota",
    type: "Retail Hemp & Cannabinoid License",
  };

  const isExpired = status === 'Expired' || status === 'Suspended';

  return (
    <Dialog>
      <DialogTrigger asChild>
        <div className="flex items-center gap-3 cursor-pointer group p-1.5 -mr-2 rounded-lg hover:bg-slate-50 transition-all border border-transparent hover:border-slate-100">
            <div className="text-right hidden lg:block leading-tight">
                <div className="font-semibold text-slate-800 text-sm group-hover:text-emerald-800 transition-colors">Test Hemp Dispensary</div>
                <div className={`text-xs font-medium transition-colors ${daysRemaining < 30 ? 'text-amber-600' : 'text-slate-500'} ${isExpired ? 'text-red-600' : ''}`}>
                    {isExpired ? 'License Expired' : `Expires in ${daysRemaining} days`}
                </div>
            </div>
            
            <Badge className={`
                text-white border-transparent shadow-md rounded-full px-4 py-2 flex items-center gap-1.5 transition-all group-hover:shadow-lg group-hover:scale-105 relative overflow-hidden
                ${isExpired 
                    ? 'bg-red-600 hover:bg-red-700 animate-pulse' 
                    : daysRemaining < 30 
                        ? 'bg-amber-500 hover:bg-amber-600 animate-pulse' 
                        : 'bg-emerald-600 hover:bg-emerald-700 ring-2 ring-emerald-500/20'
                }
            `}>
                {!isExpired && daysRemaining >= 30 && (
                    <motion.span 
                        className="absolute inset-0 bg-white/10"
                        animate={{ x: ['-100%', '100%'] }}
                        transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                    />
                )}
                <span className="font-bold relative z-10 uppercase tracking-wider text-[11px]">{isExpired ? 'Suspended' : 'Approved'}</span>
                {isExpired ? (
                    <AlertTriangle className="w-3.5 h-3.5 fill-white text-red-600 relative z-10" />
                ) : (
                    <CheckCircle className="w-3.5 h-3.5 fill-white text-emerald-600 relative z-10" />
                )}
            </Badge>
        </div>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3 text-xl pb-2 border-b border-slate-100">
            <div className={`p-2 rounded-full ${isExpired ? 'bg-red-100' : 'bg-emerald-100'}`}>
                {isExpired ? <AlertTriangle className="w-5 h-5 text-red-600" /> : <CheckCircle className="w-5 h-5 text-emerald-600" />}
            </div>
            License Details
          </DialogTitle>
          <DialogDescription className="pt-2">
            Verifiable license status for wholesale purchasing eligibility.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-5 py-2">
            <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                        <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">License Number</span>
                        <div className="font-mono font-medium text-slate-900 bg-slate-50 px-2 py-1 rounded border border-slate-100">
                            {license.number}
                        </div>
                    </div>
                    <div className="space-y-1">
                        <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">State Jurisdiction</span>
                        <div className="font-medium text-slate-900 px-2 py-1">
                            {license.state}
                        </div>
                    </div>
                </div>

                <div className="space-y-1">
                    <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">License Type</span>
                    <div className="font-medium text-slate-900">
                        {license.type}
                    </div>
                </div>

                <div className="flex items-center justify-between bg-slate-50 p-3 rounded-lg border border-slate-200">
                    <div className="flex items-center gap-3">
                        <Calendar className="w-5 h-5 text-slate-400" />
                        <div>
                            <p className="text-xs text-slate-500">Expiration Date</p>
                            <p className={`text-sm font-semibold ${isExpired ? 'text-red-600' : 'text-slate-900'}`}>
                                {licenseExpirationDate.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
                            </p>
                        </div>
                    </div>
                    <Badge variant={daysRemaining < 90 || isExpired ? "outline" : "default"} className={
                        isExpired ? "text-red-600 border-red-200 bg-red-50" :
                        daysRemaining < 30 ? "text-amber-600 border-amber-200 bg-amber-50" : 
                        "bg-emerald-100 text-emerald-800 hover:bg-emerald-100"
                    }>
                        {isExpired ? 'Expired' : `${daysRemaining} Days Left`}
                    </Badge>
                </div>
            </div>

            <div className="bg-blue-50/50 p-4 rounded-lg border border-blue-100">
                <h4 className="font-semibold text-blue-900 flex items-center gap-2 mb-2 text-sm">
                    <AlertTriangle className="w-4 h-4 text-blue-600" /> Renewal Instructions
                </h4>
                <p className="text-xs text-blue-700 leading-relaxed mb-3">
                    Per Section 1.1.1, license renewal must be initiated at least 60 days prior to expiration to maintain uninterrupted wholesale access.
                </p>
                <div className="flex gap-2">
                    <Button size="sm" variant="outline" className="flex-1 border-blue-200 text-blue-700 hover:bg-blue-50 hover:text-blue-800 bg-white gap-2 h-8 text-xs">
                        State Portal <ExternalLink className="w-3 h-3" />
                    </Button>
                </div>
            </div>

            {/* Demo Controls */}
            <div className="pt-2 border-t border-slate-100">
                <p className="text-[10px] text-slate-400 uppercase tracking-wider mb-2 font-medium">Demo Controls</p>
                <div className="flex gap-2">
                    <Button size="sm" variant="secondary" onClick={simulateExpiration} className="h-7 text-xs flex-1">
                        Simulate Expiration
                    </Button>
                    <Button size="sm" variant="outline" onClick={renewLicense} className="h-7 text-xs flex-1">
                        <RefreshCw className="w-3 h-3 mr-1" /> Renew
                    </Button>
                </div>
            </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}