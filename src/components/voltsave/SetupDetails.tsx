import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Home, Briefcase, Store, Building2, Wind, Fan, Refrigerator, WashingMachine,
  Flame, Monitor, Laptop, Tv, Microwave, Lightbulb, Wifi, Printer, ChevronDown,
  Camera, Check, Loader2
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
  { id: 'ac', name: 'AC', icon: Wind },
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
  { id: 'router', name: 'Router/Wi-Fi', icon: Wifi },
  { id: 'printer', name: 'Printer', icon: Printer },
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
    }))
  );
  const [expandedAppliance, setExpandedAppliance] = useState<string | null>(null);

  // Preselect appliances based on profile type
  useEffect(() => {
    const preselectedIds = CATEGORY_PRESELECTS[profileType];
    setAppliances(prev => prev.map(app => ({
      ...app,
      selected: preselectedIds.includes(app.id),
    })));
  }, [profileType]);

  const toggleAppliance = (id: string) => {
    setAppliances(prev => prev.map(app =>
      app.id === id ? { ...app, selected: !app.selected } : app
    ));
  };

  const updateAppliance = (id: string, field: keyof Appliance, value: any) => {
    setAppliances(prev => prev.map(app =>
      app.id === id ? { ...app, [field]: value } : app
    ));
  };

  const selectedCount = appliances.filter(a => a.selected).length;

  const handleContinue = () => {
    const selectedAppliances = appliances.filter(a => a.selected);
    const applianceData = {
      profileType,
      appliances: selectedAppliances,
    };
    localStorage.setItem('applianceData', JSON.stringify(applianceData));
    toast.success('Appliances configured!');
    onContinue(applianceData);
  };

  const spaceTypes = [
    { id: 'home', icon: Home, label: 'Home' },
    { id: 'home-office', icon: Briefcase, label: 'Home Office' },
    { id: 'small-shop', icon: Store, label: 'Small Shop' },
    { id: 'office', icon: Building2, label: 'Office' },
  ];

  return (
    <div className="w-full max-w-5xl mx-auto px-4">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-8">
          <TabsTrigger value="appliances">Select Appliances</TabsTrigger>
          <TabsTrigger value="photo">Upload Photo</TabsTrigger>
        </TabsList>

        <TabsContent value="appliances" className="space-y-8">
          {/* Space Type Selection */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Select Space Type</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {spaceTypes.map((type) => (
                <button
                  key={type.id}
                  onClick={() => setProfileType(type.id as ProfileType)}
                  className={`
                    glass-card p-4 flex flex-col items-center gap-3 transition-all
                    ${profileType === type.id 
                      ? 'ring-2 ring-primary bg-primary/10' 
                      : 'hover:bg-white/5'
                    }
                  `}
                >
                  <type.icon className={`w-8 h-8 ${profileType === type.id ? 'text-primary' : 'text-foreground/60'}`} />
                  <span className={`text-sm font-medium ${profileType === type.id ? 'text-white' : 'text-foreground/60'}`}>
                    {type.label}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Appliance Grid */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">Select Appliances</h3>
              <span className="text-sm text-foreground/60">
                {selectedCount} selected
              </span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {appliances.map((appliance) => (
                <button
                  key={appliance.id}
                  onClick={() => toggleAppliance(appliance.id)}
                  className={`
                    glass-card p-4 flex flex-col items-center gap-3 transition-all relative
                    ${appliance.selected 
                      ? 'ring-2 ring-primary bg-primary/10' 
                      : 'hover:bg-white/5'
                    }
                  `}
                >
                  {appliance.selected && (
                    <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                      <Check className="w-3 h-3 text-primary-foreground" />
                    </div>
                  )}
                  <appliance.icon className={`w-6 h-6 ${appliance.selected ? 'text-primary' : 'text-foreground/60'}`} />
                  <span className={`text-xs text-center font-medium ${appliance.selected ? 'text-white' : 'text-foreground/60'}`}>
                    {appliance.name}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Selected Appliances Details */}
          {selectedCount > 0 && (
            <div className="glass-card p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Appliance Details</h3>
              <div className="space-y-4">
                {appliances.filter(a => a.selected).map((appliance) => (
                  <div key={appliance.id} className="border-b border-border last:border-0 pb-4 last:pb-0">
                    <div className="flex items-center gap-4 mb-3">
                      <appliance.icon className="w-5 h-5 text-primary" />
                      <span className="font-medium text-white">{appliance.name}</span>
                      
                      {/* Quantity */}
                      <div className="flex items-center gap-2 ml-auto">
                        <button
                          onClick={() => updateAppliance(appliance.id, 'quantity', Math.max(1, appliance.quantity - 1))}
                          className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center hover:bg-muted/80"
                        >
                          -
                        </button>
                        <span className="w-8 text-center">{appliance.quantity}</span>
                        <button
                          onClick={() => updateAppliance(appliance.id, 'quantity', appliance.quantity + 1)}
                          className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center hover:bg-muted/80"
                        >
                          +
                        </button>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                      <div>
                        <Label className="text-xs text-foreground/50">Hours/Day</Label>
                        <Input
                          type="number"
                          step="0.5"
                          min="0"
                          max="24"
                          value={appliance.hoursPerDay}
                          onChange={(e) => updateAppliance(appliance.id, 'hoursPerDay', parseFloat(e.target.value) || 0)}
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label className="text-xs text-foreground/50">Wattage (W)</Label>
                        <Input
                          type="number"
                          value={appliance.wattage}
                          onChange={(e) => updateAppliance(appliance.id, 'wattage', parseInt(e.target.value) || 0)}
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label className="text-xs text-foreground/50">Age (years, optional)</Label>
                        <Input
                          type="text"
                          value={appliance.age || ''}
                          onChange={(e) => updateAppliance(appliance.id, 'age', e.target.value)}
                          placeholder="e.g. 3"
                          className="mt-1"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
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

            {/* Mock AI Detection Preview */}
            <div className="mt-8 p-4 bg-muted/30 rounded-lg">
              <p className="text-sm text-foreground/60 mb-3">AI Detected Appliances (Preview)</p>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-white">Air Conditioner</span>
                  <span className="px-2 py-1 rounded-full bg-green-500/20 text-green-400 text-xs">High confidence</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-white">Router</span>
                  <span className="px-2 py-1 rounded-full bg-blue-500/20 text-blue-400 text-xs">Medium confidence</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-white">Monitor</span>
                  <span className="px-2 py-1 rounded-full bg-green-500/20 text-green-400 text-xs">High confidence</span>
                </div>
              </div>
              <p className="text-xs text-foreground/40 mt-3">
                * Manual appliance data is used for calculations
              </p>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      {/* Continue Button */}
      <div className="mt-8 flex justify-center">
        <Button
          onClick={handleContinue}
          disabled={selectedCount === 0}
          size="lg"
          className="gradient-cta text-white px-12"
        >
          Continue
        </Button>
      </div>
    </div>
  );
}
