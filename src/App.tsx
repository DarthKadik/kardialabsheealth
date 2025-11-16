import { useState } from "react";
import { Home, Users, Activity, Brain, MapPin } from "lucide-react";
import { Dashboard } from "./components/Dashboard";
import { Community } from "./components/Community";
import { DataTracking } from "./components/DataTracking";
import { SaunaAlgorithms } from "./components/SaunaAlgorithms";
import { FindSaunas } from "./components/FindSaunas";
import { SessionBar } from "./components/SessionBar";
import { useSessionState } from "./hooks/useSessionState";

export default function App() {
  const [activeTab, setActiveTab] = useState("home");
  const sessionState = useSessionState();

  const renderContent = () => {
    switch (activeTab) {
      case "home":
        return <Dashboard sessionState={sessionState} />;
      case "community":
        return <Community sessionState={sessionState} />;
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
    <div className="h-screen flex flex-col bg-[#FFEBCD] max-w-md mx-auto" style={{ scrollbarWidth: 'none' }}>
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
        />
      )}

      {/* App Content */}
      <div
        className={`flex-1 overflow-y-auto ${
          sessionState.isSessionRunning && activeTab !== "home" ? "pt-[73px]" : ""
        }`}

        style={{ scrollbarWidth: 'none' }}
      > 
        {renderContent()}
      </div>

      {/* Bottom Navigation */}
      <nav className="w-full max-w-md mx-auto bg-gradient-to-r from-[#3E2723] to-[#5C4033] border-t border-[#8B7355]/40 px-4 py-2 safe-area-bottom">
        <div className="flex items-center justify-around">
          <button
            onClick={() => setActiveTab("home")}
            className={`flex flex-col items-center gap-1 px-4 py-2 rounded-lg transition-colors ${
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
            className={`flex flex-col items-center gap-1 px-4 py-2 rounded-lg transition-colors ${
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
            className={`flex flex-col items-center gap-1 px-4 py-2 rounded-lg transition-colors ${
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
            className={`flex flex-col items-center gap-1 px-4 py-2 rounded-lg transition-colors ${
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
            className={`flex flex-col items-center gap-1 px-4 py-2 rounded-lg transition-colors ${
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
    </div>
  );
}