import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Input } from '../components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { 
  Search, 
  UserPlus, 
  Mail, 
  Phone, 
  MapPin, 
  CheckCircle2, 
  AlertCircle,
  MoreVertical,
  Eye,
  Ban,
  Download,
  Filter
} from 'lucide-react';
import { AppBreadcrumb } from '../components/AppBreadcrumb';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';
import { toast } from 'sonner';

interface Retailer {
  id: string;
  businessName: string;
  ownerName: string;
  licenseNumber: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  status: 'Active' | 'Pending' | 'Suspended';
  joinedDate: string;
  totalOrders: number;
  totalSpent: number;
  zone: number;
}

const mockRetailers: Retailer[] = [
  {
    id: 'RET-001',
    businessName: 'Green Leaf Dispensary',
    ownerName: 'Sarah Mitchell',
    licenseNumber: 'HMP-MN-2024-789',
    email: 'sarah@greenleaf.com',
    phone: '(612) 555-0123',
    address: '1420 Hennepin Ave',
    city: 'Minneapolis',
    state: 'MN',
    status: 'Active',
    joinedDate: '2024-06-15',
    totalOrders: 45,
    totalSpent: 28750.00,
    zone: 1
  },
  {
    id: 'RET-002',
    businessName: 'Herbal Zen',
    ownerName: 'Michael Chen',
    licenseNumber: 'HMP-MN-2024-991',
    email: 'mike@herbalzen.com',
    phone: '(651) 555-0456',
    address: '890 Grand Ave',
    city: 'St. Paul',
    state: 'MN',
    status: 'Active',
    joinedDate: '2024-08-20',
    totalOrders: 32,
    totalSpent: 19200.00,
    zone: 1
  },
  {
    id: 'RET-003',
    businessName: 'Nature\'s Cure',
    ownerName: 'Jennifer Lopez',
    licenseNumber: 'HMP-WI-2024-105',
    email: 'jen@naturescure.com',
    phone: '(715) 555-0789',
    address: '456 Main St',
    city: 'Eau Claire',
    state: 'WI',
    status: 'Pending',
    joinedDate: '2025-01-07',
    totalOrders: 0,
    totalSpent: 0,
    zone: 3
  },
  {
    id: 'RET-004',
    businessName: 'Cloud Nine Vapes',
    ownerName: 'David Kim',
    licenseNumber: 'HMP-MN-2024-432',
    email: 'david@cloudnine.com',
    phone: '(612) 555-0321',
    address: '2250 University Ave',
    city: 'Minneapolis',
    state: 'MN',
    status: 'Active',
    joinedDate: '2024-09-10',
    totalOrders: 28,
    totalSpent: 16800.00,
    zone: 2
  },
  {
    id: 'RET-005',
    businessName: 'Wellness Junction',
    ownerName: 'Amanda Torres',
    licenseNumber: 'HMP-MN-2024-667',
    email: 'amanda@wellnessjct.com',
    phone: '(763) 555-0998',
    address: '5600 W Broadway',
    city: 'Brooklyn Park',
    state: 'MN',
    status: 'Suspended',
    joinedDate: '2024-05-22',
    totalOrders: 18,
    totalSpent: 9400.00,
    zone: 2
  },
];

export function Retailers() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [retailers, setRetailers] = useState(mockRetailers);

  const filteredRetailers = retailers.filter(retailer => {
    const matchesSearch = 
      retailer.businessName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      retailer.ownerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      retailer.licenseNumber.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'All' || retailer.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: retailers.length,
    active: retailers.filter(r => r.status === 'Active').length,
    pending: retailers.filter(r => r.status === 'Pending').length,
    suspended: retailers.filter(r => r.status === 'Suspended').length,
  };

  const handleSuspend = (id: string, name: string) => {
    setRetailers(prev => prev.map(r => 
      r.id === id ? { ...r, status: 'Suspended' as const } : r
    ));
    toast.error(`Retailer Suspended`, {
      description: `${name} has been suspended and can no longer place orders.`
    });
  };

  const handleActivate = (id: string, name: string) => {
    setRetailers(prev => prev.map(r => 
      r.id === id ? { ...r, status: 'Active' as const } : r
    ));
    toast.success(`Retailer Activated`, {
      description: `${name} can now place orders.`
    });
  };

  const getStatusBadge = (status: Retailer['status']) => {
    const variants = {
      Active: 'bg-emerald-100 text-emerald-700 border-emerald-200',
      Pending: 'bg-amber-100 text-amber-700 border-amber-200',
      Suspended: 'bg-red-100 text-red-700 border-red-200',
    };

    return (
      <Badge className={`${variants[status]} rounded-lg px-2 py-1 text-xs font-bold border`}>
        {status}
      </Badge>
    );
  };

  return (
    <div className="container mx-auto max-w-7xl px-4 md:px-8 py-12 md:py-20">
      <AppBreadcrumb />

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6 mt-6">
        <div>
          <div className="flex items-center gap-2 text-emerald-600 font-bold text-xs uppercase tracking-widest mb-3">
            <div className="w-2 h-2 rounded-full bg-emerald-500" />
            Retailer Management
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
            Licensed Retailers
          </h1>
          <p className="text-slate-600 mt-3 text-lg">Manage retailer accounts, licenses, and order activity</p>
        </div>
        <div className="flex items-center gap-4">
          <Button 
            variant="outline" 
            size="sm" 
            className="rounded-xl border-slate-200 font-bold text-slate-600 h-10 px-5"
          >
            <Download className="w-4 h-4 mr-2" />
            Export Data
          </Button>
          <Button 
            size="sm" 
            className="rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold h-10 px-5 border-none shadow-lg shadow-emerald-900/10 transition-all hover:scale-105"
          >
            <UserPlus className="w-4 h-4 mr-2" />
            Add Retailer
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-8">
        <Card className="border-slate-100 shadow-sm">
          <CardContent className="p-6">
            <div className="text-sm font-semibold text-slate-500 mb-1 uppercase tracking-wide">Total</div>
            <div className="text-3xl font-extrabold text-slate-900">{stats.total}</div>
          </CardContent>
        </Card>
        <Card className="border-emerald-100 bg-emerald-50/50 shadow-sm">
          <CardContent className="p-6">
            <div className="text-sm font-semibold text-emerald-600 mb-1 uppercase tracking-wide">Active</div>
            <div className="text-3xl font-extrabold text-emerald-700">{stats.active}</div>
          </CardContent>
        </Card>
        <Card className="border-amber-100 bg-amber-50/50 shadow-sm">
          <CardContent className="p-6">
            <div className="text-sm font-semibold text-amber-600 mb-1 uppercase tracking-wide">Pending</div>
            <div className="text-3xl font-extrabold text-amber-700">{stats.pending}</div>
          </CardContent>
        </Card>
        <Card className="border-red-100 bg-red-50/50 shadow-sm">
          <CardContent className="p-6">
            <div className="text-sm font-semibold text-red-600 mb-1 uppercase tracking-wide">Suspended</div>
            <div className="text-3xl font-extrabold text-red-700">{stats.suspended}</div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Card>
        <CardHeader className="border-b border-slate-100 pb-6">
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
            <CardTitle className="text-xl font-bold text-slate-900">All Retailers</CardTitle>
            <div className="flex flex-col md:flex-row gap-3 w-full md:w-auto">
              {/* Search */}
              <div className="relative flex-1 md:w-64">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                <Input
                  placeholder="Search retailers..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 h-10 rounded-xl border-slate-200"
                />
              </div>
              
              {/* Status Filter */}
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full md:w-40 h-10 rounded-xl border-slate-200">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All Status</SelectItem>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Pending">Pending</SelectItem>
                  <SelectItem value="Suspended">Suspended</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-slate-50/50">
                <TableRow className="hover:bg-transparent border-slate-100">
                  <TableHead className="px-6 py-4 font-bold text-slate-500 uppercase text-[10px] tracking-widest">Business</TableHead>
                  <TableHead className="px-4 py-4 font-bold text-slate-500 uppercase text-[10px] tracking-widest">License</TableHead>
                  <TableHead className="px-4 py-4 font-bold text-slate-500 uppercase text-[10px] tracking-widest">Contact</TableHead>
                  <TableHead className="px-4 py-4 font-bold text-slate-500 uppercase text-[10px] tracking-widest">Location</TableHead>
                  <TableHead className="px-4 py-4 font-bold text-slate-500 uppercase text-[10px] tracking-widest">Status</TableHead>
                  <TableHead className="px-4 py-4 font-bold text-slate-500 uppercase text-[10px] tracking-widest text-right">Orders</TableHead>
                  <TableHead className="px-4 py-4 font-bold text-slate-500 uppercase text-[10px] tracking-widest text-right">Revenue</TableHead>
                  <TableHead className="px-6 py-4 font-bold text-slate-500 uppercase text-[10px] tracking-widest text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRetailers.map((retailer) => (
                  <TableRow key={retailer.id} className="hover:bg-slate-50/50 border-slate-50 transition-colors">
                    <TableCell className="px-6 py-5">
                      <div>
                        <div className="font-bold text-slate-900">{retailer.businessName}</div>
                        <div className="text-xs text-slate-500 mt-0.5">{retailer.ownerName}</div>
                      </div>
                    </TableCell>
                    <TableCell className="px-4 py-5">
                      <div className="font-mono text-xs bg-slate-100 w-fit px-2 py-1 rounded border border-slate-200 text-slate-600">
                        {retailer.licenseNumber}
                      </div>
                      <div className="text-[10px] text-slate-400 mt-1">Zone {retailer.zone}</div>
                    </TableCell>
                    <TableCell className="px-4 py-5">
                      <div className="space-y-1 text-xs text-slate-600">
                        <div className="flex items-center gap-1.5">
                          <Mail className="w-3 h-3 text-slate-400" />
                          <span className="truncate max-w-[180px]">{retailer.email}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Phone className="w-3 h-3 text-slate-400" />
                          {retailer.phone}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="px-4 py-5">
                      <div className="flex items-start gap-1.5 text-xs text-slate-600">
                        <MapPin className="w-3 h-3 text-slate-400 mt-0.5 flex-shrink-0" />
                        <div>
                          <div>{retailer.city}, {retailer.state}</div>
                          <div className="text-slate-400 text-[10px]">{retailer.address}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="px-4 py-5">
                      {getStatusBadge(retailer.status)}
                    </TableCell>
                    <TableCell className="px-4 py-5 text-right">
                      <div className="font-bold text-slate-900">{retailer.totalOrders}</div>
                      <div className="text-[10px] text-slate-400">orders</div>
                    </TableCell>
                    <TableCell className="px-4 py-5 text-right">
                      <div className="font-extrabold text-emerald-700 text-base">
                        ${retailer.totalSpent.toLocaleString()}
                      </div>
                    </TableCell>
                    <TableCell className="px-6 py-5 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                            <MoreVertical className="w-4 h-4" />
                            <span className="sr-only">Actions</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="rounded-xl border-slate-200 shadow-xl w-48">
                          <DropdownMenuLabel className="font-bold text-xs uppercase tracking-widest text-slate-400">
                            Actions
                          </DropdownMenuLabel>
                          <DropdownMenuItem className="rounded-lg cursor-pointer">
                            <Eye className="w-4 h-4 mr-2 text-emerald-600" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem className="rounded-lg cursor-pointer">
                            <Mail className="w-4 h-4 mr-2 text-emerald-600" />
                            Send Email
                          </DropdownMenuItem>
                          <DropdownMenuSeparator className="bg-slate-100" />
                          {retailer.status === 'Active' ? (
                            <DropdownMenuItem 
                              onClick={() => handleSuspend(retailer.id, retailer.businessName)}
                              className="text-red-600 focus:text-red-600 rounded-lg cursor-pointer"
                            >
                              <Ban className="w-4 h-4 mr-2" />
                              Suspend Account
                            </DropdownMenuItem>
                          ) : retailer.status === 'Suspended' ? (
                            <DropdownMenuItem 
                              onClick={() => handleActivate(retailer.id, retailer.businessName)}
                              className="text-emerald-600 focus:text-emerald-600 rounded-lg cursor-pointer"
                            >
                              <CheckCircle2 className="w-4 h-4 mr-2" />
                              Activate Account
                            </DropdownMenuItem>
                          ) : null}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {filteredRetailers.length === 0 && (
            <div className="text-center py-16 text-slate-500">
              <AlertCircle className="w-12 h-12 mx-auto mb-4 text-slate-300" />
              <p className="font-medium">No retailers found</p>
              <p className="text-sm">Try adjusting your search or filter criteria</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
