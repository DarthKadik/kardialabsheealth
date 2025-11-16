import { X, Play } from "lucide-react";
import { Button } from "./ui/button";

interface Interval {
  id: number;
  type: "sauna" | "break";
  duration: number;
  temperature?: "mellow" | "warm" | "hot" | "intense";
}

interface SavedProgram {
  id: number;
  name: string;
  intervals: Interval[];
  soundscape: string;
  lighting: { r: number; g: number; b: number };
  actions: any[];
}

interface SessionBarProps {
  elapsedTime: number;
  duration: number[];
  heatLevel: number[];
  currentProgram: SavedProgram | null;
  currentIntervalIndex: number;
  intervalStartTime: number | null;
  onStop: () => void;
  onNavigateHome: () => void;
  getTotalProgramDuration: (program: SavedProgram) => number;
  getIntervalElapsedTime: () => number;
  getCurrentInterval: () => Interval | null;
}

export function SessionBar({
  elapsedTime,
  duration,
  heatLevel,
  currentProgram,
  onStop,
  onNavigateHome,
  getTotalProgramDuration,
  getCurrentInterval,
}: Omit<SessionBarProps, 'currentIntervalIndex' | 'intervalStartTime' | 'getIntervalElapsedTime'>) {
  const formatElapsedTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const getTemperatureDisplay = (temp?: "mellow" | "warm" | "hot" | "intense") => {
    switch (temp) {
      case "mellow":
        return "60-70°C";
      case "warm":
        return "70-80°C";
      case "hot":
        return "80-90°C";
      case "intense":
        return "90+°C";
      default:
        return "";
    }
  };

  const currentInterval = getCurrentInterval();
  const totalDuration = currentProgram
    ? getTotalProgramDuration(currentProgram)
    : duration[0];
  const progress = currentProgram
    ? (elapsedTime / (totalDuration * 60)) * 100
    : (elapsedTime / (duration[0] * 60)) * 100;

  return (
    <div className="fixed top-0 left-0 right-0 z-50 max-w-md mx-auto">
      <div className="bg-gradient-to-r from-[#3E2723] to-[#5C4033] shadow-lg border-b border-[#8B7355]/40">
        {/* Progress bar */}
        <div className="h-1 bg-[#2C1810]">
          <div
            className="h-full bg-gradient-to-r from-[#FF6B35] to-[#FF8C42] transition-all duration-1000"
            style={{ width: `${Math.min(progress, 100)}%` }}
          />
        </div>

        {/* Content */}
        <div className="px-4 py-3">
          <div className="flex items-center justify-between">
            {/* Left: Session info */}
            <button
              onClick={onNavigateHome}
              className="flex items-center gap-3 flex-1 min-w-0 hover:opacity-80 transition-opacity"
            >
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-[#FF6B35]/20 flex-shrink-0">
                <Play className="w-5 h-5 text-[#FF6B35] fill-[#FF6B35]" />
              </div>
              <div className="flex-1 min-w-0 text-left">
                <div className="text-white text-sm truncate">
                  {currentProgram ? currentProgram.name : "Sauna Session"}
                </div>
                <div className="text-white/60 text-xs flex items-center gap-2">
                  <span>{formatElapsedTime(elapsedTime)}</span>
                  {currentInterval && (
                    <>
                      <span className="text-white/40">•</span>
                      <span className="capitalize">{currentInterval.type}</span>
                      {currentInterval.temperature && (
                        <>
                          <span className="text-white/40">•</span>
                          <span>{getTemperatureDisplay(currentInterval.temperature)}</span>
                        </>
                      )}
                    </>
                  )}
                  {!currentProgram && (
                    <>
                      <span className="text-white/40">•</span>
                      <span>{heatLevel[0]}°C</span>
                    </>
                  )}
                </div>
              </div>
            </button>

            {/* Right: Stop button */}
            <Button
              onClick={onStop}
              variant="ghost"
              size="sm"
              className="text-white/60 hover:text-white hover:bg-white/10 flex-shrink-0 ml-2"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
