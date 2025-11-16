import { useEffect, useRef, useState } from "react";
import { Home, Users, Activity, Brain, MapPin } from "lucide-react";
import { Dashboard } from "./components/Dashboard";
import { Community } from "./components/Community";
import { DataTracking } from "./components/DataTracking";
import { SaunaAlgorithms } from "./components/SaunaAlgorithms";
import { FindSaunas } from "./components/FindSaunas";
import { SessionBar } from "./components/SessionBar";
import { useSessionState } from "./hooks/useSessionState";
import { SessionFeedback } from "./components/SessionFeedback";
import { SessionShareCard } from "./components/SessionShareCard";

export default function App() {
  const [activeTab, setActiveTab] = useState("home");
  const sessionState = useSessionState();
  const [showFeedback, setShowFeedback] = useState(false);
  const [showShareCard, setShowShareCard] = useState(false);
  const [shareStats, setShareStats] = useState<{
    durationMin: number;
    avgTemp: number;
    programName: string | null;
    intervalsCompleted: number;
    startedAt: number;
    endedAt: number;
  } | null>(null);
  const [shareFeedback, setShareFeedback] = useState<{ relaxing: number; enjoyable: number } | null>(null);
  const wasRunningRef = useRef(false);
  const lastRunningSnapshotRef = useRef<{
    sessionStartTime: number | null;
    durationMin: number;
    avgTemp: number;
    currentProgramName: string | null;
    intervalsCompleted: number;
  }>({
    sessionStartTime: null,
    durationMin: 0,
    avgTemp: 0,
    currentProgramName: null,
    intervalsCompleted: 0,
  });

  // Show feedback when a running session stops (includes auto-stop on completion)
  useEffect(() => {
    const wasRunning = wasRunningRef.current;
    const isRunning = sessionState.isSessionRunning;
    if (wasRunning && !isRunning) {
      // Build share stats from last running snapshot
      const snap = lastRunningSnapshotRef.current;
      const endedAt = Date.now();
      setShareStats({
        durationMin: snap.durationMin,
        avgTemp: Math.round(snap.avgTemp),
        programName: snap.currentProgramName,
        intervalsCompleted: snap.intervalsCompleted,
        startedAt: snap.sessionStartTime ?? endedAt,
        endedAt,
      });
      setShowFeedback(true);
    }
    wasRunningRef.current = isRunning;
  }, [sessionState.isSessionRunning]);

  // While session is running, keep a snapshot of relevant details for sharing
  useEffect(() => {
    if (sessionState.isSessionRunning) {
      const isProgram = !!sessionState.currentProgram;
      const durationFromProgram = isProgram && sessionState.currentProgram
        ? sessionState.getTotalProgramDuration(sessionState.currentProgram)
        : undefined;
      const durationMin = durationFromProgram ?? (sessionState.duration?.[0] ?? 0);
      lastRunningSnapshotRef.current = {
        sessionStartTime: sessionState.sessionStartTime,
        durationMin,
        avgTemp: sessionState.heatLevel?.[0] ?? 0,
        currentProgramName: sessionState.currentProgram?.name ?? null,
        intervalsCompleted: sessionState.currentIntervalIndex ?? 0,
      };
    }
  }, [
    sessionState.isSessionRunning,
    sessionState.sessionStartTime,
    sessionState.elapsedTime,
    sessionState.currentProgram,
    sessionState.currentIntervalIndex,
    sessionState.heatLevel,
    sessionState.duration,
  ]);

  const renderContent = () => {
    switch (activeTab) {
      case "home":
        return <Dashboard sessionState={sessionState} />;
      case "community":
        return <Community sessionState={sessionState} onNavigate={(tab) => setActiveTab(tab)} />;
      case "tracking":
        return <DataTracking />;
      case "algorithms":
        return <SaunaAlgorithms />;
      case "find":
        return <FindSaunas />;
      default:
        return <Dashboard sessionState={sessionState} />;
    }
  };

  return (
    <div className="h-screen flex flex-col bg-[#FFEBCD] max-w-md mx-auto">
      {/* Session Bar - Show when session is running and not on home page */}
      {sessionState.isSessionRunning && activeTab !== "home" && (
        <SessionBar
          elapsedTime={sessionState.elapsedTime}
          duration={sessionState.duration}
          heatLevel={sessionState.heatLevel}
          currentProgram={sessionState.currentProgram}
          onStop={sessionState.stopProgram}
          onNavigateHome={() => setActiveTab("home")}
          getTotalProgramDuration={sessionState.getTotalProgramDuration}
          getCurrentInterval={sessionState.getCurrentInterval}
          currentTemp={sessionState.currentTemp}
          isWarming={sessionState.isWarming}
          isReadyToStart={sessionState.isReadyToStart}
          warmupProgressPct={sessionState.warmupProgressPct}
          etaSeconds={sessionState.etaSeconds}
        />
      )}

      {/* App Content */}
      <div
        className={`flex-1 overflow-y-auto   ${
          sessionState.isSessionRunning && activeTab !== "home" ? "pt-[73px]" : ""
        }`}
        data-app-scroll-container

        style={{ scrollbarWidth: 'none' }}
      >
        {renderContent()}
      </div>

      {/* Bottom Navigation */}
      <nav className="w-full max-w-md mx-auto bg-gradient-to-r from-[#3E2723] to-[#5C4033] border-t border-[#8B7355]/40 px-4 py-2 safe-area-bottom">
        <div className="flex items-center justify-around">
          <button
            onClick={() => setActiveTab("home")}
            className={`flex-1 flex flex-col items-center gap-1 py-2 rounded-lg transition-colors ${
              activeTab === "home"
                ? "text-[#FFEBCD]"
                : "text-white/60 hover:text-white/80"
            }`}
          >
            <Home className="w-5 h-5" />
            <span className="text-xs">Home</span>
          </button>

          <button
            onClick={() => setActiveTab("community")}
            className={`flex-1 flex flex-col items-center gap-1 py-2 rounded-lg transition-colors ${
              activeTab === "community"
                ? "text-[#FFEBCD]"
                : "text-white/60 hover:text-white/80"
            }`}
          >
            <Users className="w-5 h-5" />
            <span className="text-xs">Community</span>
          </button>

          <button
            onClick={() => setActiveTab("tracking")}
            className={`flex-1 flex flex-col items-center gap-1 py-2 rounded-lg transition-colors ${
              activeTab === "tracking"
                ? "text-[#FFEBCD]"
                : "text-white/60 hover:text-white/80"
            }`}
          >
            <Activity className="w-5 h-5" />
            <span className="text-xs">Stats</span>
          </button>

          <button
            onClick={() => setActiveTab("algorithms")}
            className={`flex-1 flex flex-col items-center gap-1 py-2 rounded-lg transition-colors ${
              activeTab === "algorithms"
                ? "text-[#FFEBCD]"
                : "text-white/60 hover:text-white/80"
            }`}
          >
            <Brain className="w-5 h-5" />
            <span className="text-xs">Smart</span>
          </button>

          <button
            onClick={() => setActiveTab("find")}
            className={`flex-1 flex flex-col items-center gap-1 py-2 rounded-lg transition-colors ${
              activeTab === "find"
                ? "text-[#FFEBCD]"
                : "text-white/60 hover:text-white/80"
            }`}
          >
            <MapPin className="w-5 h-5" />
            <span className="text-xs">Find</span>
          </button>
        </div>
      </nav>

      {/* Session Feedback Modal */}
      {showFeedback && (
        <SessionFeedback
          onClose={() => setShowFeedback(false)}
          onSubmit={(data) => {
            // Persist feedback if needed, then show share card
            setShareFeedback({ relaxing: data.relaxingLevel, enjoyable: data.enjoyableLevel });
            setShowFeedback(false);
            setShowShareCard(true);
          }}
        />
      )}

      {/* Session Share Card Modal */}
      {showShareCard && shareStats && shareFeedback && (
        <SessionShareCard
          stats={shareStats}
          feedback={shareFeedback}
          onClose={() => setShowShareCard(false)}
        />
      )}
    </div>
  );
}