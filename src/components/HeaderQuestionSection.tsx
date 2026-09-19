import React, { useState, useRef, useEffect } from "react";
import { DocumentItem } from "../types";
import {
  Sparkles,
  Search,
  Send,
  HelpCircle,
  ChevronDown,
  X,
  CornerDownLeft,
  Loader2,
} from "lucide-react";

interface HeaderQuestionSectionProps {
  currentDocument: DocumentItem;
  onAskQuestion: (question: string) => void;
  loading: boolean;
}

export const HeaderQuestionSection: React.FC<HeaderQuestionSectionProps> = ({
  currentDocument,
  onAskQuestion,
  loading,
}) => {
  const [query, setQuery] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [mobileExpanded, setMobileExpanded] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setShowDropdown(false);
      }
    };
    window.document.addEventListener("mousedown", handleClickOutside);
    return () => {
      window.document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleAsk = (questionText: string) => {
    const trimmed = questionText.trim();
    if (!trimmed || loading) return;
    onAskQuestion(trimmed);
    setQuery("");
    setShowDropdown(false);
    setMobileExpanded(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAsk(query);
    } else if (e.key === "Escape") {
      setShowDropdown(false);
      setMobileExpanded(false);
    }
  };

  const suggestions = currentDocument.suggestedQuestions || [
    "What are the primary obligations and responsibilities outlined?",
    "Are there any penalty clauses, warranties, or termination risks?",
    "What are the critical dates, milestones, or deadlines mentioned?",
    "Can you provide an executive summary with key metrics?",
  ];

  return (
    <div
      ref={containerRef}
      id="header-question-section"
      className={`relative ${
        mobileExpanded
          ? "fixed inset-x-0 top-0 h-16 z-50 bg-white px-4 flex items-center shadow-md border-b border-slate-200"
          : "flex-1 max-w-lg md:max-w-xl mx-2 md:mx-4"
      }`}
    >
      {/* Mobile collapsed toggle button */}
      <div className="md:hidden flex items-center">
        {!mobileExpanded && (
          <button
            id="mobile-header-question-toggle"
            onClick={() => {
              setMobileExpanded(true);
              setTimeout(() => inputRef.current?.focus(), 100);
            }}
            className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-lg transition-colors"
            title="Ask document question"
          >
            <Sparkles className="h-3.5 w-3.5 text-indigo-600" />
            <span>Ask AI</span>
          </button>
        )}
      </div>

      {/* Main question input form (visible on md+, or when mobileExpanded is true) */}
      <div
        className={`${
          mobileExpanded ? "flex w-full items-center gap-2" : "hidden md:flex items-center w-full"
        }`}
      >
        <div className="relative flex-1 flex items-center">
          <div className="absolute left-3 flex items-center pointer-events-none text-indigo-600">
            {loading ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <Sparkles className="h-3.5 w-3.5" />
            )}
          </div>

          <input
            ref={inputRef}
            id="header-question-input"
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setShowDropdown(true)}
            onKeyDown={handleKeyDown}
            placeholder={`Ask anything about ${currentDocument.name}...`}
            className="w-full pl-8 pr-20 py-1.5 text-xs font-normal bg-slate-50 hover:bg-white focus:bg-white text-slate-800 placeholder-slate-400 border border-slate-200 hover:border-slate-300 focus:border-indigo-500 rounded-lg shadow-2xs focus:outline-hidden focus:ring-2 focus:ring-indigo-100 transition-all"
            disabled={loading}
          />

          {/* Right action inside input: Quick Suggestions dropdown button + Send button */}
          <div className="absolute right-1.5 flex items-center gap-1">
            {query.trim() ? (
              <>
                <button
                  type="button"
                  id="clear-header-question-btn"
                  onClick={() => setQuery("")}
                  className="p-1 text-slate-400 hover:text-slate-600 rounded-md transition-colors"
                  title="Clear input"
                >
                  <X className="h-3 w-3" />
                </button>
                <button
                  type="button"
                  id="submit-header-question-btn"
                  onClick={() => handleAsk(query)}
                  disabled={loading}
                  className="flex items-center justify-center h-6 px-2 text-[11px] font-semibold text-white bg-indigo-600 hover:bg-indigo-700 active:scale-95 rounded-md shadow-2xs transition-all disabled:opacity-50"
                  title="Ask question (Enter)"
                >
                  {loading ? (
                    <Loader2 className="h-3 w-3 animate-spin" />
                  ) : (
                    <>
                      <span className="mr-1 hidden sm:inline">Ask</span>
                      <CornerDownLeft className="h-2.5 w-2.5" />
                    </>
                  )}
                </button>
              </>
            ) : (
              <button
                type="button"
                id="header-suggested-questions-toggle"
                onClick={() => setShowDropdown(!showDropdown)}
                className="flex items-center gap-1 px-1.5 py-0.5 text-[10px] font-medium text-slate-500 hover:text-indigo-600 bg-white hover:bg-indigo-50 border border-slate-200 rounded-md transition-colors"
                title="View suggested questions"
              >
                <HelpCircle className="h-3 w-3 text-indigo-500" />
                <span className="hidden lg:inline">Questions</span>
                <ChevronDown className="h-2.5 w-2.5 text-slate-400" />
              </button>
            )}
          </div>
        </div>

        {/* Mobile close button when expanded */}
        {mobileExpanded && (
          <button
            id="mobile-close-header-question"
            onClick={() => setMobileExpanded(false)}
            className="p-2 text-slate-500 hover:text-slate-800 rounded-lg"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      {/* Suggested Questions Dropdown Popover */}
      {showDropdown && (
        <div
          id="header-suggested-questions-dropdown"
          className="absolute left-0 right-0 top-full mt-1.5 bg-white border border-slate-200 rounded-xl shadow-lg z-50 overflow-hidden animate-in fade-in slide-in-from-top-1 duration-150"
        >
          <div className="p-2.5 bg-slate-50/80 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-600">
              <Sparkles className="h-3.5 w-3.5 text-indigo-600" />
              <span>Suggested Questions for {currentDocument.name}</span>
            </div>
            <span className="text-[10px] text-slate-400">Click to ask instantly</span>
          </div>

          <div className="max-h-60 overflow-y-auto p-1.5 space-y-1">
            {suggestions.map((q, idx) => (
              <button
                key={idx}
                id={`header-suggested-q-${idx}`}
                onClick={() => handleAsk(q)}
                className="w-full text-left flex items-start gap-2 p-2 rounded-lg hover:bg-indigo-50/70 text-slate-700 hover:text-indigo-950 transition-colors group cursor-pointer text-xs"
              >
                <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-slate-100 group-hover:bg-indigo-100 text-[10px] font-medium text-slate-600 group-hover:text-indigo-700 mt-0.5">
                  {idx + 1}
                </span>
                <span className="flex-1 leading-snug">{q}</span>
                <Send className="h-3 w-3 shrink-0 text-slate-300 group-hover:text-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity mt-0.5" />
              </button>
            ))}
          </div>

          <div className="p-2 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between text-[11px] text-slate-500">
            <span>Powered by Gemini 3.8 Flash</span>
            <span className="text-[10px] text-slate-400">Grounded in document text</span>
          </div>
        </div>
      )}
    </div>
  );
};
