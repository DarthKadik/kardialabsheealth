export interface AiSessionSuggestion {
  id: string;
  name: string;
}

export interface AiResponse {
  message: string;
  session?: AiSessionSuggestion;
  requiresApproval?: boolean;
  nextAction?: "none" | "start_session" | "gather_more_info" | "answer_followup";
}

const WEBHOOK_URL =
  "https://ripatti.app.n8n.cloud/webhook/1c61ddea-d510-4750-a138-38c69d1d8b9e/chat";

export function generateSessionId(): string {
  // Simple 32-char hex string
  const bytes = new Uint8Array(16);
  if (typeof crypto !== "undefined" && "getRandomValues" in crypto) {
    crypto.getRandomValues(bytes);
  } else {
    for (let i = 0; i < bytes.length; i++) bytes[i] = Math.floor(Math.random() * 256);
  }
  return Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");
}

export async function postAiMessage(message: string, sessionId: string): Promise<AiResponse> {
  // Required payload format for N8N webhook
  const payload = {
    sessionId,
    action: "sendMessage",
    chatInput: message,
  };
  const res = await fetch(WEBHOOK_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
  const rawText = await res.text().catch(() => "");
  if (!res.ok) {
    // eslint-disable-next-line no-console
    console.error("AI service error:", res.status, rawText);
    throw new Error(`AI service error: ${res.status} - ${rawText || "No body"}`);
  }
  let data: any;
  try {
    data = JSON.parse(rawText);
  } catch {
    // If not JSON but we did get text, treat it as the conversational message
    if (rawText && rawText.trim().length > 0) {
      return {
        message: rawText.trim(),
      };
    }
    // eslint-disable-next-line no-console
    console.error("AI service invalid JSON and empty body");
    throw new Error("Invalid AI response: not JSON and empty body");
  }

  // Normalize message from alternate shapes
  let aiMessage: unknown = data?.message;
  console.log("aiMessage", data);
  if (typeof aiMessage !== "string") {
    aiMessage =
      (typeof data?.data?.message === "string" && data.data.message) ||
      // n8n often wraps output under `output`
      (typeof data?.output?.message === "string" && data.output.message) ||
      (typeof data?.reply === "string" && data.reply) ||
      (typeof data?.response === "string" && data.response) ||
      null;
  }
  if (typeof aiMessage !== "string" || aiMessage.length === 0) {
    // eslint-disable-next-line no-console
    console.warn("AI service: missing 'message' in response", data);
    throw new Error("Invalid AI response: missing 'message'");
  }

  // Normalize session if present
  let session: AiSessionSuggestion | undefined;
  const sessionSource = data.session ?? data.output?.session;
  if (sessionSource) {
    const sid = sessionSource.id;
    const sname = sessionSource.name;
    const idStr =
      typeof sid === "string"
        ? sid
        : typeof sid === "number"
        ? String(sid)
        : undefined;
    if (idStr && typeof sname === "string") {
      session = { id: idStr, name: sname };
    } // else ignore malformed session silently
  }

  // nextAction: accept only valid values; otherwise ignore
  const allowed = ["none", "start_session", "gather_more_info", "answer_followup"] as const;
  const nextActionRaw = data.nextAction ?? data.output?.nextAction;
  const nextAction = allowed.includes(nextActionRaw) ? nextActionRaw : undefined;
  const requiresApprovalRaw = data.requiresApproval ?? data.output?.requiresApproval;

  return {
    message: aiMessage,
    session,
    requiresApproval: typeof requiresApprovalRaw === "boolean" ? requiresApprovalRaw : undefined,
    nextAction,
  } as AiResponse;
}


