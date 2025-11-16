import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Button } from "./ui/button";

interface SessionFeedbackProps {
  onSubmit: (data: { relaxingLevel: number; enjoyableLevel: number }) => void;
  onClose: () => void;
}

const relaxingOptions = [
  {
    level: 0,
    title: "Not Relaxing",
    desc: "Uncomfortable experience, couldn't unwind, left early",
  },
  {
    level: 1,
    title: "Slightly Relaxing",
    desc: "Some minor relaxation but mostly uncomfortable or distracted",
  },
  {
    level: 2,
    title: "Moderately Relaxing",
    desc: "Decent session, felt somewhat refreshed",
  },
  {
    level: 3,
    title: "Relaxing",
    desc: "Good session, feeling noticeably calmer and refreshed",
  },
  {
    level: 4,
    title: "Very Relaxing",
    desc: "Great session, feel deeply relaxed and rejuvenated",
  },
  {
    level: 5,
    title: "Perfectly Relaxing",
    desc: "Exceptional experience, complete mind-body relaxation achieved",
  },
];

const enjoyableOptions = [
  {
    level: 0,
    title: "Not Enjoyable",
    desc: "Unpleasant experience, wouldn't recommend",
  },
  {
    level: 1,
    title: "Slightly Enjoyable",
    desc: "A few good moments but overall disappointing",
  },
  {
    level: 2,
    title: "Moderately Enjoyable",
    desc: "Decent time, had some fun",
  },
  {
    level: 3,
    title: "Enjoyable",
    desc: "Good experience, would do again",
  },
  {
    level: 4,
    title: "Very Enjoyable",
    desc: "Really fun session, great atmosphere and vibes",
  },
  {
    level: 5,
    title: "Perfectly Enjoyable",
    desc: "Outstanding experience, everything was perfect",
  },
];

export function SessionFeedback({ onSubmit, onClose }: SessionFeedbackProps) {
  const [relaxing, setRelaxing] = useState<number | null>(null);
  const [enjoyable, setEnjoyable] = useState<number | null>(null);
  const [step, setStep] = useState<0 | 1>(0);
  const [visible, setVisible] = useState(false);

  const canSubmit = relaxing !== null && enjoyable !== null;
  const canGoNext = relaxing !== null;

  useEffect(() => {
    // Trigger enter animation on mount
    const id = requestAnimationFrame(() => setVisible(true));
    return () => cancelAnimationFrame(id);
  }, []);

  // Prevent background scroll while modal is open
  useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, []);

  return createPortal(
    <div className="fixed inset-0 z-[2147483647] flex items-end sm:items-center justify-center" style={{ zIndex: 2147483647 }}>
      <div
        className={`absolute inset-0 bg-black/60 transition-opacity duration-200 ${visible ? "opacity-100" : "opacity-0"}`}
        onClick={onClose}
      />
      <div className={`relative w-full max-w-md mx-auto bg-[#FFEBCD] rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden transition-all duration-200 ${visible ? "opacity-100 translate-y-0 sm:scale-100" : "opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"}`}>
        <div className="relative px-6 pt-8 pb-6 text-white overflow-hidden">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage:
                "url('https://images.unsplash.com/photo-1678742753298-9e6b10fcc42f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixlib=rb-4.1.0&q=80&w=1080')",
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-br from-[#8B7355]/95 to-[#5C4033]/95" />
          <Button
            onClick={onClose}
            className="absolute top-4 right-4 bg-white/20 hover:bg-white/30 text-white border border-white/40 h-9 px-4 text-sm"
          >
            Skip
          </Button>
          <div className="relative">
            <h2 className="text-white mb-1">How was your sauna?</h2>
            <p className="text-white/80 text-sm">
              Share quick feedback to improve your next session
            </p>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {step === 0 && (
            <div>
              <h3 className="text-[#3E2723] mb-3">How relaxing was the sauna?</h3>
              <div className="space-y-2">
                {relaxingOptions.map((opt) => (
                  <button
                    key={opt.level}
                    onClick={() => setRelaxing(opt.level)}
                    className={`w-full text-left rounded-xl px-4 py-3 border transition-colors ${
                      relaxing === opt.level
                        ? "bg-[#8B7355] text-white border-[#8B7355]"
                        : "bg-white/70 text-[#3E2723] border-[#8B7355]/30 hover:bg-white"
                    }`}
                  >
                    <div className="flex flex-col items-start gap-1">
                      <div className="text-sm font-medium">
                        Level {opt.level} - {opt.title}
                      </div>
                      <div className="text-xs opacity-80">{opt.desc}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 1 && (
            <div>
              <h3 className="text-[#3E2723] mb-3">How enjoyable was the sauna?</h3>
              <div className="space-y-2">
                {enjoyableOptions.map((opt) => (
                  <button
                    key={opt.level}
                    onClick={() => setEnjoyable(opt.level)}
                    className={`w-full text-left rounded-xl px-4 py-3 border transition-colors ${
                      enjoyable === opt.level
                        ? "bg-[#8B7355] text-white border-[#8B7355]"
                        : "bg-white/70 text-[#3E2723] border-[#8B7355]/30 hover:bg-white"
                    }`}
                  >
                    <div className="flex flex-col items-start gap-1">
                      <div className="text-sm font-medium">
                        Level {opt.level} - {opt.title}
                      </div>
                      <div className="text-xs opacity-80">{opt.desc}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="flex gap-2 pt-2">
            <Button
              variant="outline"
              className="flex-1 border-[#8B7355] text-[#8B7355] hover:bg-[#8B7355] hover:text-white"
              onClick={onClose}
            >
              Cancel
            </Button>
            {step === 0 ? (
              <Button
                className="flex-1 bg-gradient-to-r from-[#8B7355] to-[#6D5A47] hover:from-[#6D5A47] hover:to-[#5C4033] text-white"
                disabled={!canGoNext}
                onClick={() => setStep(1)}
              >
                Next
              </Button>
            ) : (
              <Button
                className="flex-1 bg-gradient-to-r from-[#8B7355] to-[#6D5A47] hover:from-[#6D5A47] hover:to-[#5C4033] text-white"
                disabled={!canSubmit}
                onClick={() =>
                  canSubmit &&
                  onSubmit({
                    relaxingLevel: relaxing as number,
                    enjoyableLevel: enjoyable as number,
                  })
                }
              >
                Submit
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}


