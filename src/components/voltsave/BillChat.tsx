import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Loader2, Bot, User, AlertCircle } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

const API_BASE = import.meta.env.VITE_API_URL ?? "http://localhost:3000";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
  streaming?: boolean;
  error?: boolean;
}

interface BillChatProps {
  billId: string;
}

const SUGGESTED_QUESTIONS = [
  "Why is my bill so high this month?",
  "Which appliance uses the most electricity?",
  "How can I reduce my bill by 20%?",
  "Am I on the right tariff plan?",
];

const BillChat = ({ billId }: BillChatProps) => {
  const { token } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = useCallback(async (question: string) => {
    if (!question.trim() || isStreaming) return;

    const userMsg: ChatMessage = { role: "user", content: question.trim() };
    const history = messages.map(({ role, content }) => ({ role, content }));

    setMessages(prev => [...prev, userMsg, { role: "assistant", content: "", streaming: true }]);
    setInput("");
    setIsStreaming(true);

    abortRef.current = new AbortController();

    try {
      const res = await fetch(`${API_BASE}/api/bills/${billId}/chat`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ question: question.trim(), history }),
        signal: abortRef.current.signal,
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({ message: "Request failed" }));
        throw new Error(err.message ?? `Error ${res.status}`);
      }

      const reader = res.body!.getReader();
      const decoder = new TextDecoder();
      let answer = "";
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() ?? "";

        for (const line of lines) {
          if (!line.startsWith("data:")) continue;
          try {
            const parsed = JSON.parse(line.slice(5).trim());
            if (parsed.token) {
              answer += parsed.token;
              setMessages(prev => {
                const next = [...prev];
                next[next.length - 1] = { role: "assistant", content: answer, streaming: true };
                return next;
              });
            }
            if (parsed.done) break;
            if (parsed.error) throw new Error(parsed.error);
          } catch {
            // malformed SSE line — skip
          }
        }
      }

      // Finalise — remove streaming flag
      setMessages(prev => {
        const next = [...prev];
        next[next.length - 1] = { role: "assistant", content: answer || "No response received." };
        return next;
      });
    } catch (err: unknown) {
      if ((err as Error)?.name === "AbortError") return;
      const msg = (err as Error)?.message ?? "Something went wrong";
      setMessages(prev => {
        const next = [...prev];
        next[next.length - 1] = { role: "assistant", content: msg, error: true };
        return next;
      });
    } finally {
      setIsStreaming(false);
      abortRef.current = null;
    }
  }, [billId, token, messages, isStreaming]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  return (
    <div className="flex flex-col h-[600px] bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">

      {/* Header */}
      <div className="flex items-center gap-3 px-5 py-3 border-b border-slate-700 bg-slate-800/80">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-teal-500 flex items-center justify-center">
          <Bot className="w-4 h-4 text-white" />
        </div>
        <div>
          <p className="font-semibold text-white text-sm">VoltSave AI Chat</p>
          <p className="text-slate-400 text-xs">Ask anything about your electricity bill</p>
        </div>
        <span className="ml-auto text-[10px] bg-green-500/20 text-green-400 px-2 py-0.5 rounded">
          {isStreaming ? "Thinking…" : "Online"}
        </span>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && (
          <div className="text-center py-8">
            <Bot className="w-10 h-10 text-slate-600 mx-auto mb-3" />
            <p className="text-slate-400 text-sm mb-4">Ask me anything about your bill</p>
            <div className="flex flex-wrap gap-2 justify-center">
              {SUGGESTED_QUESTIONS.map((q, i) => (
                <button
                  key={i}
                  onClick={() => sendMessage(q)}
                  className="text-xs bg-slate-700 hover:bg-slate-600 text-slate-300 px-3 py-1.5 rounded-lg transition text-left"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}

        <AnimatePresence initial={false}>
          {messages.map((msg, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
              className={`flex gap-3 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              {msg.role === "assistant" && (
                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-500 to-teal-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Bot className="w-3.5 h-3.5 text-white" />
                </div>
              )}

              <div className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                msg.role === "user"
                  ? "bg-blue-600 text-white rounded-br-sm"
                  : msg.error
                  ? "bg-red-500/10 border border-red-500/30 text-red-300 rounded-bl-sm"
                  : "bg-slate-700 text-slate-200 rounded-bl-sm"
              }`}>
                {msg.error && <AlertCircle className="w-3.5 h-3.5 inline mr-1 text-red-400" />}
                {msg.content}
                {msg.streaming && (
                  <span className="inline-block w-1.5 h-4 bg-blue-400 ml-0.5 animate-pulse rounded-sm align-middle" />
                )}
              </div>

              {msg.role === "user" && (
                <div className="w-7 h-7 rounded-full bg-slate-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <User className="w-3.5 h-3.5 text-slate-300" />
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>

        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="border-t border-slate-700 p-3">
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Ask about your bill…"
            disabled={isStreaming}
            className="flex-1 bg-slate-700 text-white placeholder-slate-500 rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 transition"
          />
          <button
            type="submit"
            disabled={!input.trim() || isStreaming}
            className="w-10 h-10 rounded-lg bg-blue-600 hover:bg-blue-500 disabled:opacity-40 flex items-center justify-center flex-shrink-0 transition"
          >
            {isStreaming
              ? <Loader2 className="w-4 h-4 text-white animate-spin" />
              : <Send className="w-4 h-4 text-white" />
            }
          </button>
        </form>
        <p className="text-slate-600 text-[10px] mt-1.5 text-center">
          AI answers are based on your bill data only
        </p>
      </div>

    </div>
  );
};

export default BillChat;
