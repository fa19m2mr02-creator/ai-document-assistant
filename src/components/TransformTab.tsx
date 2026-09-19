import React, { useState } from "react";
import { DocumentItem } from "../types";
import { Wand2, Copy, Check, Download, RefreshCw, Globe, HelpCircle, Table2, AlignLeft } from "lucide-react";
import ReactMarkdown from "react-markdown";

interface TransformTabProps {
  document: DocumentItem;
}

export const TransformTab: React.FC<TransformTabProps> = ({ document }) => {
  const [action, setAction] = useState<"rewrite" | "translate" | "faq" | "extract_table">("rewrite");
  const [option, setOption] = useState("Executive Brief");
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const rewriteOptions = [
    { label: "Executive Brief", desc: "Concise, high-level, action-oriented" },
    { label: "Plain English (ELI5)", desc: "Simple language without technical jargon" },
    { label: "Technical Specification", desc: "Rigorous, system-oriented terminology" },
    { label: "Formal Legal Tone", desc: "Rigorous contractual language" },
    { label: "Internal Team Memo", desc: "Collaborative, practical team briefing" },
  ];

  const translationOptions = [
    "Spanish (Español)",
    "French (Français)",
    "German (Deutsch)",
    "Japanese (日本語)",
    "Mandarin Chinese (中文)",
    "Portuguese (Português)",
    "Italian (Italiano)",
    "Arabic (العربية)",
    "Hindi (हिन्दी)",
    "Korean (한국어)",
  ];

  const handleTransform = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/documents/transform", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          document: {
            name: document.name,
            type: document.type,
            content: document.content,
          },
          action,
          option,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Failed to transform document.");
      }

      setResult(data.result);
    } catch (err: any) {
      setError(err.message || "Failed to complete transformation.");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (!result) return;
    navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    if (!result) return;
    const blob = new Blob([result], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = window.document.createElement("a");
    link.href = url;
    link.download = `${document.name.replace(/\.[^/.]+$/, "")}_${action}.md`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div id="transform-tab-container" className="flex flex-col h-full space-y-4">
      {/* Configuration Bar */}
      <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-2xs space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          {/* Action Tabs */}
          <div className="flex flex-wrap items-center gap-1.5 p-1 bg-slate-100 rounded-lg">
            <button
              id="transform-action-rewrite"
              onClick={() => {
                setAction("rewrite");
                setOption("Executive Brief");
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
                action === "rewrite"
                  ? "bg-white text-indigo-700 shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <AlignLeft className="h-3.5 w-3.5" />
              <span>Rewrite & Restyle</span>
            </button>
            <button
              id="transform-action-translate"
              onClick={() => {
                setAction("translate");
                setOption("Spanish (Español)");
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
                action === "translate"
                  ? "bg-white text-indigo-700 shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <Globe className="h-3.5 w-3.5" />
              <span>Translate</span>
            </button>
            <button
              id="transform-action-faq"
              onClick={() => {
                setAction("faq");
                setOption("");
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
                action === "faq"
                  ? "bg-white text-indigo-700 shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <HelpCircle className="h-3.5 w-3.5" />
              <span>Generate FAQ</span>
            </button>
            <button
              id="transform-action-extract"
              onClick={() => {
                setAction("extract_table");
                setOption("");
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
                action === "extract_table"
                  ? "bg-white text-indigo-700 shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <Table2 className="h-3.5 w-3.5" />
              <span>Extract Structured Tables</span>
            </button>
          </div>

          <button
            id="execute-transform-button"
            onClick={handleTransform}
            disabled={loading}
            className="flex items-center gap-1.5 px-4 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 active:scale-98 disabled:opacity-50 rounded-lg shadow-xs transition-all"
          >
            {loading ? (
              <>
                <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                <span>Transforming...</span>
              </>
            ) : (
              <>
                <Wand2 className="h-3.5 w-3.5" />
                <span>Transform Document</span>
              </>
            )}
          </button>
        </div>

        {/* Action Options Secondary Bar */}
        {action === "rewrite" && (
          <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-slate-100">
            <span className="text-[11px] font-semibold text-slate-500 mr-1">Target Tone:</span>
            {rewriteOptions.map((opt) => (
              <button
                key={opt.label}
                onClick={() => setOption(opt.label)}
                className={`px-2.5 py-1 text-xs rounded-md border transition-all ${
                  option === opt.label
                    ? "border-indigo-500 bg-indigo-50 text-indigo-700 font-semibold"
                    : "border-slate-200 bg-slate-50 text-slate-600 hover:border-slate-300"
                }`}
                title={opt.desc}
              >
                {opt.label}
              </button>
            ))}
          </div>
        )}

        {action === "translate" && (
          <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-slate-100">
            <span className="text-[11px] font-semibold text-slate-500 mr-1">Target Language:</span>
            <select
              value={option}
              onChange={(e) => setOption(e.target.value)}
              className="text-xs rounded-md border border-slate-300 bg-white px-3 py-1 text-slate-800 focus:outline-hidden focus:border-indigo-500"
            >
              {translationOptions.map((lang) => (
                <option key={lang} value={lang}>
                  {lang}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Error state */}
      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700">
          <p className="font-semibold">Transformation Failed</p>
          <p className="mt-0.5">{error}</p>
        </div>
      )}

      {/* Result Container */}
      <div className="flex-1 bg-white rounded-xl border border-slate-200 p-6 md:p-8 overflow-y-auto shadow-2xs">
        {loading ? (
          <div className="flex flex-col items-center justify-center h-64 space-y-4 text-center">
            <div className="relative flex items-center justify-center">
              <div className="h-12 w-12 rounded-full border-2 border-indigo-200 border-t-indigo-600 animate-spin" />
              <Wand2 className="absolute h-5 w-5 text-indigo-600 animate-pulse" />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-800">Processing transformation...</p>
              <p className="text-xs text-slate-500 mt-0.5">
                Gemini is re-articulating the document according to your specified parameters.
              </p>
            </div>
          </div>
        ) : result ? (
          <div className="max-w-3xl mx-auto space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-700">
                  {action === "rewrite"
                    ? `Rewritten: ${option}`
                    : action === "translate"
                    ? `Translation: ${option}`
                    : action === "faq"
                    ? "Generated FAQs"
                    : "Extracted Tables & Metrics"}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  id="copy-transform-button"
                  onClick={handleCopy}
                  className="flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg transition-colors"
                >
                  {copied ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
                  <span>{copied ? "Copied" : "Copy"}</span>
                </button>
                <button
                  id="download-transform-button"
                  onClick={handleDownload}
                  className="flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg transition-colors"
                >
                  <Download className="h-3.5 w-3.5" />
                  <span>Export</span>
                </button>
              </div>
            </div>

            <div className="prose prose-slate max-w-none prose-headings:font-semibold prose-h1:text-xl prose-h2:text-lg prose-h3:text-base prose-p:text-xs md:prose-p:text-sm prose-p:leading-relaxed prose-li:text-xs md:prose-li:text-sm prose-table:text-xs">
              <ReactMarkdown>{result}</ReactMarkdown>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-64 text-center max-w-md mx-auto">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 mb-3 border border-indigo-100">
              <Wand2 className="h-6 w-6" />
            </div>
            <h3 className="text-sm font-semibold text-slate-800">Select a transformation above</h3>
            <p className="text-xs text-slate-500 mt-1 mb-4">
              Rewrite the document into executive summaries, translate into 10+ languages, auto-generate Q&A FAQs, or extract data tables with one click.
            </p>
            <button
              id="empty-transform-btn"
              onClick={handleTransform}
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs transition-colors"
            >
              <Wand2 className="h-3.5 w-3.5" />
              <span>Run Transformation</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
