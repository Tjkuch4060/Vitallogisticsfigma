import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Input } from '../components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { 
  Search, 
  DollarSign, 
  Calendar,
  Download,
  Filter,
  TrendingUp,
  Clock,
  CheckCircle2,
  AlertCircle,
  Building2,
  ArrowUpRight,
  FileText
} from 'lucide-react';
import { AppBreadcrumb } from '../components/AppBreadcrumb';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';
import { toast } from 'sonner';

interface Payout {
  id: string;
  brandId: string;
  brandName: string;
  period: string;
  periodStart: string;
  periodEnd: string;
  totalSales: number;
  brandShare: number; // 70%
  platformFee: number; // 30%
  status: 'Pending' | 'Processing' | 'Completed' | 'Failed';
  scheduledDate: string;
  completedDate?: string;
  orderCount: number;
}

const mockPayouts: Payout[] = [
  {
    id: 'PAY-001',
    brandId: 'BRN-001',
    brandName: 'Delta Naturals',
    period: 'January 2026',
    periodStart: '2026-01-01',
    periodEnd: '2026-01-31',
    totalSales: 28450.00,
    brandShare: 19915.00,
    platformFee: 8535.00,
    status: 'Completed',
    scheduledDate: '2026-02-05',
    completedDate: '2026-02-05',
    orderCount: 42
  },
  {
    id: 'PAY-002',
    brandId: 'BRN-002',
    brandName: 'Hemp Horizon',
    period: 'January 2026',
    periodStart: '2026-01-01',
    periodEnd: '2026-01-31',
    totalSales: 19200.00,
    brandShare: 13440.00,
    platformFee: 5760.00,
    status: 'Completed',
    scheduledDate: '2026-02-05',
    completedDate: '2026-02-05',
    orderCount: 28
  },
  {
    id: 'PAY-003',
    brandId: 'BRN-003',
    brandName: 'Pure Leaf Co.',
    period: 'January 2026',
    periodStart: '2026-01-01',
    periodEnd: '2026-01-31',
    totalSales: 36800.00,
    brandShare: 25760.00,
    platformFee: 11040.00,
    status: 'Completed',
    scheduledDate: '2026-02-05',
    completedDate: '2026-02-05',
    orderCount: 55
  },
  {
    id: 'PAY-004',
    brandId: 'BRN-001',
    brandName: 'Delta Naturals',
    period: 'February 2026',
    periodStart: '2026-02-01',
    periodEnd: '2026-02-13',
    totalSales: 15600.00,
    brandShare: 10920.00,
    platformFee: 4680.00,
    status: 'Processing',
    scheduledDate: '2026-03-05',
    orderCount: 23
  },
  {
    id: 'PAY-005',
    brandId: 'BRN-002',
    brandName: 'Hemp Horizon',
    period: 'February 2026',
    periodStart: '2026-02-01',
    periodEnd: '2026-02-13',
    totalSales: 12400.00,
    brandShare: 8680.00,
    platformFee: 3720.00,
    status: 'Processing',
    scheduledDate: '2026-03-05',
    orderCount: 18
  },
  {
    id: 'PAY-006',
    brandId: 'BRN-003',
    brandName: 'Pure Leaf Co.',
    period: 'February 2026',
    periodStart: '2026-02-01',
    periodEnd: '2026-02-13',
    totalSales: 18900.00,
    brandShare: 13230.00,
    platformFee: 5670.00,
    status: 'Pending',
    scheduledDate: '2026-03-05',
    orderCount: 31
  },
];

export function Payouts() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [payouts] = useState(mockPayouts);

  const filteredPayouts = payouts.filter(payout => {
    const matchesSearch = 
      payout.brandName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      payout.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      payout.period.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'All' || payout.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const stats = {
    totalPayouts: payouts.reduce((sum, p) => sum + p.brandShare, 0),
    platformRevenue: payouts.reduce((sum, p) => sum + p.platformFee, 0),
    pending: payouts.filter(p => p.status === 'Pending').length,
    completed: payouts.filter(p => p.status === 'Completed').length,
  };

  const getStatusBadge = (status: Payout['status']) => {
    const variants = {
      Completed: 'bg-emerald-100 text-emerald-700 border-emerald-200',
      Processing: 'bg-blue-100 text-blue-700 border-blue-200',
      Pending: 'bg-amber-100 text-amber-700 border-amber-200',
      Failed: 'bg-red-100 text-red-700 border-red-200',
    };

    const icons = {
      Completed: CheckCircle2,
      Processing: Clock,
      Pending: Clock,
      Failed: AlertCircle,
    };

    const Icon = icons[status];

    return (
      <Badge className={`${variants[status]} rounded-lg px-2 py-1 text-xs font-bold border flex items-center gap-1 w-fit`}>
        <Icon className="w-3 h-3" />
        {status}
      </Badge>
    );
  };

  const handleExportPayout = (id: string, brandName: string) => {
    toast.success('Payout Report Exported', {
      description: `Downloaded ${brandName} payout statement.`
    });
  };

  const handleProcessPayout = (id: string, brandName: string) => {
    toast.info('Processing Payout', {
      description: `Initiating transfer to ${brandName}...`
    });
  };

  return (
    <div className="container mx-auto max-w-7xl px-4 md:px-8 py-12 md:py-20">
      <AppBreadcrumb />

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6 mt-6">
        <div>
          <div className="flex items-center gap-2 text-emerald-600 font-bold text-xs uppercase tracking-widest mb-3">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            Financial Management
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
            Brand Payouts
          </h1>
          <p className="text-slate-600 mt-3 text-lg">Track and manage revenue distribution to brand partners</p>
        </div>
        <div className="flex items-center gap-4">
          <Button 
            variant="outline" 
            size="sm" 
            className="rounded-xl border-slate-200 font-bold text-slate-600 h-10 px-5"
          >
            <Download className="w-4 h-4 mr-2" />
            Export All
          </Button>
          <Button 
            size="sm" 
            className="rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold h-10 px-5 border-none shadow-lg shadow-emerald-900/10 transition-all hover:scale-105"
          >
            <DollarSign className="w-4 h-4 mr-2" />
            Process Payouts
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-8">
        <Card className="border-emerald-100 bg-emerald-50/50 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm font-semibold text-emerald-600 uppercase tracking-wide">Total Payouts</div>
              <DollarSign className="w-5 h-5 text-emerald-600" />
            </div>
            <div className="text-3xl font-extrabold text-emerald-700">
              ${(stats.totalPayouts / 1000).toFixed(1)}K
            </div>
            <div className="text-xs text-emerald-600 mt-1">70% to brands</div>
          </CardContent>
        </Card>
        <Card className="border-slate-100 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm font-semibold text-slate-500 uppercase tracking-wide">Platform Revenue</div>
              <TrendingUp className="w-5 h-5 text-slate-400" />
            </div>
            <div className="text-3xl font-extrabold text-slate-900">
              ${(stats.platformRevenue / 1000).toFixed(1)}K
            </div>
            <div className="text-xs text-slate-500 mt-1">30% commission</div>
          </CardContent>
        </Card>
        <Card className="border-amber-100 bg-amber-50/50 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm font-semibold text-amber-600 uppercase tracking-wide">Pending</div>
              <Clock className="w-5 h-5 text-amber-600" />
            </div>
            <div className="text-3xl font-extrabold text-amber-700">{stats.pending}</div>
            <div className="text-xs text-amber-600 mt-1">awaiting processing</div>
          </CardContent>
        </Card>
        <Card className="border-emerald-100 bg-emerald-50/50 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm font-semibold text-emerald-600 uppercase tracking-wide">Completed</div>
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            </div>
            <div className="text-3xl font-extrabold text-emerald-700">{stats.completed}</div>
            <div className="text-xs text-emerald-600 mt-1">this period</div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Card>
        <CardHeader className="border-b border-slate-100 pb-6">
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
            <CardTitle className="text-xl font-bold text-slate-900">Payout History</CardTitle>
            <div className="flex flex-col md:flex-row gap-3 w-full md:w-auto">
              {/* Search */}
              <div className="relative flex-1 md:w-64">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                <Input
                  placeholder="Search payouts..."
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
                  <SelectItem value="Pending">Pending</SelectItem>
                  <SelectItem value="Processing">Processing</SelectItem>
                  <SelectItem value="Completed">Completed</SelectItem>
                  <SelectItem value="Failed">Failed</SelectItem>
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
                  <TableHead className="px-6 py-4 font-bold text-slate-500 uppercase text-[10px] tracking-widest">Payout ID</TableHead>
                  <TableHead className="px-4 py-4 font-bold text-slate-500 uppercase text-[10px] tracking-widest">Brand</TableHead>
                  <TableHead className="px-4 py-4 font-bold text-slate-500 uppercase text-[10px] tracking-widest">Period</TableHead>
                  <TableHead className="px-4 py-4 font-bold text-slate-500 uppercase text-[10px] tracking-widest text-right">Total Sales</TableHead>
                  <TableHead className="px-4 py-4 font-bold text-slate-500 uppercase text-[10px] tracking-widest text-right">Brand Share (70%)</TableHead>
                  <TableHead className="px-4 py-4 font-bold text-slate-500 uppercase text-[10px] tracking-widest text-right">Platform Fee (30%)</TableHead>
                  <TableHead className="px-4 py-4 font-bold text-slate-500 uppercase text-[10px] tracking-widest text-center">Orders</TableHead>
                  <TableHead className="px-4 py-4 font-bold text-slate-500 uppercase text-[10px] tracking-widest">Status</TableHead>
                  <TableHead className="px-6 py-4 font-bold text-slate-500 uppercase text-[10px] tracking-widest text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPayouts.map((payout) => (
                  <TableRow key={payout.id} className="hover:bg-slate-50/50 border-slate-50 transition-colors">
                    <TableCell className="px-6 py-5">
                      <div className="font-mono text-xs font-bold text-slate-900">{payout.id}</div>
                      <div className="text-[10px] text-slate-400 mt-0.5">
                        {payout.status === 'Completed' && payout.completedDate && (
                          <>Paid {new Date(payout.completedDate).toLocaleDateString()}</>
                        )}
                        {payout.status !== 'Completed' && (
                          <>Due {new Date(payout.scheduledDate).toLocaleDateString()}</>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="px-4 py-5">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center flex-shrink-0">
                          <Building2 className="w-4 h-4 text-emerald-700" />
                        </div>
                        <div>
                          <div className="font-bold text-slate-900 text-sm">{payout.brandName}</div>
                          <div className="text-[10px] text-slate-400">ID: {payout.brandId}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="px-4 py-5">
                      <div className="flex items-center gap-1.5 text-sm text-slate-700">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        <span className="font-medium">{payout.period}</span>
                      </div>
                      <div className="text-[10px] text-slate-400 mt-0.5">
                        {new Date(payout.periodStart).toLocaleDateString()} - {new Date(payout.periodEnd).toLocaleDateString()}
                      </div>
                    </TableCell>
                    <TableCell className="px-4 py-5 text-right">
                      <div className="font-bold text-slate-900">${payout.totalSales.toLocaleString()}</div>
                    </TableCell>
                    <TableCell className="px-4 py-5 text-right">
                      <div className="font-extrabold text-emerald-700 text-base">
                        ${payout.brandShare.toLocaleString()}
                      </div>
                    </TableCell>
                    <TableCell className="px-4 py-5 text-right">
                      <div className="font-bold text-slate-600">
                        ${payout.platformFee.toLocaleString()}
                      </div>
                    </TableCell>
                    <TableCell className="px-4 py-5 text-center">
                      <div className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-slate-100 text-slate-700">
                        <span className="font-bold text-sm">{payout.orderCount}</span>
                      </div>
                    </TableCell>
                    <TableCell className="px-4 py-5">
                      {getStatusBadge(payout.status)}
                    </TableCell>
                    <TableCell className="px-6 py-5 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-8 px-3 rounded-lg text-emerald-700 hover:text-emerald-800 hover:bg-emerald-50"
                          onClick={() => handleExportPayout(payout.id, payout.brandName)}
                        >
                          <FileText className="w-3.5 h-3.5 mr-1.5" />
                          Export
                        </Button>
                        {payout.status === 'Pending' && (
                          <Button
                            size="sm"
                            className="h-8 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white"
                            onClick={() => handleProcessPayout(payout.id, payout.brandName)}
                          >
                            <ArrowUpRight className="w-3.5 h-3.5 mr-1.5" />
                            Process
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {filteredPayouts.length === 0 && (
            <div className="text-center py-16 text-slate-500">
              <DollarSign className="w-12 h-12 mx-auto mb-4 text-slate-300" />
              <p className="font-medium">No payouts found</p>
              <p className="text-sm">Try adjusting your search or filter criteria</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
