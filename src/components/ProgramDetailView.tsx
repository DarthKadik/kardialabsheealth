import { Button } from "./ui/button";
import { X, Edit2, ChevronLeft } from "lucide-react";

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

interface ProgramDetailViewProps {
  program: SavedProgram;
  onClose: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export function ProgramDetailView({ program, onClose, onEdit, onDelete }: ProgramDetailViewProps) {
  const totalDuration = program.intervals.reduce((sum, interval) => sum + interval.duration, 0);
  const prepActions = program.actions.filter(a => a.type === "prep");
  const postActions = program.actions.filter(a => a.type === "post");

  const getTempColor = (temp?: string) => {
    switch (temp) {
      case "mellow": return "bg-blue-100 text-blue-700 border-blue-300";
      case "warm": return "bg-yellow-100 text-yellow-700 border-yellow-300";
      case "hot": return "bg-orange-100 text-orange-700 border-orange-300";
      case "intense": return "bg-red-100 text-red-700 border-red-300";
      default: return "bg-white/60 text-[#5C4033] border-[#8B7355]/30";
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-6">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Content */}
      <div className="relative w-full max-w-md bg-[#FFEBCD] rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div 
          className="relative px-6 pt-8 pb-6 text-white overflow-hidden"
          style={{
            background: `linear-gradient(135deg, rgba(${program.lighting.r}, ${program.lighting.g}, ${program.lighting.b}, 0.95) 0%, rgba(92, 64, 51, 0.95) 100%)`
          }}
        >
          <button
            onClick={onClose}
            className="mb-3 text-white/80 hover:text-white flex items-center gap-2 transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
            <span className="text-sm">Back</span>
          </button>
          
          <div className="absolute top-4 right-4 flex gap-2">
            <button
              onClick={onEdit}
              className="text-white/80 hover:text-white transition-colors"
              title="Edit Program"
            >
              <Edit2 className="w-5 h-5" />
            </button>
            <button
              onClick={onClose}
              className="text-white/80 hover:text-white transition-colors"
              title="Close"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
          
          <div className="relative">
            <h2 className="text-white mb-1">{program.name}</h2>
            <p className="text-white/90 text-sm">Total duration: {totalDuration} minutes</p>
          </div>
        </div>

        {/* Program Details */}
        <div className="p-6 space-y-6">
          
          {/* Pre-Session Actions */}
          {prepActions.length > 0 && (
            <div>
              <h3 className="text-[#3E2723] mb-3">Before Session</h3>
              <div className="space-y-2">
                {prepActions.map((action) => (
                  <div key={action.id} className="flex items-center justify-between bg-white/60 p-3 rounded-lg">
                    <span className="text-[#3E2723]">{action.name}</span>
                    {action.time && (
                      <span className="text-[#5C4033] text-sm">{action.time} min</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Session Intervals */}
          <div>
            <h3 className="text-[#3E2723] mb-3">Session Structure</h3>
            <div className="space-y-2">
              {program.intervals.map((interval, index) => (
                <div key={interval.id} className="bg-white/60 p-4 rounded-xl">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[#3E2723]">
                      {index + 1}. {interval.type === "sauna" ? "Sauna" : "Break"}
                    </span>
                    <span className="text-[#5C4033]">{interval.duration} min</span>
                  </div>
                  
                  {interval.type === "sauna" && interval.temperature && (
                    <div className="mt-2">
                      <span className={`inline-block px-3 py-1 rounded-full text-xs border ${getTempColor(interval.temperature)}`}>
                        {interval.temperature.charAt(0).toUpperCase() + interval.temperature.slice(1)} Heat
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Soundscape */}
          {program.soundscape && (
            <div>
              <h3 className="text-[#3E2723] mb-3">Ambience</h3>
              <div className="bg-white/60 p-3 rounded-lg">
                <span className="text-[#3E2723]">{program.soundscape}</span>
              </div>
            </div>
          )}

          {/* Lighting */}
          <div>
            <h3 className="text-[#3E2723] mb-3">Lighting</h3>
            <div className="flex items-center gap-3 bg-white/60 p-3 rounded-lg">
              <div 
                className="h-10 w-10 rounded-lg border-2 border-[#8B7355]/30"
                style={{ backgroundColor: `rgb(${program.lighting.r}, ${program.lighting.g}, ${program.lighting.b})` }}
              />
              <div>
                <p className="text-[#3E2723] text-sm">Custom Color</p>
                <p className="text-[#5C4033] text-xs font-mono">
                  RGB({program.lighting.r}, {program.lighting.g}, {program.lighting.b})
                </p>
              </div>
            </div>
          </div>

          {/* Post-Session Actions */}
          {postActions.length > 0 && (
            <div>
              <h3 className="text-[#3E2723] mb-3">After Session</h3>
              <div className="space-y-2">
                {postActions.map((action) => (
                  <div key={action.id} className="flex items-center justify-between bg-white/60 p-3 rounded-lg">
                    <span className="text-[#3E2723]">{action.name}</span>
                    {action.time && (
                      <span className="text-[#5C4033] text-sm">{action.time} min</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="space-y-3 pt-4">
            <Button 
              className="w-full bg-gradient-to-r from-[#8B7355] to-[#6D5A47] hover:from-[#6D5A47] hover:to-[#5C4033] text-white h-12"
            >
              Start This Program
            </Button>

            <div className="flex gap-2">
              <Button 
                variant="outline"
                className="flex-1 border-2 border-[#8B7355] text-[#5C4033] hover:bg-white/40 h-10"
                onClick={onEdit}
              >
                Edit
              </Button>
              <Button 
                variant="outline"
                className="flex-1 border-2 border-red-600 text-red-600 hover:bg-red-50 h-10"
                onClick={onDelete}
              >
                Delete
              </Button>
            </div>

            <Button 
              variant="ghost"
              className="w-full text-[#5C4033] hover:bg-white/40"
              onClick={onClose}
            >
              Close
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
