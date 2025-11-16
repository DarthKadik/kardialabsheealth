import { GuidedSessionConfig, Step } from "../data/guidedSessions";
import type { SavedProgram, Interval } from "../hooks/useSessionState";

function parseMinutes(duration?: string): number {
  if (!duration) return 0;
  const match = duration.match(/([\d.]+)\s*min/i);
  if (!match) return 0;
  const minutes = parseFloat(match[1]);
  return Number.isFinite(minutes) ? minutes : 0;
}

function stepToInterval(step: Step): Interval | null {
  const minutes = parseMinutes(step.duration);
  if (step.type === "interval" || step.type === "steam") {
    if (minutes <= 0) return null;
    return {
      id: step.id,
      type: "sauna",
      duration: Math.round(minutes),
      temperature: undefined,
    };
  }
  if (step.type === "cooldown" || step.type === "hydration" || step.type === "prep") {
    const breakMinutes = minutes > 0 ? minutes : step.type === "hydration" ? 2 : 0;
    if (breakMinutes <= 0) return null;
    return {
      id: step.id,
      type: "break",
      duration: Math.round(breakMinutes),
    };
  }
  return null;
}

export function guidedConfigToProgram(config: GuidedSessionConfig): SavedProgram {
  const intervals: Interval[] = config.steps
    .map(stepToInterval)
    .filter((i): i is Interval => !!i);

  const program: SavedProgram = {
    id: Date.now(), // ephemeral; not persisted by default
    name: config.title,
    intervals,
    soundscape: "",
    lighting: { r: 255, g: 200, b: 150 },
    actions: [],
  };
  return program;
}

export function getTotalActiveMinutes(config: GuidedSessionConfig): number {
  return config.steps.reduce((sum, s) => sum + parseMinutes(s.duration), 0);
}


