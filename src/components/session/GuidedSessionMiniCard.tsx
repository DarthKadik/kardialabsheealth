import { Button } from "../ui/button";
import type { GuidedSessionConfig } from "../../data/guidedSessions";

interface GuidedSessionMiniCardProps {
  session: GuidedSessionConfig;
  onSelect: () => void;
}

export function GuidedSessionMiniCard({ session, onSelect }: GuidedSessionMiniCardProps) {
  return (
    <div className="min-w-[360px] max-w-[400px] h-full">
      <div className="h-full bg-white/70 border border-[#8B7355]/30 rounded-2xl overflow-hidden flex flex-col">
        <div
          className="h-32 bg-cover bg-center"
          style={{ backgroundImage: `url('${session.coverImage}')` }}
        />
        <div className="p-4 flex-1 flex flex-col">
          <h4 className="text-[#3E2723] text-lg">{session.title}</h4>
          <p className="text-[#5C4033]/80 text-sm mb-2">{session.subtitle}</p>
          <div className="text-[#5C4033]/70 text-xs mb-4">
            {session.duration} min • {session.temp}°C
          </div>
          <div className="mt-auto">
            <Button
              className="w-full bg-gradient-to-r from-[#8B7355] to-[#6D5A47] hover:from-[#6D5A47] hover:to-[#5C4033] text-white"
              onClick={onSelect}
            >
              View details
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}


