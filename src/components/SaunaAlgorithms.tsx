import { Slider } from "./ui/slider";
import { Switch } from "./ui/switch";
import { Button } from "./ui/button";
import { useState } from "react";
import { GuidedSession } from "./GuidedSession";
import { GuidedSessionConfig } from "../data/guidedSessions";
import SaunaCamera from "./SaunaCamera";
import { Shield, Settings, AlertTriangle, Package, ExternalLink, Plus, Trash2, Flame, Box, X, Info, Wifi, Zap, Home } from "lucide-react";

interface InventoryItem {
  id: number;
  name: string;
  category: string;
  quantity: number;
}

interface SmartDevice {
  id: number;
  name: string;
  type: string;
  connected: boolean;
  source: 'harvia' | 'custom';
}

export function SaunaAlgorithms() {
  const [autoOptimize] = useState(true);
  const [targetTemp, setTargetTemp] = useState([85]);
  const [sessionLength, setSessionLength] = useState([20]);
  const [activeGuidedSession, setActiveGuidedSession] = useState<GuidedSessionConfig | null>(null);
  const [showSafetySettings, setShowSafetySettings] = useState(false);
  const [inactivityThreshold, setInactivityThreshold] = useState([15]); // Minutes of inactivity before auto shutdown
  const [maxTemp, setMaxTemp] = useState(100); // Maximum temperature limit
  const [maxSessionTime, setMaxSessionTime] = useState(60); // Maximum session time limit in minutes
  const [showStoveInfo, setShowStoveInfo] = useState(false); // Show stove longevity info popup
  
  // Infrastructure usage tracking (mock data - to be connected to real data later)
  const [stonesUsageHours] = useState(450); // Total hours
  const stonesReplacementPeriod = 600; // Recommended replacement at 600 hours
  const stonesUsagePercent = Math.min((stonesUsageHours / stonesReplacementPeriod) * 100, 100);
  
  const [stoveUsageYears] = useState(3.2); // Years of usage
  const stoveReplacementPeriod = 10; // Recommended replacement at 10 years
  const stoveUsagePercent = Math.min((stoveUsageYears / stoveReplacementPeriod) * 100, 100);
  
  // Inventory management
  const [inventory, setInventory] = useState<InventoryItem[]>([
    { id: 1, name: "Sauna Bucket & Ladle", category: "Accessories", quantity: 1 },
    { id: 2, name: "Thermometer", category: "Monitoring", quantity: 2 },
    { id: 3, name: "Essential Oils", category: "Aromatics", quantity: 3 }
  ]);
  const [showAddItem, setShowAddItem] = useState(false);
  const [newItemName, setNewItemName] = useState("");
  const [newItemCategory, setNewItemCategory] = useState("Accessories");
  const [newItemQuantity, setNewItemQuantity] = useState(1);

  const handleAddItem = () => {
    if (newItemName.trim()) {
      const newItem: InventoryItem = {
        id: Math.max(...inventory.map(i => i.id), 0) + 1,
        name: newItemName.trim(),
        category: newItemCategory,
        quantity: newItemQuantity
      };
      setInventory([...inventory, newItem]);
      setNewItemName("");
      setNewItemCategory("Accessories");
      setNewItemQuantity(1);
      setShowAddItem(false);
    }
  };

  // Smart device connectivity
  const [showDeviceConnect, setShowDeviceConnect] = useState(false);
  const [seatalkConnected, setSeatalkConnected] = useState(false);
  const [connectedDevices, setConnectedDevices] = useState<SmartDevice[]>([]);
  const [showAddCustomDevice, setShowAddCustomDevice] = useState(false);
  const [customDeviceName, setCustomDeviceName] = useState("");
  const [customDeviceType, setCustomDeviceType] = useState("Speaker");

  const handleConnectSeatalk = () => {
    setSeatalkConnected(true);
    // Add example Harvia devices
    setConnectedDevices([
      { id: 1, name: "Harvia Sonata Speaker", type: "Speaker", connected: true, source: 'harvia' },
      { id: 2, name: "Harvia LED Lighting", type: "LED", connected: true, source: 'harvia' },
      { id: 3, name: "Harvia Control Panel", type: "Control", connected: true, source: 'harvia' }
    ]);
  };

  const handleAddCustomDevice = () => {
    if (customDeviceName.trim()) {
      const newDevice: SmartDevice = {
        id: Math.max(...connectedDevices.map(d => d.id), 0) + 1,
        name: customDeviceName.trim(),
        type: customDeviceType,
        connected: true,
        source: 'custom'
      };
      setConnectedDevices([...connectedDevices, newDevice]);
      setCustomDeviceName("");
      setCustomDeviceType("Speaker");
      setShowAddCustomDevice(false);
    }
  };

  const handleDisconnectDevice = (id: number) => {
    setConnectedDevices(connectedDevices.filter(d => d.id !== id));
  };
  
  // If guided session is active, show it instead
  if (activeGuidedSession) {
    return <GuidedSession onBack={() => setActiveGuidedSession(null)} />;
  }

  return (
    <div className="bg-[#FFEBCD]">
      {/* Header with Background Image */}
      <div className="relative px-6 pt-12 pb-8 text-white overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1678742753298-9e6b10fcc42f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzYXVuYSUyMHdvb2QlMjB0ZXh0dXJlfGVufDF8fHx8MTc2MzE1MzcwN3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral')"
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-[#8B7355]/95 to-[#5C4033]/95" />
        
        <div className="relative z-10">
          <h1 className="text-white mb-2">Smart Sauna</h1>
          <p className="text-white/90 text-sm">
            AI-powered recommendations tailored to your goals and health data
          </p>
        </div>
      </div>

      <div className="px-6 py-6">
        {/* Smart Device Connection Button */}
        <button
          onClick={() => setShowDeviceConnect(true)}
          className="w-full mb-6 relative overflow-hidden rounded-2xl shadow-lg p-4 flex items-center justify-between hover:opacity-90 transition-all"
        >
          <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: "url('https://images.unsplash.com/photo-1741601272577-fc2c46f87d9f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzYXVuYSUyMHN0b25lcyUyMHN0ZWFtfGVufDF8fHx8MTc2MzIwMDU1MXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral')"
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-br from-orange-600/80 to-red-700/80" />
          <div className="relative flex items-center gap-3 text-white">
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
              <Wifi className="w-5 h-5" />
            </div>
            <div className="text-left">
              <p className="text-white font-medium">Connect Smart Devices</p>
              <p className="text-white/90 text-sm">Harvia Seatalk & Custom Devices</p>
            </div>
          </div>
          <div className="relative text-white/80">
            {connectedDevices.length > 0 && (
              <span className="text-xs bg-white/20 px-2 py-1 rounded-full">{connectedDevices.length} connected</span>
            )}
          </div>
        </button>

        {/* Real-Time Heatmap */}
        <div className="mb-6">
          <h3 className="text-[#3E2723] mb-3">Live Temperature Map</h3>
          <SaunaCamera />
        </div>

        {/* Manual Controls */}
        {!autoOptimize && (
          <div className="relative overflow-hidden rounded-2xl shadow-lg bg-white/60 p-6 mb-6">
            <h3 className="text-[#3E2723] mb-6">Manual Settings</h3>
            
            <div className="space-y-6">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="text-[#5C4033]">Temperature</label>
                  <span className="text-[#3E2723]">{targetTemp[0]}°C</span>
                </div>
                <Slider
                  value={targetTemp}
                  onValueChange={setTargetTemp}
                  min={60}
                  max={100}
                  step={5}
                  className="w-full"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="text-[#5C4033]">Duration</label>
                  <span className="text-[#3E2723]">{sessionLength[0]} min</span>
                </div>
                <Slider
                  value={sessionLength}
                  onValueChange={setSessionLength}
                  min={5}
                  max={60}
                  step={5}
                  className="w-full"
                />
              </div>
            </div>

            <Button className="w-full mt-6 bg-gradient-to-r from-[#8B7355] to-[#6D5A47] text-white hover:from-[#6D5A47] hover:to-[#5C4033]">
              Start Custom Session
            </Button>
          </div>
        )}

        {/* Safety Settings */}
        <div className="mb-6">
          <button
            onClick={() => setShowSafetySettings(true)}
            className="w-full relative overflow-hidden rounded-2xl shadow-lg bg-white/60 p-4 flex items-center justify-between hover:bg-white/70 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#FF6B35]/20 to-[#F7931E]/20 flex items-center justify-center">
                <Shield className="w-5 h-5 text-[#FF6B35]" />
              </div>
              <div className="text-left">
                <p className="text-[#3E2723]">Safety Settings</p>
                <p className="text-[#5C4033]/70 text-sm">Configure safety limits & alerts</p>
              </div>
            </div>
            <Settings className="w-5 h-5 text-[#5C4033]/50" />
          </button>
        </div>

        {/* Infrastructure Usage Monitors */}
        <div className="mb-6">
          <h3 className="text-[#3E2723] mb-3">Infrastructure Health</h3>
          
          {/* Stones Usage */}
          <div className="relative overflow-hidden rounded-2xl shadow-lg bg-white/60 p-4 mb-3">
            <div className="flex items-center gap-3 mb-3">
              <Box className="w-5 h-5 text-[#5C4033]" />
              <div className="flex-1">
                <p className="text-[#3E2723]">Sauna Stones</p>
                <p className="text-[#5C4033]/70 text-xs">{stonesUsageHours}h / {stonesReplacementPeriod}h used</p>
              </div>
              <span className={`text-sm ${stonesUsagePercent >= 90 ? 'text-[#FF6B35]' : stonesUsagePercent >= 70 ? 'text-[#F7931E]' : 'text-[#8B7355]'}`}>
                {stonesUsagePercent.toFixed(0)}%
              </span>
            </div>
            <div className="w-full h-2 bg-[#5C4033]/10 rounded-full overflow-hidden">
              <div 
                className={`h-full transition-all duration-500 ${
                  stonesUsagePercent >= 90 ? 'bg-gradient-to-r from-[#FF6B35] to-[#F7931E]' : 
                  stonesUsagePercent >= 70 ? 'bg-gradient-to-r from-[#F7931E] to-[#FFB347]' : 
                  'bg-gradient-to-r from-[#8B7355] to-[#6D5A47]'
                }`}
                style={{ width: `${stonesUsagePercent}%` }}
              />
            </div>
            {stonesUsagePercent >= 80 && (
              <p className="text-[#FF6B35] text-xs mt-2 flex items-center gap-1">
                <AlertTriangle className="w-3 h-3" />
                Consider replacement soon
              </p>
            )}
          </div>

          {/* Stove Usage */}
          <div className="relative overflow-hidden rounded-2xl shadow-lg bg-white/60 p-4">
            <div className="flex items-center gap-3 mb-3">
              <Flame className="w-5 h-5 text-[#5C4033]" />
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <p className="text-[#3E2723]">Stove System</p>
                  <button
                    onClick={() => setShowStoveInfo(true)}
                    className="text-[#5C4033]/50 hover:text-[#8B7355] transition-colors"
                  >
                    <Info className="w-4 h-4" />
                  </button>
                </div>
                <p className="text-[#5C4033]/70 text-xs">{stoveUsageYears}y / {stoveReplacementPeriod}y usage</p>
              </div>
              <span className={`text-sm ${stoveUsagePercent >= 90 ? 'text-[#FF6B35]' : stoveUsagePercent >= 70 ? 'text-[#F7931E]' : 'text-[#8B7355]'}`}>
                {stoveUsagePercent.toFixed(0)}%
              </span>
            </div>
            <div className="w-full h-2 bg-[#5C4033]/10 rounded-full overflow-hidden">
              <div 
                className={`h-full transition-all duration-500 ${
                  stoveUsagePercent >= 90 ? 'bg-gradient-to-r from-[#FF6B35] to-[#F7931E]' : 
                  stoveUsagePercent >= 70 ? 'bg-gradient-to-r from-[#F7931E] to-[#FFB347]' : 
                  'bg-gradient-to-r from-[#8B7355] to-[#6D5A47]'
                }`}
                style={{ width: `${stoveUsagePercent}%` }}
              />
            </div>
            {stoveUsagePercent >= 80 && (
              <p className="text-[#FF6B35] text-xs mt-2 flex items-center gap-1">
                <AlertTriangle className="w-3 h-3" />
                Consider replacement planning
              </p>
            )}
          </div>
        </div>

        {/* Sauna Inventory */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-[#3E2723]">Sauna Inventory</h3>
            <button
              onClick={() => setShowAddItem(!showAddItem)}
              className="text-[#8B7355] hover:text-[#6D5A47] transition-colors"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-2 mb-3">
            {inventory.map((item) => (
              <div
                key={item.id}
                className="relative overflow-hidden rounded-xl shadow bg-white/60 p-3 flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <Package className="w-4 h-4 text-[#5C4033]" />
                  <div>
                    <p className="text-[#3E2723] text-sm">{item.name}</p>
                    <p className="text-[#5C4033]/60 text-xs">{item.category} • Qty: {item.quantity}</p>
                  </div>
                </div>
                <button
                  onClick={() => setInventory(inventory.filter(i => i.id !== item.id))}
                  className="text-[#5C4033]/40 hover:text-[#FF6B35] transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>

          {showAddItem && (
            <div className="relative overflow-hidden rounded-xl shadow bg-white/80 p-4 mb-3">
              <div className="space-y-3">
                <div>
                  <label className="text-[#3E2723] text-xs mb-1 block">Item Name</label>
                  <input
                    type="text"
                    value={newItemName}
                    onChange={(e) => setNewItemName(e.target.value)}
                    placeholder="e.g., Sauna Bucket"
                    className="w-full px-3 py-2 text-[#3E2723] bg-white rounded border border-[#5C4033]/20 text-sm focus:outline-none focus:border-[#8B7355]"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[#3E2723] text-xs mb-1 block">Category</label>
                    <select
                      value={newItemCategory}
                      onChange={(e) => setNewItemCategory(e.target.value)}
                      className="w-full px-3 py-2 text-[#3E2723] bg-white rounded border border-[#5C4033]/20 text-sm focus:outline-none focus:border-[#8B7355]"
                    >
                      <option value="Accessories">Accessories</option>
                      <option value="Monitoring">Monitoring</option>
                      <option value="Aromatics">Aromatics</option>
                      <option value="Cleaning">Cleaning</option>
                      <option value="Safety">Safety</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[#3E2723] text-xs mb-1 block">Quantity</label>
                    <input
                      type="number"
                      value={newItemQuantity}
                      onChange={(e) => setNewItemQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                      min="1"
                      className="w-full px-3 py-2 text-[#3E2723] bg-white rounded border border-[#5C4033]/20 text-sm focus:outline-none focus:border-[#8B7355]"
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    onClick={handleAddItem}
                    disabled={!newItemName.trim()}
                    className="flex-1 bg-gradient-to-r from-[#8B7355] to-[#6D5A47] text-white hover:from-[#6D5A47] hover:to-[#5C4033] disabled:opacity-50"
                  >
                    Add Item
                  </Button>
                  <Button
                    onClick={() => {
                      setShowAddItem(false);
                      setNewItemName("");
                      setNewItemCategory("Accessories");
                      setNewItemQuantity(1);
                    }}
                    variant="outline"
                    className="border-[#5C4033]/20 text-[#5C4033] hover:bg-[#5C4033]/5"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </div>
          )}

          <a
            href="https://www.harvia.com/en/products/"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full relative overflow-hidden rounded-xl shadow-lg bg-gradient-to-r from-[#8B7355] to-[#6D5A47] p-4 flex items-center justify-between text-white hover:from-[#6D5A47] hover:to-[#5C4033] transition-all"
          >
            <div className="flex items-center gap-3">
              <ExternalLink className="w-5 h-5" />
              <span>Browse Harvia Webshop</span>
            </div>
          </a>
        </div>
      </div>

      {/* Smart Device Connection Modal */}
      {showDeviceConnect && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-end sm:items-center justify-center">
          <div className="bg-[#FFEBCD] rounded-t-3xl sm:rounded-3xl w-full sm:max-w-md max-h-[85vh] overflow-y-auto">
            <div className="sticky top-0 bg-[#FFEBCD] border-b border-[#5C4033]/10 p-6 flex items-center justify-between">
              <h2 className="text-[#3E2723]">Smart Device Connection</h2>
              <button
                onClick={() => {
                  setShowDeviceConnect(false);
                  setShowAddCustomDevice(false);
                  setCustomDeviceName("");
                  setCustomDeviceType("Speaker");
                }}
                className="text-[#5C4033]/60 hover:text-[#3E2723] transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              {/* Harvia Seatalk Connection - Primary */}
              <div className="bg-white/60 rounded-xl p-4">
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#FF6B35] to-[#F7931E] flex items-center justify-center flex-shrink-0">
                    <Zap className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-[#3E2723] mb-1">Harvia Seatalk</h3>
                    <p className="text-[#5C4033]/70 text-xs leading-relaxed">
                      Connect to Harvia's smart ecosystem for speakers, LED lighting, and control panels with seamless integration.
                    </p>
                  </div>
                </div>
                <Button
                  onClick={() => {
                    handleConnectSeatalk();
                    setShowDeviceConnect(false);
                  }}
                  disabled={seatalkConnected}
                  className="w-full bg-gradient-to-r from-[#FF6B35] to-[#F7931E] text-white hover:from-[#F7931E] hover:to-[#FFB347] disabled:opacity-50"
                >
                  {seatalkConnected ? "Connected" : "Connect to Seatalk"}
                </Button>
              </div>

              {/* Custom Smart Home Devices - Secondary */}
              <div className="bg-white/60 rounded-xl p-4">
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#8B7355]/20 to-[#6D5A47]/20 flex items-center justify-center flex-shrink-0">
                    <Home className="w-6 h-6 text-[#8B7355]" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-[#3E2723] mb-1">Custom Devices</h3>
                    <p className="text-[#5C4033]/70 text-xs leading-relaxed">
                      Add your own smart home devices manually for custom integration.
                    </p>
                  </div>
                </div>
                <Button
                  onClick={() => setShowAddCustomDevice(!showAddCustomDevice)}
                  variant="outline"
                  className="w-full border-[#8B7355] text-[#8B7355] hover:bg-[#8B7355]/10"
                >
                  {showAddCustomDevice ? "Cancel" : "Add Custom Device"}
                </Button>

                {showAddCustomDevice && (
                  <div className="mt-4 space-y-3 p-3 bg-white/60 rounded-lg">
                    <div>
                      <label className="text-[#3E2723] text-xs mb-1 block">Device Name</label>
                      <input
                        type="text"
                        value={customDeviceName}
                        onChange={(e) => setCustomDeviceName(e.target.value)}
                        placeholder="e.g., My Smart Speaker"
                        className="w-full px-3 py-2 text-[#3E2723] bg-white rounded border border-[#5C4033]/20 text-sm focus:outline-none focus:border-[#8B7355]"
                      />
                    </div>
                    <div>
                      <label className="text-[#3E2723] text-xs mb-1 block">Device Type</label>
                      <select
                        value={customDeviceType}
                        onChange={(e) => setCustomDeviceType(e.target.value)}
                        className="w-full px-3 py-2 text-[#3E2723] bg-white rounded border border-[#5C4033]/20 text-sm focus:outline-none focus:border-[#8B7355]"
                      >
                        <option value="Speaker">Speaker</option>
                        <option value="LED">LED Lighting</option>
                        <option value="Control">Control Panel</option>
                        <option value="Sensor">Sensor</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                    <Button
                      onClick={() => {
                        handleAddCustomDevice();
                      }}
                      disabled={!customDeviceName.trim()}
                      className="w-full bg-gradient-to-r from-[#8B7355] to-[#6D5A47] text-white hover:from-[#6D5A47] hover:to-[#5C4033] disabled:opacity-50"
                    >
                      Add Device
                    </Button>
                  </div>
                )}
              </div>

              {/* Connected Devices List */}
              {connectedDevices.length > 0 && (
                <div className="bg-white/60 rounded-xl p-4">
                  <h3 className="text-[#3E2723] mb-3">Connected Devices</h3>
                  <div className="space-y-2">
                    {connectedDevices.map((device) => (
                      <div
                        key={device.id}
                        className="bg-white/60 rounded-lg p-3 flex items-center justify-between"
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                            device.source === 'harvia' 
                              ? 'bg-gradient-to-br from-[#FF6B35]/20 to-[#F7931E]/20' 
                              : 'bg-gradient-to-br from-[#8B7355]/20 to-[#6D5A47]/20'
                          }`}>
                            {device.type === 'Speaker' ? <Zap className="w-4 h-4 text-[#5C4033]" /> : 
                             device.type === 'LED' ? <Zap className="w-4 h-4 text-[#5C4033]" /> : 
                             <Package className="w-4 h-4 text-[#5C4033]" />}
                          </div>
                          <div>
                            <p className="text-[#3E2723] text-sm">{device.name}</p>
                            <p className="text-[#5C4033]/60 text-xs">
                              {device.type} • {device.source === 'harvia' ? 'Seatalk' : 'Custom'}
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={() => {
                            handleDisconnectDevice(device.id);
                            if (device.source === 'harvia') {
                              setSeatalkConnected(false);
                            }
                          }}
                          className="text-[#5C4033]/40 hover:text-[#FF6B35] transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Safety Settings Overlay */}
      {showSafetySettings && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-end sm:items-center justify-center">
          <div className="bg-[#FFEBCD] rounded-t-3xl sm:rounded-3xl w-full sm:max-w-md max-h-[85vh] overflow-y-auto">
            <div className="sticky top-0 bg-[#FFEBCD] border-b border-[#5C4033]/10 p-6 flex items-center justify-between">
              <h2 className="text-[#3E2723]">Safety Settings</h2>
              <button
                onClick={() => setShowSafetySettings(false)}
                className="text-[#5C4033]/60 hover:text-[#3E2723] transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              {/* Maximum Temperature */}
              <div className="bg-white/60 rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <label className="text-[#3E2723]">Maximum Temperature</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      value={maxTemp}
                      onChange={(e) => setMaxTemp(Math.max(60, Math.min(120, parseInt(e.target.value) || 60)))}
                      className="w-16 px-2 py-1 text-[#3E2723] bg-white/80 rounded border border-[#5C4033]/20 text-center text-sm focus:outline-none focus:border-[#8B7355]"
                      min="60"
                      max="120"
                    />
                    <span className="text-[#5C4033]">°C</span>
                  </div>
                </div>
                <p className="text-[#5C4033]/70 text-xs">
                  System will not exceed this temperature
                </p>
              </div>

              {/* Session Time Limit */}
              <div className="bg-white/60 rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <label className="text-[#3E2723]">Session Time Limit</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      value={maxSessionTime}
                      onChange={(e) => setMaxSessionTime(Math.max(5, Math.min(180, parseInt(e.target.value) || 5)))}
                      className="w-16 px-2 py-1 text-[#3E2723] bg-white/80 rounded border border-[#5C4033]/20 text-center text-sm focus:outline-none focus:border-[#8B7355]"
                      min="5"
                      max="180"
                    />
                    <span className="text-[#5C4033]">min</span>
                  </div>
                </div>
                <p className="text-[#5C4033]/70 text-xs">
                  Auto-stop after this duration
                </p>
              </div>

              {/* Temperature Alerts */}
              <div className="bg-white/60 rounded-xl p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[#3E2723]">Temperature Alerts</p>
                    <p className="text-[#5C4033]/70 text-xs">Notify when temp exceeds safe range</p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </div>

              {/* Auto Shutdown */}
              <div className="bg-white/60 rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <label className="text-[#3E2723]">Auto Shutdown</label>
                  <span className="text-[#5C4033]">{inactivityThreshold[0]} min</span>
                </div>
                <p className="text-[#5C4033]/70 text-xs mb-3">
                  Turn off stove after this many minutes of inactivity
                </p>
                <Slider
                  value={inactivityThreshold}
                  onValueChange={setInactivityThreshold}
                  min={5}
                  max={60}
                  step={5}
                  className="w-full"
                />
              </div>

              {/* Door Open Alert */}
              <div className="bg-white/60 rounded-xl p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[#3E2723]">Door Open Alert</p>
                    <p className="text-[#5C4033]/70 text-xs">Alert if door left open too long</p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </div>

              {/* Emergency Stop */}
              <div className="bg-white/60 rounded-xl p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[#3E2723]">Emergency Contact</p>
                    <p className="text-[#5C4033]/70 text-xs">Set up emergency contact info</p>
                  </div>
                  <Button size="sm" variant="outline">Configure</Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Stove Longevity Info Popup */}
      {showStoveInfo && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-6">
          <div className="bg-[#FFEBCD] rounded-3xl w-full max-w-sm shadow-2xl">
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#8B7355] to-[#6D5A47] flex items-center justify-center">
                  <Flame className="w-6 h-6 text-white" />
                </div>
                <button
                  onClick={() => setShowStoveInfo(false)}
                  className="text-[#5C4033]/60 hover:text-[#3E2723] transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              
              <h3 className="text-[#3E2723] mb-3">Built to Last a Decade</h3>
              
              <p className="text-[#5C4033] text-sm leading-relaxed mb-4">
                Harvia stoves are engineered with exceptional quality and durability in mind. With proper care and maintenance, you can expect your Harvia stove to provide reliable performance for up to <span className="font-semibold text-[#8B7355]">10 years</span> without needing replacement.
              </p>
              
              <div className="bg-white/60 rounded-xl p-4 mb-4">
                <p className="text-[#3E2723] text-sm mb-2">Premium Quality Features:</p>
                <ul className="text-[#5C4033] text-xs space-y-1.5">
                  <li className="flex items-start gap-2">
                    <span className="text-[#8B7355] mt-0.5">•</span>
                    <span>High-grade materials & construction</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#8B7355] mt-0.5">•</span>
                    <span>Rigorous quality testing standards</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#8B7355] mt-0.5">•</span>
                    <span>Designed for long-term reliability</span>
                  </li>
                </ul>
              </div>
              
              <Button 
                onClick={() => setShowStoveInfo(false)}
                className="w-full bg-gradient-to-r from-[#8B7355] to-[#6D5A47] text-white hover:from-[#6D5A47] hover:to-[#5C4033]"
              >
                Got It
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}