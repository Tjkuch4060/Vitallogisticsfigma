import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Input } from '../components/ui/input';
import { 
  Search, 
  Building2, 
  Package, 
  DollarSign, 
  TrendingUp,
  Mail,
  Phone,
  Globe,
  MoreVertical,
  Eye,
  Ban,
  CheckCircle2,
  Download,
  Filter,
  Star
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

interface Brand {
  id: string;
  name: string;
  contactName: string;
  email: string;
  phone: string;
  website: string;
  status: 'Active' | 'Pending' | 'Suspended';
  joinedDate: string;
  productCount: number;
  totalRevenue: number;
  commission: number; // percentage
  rating: number;
  category: string;
}

const mockBrands: Brand[] = [
  {
    id: 'BRN-001',
    name: 'Delta Naturals',
    contactName: 'Tom Anderson',
    email: 'tom@deltanaturals.com',
    phone: '(555) 123-4567',
    website: 'deltanaturals.com',
    status: 'Active',
    joinedDate: '2024-03-15',
    productCount: 24,
    totalRevenue: 89450.00,
    commission: 70,
    rating: 4.8,
    category: 'Edibles'
  },
  {
    id: 'BRN-002',
    name: 'Hemp Horizon',
    contactName: 'Lisa Martinez',
    email: 'lisa@hemphorizon.com',
    phone: '(555) 234-5678',
    website: 'hemphorizon.com',
    status: 'Active',
    joinedDate: '2024-05-20',
    productCount: 18,
    totalRevenue: 64200.00,
    commission: 70,
    rating: 4.6,
    category: 'Vapes'
  },
  {
    id: 'BRN-003',
    name: 'Pure Leaf Co.',
    contactName: 'James Wilson',
    email: 'james@pureleaf.com',
    phone: '(555) 345-6789',
    website: 'pureleafco.com',
    status: 'Active',
    joinedDate: '2024-04-10',
    productCount: 32,
    totalRevenue: 112800.00,
    commission: 70,
    rating: 4.9,
    category: 'Flower'
  },
  {
    id: 'BRN-004',
    name: 'Zen Botanicals',
    contactName: 'Maria Garcia',
    email: 'maria@zenbotanicals.com',
    phone: '(555) 456-7890',
    website: 'zenbotanicals.com',
    status: 'Pending',
    joinedDate: '2025-01-05',
    productCount: 0,
    totalRevenue: 0,
    commission: 70,
    rating: 0,
    category: 'Tinctures'
  },
  {
    id: 'BRN-005',
    name: 'Cloud Extraction',
    contactName: 'Ryan Cooper',
    email: 'ryan@cloudextract.com',
    phone: '(555) 567-8901',
    website: 'cloudextraction.com',
    status: 'Suspended',
    joinedDate: '2024-02-28',
    productCount: 12,
    totalRevenue: 28900.00,
    commission: 70,
    rating: 3.8,
    category: 'Concentrates'
  },
];

export function Brands() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [brands, setBrands] = useState(mockBrands);

  const filteredBrands = brands.filter(brand => {
    const matchesSearch = 
      brand.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      brand.contactName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      brand.category.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'All' || brand.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: brands.length,
    active: brands.filter(b => b.status === 'Active').length,
    totalProducts: brands.reduce((sum, b) => sum + b.productCount, 0),
    totalRevenue: brands.reduce((sum, b) => sum + b.totalRevenue, 0),
  };

  const handleSuspend = (id: string, name: string) => {
    setBrands(prev => prev.map(b => 
      b.id === id ? { ...b, status: 'Suspended' as const } : b
    ));
    toast.error(`Brand Suspended`, {
      description: `${name} products are now unavailable to retailers.`
    });
  };

  const handleActivate = (id: string, name: string) => {
    setBrands(prev => prev.map(b => 
      b.id === id ? { ...b, status: 'Active' as const } : b
    ));
    toast.success(`Brand Activated`, {
      description: `${name} products are now available to retailers.`
    });
  };

  const getStatusBadge = (status: Brand['status']) => {
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
            Brand Partner Network
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
            Brand Partners
          </h1>
          <p className="text-slate-600 mt-3 text-lg">Manage brand relationships, products, and revenue</p>
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
            <Building2 className="w-4 h-4 mr-2" />
            Add Brand
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-8">
        <Card className="border-slate-100 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm font-semibold text-slate-500 uppercase tracking-wide">Total Brands</div>
              <Building2 className="w-5 h-5 text-slate-400" />
            </div>
            <div className="text-3xl font-extrabold text-slate-900">{stats.total}</div>
            <div className="text-xs text-slate-500 mt-1">{stats.active} active</div>
          </CardContent>
        </Card>
        <Card className="border-emerald-100 bg-emerald-50/50 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm font-semibold text-emerald-600 uppercase tracking-wide">Products</div>
              <Package className="w-5 h-5 text-emerald-600" />
            </div>
            <div className="text-3xl font-extrabold text-emerald-700">{stats.totalProducts}</div>
            <div className="text-xs text-emerald-600 mt-1">in catalog</div>
          </CardContent>
        </Card>
        <Card className="border-emerald-100 bg-emerald-50/50 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm font-semibold text-emerald-600 uppercase tracking-wide">Total Revenue</div>
              <DollarSign className="w-5 h-5 text-emerald-600" />
            </div>
            <div className="text-3xl font-extrabold text-emerald-700">
              ${(stats.totalRevenue / 1000).toFixed(0)}K
            </div>
            <div className="text-xs text-emerald-600 mt-1">lifetime</div>
          </CardContent>
        </Card>
        <Card className="border-emerald-100 bg-emerald-50/50 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm font-semibold text-emerald-600 uppercase tracking-wide">Avg Commission</div>
              <TrendingUp className="w-5 h-5 text-emerald-600" />
            </div>
            <div className="text-3xl font-extrabold text-emerald-700">70%</div>
            <div className="text-xs text-emerald-600 mt-1">to brands</div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Card>
        <CardHeader className="border-b border-slate-100 pb-6">
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
            <CardTitle className="text-xl font-bold text-slate-900">All Brand Partners</CardTitle>
            <div className="flex flex-col md:flex-row gap-3 w-full md:w-auto">
              {/* Search */}
              <div className="relative flex-1 md:w-64">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                <Input
                  placeholder="Search brands..."
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
            <div className="grid gap-0">
              {filteredBrands.map((brand) => (
                <div 
                  key={brand.id} 
                  className="border-b border-slate-100 p-6 hover:bg-slate-50/50 transition-colors"
                >
                  <div className="flex flex-col lg:flex-row lg:items-center gap-6">
                    {/* Brand Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center flex-shrink-0">
                          <Building2 className="w-6 h-6 text-emerald-700" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-lg font-bold text-slate-900">{brand.name}</h3>
                            {getStatusBadge(brand.status)}
                            {brand.rating > 0 && (
                              <div className="flex items-center gap-1 text-amber-500">
                                <Star className="w-4 h-4 fill-current" />
                                <span className="text-sm font-bold">{brand.rating}</span>
                              </div>
                            )}
                          </div>
                          <div className="text-sm text-slate-600 mb-3">{brand.contactName} • {brand.category}</div>
                          <div className="flex flex-wrap gap-4 text-xs text-slate-500">
                            <div className="flex items-center gap-1.5">
                              <Mail className="w-3 h-3 text-slate-400" />
                              {brand.email}
                            </div>
                            <div className="flex items-center gap-1.5">
                              <Phone className="w-3 h-3 text-slate-400" />
                              {brand.phone}
                            </div>
                            <div className="flex items-center gap-1.5">
                              <Globe className="w-3 h-3 text-slate-400" />
                              {brand.website}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="flex gap-8 lg:gap-12">
                      <div className="text-center">
                        <div className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">Products</div>
                        <div className="text-2xl font-extrabold text-slate-900">{brand.productCount}</div>
                      </div>
                      <div className="text-center">
                        <div className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">Revenue</div>
                        <div className="text-2xl font-extrabold text-emerald-700">
                          ${(brand.totalRevenue / 1000).toFixed(0)}K
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">Split</div>
                        <div className="text-2xl font-extrabold text-slate-900">{brand.commission}%</div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 lg:pl-6 lg:border-l border-slate-200">
                      <Button
                        variant="outline"
                        size="sm"
                        className="rounded-xl h-9"
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        View
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button size="sm" variant="ghost" className="h-9 w-9 p-0 rounded-xl">
                            <MoreVertical className="w-4 h-4" />
                            <span className="sr-only">Actions</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="rounded-xl border-slate-200 shadow-xl w-48">
                          <DropdownMenuLabel className="font-bold text-xs uppercase tracking-widest text-slate-400">
                            Actions
                          </DropdownMenuLabel>
                          <DropdownMenuItem className="rounded-lg cursor-pointer">
                            <Package className="w-4 h-4 mr-2 text-emerald-600" />
                            View Products
                          </DropdownMenuItem>
                          <DropdownMenuItem className="rounded-lg cursor-pointer">
                            <DollarSign className="w-4 h-4 mr-2 text-emerald-600" />
                            View Payouts
                          </DropdownMenuItem>
                          <DropdownMenuItem className="rounded-lg cursor-pointer">
                            <Mail className="w-4 h-4 mr-2 text-emerald-600" />
                            Send Email
                          </DropdownMenuItem>
                          <DropdownMenuSeparator className="bg-slate-100" />
                          {brand.status === 'Active' ? (
                            <DropdownMenuItem 
                              onClick={() => handleSuspend(brand.id, brand.name)}
                              className="text-red-600 focus:text-red-600 rounded-lg cursor-pointer"
                            >
                              <Ban className="w-4 h-4 mr-2" />
                              Suspend Brand
                            </DropdownMenuItem>
                          ) : brand.status === 'Suspended' ? (
                            <DropdownMenuItem 
                              onClick={() => handleActivate(brand.id, brand.name)}
                              className="text-emerald-600 focus:text-emerald-600 rounded-lg cursor-pointer"
                            >
                              <CheckCircle2 className="w-4 h-4 mr-2" />
                              Activate Brand
                            </DropdownMenuItem>
                          ) : null}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {filteredBrands.length === 0 && (
            <div className="text-center py-16 text-slate-500">
              <Building2 className="w-12 h-12 mx-auto mb-4 text-slate-300" />
              <p className="font-medium">No brands found</p>
              <p className="text-sm">Try adjusting your search or filter criteria</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
