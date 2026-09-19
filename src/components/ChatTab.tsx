import React, { useState, useRef, useEffect } from "react";
import { DocumentItem, ChatMessage } from "../types";
import { Send, Bot, User, Sparkles, Trash2, ArrowDown, HelpCircle } from "lucide-react";
import ReactMarkdown from "react-markdown";

interface ChatTabProps {
  document: DocumentItem;
  messages: ChatMessage[];
  onSendMessage: (question: string) => Promise<void>;
  onClearChat: () => void;
  loading: boolean;
}

export const ChatTab: React.FC<ChatTabProps> = ({
  document,
  messages,
  onSendMessage,
  onClearChat,
  loading,
}) => {
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;
    const q = input.trim();
    setInput("");
    onSendMessage(q);
  };

  const handleQuickQuestion = (q: string) => {
    if (loading) return;
    onSendMessage(q);
  };

  return (
    <div id="chat-tab-container" className="flex flex-col h-full bg-white rounded-xl border border-slate-200 overflow-hidden shadow-2xs">
      {/* Chat Header */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-slate-200 bg-slate-50/80">
        <div className="flex items-center gap-2.5">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-600 text-white shadow-2xs">
            <Bot className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-xs font-semibold text-slate-800">Document Assistant Q&A</h3>
            <p className="text-[11px] text-slate-500 truncate max-w-[280px]">
              Grounded strictly in {document.name}
            </p>
          </div>
        </div>

        {messages.length > 0 && (
          <button
            id="clear-chat-history-button"
            onClick={onClearChat}
            className="flex items-center gap-1 px-2.5 py-1 text-xs text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors"
            title="Reset conversation"
          >
            <Trash2 className="h-3.5 w-3.5" />
            <span>Clear chat</span>
          </button>
        )}
      </div>

      {/* Messages Scroll Area */}
      <div id="chat-messages-container" className="flex-1 overflow-y-auto p-5 md:p-6 space-y-4">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full max-w-md mx-auto text-center py-8">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 mb-3 border border-indigo-100">
              <Sparkles className="h-6 w-6" />
            </div>
            <h4 className="text-sm font-semibold text-slate-800">Ask anything about this document</h4>
            <p className="text-xs text-slate-500 mt-1 mb-6 leading-relaxed">
              Gemini will reference clauses, metrics, terms, and context with direct citations.
            </p>

            {/* Suggested quick questions */}
            {document.suggestedQuestions && document.suggestedQuestions.length > 0 && (
              <div className="w-full space-y-2 text-left">
                <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider px-1">
                  Suggested Questions
                </p>
                <div className="space-y-1.5">
                  {document.suggestedQuestions.map((q, idx) => (
                    <button
                      key={idx}
                      id={`suggested-question-btn-${idx}`}
                      onClick={() => handleQuickQuestion(q)}
                      className="w-full text-left p-2.5 rounded-lg border border-slate-200 hover:border-indigo-300 bg-slate-50/60 hover:bg-indigo-50/50 text-xs text-slate-700 transition-all flex items-start gap-2 group"
                    >
                      <HelpCircle className="h-3.5 w-3.5 text-indigo-500 mt-0.5 shrink-0 group-hover:scale-110 transition-transform" />
                      <span className="flex-1">{q}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-3 max-w-3xl ${
                msg.role === "user" ? "ml-auto justify-end" : "mr-auto justify-start"
              }`}
            >
              {msg.role === "model" && (
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 border border-indigo-100 mt-0.5">
                  <Bot className="h-4 w-4" />
                </div>
              )}

              <div
                className={`rounded-2xl p-4 text-xs md:text-sm leading-relaxed ${
                  msg.role === "user"
                    ? "bg-indigo-600 text-white rounded-br-xs"
                    : "bg-slate-50 border border-slate-200 text-slate-800 rounded-bl-xs shadow-2xs"
                }`}
              >
                {msg.role === "user" ? (
                  <p className="whitespace-pre-wrap">{msg.text}</p>
                ) : (
                  <div className="prose prose-slate max-w-none prose-p:text-xs md:prose-p:text-sm prose-p:leading-relaxed prose-headings:font-semibold prose-h3:text-sm prose-ul:text-xs prose-li:text-xs prose-table:text-xs prose-pre:bg-slate-900 prose-pre:text-slate-100">
                    <ReactMarkdown>{msg.text}</ReactMarkdown>
                  </div>
                )}
                <div
                  className={`mt-1 text-[10px] ${
                    msg.role === "user" ? "text-indigo-200 text-right" : "text-slate-400 text-left"
                  }`}
                >
                  {new Date(msg.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </div>
              </div>

              {msg.role === "user" && (
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-800 text-white shadow-2xs mt-0.5">
                  <User className="h-4 w-4" />
                </div>
              )}
            </div>
          ))
        )}

        {loading && (
          <div className="flex gap-3 max-w-3xl mr-auto justify-start items-center">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 border border-indigo-100">
              <Bot className="h-4 w-4" />
            </div>
            <div className="rounded-2xl rounded-bl-xs bg-slate-50 border border-slate-200 p-3.5 text-xs text-slate-600 flex items-center gap-2">
              <div className="flex space-x-1">
                <div className="h-2 w-2 rounded-full bg-indigo-500 animate-bounce" style={{ animationDelay: "0ms" }} />
                <div className="h-2 w-2 rounded-full bg-indigo-500 animate-bounce" style={{ animationDelay: "150ms" }} />
                <div className="h-2 w-2 rounded-full bg-indigo-500 animate-bounce" style={{ animationDelay: "300ms" }} />
              </div>
              <span className="text-slate-500 text-xs">Analyzing document context...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested chips if conversation is active */}
      {messages.length > 0 && document.suggestedQuestions && (
        <div className="px-4 py-2 border-t border-slate-100 bg-slate-50/50 flex items-center gap-2 overflow-x-auto text-[11px] scrollbar-none">
          <span className="text-slate-400 shrink-0 font-medium">Quick ask:</span>
          {document.suggestedQuestions.slice(0, 3).map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleQuickQuestion(q)}
              disabled={loading}
              className="shrink-0 px-2.5 py-1 rounded-full bg-white border border-slate-200 hover:border-indigo-300 text-slate-700 hover:text-indigo-600 text-xs transition-colors truncate max-w-[220px]"
            >
              {q}
            </button>
          ))}
        </div>
      )}

      {/* Input Bar */}
      <form onSubmit={handleSubmit} className="p-3 border-t border-slate-200 bg-white">
        <div className="flex items-center gap-2">
          <input
            ref={inputRef}
            id="chat-query-input"
            type="text"
            placeholder={`Ask a question about ${document.name}...`}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={loading}
            className="flex-1 rounded-lg border border-slate-300 px-3.5 py-2 text-xs md:text-sm placeholder-slate-400 focus:outline-hidden focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
          />
          <button
            type="submit"
            id="send-chat-query-button"
            disabled={!input.trim() || loading}
            className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 active:scale-95 disabled:opacity-40 shadow-xs transition-all shrink-0"
          >
            <Send className="h-4 w-4" />
          </button>
        </div>
      </form>
    </div>
  );
};
