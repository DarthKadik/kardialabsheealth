import { useEffect, useRef } from "react";
import { Button } from "./ui/button";

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
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const size = 1080; // square card for social

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Background gradient
    const grad = ctx.createLinearGradient(0, 0, size, size);
    grad.addColorStop(0, "#3E2723");
    grad.addColorStop(1, "#5C4033");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, size, size);

    // Card overlay
    ctx.fillStyle = "rgba(255, 235, 205, 0.08)";
    ctx.fillRect(60, 60, size - 120, size - 120);

    // Heading
    ctx.fillStyle = "#FFEBCD";
    ctx.font = "bold 64px system-ui, -apple-system, sans-serif";
    ctx.fillText("Sauna Session", 100, 140);

    // Date
    ctx.fillStyle = "rgba(255,255,255,0.8)";
    ctx.font = "32px system-ui, -apple-system, sans-serif";
    const date = new Date(stats.endedAt).toLocaleString();
    ctx.fillText(date, 100, 190);

    // Metrics
    ctx.fillStyle = "#FFEBCD";
    ctx.font = "bold 48px system-ui, -apple-system, sans-serif";
    ctx.fillText(`${stats.durationMin} min`, 100, 270);
    ctx.font = "28px system-ui, -apple-system, sans-serif";
    ctx.fillStyle = "rgba(255,255,255,0.85)";
    ctx.fillText("Duration", 100, 310);

    ctx.fillStyle = "#FFEBCD";
    ctx.font = "bold 48px system-ui, -apple-system, sans-serif";
    ctx.fillText(`${Math.round(stats.avgTemp)}°C`, 360, 270);
    ctx.font = "28px system-ui, -apple-system, sans-serif";
    ctx.fillStyle = "rgba(255,255,255,0.85)";
    ctx.fillText("Avg Temp", 360, 310);

    ctx.fillStyle = "#FFEBCD";
    ctx.font = "bold 48px system-ui, -apple-system, sans-serif";
    ctx.fillText(`${Math.max(0, stats.intervalsCompleted)}`, 610, 270);
    ctx.font = "28px system-ui, -apple-system, sans-serif";
    ctx.fillStyle = "rgba(255,255,255,0.85)";
    ctx.fillText("Intervals", 610, 310);

    if (stats.programName) {
      ctx.fillStyle = "rgba(255,255,255,0.9)";
      ctx.font = "28px system-ui, -apple-system, sans-serif";
      ctx.fillText(`Program: ${stats.programName}`, 100, 370);
    }

    // Badges for feedback
    const drawBadge = (x: number, y: number, label: string, value: number, colors: { bg: string; text: string }) => {
      const w = 380;
      const h = 100;
      ctx.fillStyle = colors.bg;
      roundRect(ctx, x, y, w, h, 16, true, false);
      ctx.fillStyle = colors.text;
      ctx.font = "28px system-ui, -apple-system, sans-serif";
      ctx.fillText(label, x + 24, y + 40);
      ctx.font = "bold 44px system-ui, -apple-system, sans-serif";
      ctx.fillText(`Level ${value}/5`, x + 24, y + 84);
    };

    drawBadge(100, 430, "Relaxing", feedback.relaxing, { bg: "rgba(255,255,255,0.1)", text: "#FFEBCD" });
    drawBadge(520, 430, "Enjoyable", feedback.enjoyable, { bg: "rgba(255,255,255,0.1)", text: "#FFEBCD" });

    // Footer / branding
    ctx.fillStyle = "rgba(255,255,255,0.7)";
    ctx.font = "24px system-ui, -apple-system, sans-serif";
    ctx.fillText("Shared from Smart Sauna", 100, size - 120);
    ctx.fillText("#sauna #wellness", 100, size - 80);
  }, [stats, feedback]);

  const downloadPng = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement("a");
    link.download = `sauna-session-${new Date(stats.endedAt).toISOString()}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  const copyToClipboard = async () => {
    try {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/png"));
      if (blob && navigator.clipboard && "write" in navigator.clipboard) {
        // @ts-ignore
        await navigator.clipboard.write([new window.ClipboardItem({ "image/png": blob })]);
        alert("Image copied to clipboard!");
      } else {
        downloadPng();
      }
    } catch {
      downloadPng();
    }
  };

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
          <div className="w-full bg-[#3E2723] rounded-xl overflow-hidden aspect-square">
            <canvas ref={canvasRef} className="w-full h-full block" />
          </div>
          <div className="flex gap-2">
            <Button
              className="flex-1 bg-gradient-to-r from-[#8B7355] to-[#6D5A47] hover:from-[#6D5A47] hover:to-[#5C4033] text-white"
              onClick={downloadPng}
            >
              Save Image
            </Button>
            <Button
              variant="outline"
              className="flex-1 border-[#8B7355] text-[#8B7355] hover:bg-[#8B7355] hover:text-white"
              onClick={copyToClipboard}
            >
              Copy Image
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
  );
}

function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number,
  fill: boolean,
  stroke: boolean
) {
  if (typeof radius === "number") {
    radius = Math.min(radius, width / 2, height / 2);
  }
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
  if (fill) ctx.fill();
  if (stroke) ctx.stroke();
}


