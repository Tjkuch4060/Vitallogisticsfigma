import React, { useState } from 'react';
import { AppBreadcrumb } from '../components/AppBreadcrumb';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import { Label } from '../components/ui/label';
import { Separator } from '../components/ui/separator';
import { toast } from 'sonner';
import { 
    Map as MapIcon, 
    Truck, 
    Calendar, 
    DollarSign, 
    Save, 
    Info, 
    Check,
    Settings
} from 'lucide-react';
import { deliveryZones, DeliveryZone } from '../data/mockData';

// Weekdays constant is still useful here
const WEEKDAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export function DeliveryZones() {
    // Initialize state with imported mock data
    const [zones, setZones] = useState<DeliveryZone[]>(deliveryZones);
    const [selectedZoneId, setSelectedZoneId] = useState<string | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [editForm, setEditForm] = useState<DeliveryZone | null>(null);

    const handleZoneClick = (id: string) => {
        setSelectedZoneId(id);
        setIsEditing(false);
    };

    const handleEditClick = (zone: DeliveryZone) => {
        setEditForm({ ...zone });
        setSelectedZoneId(zone.id);
        setIsEditing(true);
    };

    const handleSave = () => {
        if (!editForm) return;
        setZones(prev => prev.map(z => z.id === editForm.id ? editForm : z));
        setIsEditing(false);
        toast.success("Zone Configuration Saved", {
            description: `${editForm.name} settings have been updated.`
        });
    };

    const toggleDay = (day: string) => {
        if (!editForm) return;
        const currentDays = editForm.days;
        const newDays = currentDays.includes(day)
            ? currentDays.filter(d => d !== day)
            : [...currentDays, day];
        
        // Sort days
        const sortedDays = WEEKDAYS.filter(d => newDays.includes(d));
        setEditForm({ ...editForm, days: sortedDays });
    };

    return (
        <div className="container mx-auto px-4 md:px-8 py-12 animate-in fade-in duration-500">
            <AppBreadcrumb />
            
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-slate-900">Delivery Zones</h1>
                <p className="text-slate-500 mt-2">Manage delivery boundaries, fees, and schedules.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                
                {/* Left Column: Interactive Map */}
                <div className="lg:col-span-7">
                    <Card className="h-full overflow-hidden border-slate-200 shadow-md">
                        <CardHeader className="border-b border-slate-100 bg-slate-50/50 pb-4">
                            <div className="flex items-center justify-between">
                                <CardTitle className="flex items-center gap-2 text-lg">
                                    <MapIcon className="w-5 h-5 text-slate-500" />
                                    Zone Map
                                </CardTitle>
                                <div className="flex gap-4 text-xs font-medium">
                                    {zones.map(zone => (
                                        <div key={zone.id} className="flex items-center gap-1.5">
                                            <span className="w-3 h-3 rounded-full" style={{ backgroundColor: zone.color }} />
                                            <span className={selectedZoneId === zone.id ? "font-bold text-slate-900" : "text-slate-500"}>
                                                {zone.name.split(':')[0]}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="p-0 relative bg-slate-100 min-h-[500px] flex items-center justify-center">
                            
                            {/* Stylized SVG Map */}
                            <svg viewBox="0 0 800 600" className="w-full h-full max-h-[600px] drop-shadow-xl">
                                <defs>
                                    <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
                                        <feDropShadow dx="0" dy="4" stdDeviation="4" floodOpacity="0.1"/>
                                    </filter>
                                </defs>
                                
                                {/* Background Water/Land features context */}
                                <path d="M0,0 H800 V600 H0 Z" fill="#f1f5f9" /> {/* Land */}
                                <path d="M550,0 C 600,100 500,200 650,300 C 750,350 800,400 800,450 V0 Z" fill="#e2e8f0" opacity="0.5" /> {/* River/Feature */}

                                {/* Zone 3: Regional (Outer Layer) */}
                                <g 
                                    onClick={() => handleZoneClick('zone-3')}
                                    className="cursor-pointer transition-all duration-300 hover:brightness-105"
                                    style={{ opacity: selectedZoneId && selectedZoneId !== 'zone-3' ? 0.4 : 1 }}
                                >
                                    <path 
                                        d="M50,50 L750,50 L750,550 L50,550 Z" 
                                        fill={zones[2].color} 
                                        fillOpacity="0.15" 
                                        stroke={zones[2].color} 
                                        strokeWidth="2"
                                        strokeDasharray="8 4"
                                    />
                                    <text x="600" y="500" fill={zones[2].color} className="font-bold text-lg" opacity="0.8">ZONE 3</text>
                                </g>

                                {/* Zone 2: Greater Metro (Middle Layer) */}
                                <g 
                                    onClick={() => handleZoneClick('zone-2')}
                                    className="cursor-pointer transition-all duration-300 hover:brightness-105"
                                    style={{ opacity: selectedZoneId && selectedZoneId !== 'zone-2' ? 0.4 : 1 }}
                                >
                                    <path 
                                        d="M150,150 C 300,120 500,120 650,150 L 620,450 C 500,480 300,480 180,450 Z" 
                                        fill={zones[1].color} 
                                        fillOpacity="0.2" 
                                        stroke={zones[1].color} 
                                        strokeWidth="2" 
                                    />
                                    <text x="500" y="400" fill={zones[1].color} className="font-bold text-lg" opacity="0.9">ZONE 2</text>
                                </g>

                                {/* Zone 1: Metro Core (Inner Layer) */}
                                <g 
                                    onClick={() => handleZoneClick('zone-1')}
                                    className="cursor-pointer transition-all duration-300 hover:brightness-110"
                                    style={{ opacity: selectedZoneId && selectedZoneId !== 'zone-1' ? 0.4 : 1 }}
                                >
                                    <path 
                                        d="M280,250 L520,250 L500,380 L300,380 Z" 
                                        fill={zones[0].color} 
                                        fillOpacity="0.3" 
                                        stroke={zones[0].color} 
                                        strokeWidth="3" 
                                    />
                                    <circle cx="400" cy="315" r="4" fill="white" stroke={zones[0].color} strokeWidth="2" />
                                    <text x="375" y="300" fill={zones[0].color} className="font-bold text-lg">ZONE 1</text>
                                </g>

                                {/* Hover/Select Indicator - dynamic based on selection */}
                                {selectedZoneId && (
                                    <g transform="translate(20, 20)">
                                        <rect width="200" height="40" rx="8" fill="white" className="shadow-lg" />
                                        <text x="20" y="25" className="font-sans font-medium text-sm fill-slate-700">
                                            Selected: {zones.find(z => z.id === selectedZoneId)?.name}
                                        </text>
                                    </g>
                                )}
                            </svg>

                            <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur border border-slate-200 p-3 rounded-lg shadow-sm text-xs text-slate-500 max-w-[200px]">
                                Click on a zone area to view and edit details.
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Right Column: Configuration */}
                <div className="lg:col-span-5 space-y-6">
                    {/* List of Zones when none selected or editing */}
                    {!isEditing && (
                        <div className="space-y-4">
                            {zones.map(zone => (
                                <Card 
                                    key={zone.id} 
                                    className={`
                                        cursor-pointer transition-all duration-200
                                        ${selectedZoneId === zone.id 
                                            ? 'ring-2 ring-emerald-500 shadow-md border-emerald-500/20 bg-emerald-50/10' 
                                            : 'hover:border-emerald-200 hover:bg-slate-50'
                                        }
                                    `}
                                    onClick={() => handleZoneClick(zone.id)}
                                >
                                    <CardHeader className="pb-2">
                                        <div className="flex justify-between items-start">
                                            <div className="flex items-center gap-2">
                                                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: zone.color }} />
                                                <CardTitle className="text-base">{zone.name}</CardTitle>
                                            </div>
                                            {selectedZoneId === zone.id && (
                                                 <Button size="sm" variant="ghost" className="h-8 px-2" onClick={(e) => { e.stopPropagation(); handleEditClick(zone); }}>
                                                    <Settings className="w-4 h-4 mr-1" /> Edit
                                                 </Button>
                                            )}
                                        </div>
                                        <CardDescription className="text-xs">{zone.description}</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="grid grid-cols-2 gap-4 text-sm">
                                            <div>
                                                <span className="text-slate-500 block text-xs uppercase tracking-wider mb-1">Fee</span>
                                                <div className="font-medium flex items-baseline">
                                                    ${zone.baseFee}
                                                    <span className="text-xs text-slate-400 font-normal ml-1">/ order</span>
                                                </div>
                                            </div>
                                            <div>
                                                <span className="text-slate-500 block text-xs uppercase tracking-wider mb-1">Free Over</span>
                                                <div className="font-medium text-emerald-700">
                                                    ${zone.freeThreshold}
                                                </div>
                                            </div>
                                            <div className="col-span-2">
                                                <span className="text-slate-500 block text-xs uppercase tracking-wider mb-1">Delivery Days</span>
                                                <div className="flex gap-1 flex-wrap">
                                                    {WEEKDAYS.map(day => (
                                                        <span 
                                                            key={day}
                                                            className={`
                                                                px-1.5 py-0.5 rounded text-[10px] font-medium border
                                                                ${zone.days.includes(day) 
                                                                    ? 'bg-slate-800 text-white border-slate-800' 
                                                                    : 'bg-slate-50 text-slate-300 border-slate-100'
                                                                }
                                                            `}
                                                        >
                                                            {day}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    )}

                    {/* Edit Form */}
                    {isEditing && editForm && (
                        <Card className="border-emerald-100 shadow-lg animate-in slide-in-from-right-4 duration-300">
                            <CardHeader className="bg-emerald-50/50 border-b border-emerald-100 pb-4">
                                <div className="flex justify-between items-center">
                                    <CardTitle className="text-emerald-900">Edit {editForm.name}</CardTitle>
                                    <Button size="sm" variant="ghost" onClick={() => setIsEditing(false)} className="h-8 w-8 p-0 text-slate-400">
                                        <Check className="w-4 h-4" /> {/* Actually X to close, but Check implies done? Let's use generic close icon or just "Cancel" button below */}
                                        <span className="sr-only">Close</span>
                                    </Button>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-4 pt-6">
                                <div className="space-y-2">
                                    <Label htmlFor="zoneName">Zone Name</Label>
                                    <Input 
                                        id="zoneName" 
                                        value={editForm.name} 
                                        onChange={(e) => setEditForm({...editForm, name: e.target.value})} 
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="baseFee">Base Fee ($)</Label>
                                        <div className="relative">
                                            <DollarSign className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                            <Input 
                                                id="baseFee" 
                                                type="number"
                                                className="pl-8"
                                                value={editForm.baseFee}
                                                onChange={(e) => setEditForm({...editForm, baseFee: parseFloat(e.target.value)})}
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="freeThreshold">Free Over ($)</Label>
                                        <div className="relative">
                                            <DollarSign className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                            <Input 
                                                id="freeThreshold" 
                                                type="number"
                                                className="pl-8"
                                                value={editForm.freeThreshold}
                                                onChange={(e) => setEditForm({...editForm, freeThreshold: parseFloat(e.target.value)})}
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-3 pt-2">
                                    <Label>Delivery Days</Label>
                                    <div className="flex flex-wrap gap-2">
                                        {WEEKDAYS.map(day => {
                                            const isSelected = editForm.days.includes(day);
                                            return (
                                                <button
                                                    key={day}
                                                    onClick={() => toggleDay(day)}
                                                    className={`
                                                        px-3 py-1.5 rounded-md text-sm font-medium transition-colors border
                                                        ${isSelected 
                                                            ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm' 
                                                            : 'bg-white text-slate-600 border-slate-200 hover:border-emerald-300 hover:text-emerald-700'
                                                        }
                                                    `}
                                                >
                                                    {day}
                                                </button>
                                            )
                                        })}
                                    </div>
                                    <p className="text-xs text-slate-500">
                                        Select the days of the week when deliveries occur in this zone.
                                    </p>
                                </div>
                            </CardContent>
                            <CardFooter className="flex justify-between bg-slate-50 border-t border-slate-100 py-4">
                                <Button variant="outline" onClick={() => setIsEditing(false)}>Cancel</Button>
                                <Button onClick={handleSave} className="bg-emerald-600 hover:bg-emerald-700">
                                    <Save className="w-4 h-4 mr-2" /> Save Changes
                                </Button>
                            </CardFooter>
                        </Card>
                    )}
                </div>
            </div>
        </div>
    );
}