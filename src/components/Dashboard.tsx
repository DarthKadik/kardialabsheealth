import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Slider } from "./ui/slider";
import Carousel from './ui/carousel'

import {
  ChevronDown,
  ChevronUp,
  Plus,
  X,
  Volume2,
} from "lucide-react";
import { SavedProgramCard } from "./SavedProgramCard";
import { ProgramDetailView } from "./ProgramDetailView";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { DraggableInterval } from "./DraggableInterval";
import type {
  SavedProgram,
  Interval,
  Action,
} from "../hooks/useSessionState";
import { GuidedSession } from "./GuidedSession";
import { GuidedSessionConfig } from "../data/guidedSessions";
import { WheelPicker } from "./WheelPicker";
import { useProfile } from "../context/ProfileContext";
import { useSoundscapeAudio } from "../hooks/useSoundscapeAudio";
import { SessionHeaderCard } from "./session/SessionHeaderCard";
import { TimeWheel } from "./session/TimeWheel";
import { SessionBar } from "./SessionBar";

interface DashboardProps {
  onNavigate: (tab: string) => void;
  sessionState: ReturnType<
    typeof import("../hooks/useSessionState").useSessionState
  >;
}

export function Dashboard({
  sessionState,
}: Omit<DashboardProps, 'onNavigate'>) {
  const { profile } = useProfile();
  const displayName = profile.name && profile.name.trim() ? profile.name : "Anna";
  useEffect(() => {
    console.log("Onboarding profile:", profile);
  }, [profile]);
  // Destructure session state
  const {
    duration,
    setDuration,
    heatLevel,
    setHeatLevel,
    humidity,
    setHumidity,
    isSessionRunning,
    elapsedTime,
    isSessionScheduled,
    scheduledStartTime,
    timeUntilStart,
    currentProgram,
    currentIntervalIndex,
    startSession,
    stopSession,
    scheduleSession,
    cancelSchedule,
    startProgramNow,
    scheduleProgramForLater,
    stopProgram,
    getCurrentInterval,
    getTotalProgramDuration,
    getIntervalElapsedTime,
    formatCountdown,
    formatElapsedTime,
    getCurrentTime,
  } = sessionState;

  const [showConfigOverlay, setShowConfigOverlay] =
    useState(false);
  const [startTime, setStartTime] = useState(getCurrentTime());
  const [
    showScheduleProgramOverlay,
    setShowScheduleProgramOverlay,
  ] = useState(false);
  const [programScheduleTime, setProgramScheduleTime] =
    useState(getCurrentTime());
  const [activeGuidedSession, setActiveGuidedSession] =
    useState<GuidedSessionConfig | null>(null);
  const [activePicker, setActivePicker] = useState<
    "temp" | "time" | "humidity" | null
  >(null);

  // Advanced program state
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [intervals, setIntervals] = useState<Interval[]>([]);
  const [soundscape, setSoundscape] = useState("");
  const [lightingR, setLightingR] = useState([255]);
  const [lightingG, setLightingG] = useState([200]);
  const [lightingB, setLightingB] = useState([150]);
  const [actions, setActions] = useState<Action[]>([]);
  const [newActionName, setNewActionName] = useState("");
  const [showAddAction, setShowAddAction] = useState<
    "prep" | "post" | null
  >(null);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [isMouseDown, setIsMouseDown] = useState(false);
  const [editingActionTime, setEditingActionTime] = useState<
    number | null
  >(null);
  const [tempActionTime, setTempActionTime] = useState("");

  // Warm-up state and helpers are now provided by sessionState
  const {
    currentTemp,
    tempDelta,
    isWarming,
    isReadyToStart,
    etaSeconds,
    warmupProgressPct,
  } = sessionState as any;

  // Use saved programs from sessionState instead of local state
  const {
    savedPrograms,
    addProgram,
    updateProgram,
    deleteProgram: deleteProgramFromState,
  } = sessionState;
  const [viewingProgram, setViewingProgram] =
    useState<SavedProgram | null>(null);
  const [programName, setProgramName] = useState("");
  const [editingProgramId, setEditingProgramId] = useState<
    number | null
  >(null);

  // Drop indicator state for drag and drop
  const [dropIndicator, setDropIndicator] = useState<{
    index: number;
    show: boolean;
  }>({ index: -1, show: false });

  // Soundscape audio
  const audio = useSoundscapeAudio({
    isSessionRunning,
    currentProgramSoundscape: currentProgram?.soundscape || null,
  });

  // Wrapper functions for UI actions
  const handleStartSession = () => {
    startSession();
    setShowConfigOverlay(false);
  };

  const handleScheduleSession = () => {
    scheduleSession(startTime);
    setShowConfigOverlay(false);
  };

  const handleStartProgramNow = (program: SavedProgram) => {
    startProgramNow(program);
  };

  const handleScheduleProgramForLater = (
    program: SavedProgram,
  ) => {
    scheduleProgramForLater(program, programScheduleTime);
    setShowScheduleProgramOverlay(false);
  };

  const handleStopProgram = () => {
    audio.stop();
    stopProgram();
  };

  const handleStopSession = () => {
    audio.stop();
    stopSession();
  };

  // Audio lifecycle moved to useSoundscapeAudio

  const addInterval = (type: "sauna" | "break") => {
    setIntervals([
      ...intervals,
      {
        id: Date.now(),
        type,
        duration: type === "sauna" ? 15 : 5,
      },
    ]);
  };

  const removeInterval = (id: number) => {
    setIntervals(intervals.filter((i) => i.id !== id));
  };

  const updateInterval = (id: number, duration: number) => {
    setIntervals(
      intervals.map((i) =>
        i.id === id ? { ...i, duration } : i,
      ),
    );
  };

  const moveInterval = (
    dragIndex: number,
    hoverIndex: number,
  ) => {
    const draggedInterval = intervals[dragIndex];
    const newIntervals = [...intervals];
    newIntervals.splice(dragIndex, 1);
    newIntervals.splice(hoverIndex, 0, draggedInterval);
    setIntervals(newIntervals);
  };

  const addAction = (type: "prep" | "post") => {
    if (newActionName.trim()) {
      setActions([
        ...actions,
        { id: Date.now(), name: newActionName, type },
      ]);
      setNewActionName("");
      setShowAddAction(null);
    }
  };

  const removeAction = (id: number) => {
    setActions(actions.filter((a) => a.id !== id));
  };

  const saveAdvancedProgram = () => {
    if (intervals.length === 0) {
      alert(
        "Please add at least one interval to save the program",
      );
      return;
    }

    if (!programName.trim()) {
      alert("Please enter a name for your program");
      return;
    }

    if (editingProgramId !== null) {
      // Update existing program
      const program: SavedProgram = {
        id: editingProgramId,
        name: programName,
        intervals: intervals.map((i) => ({ ...i })),
        soundscape,
        lighting: {
          r: lightingR[0],
          g: lightingG[0],
          b: lightingB[0],
        },
        actions: actions.map((a) => ({ ...a })),
      };
      updateProgram(program);
      setEditingProgramId(null);
    } else {
      // Create new program
      const program: SavedProgram = {
        id: Date.now(),
        name: programName,
        intervals: intervals.map((i) => ({ ...i })),
        soundscape,
        lighting: {
          r: lightingR[0],
          g: lightingG[0],
          b: lightingB[0],
        },
        actions: actions.map((a) => ({ ...a })),
      };
      addProgram(program);
    }

    setShowConfigOverlay(false);
    setShowAdvanced(false);
    // Reset advanced settings
    setIntervals([]);
    setSoundscape("");
    setActions([]);
    setLightingR([255]);
    setLightingG([200]);
    setLightingB([150]);
    setProgramName("");
  };

  const loadProgramForEditing = (program: SavedProgram) => {
    setEditingProgramId(program.id);
    setProgramName(program.name);
    setIntervals(program.intervals.map((i) => ({ ...i })));
    setSoundscape(program.soundscape);
    setLightingR([program.lighting.r]);
    setLightingG([program.lighting.g]);
    setLightingB([program.lighting.b]);
    setActions(program.actions.map((a) => ({ ...a })));
    setShowAdvanced(true);
    setShowConfigOverlay(true);
    setViewingProgram(null);
  };

  const handleDeleteProgram = (programId: number) => {
    if (
      confirm("Are you sure you want to delete this program?")
    ) {
      deleteProgramFromState(programId);
      setViewingProgram(null);
    }
  };

  const soundscapeOptions = [
    "Forest Ambience",
    "Ocean Waves",
    "Rain & Thunder",
    "Nordic Winds",
    "Meditation Bowls",
    "Birch Forest",
    "Silent",
  ];

  // If guided session is active, show it instead
  if (activeGuidedSession) {
    return (
      <>
        {isSessionRunning && (
          <SessionBar
            elapsedTime={elapsedTime}
            duration={duration}
            heatLevel={heatLevel}
            currentProgram={currentProgram}
            onStop={handleStopProgram}
            onNavigateHome={() => {}}
            getTotalProgramDuration={getTotalProgramDuration}
            getCurrentInterval={getCurrentInterval}
            currentTemp={currentTemp}
            isWarming={isWarming}
            isReadyToStart={isReadyToStart}
            warmupProgressPct={warmupProgressPct}
            etaSeconds={etaSeconds}
          />
        )}
        <div className={isSessionRunning ? "pt-[73px]" : ""}>
          <GuidedSession
            onBack={() => setActiveGuidedSession(null)}
          />
        </div>
      </>
    );
  }

  return (
    <div className="min-h-full bg-[#FFEBCD]">
      {/* Header with Background */}
      <div className="relative px-6 pt-12 pb-8 text-white overflow-hidden min-h-[300px]">
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1759302353458-3c617bfd428b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsaWdodCUyMHNhdW5hJTIwd29vZCUyMGJlbmNofGVufDF8fHx8MTc2MzE1NTU3NXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral')",
            backgroundPosition: "right center",
          }}
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-gray-900/90 via-gray-900/50 to-gray-900/20" />

        {/* Content */}
        <div className="relative z-10">
          <div className="mb-6">
            <p className="text-white/70 text-sm">Welcome back,</p>
            <h1 className="text-white mt-1">{displayName}</h1>
          </div>
          <SessionHeaderCard
            isSessionRunning={isSessionRunning}
            isSessionScheduled={isSessionScheduled}
            elapsedTime={elapsedTime}
            scheduledStartTime={scheduledStartTime}
            timeUntilStart={timeUntilStart}
            currentProgram={currentProgram}
            currentIntervalIndex={currentIntervalIndex}
            heatLevel={heatLevel}
            duration={duration}
            humidity={humidity}
            getCurrentInterval={getCurrentInterval}
            getTotalProgramDuration={getTotalProgramDuration}
            getIntervalElapsedTime={getIntervalElapsedTime}
            formatCountdown={formatCountdown}
            formatElapsedTime={formatElapsedTime}
            currentTemp={currentTemp}
            tempDelta={tempDelta}
            isWarming={isWarming}
            isReadyToStart={isReadyToStart}
            progressPct={warmupProgressPct}
            etaSeconds={etaSeconds}
            onStartSession={handleStartSession}
            onStopSession={handleStopSession}
            onStartProgramNow={handleStartProgramNow}
            onStopProgram={handleStopProgram}
            onCancelSchedule={cancelSchedule}
            onOpenConfig={() => setShowConfigOverlay(true)}
            onOpenScheduleProgram={() => setShowScheduleProgramOverlay(true)}
            setActivePicker={setActivePicker}
            audio={{
              isMuted: audio.isMuted,
              volume: audio.volume,
              toggleMute: audio.toggleMute,
              setVolume: audio.setVolume,
            }}
          />
        </div>
      </div>

      {/* Configuration Overlay */}
      {showConfigOverlay && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-6">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setShowConfigOverlay(false)}
          />

          {/* Menu */}
          <div className="relative w-full max-w-md bg-[#FFEBCD] rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="relative px-6 pt-8 pb-6 text-white overflow-hidden">
              <div
                className="absolute inset-0 bg-cover bg-center pointer-events-none"
                style={{
                  backgroundImage:
                    "url('https://images.unsplash.com/photo-1678742753298-9e6b10fcc42f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzYXVuYSUyMHdvb2QlMjB0ZXh0dXJlfGVufDF8fHx8MTc2MzE1MzcwN3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral')",
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-br from-[#8B7355]/95 to-[#5C4033]/95 pointer-events-none" />
              <Button
                onClick={() => setShowConfigOverlay(false)}
                className="absolute top-4 right-4 bg-white/20 hover:bg-white/30 text-white border border-white/40 h-9 px-4 text-sm"
              >
                Back
              </Button>
              <div className="relative">
                <h2 className="text-white mb-1">
                  Session Configuration
                </h2>
                <p className="text-white/80 text-sm">
                  Customize your sauna experience
                </p>
              </div>
            </div>

            {/* Configuration Options */}
            <div className="p-6 space-y-6">
              {/* Start Time */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="block text-[#3E2723]">
                    Start Time
                  </label>
                </div>
                <TimeWheel value={startTime} onChange={setStartTime} />
              </div>

              {/* Duration */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="text-[#3E2723]">
                    Duration
                  </label>
                  <span className="text-[#5C4033]">
                    {duration[0]} min
                  </span>
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
                  <label className="text-[#3E2723]">
                    Heat Level
                  </label>
                  <span className="text-[#5C4033]">
                    {heatLevel[0]}°C
                  </span>
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
                  <label className="text-[#3E2723]">
                    Humidity
                  </label>
                  <span className="text-[#5C4033]">
                    {humidity[0]}%
                  </span>
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
                <div className="flex gap-2">
                  <Button
                    className="flex-1 bg-gradient-to-r from-[#8B7355] to-[#6D5A47] hover:from-[#6D5A47] hover:to-[#5C4033] text-white h-12"
                      onClick={handleStartSession}
                  >
                    Start Session
                  </Button>
                  <Button
                    className="flex-1 bg-gradient-to-r from-[#8B7355] to-[#6D5A47] hover:from-[#6D5A47] hover:to-[#5C4033] text-white h-12"
                    onClick={handleScheduleSession}
                  >
                    Schedule Session
                  </Button>
                </div>

                <button
                  onClick={() => setShowAdvanced(!showAdvanced)}
                  className="w-full border-2 border-[#8B7355] text-[#5C4033] hover:bg-white/40 h-12 rounded-md flex items-center justify-center gap-2 transition-colors"
                >
                  <span>Advanced Program</span>
                  {showAdvanced ? (
                    <ChevronUp className="w-4 h-4" />
                  ) : (
                    <ChevronDown className="w-4 h-4" />
                  )}
                </button>

                {/* Advanced Options Dropdown */}
                {showAdvanced && (
                  <div className="space-y-6 pt-4 border-t-2 border-[#8B7355]/20">
                    {/* Intervals */}
                    <div>
                      <h3 className="text-[#3E2723] mb-3">
                        Session Intervals
                      </h3>
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
                              {intervals.map(
                                (interval, index) => (
                                  <DraggableInterval
                                    key={interval.id}
                                    interval={interval}
                                    index={index}
                                    moveInterval={moveInterval}
                                    updateInterval={
                                      updateInterval
                                    }
                                    removeInterval={
                                      removeInterval
                                    }
                                    intervals={intervals}
                                    setIntervals={setIntervals}
                                    dropIndicator={
                                      dropIndicator
                                    }
                                    setDropIndicator={
                                      setDropIndicator
                                    }
                                  />
                                ),
                              )}
                            </div>
                          </DndProvider>
                          <div className="flex gap-2 pt-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() =>
                                addInterval("sauna")
                              }
                              className="flex-1 border-dashed border border-[#8B7355]/40 text-[#5C4033] hover:bg-white/40 h-8"
                            >
                              <Plus className="w-3 h-3 mr-1" />
                              Sauna
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() =>
                                addInterval("break")
                              }
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
                      <h3 className="text-[#3E2723] mb-3">
                        Soundscape
                      </h3>
                      {!soundscape ? (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() =>
                            setSoundscape(soundscapeOptions[0])
                          }
                          className="w-full border-dashed border-2 border-[#8B7355]/40 text-[#5C4033] hover:bg-white/40"
                        >
                          <Plus className="w-4 h-4 mr-2" />
                          Add Soundscape
                        </Button>
                      ) : (
                        <div className="space-y-2">
                          <select
                            value={soundscape}
                            onChange={(e) =>
                              setSoundscape(e.target.value)
                            }
                            className="w-full px-4 py-3 bg-white/60 border border-[#8B7355]/30 rounded-xl text-[#3E2723] focus:outline-none focus:ring-2 focus:ring-[#8B7355]"
                          >
                            {soundscapeOptions.map((option) => (
                              <option
                                key={option}
                                value={option}
                              >
                                {option}
                              </option>
                            ))}
                          </select>

                          {/* Preview button for soundscapes */}
                          {soundscape &&
                            soundscape !== "Silent" && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => {
                                  audio.playPreview(soundscape);
                                }}
                                className="w-full text-[#5C4033] hover:bg-white/40 h-8 border-[#8B7355]/30"
                              >
                                  <>
                                    <Volume2 className="w-3 h-3 mr-2" />
                                    Preview Sound
                                  </>
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
                      <h3 className="text-[#3E2723] mb-3">
                        Lighting
                      </h3>

                      {!showColorPicker ? (
                        <div
                          onClick={() =>
                            setShowColorPicker(true)
                          }
                          className="flex items-center gap-3 bg-white/60 border border-[#8B7355]/30 rounded-xl p-3 cursor-pointer hover:bg-white/80 transition-colors"
                        >
                          <div
                            className="h-10 w-10 rounded-lg border-2 border-[#8B7355]/30 flex-shrink-0"
                            style={{
                              backgroundColor: `rgb(${lightingR[0]}, ${lightingG[0]}, ${lightingB[0]})`,
                            }}
                          />
                          <div className="flex-1">
                            <p className="text-[#3E2723] text-sm">
                              Selected Color
                            </p>
                            <p className="text-[#5C4033] text-xs font-mono">
                              RGB({lightingR[0]}, {lightingG[0]}
                              , {lightingB[0]})
                            </p>
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
                                `,
                              }}
                              onMouseDown={(e) => {
                                setIsMouseDown(true);
                                const rect =
                                  e.currentTarget.getBoundingClientRect();
                                const x = Math.max(
                                  0,
                                  Math.min(
                                    e.clientX - rect.left,
                                    rect.width,
                                  ),
                                );
                                const y = Math.max(
                                  0,
                                  Math.min(
                                    e.clientY - rect.top,
                                    rect.height,
                                  ),
                                );
                                const hue =
                                  (x / rect.width) * 360;
                                const yPercent =
                                  y / rect.height;

                                let lightness, saturation;
                                if (yPercent <= 0.5) {
                                  // Top half: white to full saturation
                                  lightness =
                                    100 - yPercent * 2 * 50;
                                  saturation =
                                    yPercent * 2 * 100;
                                } else {
                                  // Bottom half: full saturation to black
                                  lightness =
                                    50 -
                                    (yPercent - 0.5) * 2 * 50;
                                  saturation = 100;
                                }

                                // Convert HSL to RGB
                                const c =
                                  ((1 -
                                    Math.abs(
                                      (2 * lightness) / 100 - 1,
                                    )) *
                                    saturation) /
                                  100;
                                const x1 =
                                  c *
                                  (1 -
                                    Math.abs(
                                      ((hue / 60) % 2) - 1,
                                    ));
                                const m =
                                  lightness / 100 - c / 2;
                                let r = 0,
                                  g = 0,
                                  b = 0;

                                if (hue >= 0 && hue < 60) {
                                  r = c;
                                  g = x1;
                                  b = 0;
                                } else if (
                                  hue >= 60 &&
                                  hue < 120
                                ) {
                                  r = x1;
                                  g = c;
                                  b = 0;
                                } else if (
                                  hue >= 120 &&
                                  hue < 180
                                ) {
                                  r = 0;
                                  g = c;
                                  b = x1;
                                } else if (
                                  hue >= 180 &&
                                  hue < 240
                                ) {
                                  r = 0;
                                  g = x1;
                                  b = c;
                                } else if (
                                  hue >= 240 &&
                                  hue < 300
                                ) {
                                  r = x1;
                                  g = 0;
                                  b = c;
                                } else {
                                  r = c;
                                  g = 0;
                                  b = x1;
                                }

                                setLightingR([
                                  Math.round((r + m) * 255),
                                ]);
                                setLightingG([
                                  Math.round((g + m) * 255),
                                ]);
                                setLightingB([
                                  Math.round((b + m) * 255),
                                ]);
                              }}
                              onMouseMove={(e) => {
                                if (isMouseDown) {
                                  const rect =
                                    e.currentTarget.getBoundingClientRect();
                                  const x = Math.max(
                                    0,
                                    Math.min(
                                      e.clientX - rect.left,
                                      rect.width,
                                    ),
                                  );
                                  const y = Math.max(
                                    0,
                                    Math.min(
                                      e.clientY - rect.top,
                                      rect.height,
                                    ),
                                  );
                                  const hue =
                                    (x / rect.width) * 360;
                                  const yPercent =
                                    y / rect.height;

                                  let lightness, saturation;
                                  if (yPercent <= 0.5) {
                                    lightness =
                                      100 - yPercent * 2 * 50;
                                    saturation =
                                      yPercent * 2 * 100;
                                  } else {
                                    lightness =
                                      50 -
                                      (yPercent - 0.5) * 2 * 50;
                                    saturation = 100;
                                  }

                                  const c =
                                    ((1 -
                                      Math.abs(
                                        (2 * lightness) / 100 -
                                          1,
                                      )) *
                                      saturation) /
                                    100;
                                  const x1 =
                                    c *
                                    (1 -
                                      Math.abs(
                                        ((hue / 60) % 2) - 1,
                                      ));
                                  const m =
                                    lightness / 100 - c / 2;
                                  let r = 0,
                                    g = 0,
                                    b = 0;

                                  if (hue >= 0 && hue < 60) {
                                    r = c;
                                    g = x1;
                                    b = 0;
                                  } else if (
                                    hue >= 60 &&
                                    hue < 120
                                  ) {
                                    r = x1;
                                    g = c;
                                    b = 0;
                                  } else if (
                                    hue >= 120 &&
                                    hue < 180
                                  ) {
                                    r = 0;
                                    g = c;
                                    b = x1;
                                  } else if (
                                    hue >= 180 &&
                                    hue < 240
                                  ) {
                                    r = 0;
                                    g = x1;
                                    b = c;
                                  } else if (
                                    hue >= 240 &&
                                    hue < 300
                                  ) {
                                    r = x1;
                                    g = 0;
                                    b = c;
                                  } else {
                                    r = c;
                                    g = 0;
                                    b = x1;
                                  }

                                  setLightingR([
                                    Math.round((r + m) * 255),
                                  ]);
                                  setLightingG([
                                    Math.round((g + m) * 255),
                                  ]);
                                  setLightingB([
                                    Math.round((b + m) * 255),
                                  ]);
                                }
                              }}
                              onMouseUp={() =>
                                setIsMouseDown(false)
                              }
                              onMouseLeave={() =>
                                setIsMouseDown(false)
                              }
                            />

                            <div className="mt-3 flex items-center gap-3">
                              <div
                                className="h-12 flex-1 rounded-xl border-2 border-[#8B7355]/30"
                                style={{
                                  backgroundColor: `rgb(${lightingR[0]}, ${lightingG[0]}, ${lightingB[0]})`,
                                }}
                              />
                              <div className="text-xs text-[#5C4033] font-mono">
                                RGB({lightingR[0]},{" "}
                                {lightingG[0]}, {lightingB[0]})
                              </div>
                            </div>
                          </div>

                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() =>
                              setShowColorPicker(false)
                            }
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
                      <h3 className="text-[#3E2723] mb-3">
                        Pre-Session Actions
                      </h3>
                      {actions.filter((a) => a.type === "prep")
                        .length === 0 &&
                      showAddAction !== "prep" ? (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() =>
                            setShowAddAction("prep")
                          }
                          className="w-full border-dashed border-2 border-[#8B7355]/40 text-[#5C4033] hover:bg-white/40"
                        >
                          <Plus className="w-4 h-4 mr-2" />
                          Add Pre-Session Action
                        </Button>
                      ) : (
                        <div className="space-y-2">
                          {actions
                            .filter((a) => a.type === "prep")
                            .map((action) => (
                              <div key={action.id}>
                                <div className="flex items-center gap-2 bg-white/60 p-3 rounded-lg">
                                  <span className="text-sm text-[#3E2723] flex-1">
                                    {action.name}
                                  </span>
                                  {action.time === undefined ? (
                                    <button
                                      onClick={() => {
                                        setActions(
                                          actions.map((a) =>
                                            a.id === action.id
                                              ? {
                                                  ...a,
                                                  time: 5,
                                                }
                                              : a,
                                          ),
                                        );
                                      }}
                                      className="text-[#8B7355] hover:text-[#6D5A47] flex items-center gap-1"
                                    >
                                      <Plus className="w-4 h-4" />
                                      <span className="text-xs">
                                        Time
                                      </span>
                                    </button>
                                  ) : (
                                    <div className="flex items-center gap-2">
                                      <input
                                        type="number"
                                        value={
                                          editingActionTime ===
                                          action.id
                                            ? tempActionTime
                                            : action.time
                                        }
                                        onChange={(e) =>
                                          setTempActionTime(
                                            e.target.value,
                                          )
                                        }
                                        onBlur={() => {
                                          if (
                                            editingActionTime ===
                                            action.id
                                          ) {
                                            const newTime =
                                              parseInt(
                                                tempActionTime,
                                              ) || 5;
                                            setActions(
                                              actions.map(
                                                (a) =>
                                                  a.id ===
                                                  action.id
                                                    ? {
                                                        ...a,
                                                        time: newTime,
                                                      }
                                                    : a,
                                              ),
                                            );
                                            setEditingActionTime(
                                              null,
                                            );
                                          }
                                        }}
                                        onFocus={() => {
                                          setEditingActionTime(
                                            action.id,
                                          );
                                          setTempActionTime(
                                            String(action.time),
                                          );
                                        }}
                                        className="w-16 px-2 py-1 bg-white/60 border border-[#8B7355]/30 rounded text-[#3E2723] text-sm focus:outline-none focus:ring-2 focus:ring-[#8B7355]"
                                        min="1"
                                      />
                                      <span className="text-sm text-[#5C4033]">
                                        min
                                      </span>
                                      <button
                                        onClick={() => {
                                          const {
                                            time,
                                            ...rest
                                          } = action;
                                          setActions(
                                            actions.map((a) =>
                                              a.id === action.id
                                                ? (rest as Action)
                                                : a,
                                            ),
                                          );
                                        }}
                                        className="text-[#5C4033]/50 hover:text-[#5C4033]"
                                      >
                                        <X className="w-3 h-3" />
                                      </button>
                                    </div>
                                  )}
                                  <button
                                    onClick={() =>
                                      removeAction(action.id)
                                    }
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
                                onChange={(e) =>
                                  setNewActionName(
                                    e.target.value,
                                  )
                                }
                                placeholder="e.g., Shower, Hydrate..."
                                className="flex-1 px-3 py-2 bg-white/60 border border-[#8B7355]/30 rounded-lg text-[#3E2723] text-sm focus:outline-none focus:ring-2 focus:ring-[#8B7355]"
                                onKeyDown={(e) =>
                                  e.key === "Enter" &&
                                  addAction("prep")
                                }
                              />
                              <Button
                                size="sm"
                                onClick={() =>
                                  addAction("prep")
                                }
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
                          {showAddAction !== "prep" &&
                            actions.filter(
                              (a) => a.type === "prep",
                            ).length > 0 && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() =>
                                  setShowAddAction("prep")
                                }
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
                      <h3 className="text-[#3E2723] mb-3">
                        Post-Session Actions
                      </h3>
                      {actions.filter((a) => a.type === "post")
                        .length === 0 &&
                      showAddAction !== "post" ? (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() =>
                            setShowAddAction("post")
                          }
                          className="w-full border-dashed border-2 border-[#8B7355]/40 text-[#5C4033] hover:bg-white/40"
                        >
                          <Plus className="w-4 h-4 mr-2" />
                          Add Post-Session Action
                        </Button>
                      ) : (
                        <div className="space-y-2">
                          {actions
                            .filter((a) => a.type === "post")
                            .map((action) => (
                              <div key={action.id}>
                                <div className="flex items-center gap-2 bg-white/60 p-3 rounded-lg">
                                  <span className="text-sm text-[#3E2723] flex-1">
                                    {action.name}
                                  </span>
                                  {action.time === undefined ? (
                                    <button
                                      onClick={() => {
                                        setActions(
                                          actions.map((a) =>
                                            a.id === action.id
                                              ? {
                                                  ...a,
                                                  time: 5,
                                                }
                                              : a,
                                          ),
                                        );
                                      }}
                                      className="text-[#8B7355] hover:text-[#6D5A47] flex items-center gap-1"
                                    >
                                      <Plus className="w-4 h-4" />
                                      <span className="text-xs">
                                        Time
                                      </span>
                                    </button>
                                  ) : (
                                    <div className="flex items-center gap-2">
                                      <input
                                        type="number"
                                        value={
                                          editingActionTime ===
                                          action.id
                                            ? tempActionTime
                                            : action.time
                                        }
                                        onChange={(e) =>
                                          setTempActionTime(
                                            e.target.value,
                                          )
                                        }
                                        onBlur={() => {
                                          if (
                                            editingActionTime ===
                                            action.id
                                          ) {
                                            const newTime =
                                              parseInt(
                                                tempActionTime,
                                              ) || 5;
                                            setActions(
                                              actions.map(
                                                (a) =>
                                                  a.id ===
                                                  action.id
                                                    ? {
                                                        ...a,
                                                        time: newTime,
                                                      }
                                                    : a,
                                              ),
                                            );
                                            setEditingActionTime(
                                              null,
                                            );
                                          }
                                        }}
                                        onFocus={() => {
                                          setEditingActionTime(
                                            action.id,
                                          );
                                          setTempActionTime(
                                            String(action.time),
                                          );
                                        }}
                                        className="w-16 px-2 py-1 bg-white/60 border border-[#8B7355]/30 rounded text-[#3E2723] text-sm focus:outline-none focus:ring-2 focus:ring-[#8B7355]"
                                        min="1"
                                      />
                                      <span className="text-sm text-[#5C4033]">
                                        min
                                      </span>
                                      <button
                                        onClick={() => {
                                          const {
                                            time,
                                            ...rest
                                          } = action;
                                          setActions(
                                            actions.map((a) =>
                                              a.id === action.id
                                                ? (rest as Action)
                                                : a,
                                            ),
                                          );
                                        }}
                                        className="text-[#5C4033]/50 hover:text-[#5C4033]"
                                      >
                                        <X className="w-3 h-3" />
                                      </button>
                                    </div>
                                  )}
                                  <button
                                    onClick={() =>
                                      removeAction(action.id)
                                    }
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
                                onChange={(e) =>
                                  setNewActionName(
                                    e.target.value,
                                  )
                                }
                                placeholder="e.g., Cold plunge, Yoga..."
                                className="flex-1 px-3 py-2 bg-white/60 border border-[#8B7355]/30 rounded-lg text-[#3E2723] text-sm focus:outline-none focus:ring-2 focus:ring-[#8B7355]"
                                onKeyDown={(e) =>
                                  e.key === "Enter" &&
                                  addAction("post")
                                }
                              />
                              <Button
                                size="sm"
                                onClick={() =>
                                  addAction("post")
                                }
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
                          {showAddAction !== "post" &&
                            actions.filter(
                              (a) => a.type === "post",
                            ).length > 0 && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() =>
                                  setShowAddAction("post")
                                }
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
                  <>
                    <div>
                      <label className="block text-[#3E2723] mb-3">
                        Program Name
                      </label>
                      <input
                        type="text"
                        value={programName}
                        onChange={(e) =>
                          setProgramName(e.target.value)
                        }
                        placeholder="Enter program name..."
                        className="w-full px-4 py-3 bg-white/60 border border-[#8B7355]/30 rounded-xl text-[#3E2723] placeholder:text-[#5C4033]/50 focus:outline-none focus:ring-2 focus:ring-[#8B7355]"
                      />
                    </div>
                    <Button
                      className="w-full bg-gradient-to-r from-[#8B7355] to-[#6D5A47] hover:from-[#6D5A47] hover:to-[#5C4033] text-white h-12"
                      onClick={saveAdvancedProgram}
                    >
                      {editingProgramId
                        ? "Update Program"
                        : "Save Advanced Program"}
                    </Button>
                  </>
                )}

                <Button
                  variant="ghost"
                  className="w-full text-[#5C4033] hover:bg-white/40"
                  onClick={() => setShowConfigOverlay(false)}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Schedule Program Overlay */}
      {showScheduleProgramOverlay && currentProgram && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-6">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setShowScheduleProgramOverlay(false)}
          />

          {/* Menu */}
          <div className="relative w-full max-w-md bg-[#FFEBCD] rounded-3xl shadow-2xl overflow-hidden">
            {/* Header */}
            <div className="relative px-6 pt-8 pb-6 text-white overflow-hidden">
              <div
                className="absolute inset-0 bg-cover bg-center"
                style={{
                  backgroundImage:
                    "url('https://images.unsplash.com/photo-1678742753298-9e6b10fcc42f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzYXVuYSUyMHdvb2QlMjB0ZXh0dXJlfGVufDF8fHx8MTc2MzE1MzcwN3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral')",
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-br from-[#8B7355]/95 to-[#5C4033]/95" />
              <button
                onClick={() =>
                  setShowScheduleProgramOverlay(false)
                }
                className="absolute top-4 left-4 text-white/80 hover:text-white flex items-center gap-2 transition-colors"
              >
                <ChevronDown className="w-6 h-6 rotate-90" />
                <span className="text-sm">Back</span>
              </button>
              <div className="relative">
                <h2 className="text-white mb-1">
                  Schedule Program
                </h2>
                <p className="text-white/80 text-sm">
                  {currentProgram.name}
                </p>
              </div>
            </div>

            {/* Configuration Options */}
            <div className="p-6 space-y-6">
              {/* Program Summary */}
              <div className="bg-white/60 border border-[#8B7355]/30 rounded-xl p-4">
                <p className="text-[#3E2723] text-sm mb-2">
                  Program Details
                </p>
                <p className="text-[#5C4033]">
                  {currentProgram.intervals.length} intervals •{" "}
                  {getTotalProgramDuration(currentProgram)} min
                  total
                </p>
                {currentProgram.soundscape && (
                  <p className="text-[#5C4033] text-sm mt-1">
                    🎵 {currentProgram.soundscape}
                  </p>
                )}
              </div>

              {/* Start Time */}
              <div>
                <label className="block text-[#3E2723] mb-3">
                  Start Time
                </label>
                <TimeWheel value={programScheduleTime} onChange={setProgramScheduleTime} />
              </div>

              {/* Action Buttons */}
              <div className="space-y-3 pt-4">
                <Button
                  className="w-full bg-gradient-to-r from-[#8B7355] to-[#6D5A47] hover:from-[#6D5A47] hover:to-[#5C4033] text-white h-12"
                  onClick={() =>
                    currentProgram &&
                    handleScheduleProgramForLater(
                      currentProgram,
                    )
                  }
                >
                  Schedule Program
                </Button>

                <Button
                  variant="ghost"
                  className="w-full text-[#5C4033] hover:bg-white/40"
                  onClick={() =>
                    setShowScheduleProgramOverlay(false)
                  }
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Stats Grid */}
      <div className="px-6 ">
        <div className="grid grid-cols-3 gap-4 mt-4 mb-6">
          <div className="relative overflow-hidden rounded-2xl shadow-lg h-20">
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{
                backgroundImage:
                  "url('https://images.unsplash.com/photo-1678742753298-9e6b10fcc42f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzYXVuYSUyMHdvb2QlMjB0ZXh0dXJlfGVufDF8fHx8MTc2MzE1MzcwN3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral')",
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-br from-[#8B7355]/90 to-[#5C4033]/90" />
            <div className="relative pt-1.5 pb-5 px-3 h-full flex flex-col justify-start gap-1">
              <span className="text-[#FFEBCD] text-xs">
                This Month
              </span>
              <div className="-mt-0.5">
                <p className="text-white text-2xl">24</p>
                <p className="text-white/80 text-xs">
                  Sessions
                </p>
              </div>
            </div>
          </div>

          <div className="relative overflow-hidden rounded-2xl shadow-lg h-20">
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{
                backgroundImage:
                  "url('https://images.unsplash.com/photo-1678742753298-9e6b10fcc42f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzYXVuYSUyMHdvb2QlMjB0ZXh0dXJlfGVufDF8fHx8MTc2MzE1MzcwN3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral')",
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-br from-[#6D5A47]/90 to-[#3E2723]/90" />
            <div className="relative pt-1.5 pb-5 px-3 h-full flex flex-col justify-start gap-1">
              <span className="text-[#FFEBCD] text-xs">
                Total Time
              </span>
              <div className="-mt-0.5">
                <p className="text-white text-2xl">3.2h</p>
                <p className="text-white/80 text-xs">
                  This Week
                </p>
              </div>
            </div>
          </div>

          <div className="relative overflow-hidden rounded-2xl shadow-lg h-20">
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{
                backgroundImage:
                  "url('https://images.unsplash.com/photo-1741601272577-fc2c46f87d9f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzYXVuYSUyMHN0b25lcyUyMHN0ZWFtfGVufDF8fHx8MTc2MzIwMDU1MXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral')",
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-br from-orange-600/80 to-red-700/80" />
            <div className="relative pt-1.5 pb-5 px-3 h-full flex flex-col justify-start gap-1">
              <span className="text-white/90 text-xs">
                Temperature
              </span>
              <div className="-mt-0.5">
                <p className="text-white text-2xl">82°C</p>
                <p className="text-white/80 text-xs">
                  Weekly Average
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mb-6">
          <div className="space-y-3">

          </div>
        </div>

        {/* Saved Programs */}
        {savedPrograms.length > 0 && (
          <div className="mb-6">
            <h3 className="text-[#3E2723] mb-3">
              My Custom Programs
            </h3>
            <div className="space-y-4">
              {savedPrograms.map((program) => (
                <SavedProgramCard
                  key={program.id}
                  program={program}
                  onClick={() => setViewingProgram(program)}
                  onStartNow={() =>
                    handleStartProgramNow(program)
                  }
                  onSchedule={() => {
                    sessionState.loadProgram(program);
                    setShowScheduleProgramOverlay(true);
                  }}
                />
              ))}
            </div>
          </div>
        )}

        {/* Recommendations Carousel */}
        <div>
          <h3 className="text-[#3E2723]">
            Recommended Sessions
          </h3>
          <div className="relative -mx-6">
            <style>{`
              .slick-slider {
                overflow: hidden;
              }
              .slick-list {
                overflow: visible;
              }
              .slick-track {
                display: flex !important;
                align-items: stretch;
                gap: 20px;
              }
              .slick-slide {
                height: auto;
                float: none !important;
              }
              .slick-slide > div {
                height: 100%;
              }
              .slick-dots {
                bottom: -30px;
              }
              .slick-dots li button:before {
                content: '•';
                font-size: 12px;
                color: #8B7355;
                opacity: 0.3;
              }
              .slick-dots li.slick-active button:before {
                color: #8B7355;
                opacity: 1;
              }
              .slick-prev, .slick-next {
                display: none !important;
              }
            `}</style>
            <Carousel
              baseWidth={380}
              autoplay={true}
              autoplayDelay={10000}
              pauseOnHover={true}
              loop={true}
              round={false}
              onStartGuidedSession={(session) => setActiveGuidedSession(session)}
            >
              
            </Carousel>
          </div>
        </div>
      </div>

      {/* Program Detail View */}
      {viewingProgram && (
        <ProgramDetailView
          program={viewingProgram}
          onClose={() => setViewingProgram(null)}
          onEdit={() => loadProgramForEditing(viewingProgram)}
          onDelete={() =>
            handleDeleteProgram(viewingProgram.id)
          }
        />
      )}

      {/* Wheel Pickers */}
      {activePicker === "temp" && (
        <WheelPicker
          label="Temperature"
          value={heatLevel[0]}
          min={60}
          max={100}
          step={5}
          unit="°C"
          onValueChange={(value) => setHeatLevel([value])}
          onClose={() => setActivePicker(null)}
        />
      )}
      {activePicker === "time" && (
        <WheelPicker
          label="Duration"
          value={duration[0]}
          min={5}
          max={60}
          step={5}
          unit=" min"
          onValueChange={(value) => setDuration([value])}
          onClose={() => setActivePicker(null)}
        />
      )}
      {activePicker === "humidity" && (
        <WheelPicker
          label="Humidity"
          value={humidity[0]}
          min={10}
          max={80}
          step={5}
          unit="%"
          onValueChange={(value) => setHumidity([value])}
          onClose={() => setActivePicker(null)}
        />
      )}
    </div>
  );
}