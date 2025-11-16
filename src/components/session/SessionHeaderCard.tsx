import { Button } from "../ui/button";
import { Slider } from "../ui/slider";
import { Volume2, VolumeX } from "lucide-react";

interface AudioControls {
  isMuted: boolean;
  volume: number;
  toggleMute: () => void;
  setVolume: (v: number) => void;
}

interface SessionHeaderCardProps {
  // State
  isSessionRunning: boolean;
  isSessionScheduled: boolean;
  elapsedTime: number;
  scheduledStartTime: string;
  timeUntilStart: number;
  currentProgram: {
    id: number;
    name: string;
    soundscape?: string;
    intervals: Array<{ id: number; type: "sauna" | "break"; duration: number; temperature?: string }>;
  } | null;
  currentIntervalIndex: number;
  heatLevel: number[];
  duration: number[];
  humidity: number[];

  // Interval helpers
  getCurrentInterval: () => { id: number; type: "sauna" | "break"; duration: number; temperature?: string } | null;
  getTotalProgramDuration: (p: any) => number;
  getIntervalElapsedTime: () => number;
  formatCountdown: (s: number) => string;
  formatElapsedTime: (s: number) => string;

  // Warming UX
  currentTemp: number;
  tempDelta: number;
  isWarming: boolean;
  isReadyToStart: boolean;
  progressPct: number;
  etaSeconds: number;

  // Actions
  onStartSession: () => void;
  onStopSession: () => void;
  onStartProgramNow: (program: any) => void;
  onStopProgram: () => void;
  onCancelSchedule: () => void;
  onOpenConfig: () => void;
  onOpenScheduleProgram: () => void;

  // Pickers
  setActivePicker: (picker: "temp" | "time" | "humidity" | null) => void;

  // Audio
  audio?: AudioControls;
}

export function SessionHeaderCard(props: SessionHeaderCardProps) {
  const {
    isSessionRunning,
    isSessionScheduled,
    elapsedTime,
    scheduledStartTime,
    timeUntilStart,
    currentProgram,
    currentIntervalIndex,
    heatLevel,
    duration,
    humidity,
    getCurrentInterval,
    getTotalProgramDuration,
    getIntervalElapsedTime,
    formatCountdown,
    formatElapsedTime,
    currentTemp,
    isWarming,
    isReadyToStart,
    progressPct,
    etaSeconds,
    onStartSession,
    onStopSession,
    onStartProgramNow,
    onStopProgram,
    onCancelSchedule,
    onOpenConfig,
    onOpenScheduleProgram,
    setActivePicker,
    audio,
  } = props;

  return (
    <div className="bg-[#8B7355]/40 backdrop-blur-md border border-white/20 rounded-2xl p-5 shadow-xl max-w-[280px]">
      {isSessionRunning ? (
        <>
          {currentProgram ? (
            <>
              <div className="flex items-start justify-between mb-3 gap-3">
                <div className="flex-1">
                  <p className="text-[#FFEBCD] text-sm">{currentProgram.name}</p>
                  <p className="text-white text-3xl mt-1">{formatElapsedTime(elapsedTime)}</p>
                </div>
                {(isWarming || isReadyToStart) && (
                  <div className="w-28 text-right">
                    <p className="text-white/70 text-xs">{isWarming ? "Warming Up" : "Ready to start"}</p>
                    <p className="text-white text-sm">{Math.floor(currentTemp)}°C</p>
                    <div className="mt-1 bg-white/20 rounded-full h-1 overflow-hidden">
                      <div className="bg-white h-full transition-all duration-1000" style={{ width: `${progressPct}%` }} />
                    </div>
                    {props.tempDelta > 0 && (
                      <p className="text-white/70 text-xs mt-1">Ready in {formatCountdown(etaSeconds)}</p>
                    )}
                  </div>
                )}
              </div>
              {getCurrentInterval() && (
                <>
                  <div className="bg-white/10 rounded-lg p-2 mb-3">
                    <p className="text-white/70 text-xs mb-1">Current Interval</p>
                    <p className="text-white text-sm">
                      {getCurrentInterval()?.type === "sauna" ? "🔥 Sauna" : "❄️ Break"} • {getCurrentInterval()?.duration} min
                    </p>
                    {getCurrentInterval()?.temperature && (
                      <p className="text-white/60 text-xs mt-1 capitalize">{getCurrentInterval()?.temperature}</p>
                    )}
                    <div className="mt-2 bg-white/20 rounded-full h-1 overflow-hidden">
                      <div
                        className="bg-white h-full transition-all duration-1000"
                        style={{
                          width: `${Math.min(
                            100,
                            (getIntervalElapsedTime() / ((getCurrentInterval()?.duration || 1) * 60)) * 100,
                          )}%`,
                        }}
                      />
                    </div>
                  </div>
                  <p className="text-white/60 text-xs mb-4">
                    Interval {currentIntervalIndex + 1} of {currentProgram.intervals.length}
                  </p>
                </>
              )}

              {currentProgram.soundscape && currentProgram.soundscape !== "Silent" && audio && (
                <div className="bg-white/10 rounded-lg p-3 mb-3">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-white/70 text-xs">🎵 {currentProgram.soundscape}</p>
                    <button onClick={audio.toggleMute} className="text-white/80 hover:text-white transition-colors">
                      {audio.isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                    </button>
                  </div>
                  <Slider
                    value={[audio.volume]}
                    onValueChange={(v: number[]) => audio.setVolume(v[0])}
                    max={1}
                    step={0.1}
                    className="w-full"
                    disabled={audio.isMuted}
                  />
                </div>
              )}

              <Button
                size="sm"
                onClick={onStopProgram}
                className="w-full bg-red-600/80 hover:bg-red-700/80 text-white border border-white/40 backdrop-blur-sm"
              >
                End Program
              </Button>
            </>
          ) : (
            <>
              <div className="flex items-start justify-between mb-3 gap-3">
                <div className="flex-1">
                  <p className="text-[#FFEBCD] text-sm">Session In Progress</p>
                  <p className="text-white text-3xl mt-1">{formatElapsedTime(elapsedTime)}</p>
                </div>
                {(isWarming || isReadyToStart) && (
                  <div className="w-28 text-right">
                    <p className="text-white/70 text-xs text-[rgba(252,77,8,0.7)]">
                      {isWarming ? "Warming Up" : "Ready to start"}
                    </p>
                    <p className="text-white text-sm">{Math.floor(currentTemp)}°C</p>
                    <div className="mt-1 bg-white/20 rounded-full h-1 overflow-hidden">
                      <div className="bg-white h-full transition-all duration-1000" style={{ width: `${progressPct}%` }} />
                    </div>
                    {props.tempDelta > 0 && (
                      <p className="text-white/70 text-xs mt-1">Ready in {formatCountdown(etaSeconds)}</p>
                    )}
                  </div>
                )}
              </div>
              <div className="flex items-center justify-center gap-3 text-sm mb-4">
                <div>
                  <span className="text-white/70 text-xs">Temp</span>
                  <p className="text-white">{heatLevel[0]}°C</p>
                </div>
                <div className="w-px h-8 bg-white/20" />
                <div>
                  <span className="text-white/70 text-xs">Time</span>
                  <p className="text-white">{duration[0]} min</p>
                </div>
                <div className="w-px h-8 bg-white/20" />
                <div>
                  <span className="text-white/70 text-xs">Humid</span>
                  <p className="text-white">{humidity[0]}%</p>
                </div>
              </div>
              <Button
                size="sm"
                onClick={onStopSession}
                className="w-full bg-red-600/80 hover:bg-red-700/80 text-white border border-white/40 backdrop-blur-sm"
              >
                End Session
              </Button>
            </>
          )}
        </>
      ) : isSessionScheduled ? (
        <>
          {currentProgram ? (
            <>
              <p className="text-[#FFEBCD] text-sm mb-1">{currentProgram.name} Scheduled</p>
              <div className="mb-3">
                <p className="text-white text-3xl">{scheduledStartTime}</p>
                <p className="text-white/70 text-sm mt-1">Starts in {formatCountdown(timeUntilStart)}</p>
              </div>
              <div className="bg-white/10 rounded-lg p-2 mb-4">
                <p className="text-white/70 text-xs mb-1">Program Details</p>
                <p className="text-white text-sm">
                  {currentProgram.intervals.length} intervals • {getTotalProgramDuration(currentProgram)} min total
                </p>
              </div>
              <div className="space-y-2">
                <Button
                  size="sm"
                  onClick={() => currentProgram && onStartProgramNow(currentProgram)}
                  className="w-full bg-white/20 hover:bg-white/30 text-white border border-white/40 backdrop-blur-sm"
                >
                  Start Now
                </Button>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    onClick={onOpenScheduleProgram}
                    variant="ghost"
                    className="flex-1 text-white/80 hover:text-white hover:bg-white/10 text-xs"
                  >
                    Reschedule
                  </Button>
                  <Button
                    size="sm"
                    onClick={onCancelSchedule}
                    variant="ghost"
                    className="flex-1 text-white/80 hover:text-white hover:bg-white/10 text-xs"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <>
              <p className="text-[#FFEBCD] text-sm mb-1">Session Scheduled</p>
              <div className="mb-3">
                <p className="text-white text-3xl">{scheduledStartTime}</p>
                <p className="text-white/70 text-sm mt-1">Starts in {formatCountdown(timeUntilStart)}</p>
              </div>
              <div className="flex items-center justify-center gap-3 text-sm mb-4">
                <div>
                  <span className="text-white/70 text-xs">Temp</span>
                  <p className="text-white">{heatLevel[0]}°C</p>
                </div>
                <div className="w-px h-8 bg-white/20" />
                <div>
                  <span className="text-white/70 text-xs">Time</span>
                  <p className="text-white">{duration[0]} min</p>
                </div>
                <div className="w-px h-8 bg-white/20" />
                <div>
                  <span className="text-white/70 text-xs">Humid</span>
                  <p className="text-white">{humidity[0]}%</p>
                </div>
              </div>
              <div className="space-y-2">
                <Button
                  size="sm"
                  onClick={onStartSession}
                  className="w-full bg-white/20 hover:bg-white/30 text-white border border-white/40 backdrop-blur-sm"
                >
                  Start Now
                </Button>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    onClick={onOpenConfig}
                    variant="ghost"
                    className="flex-1 text-white/80 hover:text-white hover:bg-white/10 text-xs"
                  >
                    Reschedule
                  </Button>
                  <Button
                    size="sm"
                    onClick={onCancelSchedule}
                    variant="ghost"
                    className="flex-1 text-white/80 hover:text-white hover:bg-white/10 text-xs"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </>
          )}
        </>
      ) : (
        <>
          <div className="flex items-center justify-between mb-1">
            <p className="text-[#FFEBCD] text-sm">No Session Configured</p>
            <Button
              size="sm"
              onClick={onStartSession}
              className="bg-white/20 hover:bg-white/30 text-white border border-white/40 h-7 px-3 text-sm"
            >
              Start
            </Button>
          </div>
          <p className="text-white text-3xl mb-3">--:--</p>
          <div className="flex items-center gap-3 text-sm mb-4">
            <button onClick={() => setActivePicker("temp")} className="flex-1 hover:bg-white/10 rounded-lg p-2 transition-colors">
              <span className="text-white/70 text-xs block">Temp</span>
              <p className="text-white">{heatLevel[0]}°C</p>
            </button>
            <div className="w-px h-8 bg-white/20" />
            <button onClick={() => setActivePicker("time")} className="flex-1 hover:bg-white/10 rounded-lg p-2 transition-colors">
              <span className="text-white/70 text-xs block">Time</span>
              <p className="text-white">{duration[0]} min</p>
            </button>
            <div className="w-px h-8 bg-white/20" />
            <button onClick={() => setActivePicker("humidity")} className="flex-1 hover:bg-white/10 rounded-lg p-2 transition-colors">
              <span className="text-white/70 text-xs block">Humid</span>
              <p className="text-white">{humidity[0]}%</p>
            </button>
          </div>
          <Button
            size="sm"
            onClick={onOpenConfig}
            className="w-full bg-white/20 hover:bg-white/30 text-white border border-white/40 backdrop-blur-sm"
          >
            Configure Session
          </Button>
        </>
      )}
    </div>
  );
}


