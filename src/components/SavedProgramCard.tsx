import { Button } from "./ui/button";

interface Interval {
  id: number;
  type: "sauna" | "break";
  duration: number;
  temperature?: "mellow" | "warm" | "hot" | "intense";
}

interface Action {
  id: number;
  name: string;
  type: "prep" | "post";
  time?: number;
}

interface SavedProgram {
  id: number;
  name: string;
  intervals: Interval[];
  soundscape: string;
  lighting: { r: number; g: number; b: number };
  actions: Action[];
}

interface SavedProgramCardProps {
  program: SavedProgram;
  onClick: () => void;
  onStartNow: () => void;
  onSchedule: () => void;
}

export function SavedProgramCard({ program, onClick, onStartNow, onSchedule }: SavedProgramCardProps) {
  const totalDuration = program.intervals.reduce((sum, interval) => sum + interval.duration, 0);
  const saunaIntervals = program.intervals.filter(i => i.type === "sauna").length;
  
  return (
    <div 
      className="relative overflow-hidden rounded-2xl shadow-lg group cursor-pointer"
      onClick={onClick}
    >
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1678742753298-9e6b10fcc42f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzYXVuYSUyMHdvb2QlMjB0ZXh0dXJlfGVufDF8fHx8MTc2MzE1MzcwN3ww&ixlib=rb-4.1.0&q=80&w=1080')" }}
      />
      <div 
        className="absolute inset-0 bg-gradient-to-br from-[#8B7355]/90 to-[#5C4033]/90"
        style={{
          background: `linear-gradient(135deg, rgba(${program.lighting.r}, ${program.lighting.g}, ${program.lighting.b}, 0.85) 0%, rgba(92, 64, 51, 0.9) 100%)`
        }}
      />
      
      {/* Content */}
      <div className="relative p-4">
        <h4 className="text-white mb-2">{program.name}</h4>
        <p className="text-white/80 text-sm mb-4 leading-relaxed">
          {saunaIntervals} sauna {saunaIntervals === 1 ? 'round' : 'rounds'} • {totalDuration} min total
          {program.soundscape && ` • ${program.soundscape}`}
        </p>
        
        <div className="space-y-2">
          <Button 
            size="sm" 
            className="w-full bg-white/90 hover:bg-white text-[#5C4033] border border-white/40"
            onClick={(e) => {
              e.stopPropagation();
              onStartNow();
            }}
          >
            Start Now
          </Button>
          
          <div className="flex gap-2">
            <Button 
              size="sm" 
              variant="ghost"
              className="flex-1 bg-white/20 hover:bg-white/30 text-white border border-white/40"
              onClick={(e) => {
                e.stopPropagation();
                onSchedule();
              }}
            >
              Schedule
            </Button>
            <Button 
              size="sm" 
              variant="ghost"
              className="flex-1 bg-white/20 hover:bg-white/30 text-white border border-white/40"
              onClick={(e) => {
                e.stopPropagation();
                onClick();
              }}
            >
              View Details
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
