import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Home, Briefcase, Store, Building2, Wind, Fan, Refrigerator, WashingMachine,
  Flame, Monitor, Laptop, Tv, Microwave, Lightbulb, Wifi, Printer,
  Camera, Check, ChevronDown, ChevronRight, Plus, Minus, X, Zap, Settings2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

type ProfileType = 'home' | 'home-office' | 'small-shop' | 'office';

interface Appliance {
  id: string;
  name: string;
  icon: React.ElementType;
  selected: boolean;
  quantity: number;
  hoursPerDay: number;
  wattage: number;
  age?: string;
  custom?: boolean;
}

interface SetupDetailsProps {
  onContinue: (applianceData: any) => void;
}

const CATEGORY_PRESELECTS: Record<ProfileType, string[]> = {
  home: ['ac', 'fan', 'fridge', 'washing', 'tv', 'lights', 'router'],
  'home-office': ['ac', 'fan', 'desktop', 'monitor', 'lights', 'router', 'printer'],
  'small-shop': ['ac', 'fan', 'lights', 'fridge', 'tv', 'router'],
  office: ['ac', 'desktop', 'monitor', 'printer', 'lights', 'router', 'laptop'],
};

const DEFAULT_WATTAGES: Record<string, number> = {
  ac: 1500, fan: 75, fridge: 150, washing: 500, waterheater: 2000,
  desktop: 300, laptop: 65, monitor: 30, tv: 100, microwave: 1200,
  lights: 20, router: 10, printer: 50,
};

const DEFAULT_HOURS: Record<string, number> = {
  ac: 8, fan: 10, fridge: 24, washing: 1, waterheater: 0.5,
  desktop: 8, laptop: 8, monitor: 8, tv: 4, microwave: 0.5,
  lights: 6, router: 24, printer: 2,
};

const APPLIANCE_LIST = [
  { id: 'ac', name: 'Air Conditioner', icon: Wind },
  { id: 'fan', name: 'Fan', icon: Fan },
  { id: 'fridge', name: 'Refrigerator', icon: Refrigerator },
  { id: 'washing', name: 'Washing Machine', icon: WashingMachine },
  { id: 'waterheater', name: 'Water Heater', icon: Flame },
  { id: 'desktop', name: 'Desktop PC', icon: Monitor },
  { id: 'laptop', name: 'Laptop', icon: Laptop },
  { id: 'monitor', name: 'Monitor', icon: Monitor },
  { id: 'tv', name: 'TV', icon: Tv },
  { id: 'microwave', name: 'Microwave', icon: Microwave },
  { id: 'lights', name: 'Lights', icon: Lightbulb },
  { id: 'router', name: 'Router / Wi-Fi', icon: Wifi },
  { id: 'printer', name: 'Printer', icon: Printer },
];

const SPACE_TYPES = [
  { id: 'home' as ProfileType, icon: Home, label: 'Home' },
  { id: 'home-office' as ProfileType, icon: Briefcase, label: 'Home Office' },
  { id: 'small-shop' as ProfileType, icon: Store, label: 'Small Shop' },
  { id: 'office' as ProfileType, icon: Building2, label: 'Office' },
];

export default function SetupDetails({ onContinue }: SetupDetailsProps) {
  const [profileType, setProfileType] = useState<ProfileType>('home');
  const [activeTab, setActiveTab] = useState('appliances');
  const [appliances, setAppliances] = useState<Appliance[]>(
    APPLIANCE_LIST.map(app => ({
      id: app.id,
      name: app.name,
      icon: app.icon,
      selected: false,
      quantity: 1,
      hoursPerDay: DEFAULT_HOURS[app.id] || 4,
      wattage: DEFAULT_WATTAGES[app.id] || 100,
      age: '',
    })),
  );
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // Custom appliance form state
  const [showCustomForm, setShowCustomForm] = useState(false);
  const [customName, setCustomName] = useState('');
  const [customQty, setCustomQty] = useState(1);
  const [customHours, setCustomHours] = useState(4);
  const [customWatts, setCustomWatts] = useState<string>('');

  // Preselect appliances based on profile type
  useEffect(() => {
    const preselectedIds = CATEGORY_PRESELECTS[profileType];
    setAppliances(prev =>
      prev.map(app =>
        app.custom ? app : { ...app, selected: preselectedIds.includes(app.id) },
      ),
    );
  }, [profileType]);

  const toggleAppliance = (id: string) => {
    setAppliances(prev =>
      prev.map(app => (app.id === id ? { ...app, selected: !app.selected } : app)),
    );
  };

  const updateAppliance = (id: string, field: keyof Appliance, value: any) => {
    setAppliances(prev =>
      prev.map(app => (app.id === id ? { ...app, [field]: value } : app)),
    );
  };

  const addCustomAppliance = () => {
    const name = customName.trim();
    if (!name) {
      toast.error('Please enter an appliance name');
      return;
    }
    const id = `custom-${Date.now()}`;
    const watts = parseInt(customWatts, 10);
    setAppliances(prev => [
      ...prev,
      {
        id,
        name,
        icon: Settings2,
        selected: true,
        quantity: customQty,
        hoursPerDay: customHours,
        wattage: Number.isFinite(watts) && watts > 0 ? watts : 100,
        age: '',
        custom: true,
      },
    ]);
    setCustomName('');
    setCustomQty(1);
    setCustomHours(4);
    setCustomWatts('');
    setShowCustomForm(false);
    toast.success(`Added "${name}"`);
  };

  const removeAppliance = (id: string) => {
    setAppliances(prev => prev.filter(a => a.id !== id));
  };

  const selectedAppliances = appliances.filter(a => a.selected);
  const selectedCount = selectedAppliances.length;

  const handleStartAnalysis = () => {
    if (selectedCount === 0) return;
    const applianceData = { profileType, appliances: selectedAppliances };
    localStorage.setItem('applianceData', JSON.stringify(applianceData));
    toast.success('Starting AI analysis...');
    onContinue(applianceData);
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-8">
          <TabsTrigger value="appliances">Select Appliances</TabsTrigger>
          <TabsTrigger value="photo">Upload Photo</TabsTrigger>
        </TabsList>

        <TabsContent value="appliances" className="space-y-5">
          {/* Space Type */}
          <div className="glass-card p-6 sm:p-7">
            <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-foreground/50 mb-5">
              Space Type
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {SPACE_TYPES.map(type => {
                const isActive = profileType === type.id;
                return (
                  <button
                    key={type.id}
                    onClick={() => setProfileType(type.id)}
                    className={`
                      flex items-center gap-2 px-4 py-3 rounded-lg border transition-all
                      ${
                        isActive
                          ? 'bg-primary/15 border-primary text-primary shadow-[0_0_0_1px_hsl(var(--primary))]'
                          : 'bg-muted/30 border-border text-foreground/60 hover:bg-muted/50'
                      }
                    `}
                  >
                    <type.icon className="w-4 h-4 shrink-0" />
                    <span className="text-sm font-medium">{type.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Appliances */}
          <div className="glass-card p-6 sm:p-7">
            <div className="flex items-center justify-between mb-5">
              <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-foreground/50">
                Your Appliances
              </p>
              <span className="text-sm font-medium text-primary">
                {selectedCount} selected
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {appliances.map(appliance => {
                const isSelected = appliance.selected;
                return (
                  <button
                    key={appliance.id}
                    onClick={() => toggleAppliance(appliance.id)}
                    className={`
                      group flex items-center gap-3 px-4 py-3 rounded-lg border transition-all text-left
                      ${
                        isSelected
                          ? 'bg-primary/10 border-primary/60'
                          : 'bg-muted/30 border-border hover:bg-muted/50'
                      }
                    `}
                  >
                    <appliance.icon
                      className={`w-5 h-5 shrink-0 ${
                        isSelected ? 'text-primary' : 'text-foreground/50'
                      }`}
                    />
                    <span
                      className={`flex-1 text-sm font-medium truncate ${
                        isSelected ? 'text-white' : 'text-foreground/70'
                      }`}
                    >
                      {appliance.name}
                    </span>
                    {appliance.custom && (
                      <span
                        role="button"
                        tabIndex={0}
                        onClick={e => {
                          e.stopPropagation();
                          removeAppliance(appliance.id);
                        }}
                        className="p-1 rounded hover:bg-white/10 text-foreground/40"
                      >
                        <X className="w-3.5 h-3.5" />
                      </span>
                    )}
                    {isSelected ? (
                      <span className="w-5 h-5 rounded-full bg-primary/20 border border-primary/50 flex items-center justify-center">
                        <Check className="w-3 h-3 text-primary" />
                      </span>
                    ) : (
                      <span className="w-5 h-5 rounded-full border border-border" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Selected Appliance Details */}
          {selectedCount > 0 && (
            <div className="glass-card p-6 sm:p-7">
              <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-foreground/50 mb-5">
                Configure Usage
              </p>

              <div className="space-y-2">
                {selectedAppliances.map(appliance => {
                  const expanded = expandedId === appliance.id;
                  return (
                    <div
                      key={appliance.id}
                      className="rounded-lg border border-border bg-muted/20"
                    >
                      <div className="flex items-center gap-3 px-4 py-3 flex-wrap">
                        <appliance.icon className="w-5 h-5 text-primary shrink-0" />
                        <span className="font-medium text-white flex-1 min-w-[120px]">
                          {appliance.name}
                        </span>

                        {/* Quantity stepper */}
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() =>
                              updateAppliance(
                                appliance.id,
                                'quantity',
                                Math.max(1, appliance.quantity - 1),
                              )
                            }
                            className="w-7 h-7 rounded-full border border-border bg-background/50 flex items-center justify-center text-foreground/70 hover:text-white hover:border-primary"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="w-6 text-center text-sm font-medium text-white">
                            {appliance.quantity}
                          </span>
                          <button
                            onClick={() =>
                              updateAppliance(
                                appliance.id,
                                'quantity',
                                appliance.quantity + 1,
                              )
                            }
                            className="w-7 h-7 rounded-full border border-border bg-background/50 flex items-center justify-center text-foreground/70 hover:text-white hover:border-primary"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        {/* Hours input */}
                        <div className="flex items-center gap-2">
                          <input
                            type="number"
                            step="0.5"
                            min="0"
                            max="24"
                            value={appliance.hoursPerDay}
                            onChange={e =>
                              updateAppliance(
                                appliance.id,
                                'hoursPerDay',
                                parseFloat(e.target.value) || 0,
                              )
                            }
                            className="w-16 h-9 rounded-full border border-border bg-background/50 px-3 text-sm text-white text-center focus:outline-none focus:border-primary"
                          />
                          <span className="text-sm text-foreground/50">hrs</span>
                        </div>

                        {/* Advanced toggle */}
                        <button
                          onClick={() =>
                            setExpandedId(expanded ? null : appliance.id)
                          }
                          className="flex items-center gap-1 text-sm text-foreground/50 hover:text-white transition-colors ml-auto"
                        >
                          Advanced
                          <ChevronDown
                            className={`w-4 h-4 transition-transform ${
                              expanded ? 'rotate-180' : ''
                            }`}
                          />
                        </button>
                      </div>

                      <AnimatePresence>
                        {expanded && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="overflow-hidden border-t border-border"
                          >
                            <div className="px-4 py-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
                              <div>
                                <Label className="text-xs text-foreground/50">
                                  Wattage (W)
                                </Label>
                                <Input
                                  type="number"
                                  value={appliance.wattage}
                                  onChange={e =>
                                    updateAppliance(
                                      appliance.id,
                                      'wattage',
                                      parseInt(e.target.value, 10) || 0,
                                    )
                                  }
                                  className="mt-1"
                                />
                              </div>
                              <div>
                                <Label className="text-xs text-foreground/50">
                                  Age (years, optional)
                                </Label>
                                <Input
                                  type="text"
                                  value={appliance.age || ''}
                                  onChange={e =>
                                    updateAppliance(
                                      appliance.id,
                                      'age',
                                      e.target.value,
                                    )
                                  }
                                  placeholder="e.g. 3"
                                  className="mt-1"
                                />
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Add Custom Appliance */}
          <div className="glass-card p-6 sm:p-7">
            <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-foreground/50 mb-5">
              Add Custom Appliance
            </p>

            {!showCustomForm ? (
              <button
                onClick={() => setShowCustomForm(true)}
                className="flex items-center gap-2 px-4 py-2 rounded-lg border border-dashed border-border text-foreground/60 hover:text-white hover:border-primary transition-colors"
              >
                <Plus className="w-4 h-4" />
                Add appliance
              </button>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                  <Input
                    placeholder="Appliance name"
                    value={customName}
                    onChange={e => setCustomName(e.target.value)}
                  />
                  <Input
                    type="number"
                    min="1"
                    placeholder="Qty"
                    value={customQty}
                    onChange={e =>
                      setCustomQty(Math.max(1, parseInt(e.target.value, 10) || 1))
                    }
                  />
                  <Input
                    type="number"
                    min="0"
                    max="24"
                    step="0.5"
                    placeholder="Hours/day"
                    value={customHours}
                    onChange={e =>
                      setCustomHours(parseFloat(e.target.value) || 0)
                    }
                  />
                  <Input
                    type="number"
                    placeholder="Watts (opt)"
                    value={customWatts}
                    onChange={e => setCustomWatts(e.target.value)}
                  />
                </div>
                <div className="flex items-center gap-3 mt-4">
                  <Button
                    onClick={addCustomAppliance}
                    className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-full px-6"
                  >
                    Add
                  </Button>
                  <button
                    onClick={() => {
                      setShowCustomForm(false);
                      setCustomName('');
                      setCustomQty(1);
                      setCustomHours(4);
                      setCustomWatts('');
                    }}
                    className="text-sm text-foreground/60 hover:text-white"
                  >
                    Cancel
                  </button>
                </div>
              </>
            )}
          </div>
        </TabsContent>

        <TabsContent value="photo">
          <div className="glass-card p-8 text-center">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <Camera className="w-8 h-8 text-primary" />
            </div>
            <p className="text-white font-medium mb-2">
              Upload a photo of your room
            </p>
            <p className="text-foreground/50 text-sm mb-4">
              Our AI will detect appliances automatically
            </p>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              id="room-photo"
            />
            <label htmlFor="room-photo">
              <Button variant="outline" asChild>
                <span>Take Photo or Upload</span>
              </Button>
            </label>
          </div>
        </TabsContent>
      </Tabs>

      {/* Start AI Analysis */}
      <div className="mt-8">
        <Button
          onClick={handleStartAnalysis}
          disabled={selectedCount === 0}
          className="w-full h-14 gradient-cta text-white text-base font-semibold rounded-xl shadow-lg shadow-primary/20 hover:shadow-primary/30 disabled:opacity-50"
        >
          <Zap className="w-5 h-5 mr-2" />
          Start AI Analysis
          <ChevronRight className="w-5 h-5 ml-1" />
        </Button>
      </div>
    </div>
  );
}
