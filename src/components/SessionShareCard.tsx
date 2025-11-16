import { useState, useMemo, useEffect, useRef } from "react";
import { Button } from "./ui/button";
import { shareOnWhatsapp, shareOnX, mobileShare } from "../utils/socialShareUtils";

interface ShareStats {
  durationMin: number;
  avgTemp: number;
  programName: string | null;
  intervalsCompleted: number;
  startedAt: number;
  endedAt: number;
}

interface FeedbackData {
  relaxing: number;
  enjoyable: number;
}

interface SessionShareCardProps {
  stats: ShareStats;
  feedback: FeedbackData;
  onClose: () => void;
}

export function SessionShareCard({ stats, feedback, onClose }: SessionShareCardProps) {
  const defaultShareText = useMemo(() => {
    const date = new Date(stats.endedAt).toLocaleDateString();
    const lines: string[] = [
      `Sauna session ${date}`,
      `${stats.durationMin} min @ ~${Math.round(stats.avgTemp)}°C`,
      `Relaxing ${feedback.relaxing}/5, Enjoyable ${feedback.enjoyable}/5`,
      `#sauna #wellness`,
    ];
    return lines.join("\n\n");
  }, [stats, feedback]);
  const [shareText, setShareText] = useState<string>(defaultShareText);
  useEffect(() => {
    setShareText(defaultShareText);
  }, [defaultShareText]);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const autoResize = () => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "0px";
    const newHeight = Math.max(160, el.scrollHeight);
    el.style.height = `${newHeight}px`;
  };
  useEffect(() => {
    autoResize();
  }, [shareText]);

  // No image generation; simple text-based share

  return (
    <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div className="relative w-full max-w-md mx-auto bg-[#FFEBCD] rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden">
        <div className="relative px-6 pt-8 pb-6 text-white overflow-hidden">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage:
                "url('https://images.unsplash.com/photo-1678742753298-9e6b10fcc42f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixlib=rb-4.1.0&q=80&w=1080')",
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-br from-[#8B7355]/95 to-[#5C4033]/95" />
          <div className="relative">
            <h2 className="text-white mb-1">Share your session</h2>
            <p className="text-white/80 text-sm">Download or copy the image to share (e.g., Strava)</p>
          </div>
        </div>
        <div className="p-6 space-y-4">
          <div className="space-y-2">
            <label className="text-[#3E2723] text-sm">Post text</label>
            <textarea
              ref={textareaRef}
              value={shareText}
              onChange={(e) => setShareText(e.target.value)}
              className="w-full resize-none rounded-xl bg-white/80 border border-[#8B7355]/30 px-4 py-3 text-[#3E2723] placeholder:text-[#5C4033]/50 focus:outline-none focus:ring-2 focus:ring-[#8B7355] shadow-inner"
              style={{ minHeight: 160 }}
              placeholder="Add a note about your session..."
            />
            <div className="flex gap-2">
              <Button
                className="flex-1 bg-[#25D366] hover:bg-[#1ebe5b] text-white"
                onClick={() => shareOnWhatsapp(shareText)}
              >
                Share to WhatsApp
              </Button>
              <Button
                className="flex-1 bg-black hover:bg-black/80 text-white"
                onClick={() => shareOnX(shareText)}
              >
                Share to X
              </Button>
              <Button
                variant="outline"
                className="flex-1 border-[#8B7355] text-[#8B7355] hover:bg-[#8B7355] hover:text-white"
                onClick={() => mobileShare(shareText)}
              >
                Mobile Share
              </Button>
            </div>
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
  );
}


