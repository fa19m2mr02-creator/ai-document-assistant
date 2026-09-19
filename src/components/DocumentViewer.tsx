import React, { useState } from "react";
import { DocumentItem } from "../types";
import { Search, Copy, Check, FileText, Info, HelpCircle } from "lucide-react";
import ReactMarkdown from "react-markdown";

interface DocumentViewerProps {
  document: DocumentItem;
  onAskAboutSelection: (selectedText: string) => void;
}

export const DocumentViewer: React.FC<DocumentViewerProps> = ({
  document,
  onAskAboutSelection,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [copied, setCopied] = useState(false);
  const [selectedText, setSelectedText] = useState("");
  const [selectionPos, setSelectionPos] = useState<{ x: number; y: number } | null>(null);

  const handleCopy = () => {
    navigator.clipboard.writeText(document.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleMouseUp = () => {
    const selection = window.getSelection();
    if (selection && selection.toString().trim().length > 5) {
      const text = selection.toString().trim();
      setSelectedText(text);
      const range = selection.getRangeAt(0);
      const rect = range.getBoundingClientRect();
      setSelectionPos({
        x: Math.min(window.innerWidth - 220, Math.max(20, rect.left + rect.width / 2 - 100)),
        y: Math.max(10, rect.top - 42),
      });
    } else {
      setSelectedText("");
      setSelectionPos(null);
    }
  };

  const isPdf = document.type === "pdf";

  return (
    <div id="document-viewer-container" className="flex flex-col h-full bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
      {/* Viewer Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-3 border-b border-slate-200 bg-slate-50/80">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
            <FileText className="h-4 w-4 text-indigo-600" />
            <span className="truncate max-w-[240px]" title={document.name}>{document.name}</span>
          </div>
          <span className="hidden sm:inline-block h-4 w-px bg-slate-300" />
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <span>{document.wordCount.toLocaleString()} words</span>
            <span>•</span>
            <span>~{Math.max(1, Math.ceil(document.wordCount / 220))} min read</span>
            <span>•</span>
            <span className="uppercase text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-200/70 text-slate-700">
              {document.type}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* In-doc Search */}
          {!isPdf && (
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-slate-400" />
              <input
                id="viewer-search-input"
                type="text"
                placeholder="Find in document..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-44 pl-8 pr-3 py-1.5 text-xs rounded-lg border border-slate-300 bg-white placeholder-slate-400 focus:outline-hidden focus:border-indigo-500 focus:ring-1 focus:ring-indigo-100"
              />
            </div>
          )}

          <button
            id="copy-document-content-button"
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 hover:text-slate-900 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 shadow-2xs transition-colors"
          >
            {copied ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
            <span>{copied ? "Copied" : "Copy"}</span>
          </button>
        </div>
      </div>

      {/* Floating Action Button for Selected Text */}
      {selectedText && selectionPos && (
        <div
          style={{ position: "fixed", left: selectionPos.x, top: selectionPos.y, zIndex: 100 }}
          className="animate-in fade-in zoom-in-95 duration-150"
        >
          <button
            id="ask-ai-selection-button"
            onClick={() => {
              onAskAboutSelection(selectedText);
              setSelectedText("");
              setSelectionPos(null);
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-medium shadow-lg hover:shadow-indigo-500/20 transition-all border border-indigo-400"
          >
            <HelpCircle className="h-3.5 w-3.5" />
            <span>Ask Assistant about this</span>
          </button>
        </div>
      )}

      {/* Document Content Body */}
      <div
        id="viewer-content-body"
        onMouseUp={handleMouseUp}
        className="flex-1 overflow-y-auto p-6 md:p-8 text-slate-800 leading-relaxed font-sans select-text"
      >
        {isPdf ? (
          <div className="flex flex-col items-center justify-center py-12 px-4 text-center max-w-md mx-auto">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 mb-4 border border-indigo-100 shadow-xs">
              <FileText className="h-8 w-8" />
            </div>
            <h3 className="text-base font-semibold text-slate-900">{document.name}</h3>
            <p className="mt-1 text-xs text-slate-500">
              PDF file loaded into Gemini Multimodal Context ({Math.round(document.size / 1024)} KB).
            </p>
            <div className="mt-4 rounded-xl bg-slate-50 border border-slate-200 p-4 text-left text-xs text-slate-600 space-y-2">
              <div className="flex items-center gap-2 text-indigo-700 font-medium">
                <Info className="h-4 w-4 shrink-0" />
                <span>Multimodal PDF Readiness</span>
              </div>
              <p>
                This PDF is fully mounted to the backend Gemini 3.8 Flash model. You can run Executive Summaries, interactive Q&A, Clause Audits, and Transformations in the adjacent tabs without needing OCR.
              </p>
            </div>
          </div>
        ) : (
          <div className="max-w-3xl mx-auto space-y-4">
            {searchTerm ? (
              <div className="font-mono text-sm whitespace-pre-wrap bg-slate-50 p-6 rounded-xl border border-slate-200">
                {document.content.split(new RegExp(`(${searchTerm})`, "gi")).map((part, i) =>
                  part.toLowerCase() === searchTerm.toLowerCase() ? (
                    <mark key={i} className="bg-amber-200 text-amber-900 px-0.5 rounded font-semibold">
                      {part}
                    </mark>
                  ) : (
                    <span key={i}>{part}</span>
                  )
                )}
              </div>
            ) : document.type === "markdown" ? (
              <div className="prose prose-slate max-w-none prose-headings:font-semibold prose-h1:text-xl prose-h2:text-lg prose-h3:text-base prose-p:text-sm prose-p:leading-relaxed prose-li:text-sm prose-table:text-xs">
                <ReactMarkdown>{document.content}</ReactMarkdown>
              </div>
            ) : (
              <div className="font-mono text-xs md:text-sm leading-relaxed whitespace-pre-wrap text-slate-800 bg-slate-50/50 p-6 rounded-xl border border-slate-200">
                {document.content}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Footer hint */}
      <div className="px-5 py-2.5 border-t border-slate-100 bg-slate-50/60 text-[11px] text-slate-500 flex items-center justify-between">
        <span>Tip: Highlight any sentence or paragraph to ask the AI assistant directly</span>
        <span className="font-mono text-[10px] text-slate-400">Gemini 3.8 Flash Active</span>
      </div>
    </div>
  );
};
