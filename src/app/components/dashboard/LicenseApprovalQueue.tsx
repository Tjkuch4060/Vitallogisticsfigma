import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Check, X, MoreHorizontal, FileText, AlertCircle } from 'lucide-react';
import { Badge } from '../ui/badge';
import { toast } from 'sonner';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';

// Mock Pending Retailers
interface RetailerApplication {
    id: string;
    businessName: string;
    licenseNumber: string;
    state: string;
    submittedDate: string;
    status: 'Pending';
}

const initialApplications: RetailerApplication[] = [
    { id: 'APP-001', businessName: 'Herbal Zen', licenseNumber: 'HMP-MN-2024-991', state: 'MN', submittedDate: '2024-01-05', status: 'Pending' },
    { id: 'APP-002', businessName: 'Green Cloud Vapes', licenseNumber: 'HMP-MN-2024-992', state: 'MN', submittedDate: '2024-01-06', status: 'Pending' },
    { id: 'APP-003', businessName: 'Nature\'s Cure', licenseNumber: 'HMP-WI-2024-105', state: 'WI', submittedDate: '2024-01-07', status: 'Pending' },
];

export function LicenseApprovalQueue() {
    const [applications, setApplications] = useState(initialApplications);

    const handleApprove = (id: string, name: string) => {
        setApplications(prev => prev.filter(app => app.id !== id));
        toast.success(`Retailer Approved`, {
            description: `${name} has been added to the active retailers list.`
        });
    };

    const handleReject = (id: string, name: string) => {
        setApplications(prev => prev.filter(app => app.id !== id));
        toast.error(`Application Rejected`, {
            description: `${name} has been notified.`
        });
    };

    const handleRequestInfo = (name: string) => {
        toast.info(`Info Requested`, {
            description: `Email sent to ${name} requesting additional documentation.`
        });
    };

    if (applications.length === 0) {
        return (
            <Card className="h-full">
                <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                        <span>License Approvals</span>
                        <Badge variant="outline" className="bg-slate-50 text-slate-500">0 Pending</Badge>
                    </CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col items-center justify-center py-12 text-center text-slate-500">
                    <Check className="w-12 h-12 text-emerald-200 mb-4" />
                    <p className="font-medium">All caught up!</p>
                    <p className="text-sm">No pending retailer applications.</p>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="h-full">
            <CardHeader className="pb-3">
                <CardTitle className="flex items-center justify-between">
                    <span>License Approvals</span>
                    <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-200 border-amber-200">
                        {applications.length} Pending
                    </Badge>
                </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
                <div className="divide-y divide-slate-100">
                    {applications.map((app) => (
                        <div key={app.id} className="p-4 flex items-center justify-between hover:bg-slate-50/50 transition-colors">
                            <div className="min-w-0 flex-1 mr-4">
                                <div className="flex items-center gap-2 mb-1">
                                    <h4 className="font-semibold text-slate-900 truncate">{app.businessName}</h4>
                                    <Badge variant="outline" className="text-[10px] h-5 px-1.5 bg-slate-50 text-slate-500">
                                        {app.state}
                                    </Badge>
                                </div>
                                <div className="text-xs text-slate-500 space-y-0.5">
                                    <div className="font-mono bg-slate-100 w-fit px-1.5 rounded text-slate-600">
                                        {app.licenseNumber}
                                    </div>
                                    <div className="text-slate-400">
                                        Submitted: {new Date(app.submittedDate).toLocaleDateString()}
                                    </div>
                                </div>
                            </div>
                            
                            <div className="flex items-center gap-2">
                                <Button 
                                    size="sm" 
                                    className="h-8 w-8 p-0 bg-emerald-600 hover:bg-emerald-700 rounded-full"
                                    onClick={() => handleApprove(app.id, app.businessName)}
                                    title="Approve"
                                >
                                    <Check className="w-4 h-4" />
                                    <span className="sr-only">Approve</span>
                                </Button>
                                
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button size="sm" variant="ghost" className="h-8 w-8 p-0 text-slate-400 hover:text-slate-600 rounded-full">
                                            <MoreHorizontal className="w-4 h-4" />
                                            <span className="sr-only">Actions</span>
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                        <DropdownMenuItem onClick={() => handleApprove(app.id, app.businessName)}>
                                            <Check className="w-4 h-4 mr-2 text-emerald-600" /> Approve Application
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => handleRequestInfo(app.businessName)}>
                                            <AlertCircle className="w-4 h-4 mr-2 text-amber-600" /> Request More Info
                                        </DropdownMenuItem>
                                        <DropdownMenuItem>
                                            <FileText className="w-4 h-4 mr-2 text-blue-600" /> View Documents
                                        </DropdownMenuItem>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem onClick={() => handleReject(app.id, app.businessName)} className="text-red-600 focus:text-red-600">
                                            <X className="w-4 h-4 mr-2" /> Reject Application
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
            <div className="p-4 border-t border-slate-100 bg-slate-50/50">
                <Button variant="outline" size="sm" className="w-full text-xs h-8 text-slate-500">
                    View All Applications
                </Button>
            </div>
        </Card>
    );
}