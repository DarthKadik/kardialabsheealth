import { useState } from "react";
import { Button } from "../ui/button";

interface AiCompanionCardProps {
  pending?: boolean;
  onSend: (message: string) => void;
}

export function AiCompanionCard({ pending = false, onSend }: AiCompanionCardProps) {
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = message.trim();
    if (!trimmed || pending) return;
    onSend(trimmed);
    // Keep text until overlay shows; UX will clear after opening
  };

  return (
    <div className="min-w-[360px] max-w-[400px] h-full">
      <div className="h-full bg-white/70 border border-[#8B7355]/30 rounded-2xl p-4 flex flex-col justify-between">
        <div>
          <p className="text-[#3E2723] text-sm mb-1">
            Meet your AI sauna companion
          </p>
          <h4 className="text-[#3E2723] text-lg mb-2">
            What kind of sauna do you need today?
          </h4>
          <p className="text-[#5C4033]/80 text-sm">
            Tell me how you feel and I’ll suggest a session for you.
          </p>
        </div>
        <form onSubmit={handleSubmit} className="mt-4 flex gap-2">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="e.g., Sore legs after a run, a bit stressed..."
            className="flex-1 px-3 py-2 bg-white/80 border border-[#8B7355]/30 rounded-lg text-[#3E2723] text-sm focus:outline-none focus:ring-2 focus:ring-[#8B7355]"
            disabled={pending}
          />
          <Button
            type="submit"
            className="bg-[#8B7355] text-white hover:bg-[#6D5A47]"
            disabled={pending}
          >
            {pending ? "Sending..." : "Ask"}
          </Button>
        </form>
      </div>
    </div>
  );
}


