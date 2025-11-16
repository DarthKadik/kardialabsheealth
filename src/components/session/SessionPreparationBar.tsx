import { Button } from "../ui/button";
import { Clock, Flame, Thermometer, XCircle } from "lucide-react";
import { GuidedSessionConfig } from "../../data/guidedSessions";

interface SessionPreparationBarProps {
  session: GuidedSessionConfig;
  currentTemp: number;
  isWarming: boolean;
  isReadyToStart: boolean;
  warmupProgressPct: number;
  etaSeconds: number;
  onPrepare: () => void;
  onCancel: () => void;
  isRunning?: boolean;
  onStopRunning?: () => void;
}

export function SessionPreparationBar({
  session,
  currentTemp,
  isWarming,
  isReadyToStart,
  warmupProgressPct,
  etaSeconds,
  onPrepare,
  onCancel,
  isRunning,
  onStopRunning,
}: SessionPreparationBarProps) {
  const formatEta = (s: number) => {
    const m = Math.floor(s / 60);
    const r = s % 60;
    if (m <= 0) return `${r}s`;
    return `${m}m ${r}s`;
  };

  return (
    <div className="sticky top-0 z-40">
      <div className="bg-gradient-to-r from-[#8B7355] to-[#5C4033] text-white">
        <div className="px-6 py-3 flex items-center gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <Flame className="w-4 h-4" />
              <span className="truncate">
                Prepare sauna for: <strong>{session.title}</strong>
              </span>
            </div>
            <div className="mt-1 flex items-center gap-3 text-white/80 text-xs">
              <div className="flex items-center gap-1">
                <Thermometer className="w-3.5 h-3.5" />
                <span>
                  {currentTemp}°C → {session.temp}°C
                </span>
              </div>
              <div className="w-px h-3 bg-white/30" />
              <div className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                <span>
                  {isWarming
                    ? `Warming • ${formatEta(etaSeconds)} ETA`
                    : isReadyToStart
                    ? "Almost ready"
                    : "Set target & prepare"}
                </span>
              </div>
            </div>
            <div className="mt-2 h-1.5 w-full bg-white/20 rounded-full overflow-hidden">
              <div
                className="h-full bg-[#FFEBCD]"
                style={{ width: `${warmupProgressPct}%` }}
              />
            </div>
          </div>
          <div className="flex items-center gap-2">
            {isRunning ? (
              <>
                <Button
                  onClick={onStopRunning}
                  className="bg-white text-[#5C4033] hover:bg-[#FFEBCD] h-9 px-4"
                >
                  Stop Current
                </Button>
                <Button
                  variant="outline"
                  onClick={onCancel}
                  className="border-white/50 text-white hover:bg-white/10 h-9 px-3"
                >
                  <XCircle className="w-4 h-4" />
                </Button>
              </>
            ) : (
              <>
                <Button
                  onClick={onPrepare}
                  className="bg-white text-[#5C4033] hover:bg-[#FFEBCD] h-9 px-4"
                >
                  Start Warmup
                </Button>
                <Button
                  variant="outline"
                  onClick={onCancel}
                  className="border-white/50 text-white hover:bg-white/10 h-9 px-3"
                >
                  <XCircle className="w-4 h-4" />
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}


