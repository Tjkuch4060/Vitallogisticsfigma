import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { AlertTriangle, FileText, RefreshCw } from 'lucide-react';
import { useUser } from '../context/UserContext';
import { Link } from 'react-router-dom';

export function SuspensionScreen() {
    const { licenseExpirationDate, renewLicense } = useUser();

    return (
        <div className="container mx-auto px-4 py-16 flex items-center justify-center min-h-[60vh]">
            <Card className="max-w-lg w-full border-red-200 shadow-xl bg-red-50/10">
                <CardHeader className="text-center pb-2">
                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <AlertTriangle className="w-8 h-8 text-red-600" />
                    </div>
                    <CardTitle className="text-2xl font-bold text-red-700">Account Suspended</CardTitle>
                    <CardDescription className="text-red-800/80 font-medium">
                        Ordering Capabilities Disabled
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="bg-white p-4 rounded-lg border border-red-100 shadow-sm text-center space-y-2">
                        <p className="text-sm text-slate-600">Reason for suspension:</p>
                        <p className="font-semibold text-slate-900">License Expired</p>
                        <div className="text-xs text-slate-500 pt-2 border-t border-slate-100 mt-2">
                            Expiration Date: <span className="font-medium text-red-600">{licenseExpirationDate.toLocaleDateString()}</span>
                        </div>
                    </div>

                    <div className="text-sm text-slate-600 text-center px-4">
                        Please renew your state hemp license to restore ordering functionality. You can still access your order history and download invoices.
                    </div>
                </CardContent>
                <CardFooter className="flex flex-col gap-3">
                    <Button 
                        onClick={renewLicense} 
                        className="w-full bg-emerald-600 hover:bg-emerald-700 flex gap-2"
                    >
                        <RefreshCw className="w-4 h-4" />
                        Simulate Renewal (Demo)
                    </Button>
                    <Link to="/orders" className="w-full">
                        <Button variant="outline" className="w-full border-slate-200 hover:bg-slate-50 text-slate-600">
                            <FileText className="w-4 h-4 mr-2" />
                            View Past Orders & Invoices
                        </Button>
                    </Link>
                </CardFooter>
            </Card>
        </div>
    );
}