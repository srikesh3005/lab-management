import React, { useState, useRef, useEffect } from "react";
import { ChatSession, ChatMessage, Equipment } from "../types";
import {
  Bot,
  Sparkles,
  Plus,
  Send,
  Paperclip,
  ArrowRight,
  MessageSquare,
  Activity,
  CheckCircle2,
  ChevronRight,
  RefreshCw,
} from "lucide-react";

interface AIAssistantViewProps {
  chatSessions: ChatSession[];
  onSelectSession: (session: ChatSession) => void;
  currentSession: ChatSession;
  onSendMessage: (text: string) => Promise<void>;
  isGenerating: boolean;
  onSelectEquipmentById: (id: string) => void;
  onNewChat: () => void;
}

export const AIAssistantView: React.FC<AIAssistantViewProps> = ({
  chatSessions,
  onSelectSession,
  currentSession,
  onSendMessage,
  isGenerating,
  onSelectEquipmentById,
  onNewChat,
}) => {
  const [inputText, setInputText] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [currentSession.messages, isGenerating]);

  const handleSend = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim() || isGenerating) return;
    const msg = inputText;
    setInputText("");
    await onSendMessage(msg);
  };

  const handleChipClick = async (chipPrompt: string) => {
    if (isGenerating) return;
    await onSendMessage(chipPrompt);
  };

  const todaySessions = chatSessions.filter((s) => s.group === "Today");
  const pastSessions = chatSessions.filter((s) => s.group === "Previous 7 Days");

  const promptSuggestions = [
    "Which equipment is idle this week?",
    "Status of the CNC Machine in Fabrication Lab?",
    "Recommend a spectrometer for biotech lab.",
    "Show me upcoming calibrations for next month.",
  ];

  return (
    <div
      id="smartlab-ai-assistant-view"
      className="p-4 md:p-6 max-w-7xl mx-auto h-[calc(100vh-5rem)] flex gap-6"
    >
      {/* Left Sidebar: Past Chats (4 cols) */}
      <div className="w-64 md:w-72 bg-white rounded-2xl border border-slate-200 shadow-sm p-4 flex flex-col justify-between hidden md:flex shrink-0">
        <div className="space-y-4 overflow-y-auto">
          {/* New Chat Button */}
          <button
            id="ai-new-chat-btn"
            onClick={onNewChat}
            className="w-full bg-[#006c49] hover:bg-[#005237] text-white font-semibold text-xs py-2.5 px-3 rounded-xl flex items-center justify-center gap-2 shadow-xs transition-all active:scale-98"
          >
            <Plus className="w-4 h-4" />
            <span>New Chat</span>
          </button>

          {/* Today Group */}
          {todaySessions.length > 0 && (
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-2 block">
                Today
              </span>
              {todaySessions.map((s) => (
                <button
                  key={s.id}
                  onClick={() => onSelectSession(s)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium transition-all flex items-center gap-2 truncate ${
                    currentSession.id === s.id
                      ? "bg-purple-50 text-purple-900 font-bold border-l-3 border-purple-600"
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                  }`}
                >
                  <MessageSquare className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="truncate">{s.title}</span>
                </button>
              ))}
            </div>
          )}

          {/* Previous 7 Days Group */}
          {pastSessions.length > 0 && (
            <div className="space-y-1 pt-2 border-t border-slate-100">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-2 block">
                Previous 7 Days
              </span>
              {pastSessions.map((s) => (
                <button
                  key={s.id}
                  onClick={() => onSelectSession(s)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium transition-all flex items-center gap-2 truncate ${
                    currentSession.id === s.id
                      ? "bg-purple-50 text-purple-900 font-bold border-l-3 border-purple-600"
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                  }`}
                >
                  <MessageSquare className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="truncate">{s.title}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Model info banner */}
        <div className="pt-3 border-t border-slate-100 text-[11px] text-slate-400 flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-purple-600 shrink-0" />
          <span className="truncate">Gemini 3.7 Flash Engine</span>
        </div>
      </div>

      {/* Right: Active Chat View (8 cols) */}
      <div className="flex-1 bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between overflow-hidden">
        {/* Chat Header */}
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-purple-600 to-indigo-600 text-white flex items-center justify-center shadow-xs">
              <Bot className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-bold text-sm text-slate-900">{currentSession.title}</h2>
              <span className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Laboratory Context Active
              </span>
            </div>
          </div>

          <button
            onClick={onNewChat}
            className="md:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-lg text-xs"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>

        {/* Messages Feed */}
        <div className="flex-1 p-4 md:p-6 overflow-y-auto space-y-5">
          {currentSession.messages.map((msg) => {
            const isUser = msg.sender === "user";
            return (
              <div
                key={msg.id}
                className={`flex gap-3 ${isUser ? "justify-end" : "justify-start"}`}
              >
                {!isUser && (
                  <div className="w-7 h-7 rounded-lg bg-purple-600 text-white flex items-center justify-center text-xs shrink-0 mt-0.5 shadow-xs">
                    <Bot className="w-3.5 h-3.5" />
                  </div>
                )}

                <div
                  className={`max-w-[85%] sm:max-w-xl rounded-2xl p-4 space-y-3 ${
                    isUser
                      ? "bg-[#006c49] text-white rounded-tr-xs"
                      : "bg-slate-50 border border-slate-200/80 text-slate-800 rounded-tl-xs shadow-xs"
                  }`}
                >
                  <p className="text-xs md:text-sm leading-relaxed whitespace-pre-wrap">
                    {msg.text}
                  </p>

                  {/* Rich Embedded Equipment Cards */}
                  {msg.suggestedEquipment && msg.suggestedEquipment.length > 0 && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                      {msg.suggestedEquipment.map((eq, i) => (
                        <div
                          key={eq.id || i}
                          className="bg-white p-3 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between space-y-2.5 text-left"
                        >
                          <div>
                            <div className="flex items-center justify-between">
                              <span className="text-[10px] font-mono text-slate-400 font-bold">
                                {eq.id}
                              </span>
                              <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-emerald-50 text-emerald-700">
                                {eq.status || "Available"}
                              </span>
                            </div>
                            <h4 className="font-bold text-xs text-slate-900 mt-1 truncate">
                              {eq.name}
                            </h4>
                            <p className="text-[10px] text-slate-500">
                              {eq.bench || "Main Lab Bench"}
                            </p>
                          </div>

                          <div className="flex items-center justify-between pt-1 border-t border-slate-100">
                            <span className="text-[10px] font-bold text-emerald-600 flex items-center gap-1">
                              <Activity className="w-2.5 h-2.5" />
                              {eq.healthScore || 95}% Health
                            </span>
                            {eq.id && (
                              <button
                                onClick={() => onSelectEquipmentById(eq.id!)}
                                className="text-[10px] font-bold text-[#006c49] hover:underline flex items-center gap-0.5"
                              >
                                <span>Profile</span>
                                <ChevronRight className="w-2.5 h-2.5" />
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  <div
                    className={`text-[9px] ${
                      isUser ? "text-emerald-200 text-right" : "text-slate-400 text-left"
                    }`}
                  >
                    {msg.timestamp}
                  </div>
                </div>
              </div>
            );
          })}

          {/* Typing / Generating Indicator */}
          {isGenerating && (
            <div className="flex gap-3 items-center text-xs text-purple-700 font-semibold p-2">
              <div className="w-6 h-6 rounded-md bg-purple-100 flex items-center justify-center animate-spin">
                <RefreshCw className="w-3.5 h-3.5 text-purple-600" />
              </div>
              <span>SmartLab Assistant is thinking...</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Suggestion Chips & Message Input Form */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/50 space-y-3">
          {/* Quick Suggestions Chips */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            {promptSuggestions.map((prompt, idx) => (
              <button
                key={idx}
                onClick={() => handleChipClick(prompt)}
                className="text-[11px] px-3 py-1.5 rounded-full bg-white border border-slate-200 text-slate-700 hover:border-purple-300 hover:text-purple-700 hover:bg-purple-50 transition-all shrink-0 font-medium shadow-2xs"
              >
                {prompt}
              </button>
            ))}
          </div>

          {/* Chat Input Bar */}
          <form onSubmit={handleSend} className="flex items-center gap-2">
            <div className="relative flex-1">
              <input
                id="ai-chat-input"
                type="text"
                placeholder="Ask anything about equipment status, calibration schedules, or budget forecasts..."
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                disabled={isGenerating}
                className="w-full bg-white border border-slate-200 rounded-xl pl-4 pr-10 py-2.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all shadow-xs"
              />
              <button
                type="button"
                onClick={() => alert("File attachment dialog initialized.")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                title="Attach document/log"
              >
                <Paperclip className="w-4 h-4" />
              </button>
            </div>

            <button
              id="ai-send-message-btn"
              type="submit"
              disabled={!inputText.trim() || isGenerating}
              className="p-2.5 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white rounded-xl shadow-xs transition-all active:scale-95 shrink-0"
              title="Send Message"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
