import { useState, useRef, useEffect } from "react";
import { Button } from "./ui/button";
import { Slider } from "./ui/slider";
import { ChevronDown, ChevronUp, Plus, X, Volume2, VolumeX } from "lucide-react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { DraggableInterval } from "./DraggableInterval";
import type { Interval, Action } from "../hooks/useSessionState";

interface AdvancedProgramBuilderProps {
  onSave: (config: {
    programName: string;
    duration: number;
    heatLevel: number;
    humidity: number;
    intervals: Interval[];
    soundscape: string;
    lighting: { r: number; g: number; b: number };
    actions: Action[];
  }) => void;
  onStartNow?: (config: {
    programName: string;
    duration: number;
    heatLevel: number;
    humidity: number;
    intervals: Interval[];
    soundscape: string;
    lighting: { r: number; g: number; b: number };
    actions: Action[];
  }) => void;
  onScheduleLater?: (config: {
    programName: string;
    duration: number;
    heatLevel: number;
    humidity: number;
    intervals: Interval[];
    soundscape: string;
    lighting: { r: number; g: number; b: number };
    actions: Action[];
  }) => void;
  onCancel: () => void;
  initialData?: {
    programName?: string;
    duration?: number;
    heatLevel?: number;
    humidity?: number;
    intervals?: Interval[];
    soundscape?: string;
    lighting?: { r: number; g: number; b: number };
    actions?: Action[];
  };
  isSessionRunning?: boolean;
}

export function AdvancedProgramBuilder({ 
  onSave, 
  onStartNow,
  onScheduleLater,
  onCancel, 
  initialData,
  isSessionRunning = false 
}: AdvancedProgramBuilderProps) {
  // Basic settings
  const [duration, setDuration] = useState([initialData?.duration || 30]);
  const [heatLevel, setHeatLevel] = useState([initialData?.heatLevel || 80]);
  const [humidity, setHumidity] = useState([initialData?.humidity || 40]);
  const [programName, setProgramName] = useState(initialData?.programName || "");
  
  // Advanced settings
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [intervals, setIntervals] = useState<Interval[]>(initialData?.intervals || []);
  const [soundscape, setSoundscape] = useState(initialData?.soundscape || "");
  const [lightingR, setLightingR] = useState([initialData?.lighting?.r || 255]);
  const [lightingG, setLightingG] = useState([initialData?.lighting?.g || 200]);
  const [lightingB, setLightingB] = useState([initialData?.lighting?.b || 150]);
  const [actions, setActions] = useState<Action[]>(initialData?.actions || []);
  
  // UI state
  const [newActionName, setNewActionName] = useState("");
  const [showAddAction, setShowAddAction] = useState<"prep" | "post" | null>(null);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [isMouseDown, setIsMouseDown] = useState(false);
  const [editingActionTime, setEditingActionTime] = useState<number | null>(null);
  const [tempActionTime, setTempActionTime] = useState("");
  const [dropIndicator, setDropIndicator] = useState<{ index: number; show: boolean }>({ index: -1, show: false });
  
  // Audio state
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  // Soundscape options
  const soundscapeOptions = [
    "Silent",
    "Forest Ambience",
    "Ocean Waves",
    "Rain & Thunder",
    "Nordic Winds",
    "Meditation Bowls",
    "Birch Forest"
  ];
  
  // Soundscape audio mapping
  const soundscapeAudioMap: Record<string, string> = {
    "Forest Ambience": "/2462-preview.mp3",
    "Ocean Waves": "/2393-preview.mp3",
    "Rain & Thunder": "/2410-preview.mp3",
    "Nordic Winds": "/2398-preview.mp3",
    "Meditation Bowls": "/2417-preview.mp3",
    "Birch Forest": "/2462-preview.mp3",
    "Silent": ""
  };

  // Audio functions
  const playAudio = (url: string) => {
    if (!url) return;
    
    console.log("🎵 Attempting to play audio:", url);
    
    if (audioRef.current) {
      try {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      } catch (e) {
        console.log("Error stopping previous audio:", e);
      }
      audioRef.current = null;
    }
    
    const audio = new Audio(url);
    audio.loop = true;
    audio.volume = 0.6;
    
    audio.addEventListener('loadeddata', () => {
      console.log("✅ Audio loaded successfully");
    });
    
    audio.addEventListener('error', (e) => {
      console.error("❌ Audio error:", e);
    });
    
    audio.play()
      .then(() => {
        console.log("▶️ Audio playing");
        audioRef.current = audio;
      })
      .catch(err => {
        console.error("❌ Audio playback failed:", err);
      });
  };

  const stopAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
  };

  // Cleanup audio on unmount
  useEffect(() => {
    return () => {
      stopAudio();
    };
  }, []);

  // Interval management
  const addInterval = (type: "sauna" | "break") => {
    setIntervals([...intervals, { id: Date.now(), type, duration: type === "sauna" ? 15 : 5 }]);
  };

  const removeInterval = (id: number) => {
    setIntervals(intervals.filter(i => i.id !== id));
  };

  const updateInterval = (id: number, duration: number) => {
    setIntervals(intervals.map(i => i.id === id ? { ...i, duration } : i));
  };

  const moveInterval = (dragIndex: number, hoverIndex: number) => {
    const draggedInterval = intervals[dragIndex];
    const newIntervals = [...intervals];
    newIntervals.splice(dragIndex, 1);
    newIntervals.splice(hoverIndex, 0, draggedInterval);
    setIntervals(newIntervals);
  };

  // Action management
  const addAction = (type: "prep" | "post") => {
    if (newActionName.trim()) {
      setActions([...actions, { id: Date.now(), name: newActionName, type }]);
      setNewActionName("");
      setShowAddAction(null);
    }
  };

  const removeAction = (id: number) => {
    setActions(actions.filter(a => a.id !== id));
  };

  const buildConfig = () => {
    const effectiveName =
      (programName && programName.trim()) ||
      `Program ${duration[0]}m ${heatLevel[0]}°C`;
    return {
      programName: effectiveName,
      duration: duration[0],
      heatLevel: heatLevel[0],
      humidity: humidity[0],
      intervals,
      soundscape,
      lighting: { r: lightingR[0], g: lightingG[0], b: lightingB[0] },
      actions
    };
  };

  // Handle save
  const handleSave = () => {
    onSave(buildConfig());
  };

  const handleStartNow = () => {
    if (onStartNow) {
      onStartNow(buildConfig());
    }
  };

  const handleScheduleLater = () => {
    if (onScheduleLater) {
      onScheduleLater(buildConfig());
    }
  };

  return (
    <div className="space-y-6 max-h-[70vh] overflow-y-auto px-1">
      {/* Duration */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <label className="text-[#3E2723]">Duration</label>
          <span className="text-[#5C4033]">{duration[0]} min</span>
        </div>
        <Slider
          value={duration}
          onValueChange={setDuration}
          min={5}
          max={60}
          step={5}
          className="w-full"
        />
        <div className="flex justify-between text-xs text-[#5C4033]/70 mt-2">
          <span>5 min</span>
          <span>60 min</span>
        </div>
      </div>

      {/* Heat Level */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <label className="text-[#3E2723]">Heat Level</label>
          <span className="text-[#5C4033]">{heatLevel[0]}°C</span>
        </div>
        <Slider
          value={heatLevel}
          onValueChange={setHeatLevel}
          min={60}
          max={100}
          step={5}
          className="w-full"
        />
        <div className="flex justify-between text-xs text-[#5C4033]/70 mt-2">
          <span>60°C</span>
          <span>100°C</span>
        </div>
      </div>

      {/* Humidity */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <label className="text-[#3E2723]">Humidity</label>
          <span className="text-[#5C4033]">{humidity[0]}%</span>
        </div>
        <Slider
          value={humidity}
          onValueChange={setHumidity}
          min={10}
          max={80}
          step={5}
          className="w-full"
        />
        <div className="flex justify-between text-xs text-[#5C4033]/70 mt-2">
          <span>10%</span>
          <span>80%</span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="space-y-3 pt-4">
        {(onStartNow || onScheduleLater) && (
          <div className="grid grid-cols-2 gap-2">
            {onStartNow && (
              <Button
                variant="outline"
                className="w-full border-[#8B7355] text-[#5C4033] h-12"
                onClick={handleStartNow}
              >
                Start Now
              </Button>
            )}
            {onScheduleLater && (
              <Button
                variant="outline"
                className="w-full border-[#8B7355] text-[#5C4033] h-12"
                onClick={handleScheduleLater}
              >
                Schedule for Later
              </Button>
            )}
          </div>
        )}
        <Button 
          className="w-full bg-gradient-to-r from-[#8B7355] to-[#6D5A47] hover:from-[#6D5A47] hover:to-[#5C4033] text-white h-12"
          onClick={handleSave}
        >
          Save Program
        </Button>
        
        <button
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="w-full border-2 border-[#8B7355] text-[#5C4033] hover:bg-white/40 h-12 rounded-md flex items-center justify-center gap-2 transition-colors"
        >
          <span>Advanced Program</span>
          {showAdvanced ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>

        {/* Advanced Options Dropdown */}
        {showAdvanced && (
          <div className="space-y-6 pt-4 border-t-2 border-[#8B7355]/20">
            
            {/* Intervals */}
            <div>
              <h3 className="text-[#3E2723] mb-3">Session Intervals</h3>
              {intervals.length === 0 ? (
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => addInterval("sauna")}
                    className="flex-1 border-dashed border-2 border-[#8B7355]/40 text-[#5C4033] hover:bg-white/40"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Sauna
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => addInterval("break")}
                    className="flex-1 border-dashed border-2 border-[#8B7355]/40 text-[#5C4033] hover:bg-white/40"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Break
                  </Button>
                </div>
              ) : (
                <div>
                  <DndProvider backend={HTML5Backend}>
                    <div className="space-y-2">
                      {intervals.map((interval, index) => (
                        <DraggableInterval
                          key={interval.id}
                          interval={interval}
                          index={index}
                          moveInterval={moveInterval}
                          updateInterval={updateInterval}
                          removeInterval={removeInterval}
                          intervals={intervals}
                          setIntervals={setIntervals}
                          dropIndicator={dropIndicator}
                          setDropIndicator={setDropIndicator}
                        />
                      ))}
                    </div>
                  </DndProvider>
                  <div className="flex gap-2 pt-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => addInterval("sauna")}
                      className="flex-1 border-dashed border border-[#8B7355]/40 text-[#5C4033] hover:bg-white/40 h-8"
                    >
                      <Plus className="w-3 h-3 mr-1" />
                      Sauna
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => addInterval("break")}
                      className="flex-1 border-dashed border border-[#8B7355]/40 text-[#5C4033] hover:bg-white/40 h-8"
                    >
                      <Plus className="w-3 h-3 mr-1" />
                      Break
                    </Button>
                  </div>
                </div>
              )}
            </div>

            {/* Soundscape */}
            <div>
              <h3 className="text-[#3E2723] mb-3">Soundscape</h3>
              {!soundscape ? (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setSoundscape(soundscapeOptions[0])}
                  className="w-full border-dashed border-2 border-[#8B7355]/40 text-[#5C4033] hover:bg-white/40"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Soundscape
                </Button>
              ) : (
                <div className="space-y-2">
                  <select
                    value={soundscape}
                    onChange={(e) => setSoundscape(e.target.value)}
                    className="w-full px-4 py-3 bg-white/60 border border-[#8B7355]/30 rounded-xl text-[#3E2723] focus:outline-none focus:ring-2 focus:ring-[#8B7355]"
                  >
                    {soundscapeOptions.map(option => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                  
                  {/* Preview button for soundscapes */}
                  {soundscape && soundscape !== "Silent" && soundscapeAudioMap[soundscape] && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        if (audioRef.current) {
                          stopAudio();
                        } else {
                          playAudio(soundscapeAudioMap[soundscape]);
                          setTimeout(() => {
                            if (!isSessionRunning) {
                              stopAudio();
                            }
                          }, 10000);
                        }
                      }}
                      className="w-full text-[#5C4033] hover:bg-white/40 h-8 border-[#8B7355]/30"
                    >
                      {audioRef.current && !isSessionRunning ? (
                        <>
                          <VolumeX className="w-3 h-3 mr-2" />
                          Stop Preview
                        </>
                      ) : (
                        <>
                          <Volume2 className="w-3 h-3 mr-2" />
                          Preview Sound
                        </>
                      )}
                    </Button>
                  )}
                  
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setSoundscape("")}
                    className="w-full text-[#5C4033] hover:bg-white/40 h-8"
                  >
                    Remove Soundscape
                  </Button>
                </div>
              )}
            </div>

            {/* Lighting */}
            <div>
              <h3 className="text-[#3E2723] mb-3">Lighting</h3>
              
              {!showColorPicker ? (
                <div 
                  onClick={() => setShowColorPicker(true)}
                  className="flex items-center gap-3 bg-white/60 border border-[#8B7355]/30 rounded-xl p-3 cursor-pointer hover:bg-white/80 transition-colors"
                >
                  <div 
                    className="h-10 w-10 rounded-lg border-2 border-[#8B7355]/30 flex-shrink-0"
                    style={{ backgroundColor: `rgb(${lightingR[0]}, ${lightingG[0]}, ${lightingB[0]})` }}
                  />
                  <div className="flex-1">
                    <p className="text-[#3E2723] text-sm">Selected Color</p>
                    <p className="text-[#5C4033] text-xs font-mono">RGB({lightingR[0]}, {lightingG[0]}, {lightingB[0]})</p>
                  </div>
                  <ChevronDown className="w-4 h-4 text-[#5C4033]" />
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="relative">
                    <div
                      className="relative w-full aspect-[4/3] rounded-xl overflow-hidden cursor-crosshair border-2 border-[#8B7355]/30"
                      style={{
                        background: `
                          linear-gradient(to bottom, 
                            rgba(255,255,255,1) 0%, 
                            rgba(255,255,255,0) 50%,
                            rgba(0,0,0,1) 100%
                          ),
                          linear-gradient(to right,
                            hsl(0, 100%, 50%) 0%,
                            hsl(60, 100%, 50%) 17%,
                            hsl(120, 100%, 50%) 33%,
                            hsl(180, 100%, 50%) 50%,
                            hsl(240, 100%, 50%) 67%,
                            hsl(300, 100%, 50%) 83%,
                            hsl(360, 100%, 50%) 100%
                          )
                        `
                      }}
                      onMouseDown={(e) => {
                        setIsMouseDown(true);
                        const rect = e.currentTarget.getBoundingClientRect();
                        const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
                        const y = Math.max(0, Math.min(e.clientY - rect.top, rect.height));
                        const hue = (x / rect.width) * 360;
                        const yPercent = y / rect.height;
                        
                        let lightness, saturation;
                        if (yPercent <= 0.5) {
                          lightness = 100 - (yPercent * 2) * 50;
                          saturation = (yPercent * 2) * 100;
                        } else {
                          lightness = 50 - ((yPercent - 0.5) * 2) * 50;
                          saturation = 100;
                        }
                        
                        const c = (1 - Math.abs(2 * lightness / 100 - 1)) * saturation / 100;
                        const x1 = c * (1 - Math.abs((hue / 60) % 2 - 1));
                        const m = lightness / 100 - c / 2;
                        let r = 0, g = 0, b = 0;
                        
                        if (hue >= 0 && hue < 60) { r = c; g = x1; b = 0; }
                        else if (hue >= 60 && hue < 120) { r = x1; g = c; b = 0; }
                        else if (hue >= 120 && hue < 180) { r = 0; g = c; b = x1; }
                        else if (hue >= 180 && hue < 240) { r = 0; g = x1; b = c; }
                        else if (hue >= 240 && hue < 300) { r = x1; g = 0; b = c; }
                        else { r = c; g = 0; b = x1; }
                        
                        setLightingR([Math.round((r + m) * 255)]);
                        setLightingG([Math.round((g + m) * 255)]);
                        setLightingB([Math.round((b + m) * 255)]);
                      }}
                      onMouseMove={(e) => {
                        if (isMouseDown) {
                          const rect = e.currentTarget.getBoundingClientRect();
                          const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
                          const y = Math.max(0, Math.min(e.clientY - rect.top, rect.height));
                          const hue = (x / rect.width) * 360;
                          const yPercent = y / rect.height;
                          
                          let lightness, saturation;
                          if (yPercent <= 0.5) {
                            lightness = 100 - (yPercent * 2) * 50;
                            saturation = (yPercent * 2) * 100;
                          } else {
                            lightness = 50 - ((yPercent - 0.5) * 2) * 50;
                            saturation = 100;
                          }
                          
                          const c = (1 - Math.abs(2 * lightness / 100 - 1)) * saturation / 100;
                          const x1 = c * (1 - Math.abs((hue / 60) % 2 - 1));
                          const m = lightness / 100 - c / 2;
                          let r = 0, g = 0, b = 0;
                          
                          if (hue >= 0 && hue < 60) { r = c; g = x1; b = 0; }
                          else if (hue >= 60 && hue < 120) { r = x1; g = c; b = 0; }
                          else if (hue >= 120 && hue < 180) { r = 0; g = c; b = x1; }
                          else if (hue >= 180 && hue < 240) { r = 0; g = x1; b = c; }
                          else if (hue >= 240 && hue < 300) { r = x1; g = 0; b = c; }
                          else { r = c; g = 0; b = x1; }
                          
                          setLightingR([Math.round((r + m) * 255)]);
                          setLightingG([Math.round((g + m) * 255)]);
                          setLightingB([Math.round((b + m) * 255)]);
                        }
                      }}
                      onMouseUp={() => setIsMouseDown(false)}
                      onMouseLeave={() => setIsMouseDown(false)}
                    />
                    
                    <div className="mt-3 flex items-center gap-3">
                      <div 
                        className="h-12 flex-1 rounded-xl border-2 border-[#8B7355]/30"
                        style={{ backgroundColor: `rgb(${lightingR[0]}, ${lightingG[0]}, ${lightingB[0]})` }}
                      />
                      <div className="text-xs text-[#5C4033] font-mono">
                        RGB({lightingR[0]}, {lightingG[0]}, {lightingB[0]})
                      </div>
                    </div>
                  </div>
                  
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setShowColorPicker(false)}
                    className="w-full border border-[#8B7355]/40 text-[#5C4033] hover:bg-white/40 h-8"
                  >
                    <ChevronUp className="w-3 h-3 mr-1" />
                    Collapse
                  </Button>
                </div>
              )}
            </div>

            {/* Prep Actions */}
            <div>
              <h3 className="text-[#3E2723] mb-3">Pre-Session Actions</h3>
              {actions.filter(a => a.type === "prep").length === 0 && showAddAction !== "prep" ? (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setShowAddAction("prep")}
                  className="w-full border-dashed border-2 border-[#8B7355]/40 text-[#5C4033] hover:bg-white/40"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Pre-Session Action
                </Button>
              ) : (
                <div className="space-y-2">
                  {actions.filter(a => a.type === "prep").map(action => (
                    <div key={action.id}>
                      <div className="flex items-center gap-2 bg-white/60 p-3 rounded-lg">
                        <span className="text-sm text-[#3E2723] flex-1">{action.name}</span>
                        {action.time === undefined ? (
                          <button
                            onClick={() => {
                              setActions(actions.map(a => a.id === action.id ? { ...a, time: 5 } : a));
                            }}
                            className="text-[#8B7355] hover:text-[#6D5A47] flex items-center gap-1"
                          >
                            <Plus className="w-4 h-4" />
                            <span className="text-xs">Time</span>
                          </button>
                        ) : (
                          <div className="flex items-center gap-2">
                            <input
                              type="number"
                              value={editingActionTime === action.id ? tempActionTime : action.time}
                              onChange={(e) => setTempActionTime(e.target.value)}
                              onBlur={() => {
                                if (editingActionTime === action.id) {
                                  const newTime = parseInt(tempActionTime) || 5;
                                  setActions(actions.map(a => a.id === action.id ? { ...a, time: newTime } : a));
                                  setEditingActionTime(null);
                                }
                              }}
                              onFocus={() => {
                                setEditingActionTime(action.id);
                                setTempActionTime(String(action.time));
                              }}
                              className="w-16 px-2 py-1 bg-white/60 border border-[#8B7355]/30 rounded text-[#3E2723] text-sm focus:outline-none focus:ring-2 focus:ring-[#8B7355]"
                              min="1"
                            />
                            <span className="text-sm text-[#5C4033]">min</span>
                            <button
                              onClick={() => {
                                const { time, ...rest } = action;
                                setActions(actions.map(a => a.id === action.id ? rest as Action : a));
                              }}
                              className="text-[#5C4033]/50 hover:text-[#5C4033]"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                        )}
                        <button
                          onClick={() => removeAction(action.id)}
                          className="text-[#5C4033] hover:text-[#3E2723]"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                  {showAddAction === "prep" && (
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={newActionName}
                        onChange={(e) => setNewActionName(e.target.value)}
                        onKeyPress={(e) => e.key === "Enter" && addAction("prep")}
                        placeholder="Action name..."
                        className="flex-1 px-3 py-2 bg-white/60 border border-[#8B7355]/30 rounded-lg text-[#3E2723] text-sm focus:outline-none focus:ring-2 focus:ring-[#8B7355]"
                        autoFocus
                      />
                      <Button
                        size="sm"
                        onClick={() => addAction("prep")}
                        className="bg-[#8B7355] text-white hover:bg-[#6D5A47]"
                      >
                        Add
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => {
                          setShowAddAction(null);
                          setNewActionName("");
                        }}
                        className="text-[#5C4033]"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  )}
                  {actions.filter(a => a.type === "prep").length > 0 && showAddAction !== "prep" && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setShowAddAction("prep")}
                      className="w-full border-dashed border border-[#8B7355]/40 text-[#5C4033] hover:bg-white/40 h-8"
                    >
                      <Plus className="w-3 h-3 mr-1" />
                      Add Another
                    </Button>
                  )}
                </div>
              )}
            </div>

            {/* Post Actions */}
            <div>
              <h3 className="text-[#3E2723] mb-3">Post-Session Actions</h3>
              {actions.filter(a => a.type === "post").length === 0 && showAddAction !== "post" ? (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setShowAddAction("post")}
                  className="w-full border-dashed border-2 border-[#8B7355]/40 text-[#5C4033] hover:bg-white/40"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Post-Session Action
                </Button>
              ) : (
                <div className="space-y-2">
                  {actions.filter(a => a.type === "post").map(action => (
                    <div key={action.id}>
                      <div className="flex items-center gap-2 bg-white/60 p-3 rounded-lg">
                        <span className="text-sm text-[#3E2723] flex-1">{action.name}</span>
                        {action.time === undefined ? (
                          <button
                            onClick={() => {
                              setActions(actions.map(a => a.id === action.id ? { ...a, time: 5 } : a));
                            }}
                            className="text-[#8B7355] hover:text-[#6D5A47] flex items-center gap-1"
                          >
                            <Plus className="w-4 h-4" />
                            <span className="text-xs">Time</span>
                          </button>
                        ) : (
                          <div className="flex items-center gap-2">
                            <input
                              type="number"
                              value={editingActionTime === action.id ? tempActionTime : action.time}
                              onChange={(e) => setTempActionTime(e.target.value)}
                              onBlur={() => {
                                if (editingActionTime === action.id) {
                                  const newTime = parseInt(tempActionTime) || 5;
                                  setActions(actions.map(a => a.id === action.id ? { ...a, time: newTime } : a));
                                  setEditingActionTime(null);
                                }
                              }}
                              onFocus={() => {
                                setEditingActionTime(action.id);
                                setTempActionTime(String(action.time));
                              }}
                              className="w-16 px-2 py-1 bg-white/60 border border-[#8B7355]/30 rounded text-[#3E2723] text-sm focus:outline-none focus:ring-2 focus:ring-[#8B7355]"
                              min="1"
                            />
                            <span className="text-sm text-[#5C4033]">min</span>
                            <button
                              onClick={() => {
                                const { time, ...rest } = action;
                                setActions(actions.map(a => a.id === action.id ? rest as Action : a));
                              }}
                              className="text-[#5C4033]/50 hover:text-[#5C4033]"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                        )}
                        <button
                          onClick={() => removeAction(action.id)}
                          className="text-[#5C4033] hover:text-[#3E2723]"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                  {showAddAction === "post" && (
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={newActionName}
                        onChange={(e) => setNewActionName(e.target.value)}
                        onKeyPress={(e) => e.key === "Enter" && addAction("post")}
                        placeholder="Action name..."
                        className="flex-1 px-3 py-2 bg-white/60 border border-[#8B7355]/30 rounded-lg text-[#3E2723] text-sm focus:outline-none focus:ring-2 focus:ring-[#8B7355]"
                        autoFocus
                      />
                      <Button
                        size="sm"
                        onClick={() => addAction("post")}
                        className="bg-[#8B7355] text-white hover:bg-[#6D5A47]"
                      >
                        Add
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => {
                          setShowAddAction(null);
                          setNewActionName("");
                        }}
                        className="text-[#5C4033]"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  )}
                  {actions.filter(a => a.type === "post").length > 0 && showAddAction !== "post" && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setShowAddAction("post")}
                      className="w-full border-dashed border border-[#8B7355]/40 text-[#5C4033] hover:bg-white/40 h-8"
                    >
                      <Plus className="w-3 h-3 mr-1" />
                      Add Another
                    </Button>
                  )}
                </div>
              )}
            </div>

          </div>
        )}

        {showAdvanced && (
          <div>
            <label className="block text-[#3E2723] mb-3">Program Name (optional)</label>
            <input
              type="text"
              value={programName}
              onChange={(e) => setProgramName(e.target.value)}
              placeholder="Enter program name..."
              className="w-full px-4 py-3 bg-white/60 border border-[#8B7355]/30 rounded-xl text-[#3E2723] placeholder:text-[#5C4033]/50 focus:outline-none focus:ring-2 focus:ring-[#8B7355]"
            />
          </div>
        )}

        <Button 
          variant="ghost"
          className="w-full text-[#5C4033] hover:bg-white/40"
          onClick={onCancel}
        >
          Cancel
        </Button>
      </div>
    </div>
  );
}
