import React, { useState } from "react";
import { DocumentItem } from "../types";
import { Sparkles, Copy, Check, Download, RefreshCw, FileText, CheckCircle2 } from "lucide-react";
import ReactMarkdown from "react-markdown";

interface SummaryTabProps {
  document: DocumentItem;
  onUpdateSummary: (docId: string, mode: "tldr" | "executive" | "detailed", content: string) => void;
}

export const SummaryTab: React.FC<SummaryTabProps> = ({
  document,
  onUpdateSummary,
}) => {
  const [mode, setMode] = useState<"executive" | "tldr" | "detailed">("executive");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const currentSummary = document.summary?.[mode];

  const handleGenerateSummary = async (targetMode = mode) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/documents/summarize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          document: {
            name: document.name,
            type: document.type,
            content: document.content,
          },
          mode: targetMode,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Failed to generate summary.");
      }

      onUpdateSummary(document.id, targetMode, data.summary);
    } catch (err: any) {
      setError(err.message || "An error occurred while generating the summary.");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (!currentSummary) return;
    navigator.clipboard.writeText(currentSummary);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    if (!currentSummary) return;
    const blob = new Blob([currentSummary], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = window.document.createElement("a");
    link.href = url;
    link.download = `${document.name.replace(/\.[^/.]+$/, "")}_Summary_${mode}.md`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div id="summary-tab-container" className="flex flex-col h-full space-y-4">
      {/* Controls Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 bg-white rounded-xl border border-slate-200 shadow-2xs">
        {/* Mode Selector */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-lg">
          <button
            id="summary-mode-executive"
            onClick={() => {
              setMode("executive");
              if (!document.summary?.executive) {
                handleGenerateSummary("executive");
              }
            }}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
              mode === "executive"
                ? "bg-white text-indigo-700 shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Executive Brief
          </button>
          <button
            id="summary-mode-tldr"
            onClick={() => {
              setMode("tldr");
              if (!document.summary?.tldr) {
                handleGenerateSummary("tldr");
              }
            }}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
              mode === "tldr"
                ? "bg-white text-indigo-700 shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Quick TL;DR
          </button>
          <button
            id="summary-mode-detailed"
            onClick={() => {
              setMode("detailed");
              if (!document.summary?.detailed) {
                handleGenerateSummary("detailed");
              }
            }}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
              mode === "detailed"
                ? "bg-white text-indigo-700 shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Deep Breakdown
          </button>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <button
            id="generate-summary-button"
            onClick={() => handleGenerateSummary(mode)}
            disabled={loading}
            className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 active:scale-98 disabled:opacity-50 rounded-lg shadow-xs transition-all"
          >
            {loading ? (
              <>
                <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                <span>Synthesizing...</span>
              </>
            ) : (
              <>
                <Sparkles className="h-3.5 w-3.5" />
                <span>{currentSummary ? "Regenerate" : "Generate Summary"}</span>
              </>
            )}
          </button>

          {currentSummary && (
            <>
              <button
                id="copy-summary-button"
                onClick={handleCopy}
                className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg transition-colors"
                title="Copy markdown to clipboard"
              >
                {copied ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
                <span>{copied ? "Copied" : "Copy"}</span>
              </button>
              <button
                id="download-summary-button"
                onClick={handleDownload}
                className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg transition-colors"
                title="Download as Markdown"
              >
                <Download className="h-3.5 w-3.5" />
                <span>Export</span>
              </button>
            </>
          )}
        </div>
      </div>

      {/* Error state */}
      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700">
          <p className="font-semibold">Unable to synthesize summary</p>
          <p className="mt-0.5">{error}</p>
        </div>
      )}

      {/* Summary Content Body */}
      <div className="flex-1 bg-white rounded-xl border border-slate-200 p-6 md:p-8 overflow-y-auto shadow-2xs">
        {loading ? (
          <div className="flex flex-col items-center justify-center h-64 space-y-4 text-center">
            <div className="relative flex items-center justify-center">
              <div className="h-12 w-12 rounded-full border-2 border-indigo-200 border-t-indigo-600 animate-spin" />
              <Sparkles className="absolute h-5 w-5 text-indigo-600 animate-pulse" />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-800">Reading and distilling document...</p>
              <p className="text-xs text-slate-500 mt-0.5">
                Gemini 3.8 Flash is extracting core pillars, key obligations, and conclusions.
              </p>
            </div>
          </div>
        ) : currentSummary ? (
          <div className="max-w-3xl mx-auto">
            <div className="flex items-center justify-between pb-4 mb-6 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                <span className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
                  {mode === "executive" ? "Executive Summary" : mode === "tldr" ? "High-Impact TL;DR" : "Comprehensive Section Breakdown"}
                </span>
              </div>
              <span className="text-[11px] text-slate-400 font-mono">
                {document.name}
              </span>
            </div>

            <div className="prose prose-slate max-w-none prose-headings:font-semibold prose-h1:text-xl prose-h2:text-lg prose-h3:text-base prose-p:text-sm prose-p:leading-relaxed prose-li:text-sm prose-table:text-xs">
              <ReactMarkdown>{currentSummary}</ReactMarkdown>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-64 text-center max-w-md mx-auto">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 mb-3 border border-indigo-100">
              <FileText className="h-6 w-6" />
            </div>
            <h3 className="text-sm font-semibold text-slate-800">No summary generated yet</h3>
            <p className="text-xs text-slate-500 mt-1 mb-4">
              Click the button below to have Gemini generate an objective, structured summary for this document.
            </p>
            <button
              id="empty-generate-summary-btn"
              onClick={() => handleGenerateSummary(mode)}
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs transition-colors"
            >
              <Sparkles className="h-3.5 w-3.5" />
              <span>Generate {mode === "executive" ? "Executive Brief" : mode === "tldr" ? "TL;DR" : "Breakdown"}</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
