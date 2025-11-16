import { useRef, useEffect, useState } from "react";
import { Button } from "../ui/button";
import { ChevronDown } from "lucide-react";
import type { GuidedSessionConfig } from "../../data/guidedSessions";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface AiChatOverlayProps {
  open: boolean;
  pending: boolean;
  messages: Message[];
  onClose: () => void;
  onSend: (message: string) => void;
  onNewChat: () => void;
  suggested?: GuidedSessionConfig | null;
  suggestedElement?: React.ReactNode;
}

export function AiChatOverlay({
  open,
  pending,
  messages,
  onClose,
  onSend,
  onNewChat,
  suggested,
  suggestedElement,
}: AiChatOverlayProps) {
  const [input, setInput] = useState("");
  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (open) {
      const t = setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: "smooth" }), 50);
      return () => clearTimeout(t);
    }
  }, [open, messages]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-6">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md bg-[#FFEBCD] rounded-3xl shadow-2xl overflow-hidden h-[90vh] min-h-[90vh] max-h-[90vh] flex flex-col">
        <div className="relative px-6 pt-8 pb-6 text-white overflow-hidden">
          <div
            className="absolute inset-0 bg-cover bg-center pointer-events-none"
            style={{
              backgroundImage:
                "url('https://images.unsplash.com/photo-1678742753298-9e6b10fcc42f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzYXVuYSUyMHdvb2QlMjB0ZXh0dXJlfGVufDF8fHx8MTc2MzE1MzcwN3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral')",
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-br from-[#8B7355]/95 to-[#5C4033]/95 pointer-events-none" />
          <Button
            onClick={onNewChat}
            variant="secondary"
            className="absolute right-4 bottom-4 bg-white/20 hover:bg-white/30 text-white border border-white/40 h-9 px-4 text-sm"
          >
            New Chat
          </Button>
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white/90 hover:text-white flex items-center gap-1 transition-colors"
          >
            <span className="text-sm">Back</span>
            <ChevronDown className="w-5 h-5 -rotate-90" />
          </button>
          <div className="relative">
            <h2 className="text-white mb-1">AI Sauna Companion</h2>
            <p className="text-white/80 text-sm">Describe how you feel. I’ll guide you.</p>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {messages.map((m, idx) => (
            <div key={idx} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-[80%] px-3 py-2 rounded-xl text-sm ${
                  m.role === "user"
                    ? "bg-[#8B7355] text-white rounded-br-sm"
                    : "bg-white/70 text-[#3E2723] border border-[#8B7355]/20 rounded-bl-sm"
                }`}
              >
                {m.content}
              </div>
            </div>
          ))}
          {suggestedElement}
          <div ref={bottomRef} />
        </div>
        <div className="p-4 border-t border-[#8B7355]/20 bg-white/40">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const trimmed = input.trim();
              if (!trimmed || pending) return;
              onSend(trimmed);
              setInput("");
            }}
            className="flex gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Share how you feel or ask a question..."
              className="flex-1 px-3 py-2 bg-white/80 border border-[#8B7355]/30 rounded-lg text-[#3E2723] text-sm focus:outline-none focus:ring-2 focus:ring-[#8B7355]"
              disabled={pending}
            />
            <Button
              type="submit"
              className="bg-[#8B7355] text-white hover:bg-[#6D5A47]"
              disabled={pending}
            >
              {pending ? "Sending..." : "Send"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}


