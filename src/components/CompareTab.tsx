import React, { useState } from "react";
import { DocumentItem } from "../types";
import { SplitSquareVertical, ArrowRightLeft, Sparkles, RefreshCw, Copy, Check, Download, AlertCircle } from "lucide-react";
import ReactMarkdown from "react-markdown";

interface CompareTabProps {
  currentDocument: DocumentItem;
  allDocuments: DocumentItem[];
}

export const CompareTab: React.FC<CompareTabProps> = ({
  currentDocument,
  allDocuments,
}) => {
  const [docAId, setDocAId] = useState(currentDocument.id);
  const otherDocs = allDocuments.filter((d) => d.id !== currentDocument.id);
  const [docBId, setDocBId] = useState(otherDocs[0]?.id || "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [comparisonResult, setComparisonResult] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const docA = allDocuments.find((d) => d.id === docAId) || currentDocument;
  const docB = allDocuments.find((d) => d.id === docBId);

  const handleRunCompare = async () => {
    if (!docA || !docB) {
      setError("Please select two documents to compare.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/documents/compare", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          docA: {
            name: docA.name,
            type: docA.type,
            content: docA.content,
          },
          docB: {
            name: docB.name,
            type: docB.type,
            content: docB.content,
          },
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Failed to compare documents.");
      }

      setComparisonResult(data.comparison);
    } catch (err: any) {
      setError(err.message || "Failed to compare documents.");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (!comparisonResult) return;
    navigator.clipboard.writeText(comparisonResult);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    if (!comparisonResult || !docA || !docB) return;
    const blob = new Blob([comparisonResult], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `Comparison_${docA.name.slice(0, 10)}_vs_${docB.name.slice(0, 10)}.md`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div id="compare-tab-container" className="flex flex-col h-full space-y-4">
      {/* Document Selector Header */}
      <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-2xs space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 items-center">
          {/* Doc A */}
          <div className="p-3 rounded-lg border border-slate-200 bg-slate-50/70">
            <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
              Document A (Baseline)
            </label>
            <select
              id="compare-doc-a-select"
              value={docAId}
              onChange={(e) => setDocAId(e.target.value)}
              className="w-full text-xs font-medium text-slate-800 bg-white border border-slate-300 rounded-md p-1.5 focus:outline-hidden focus:border-indigo-500"
            >
              {allDocuments.map((doc) => (
                <option key={doc.id} value={doc.id}>
                  {doc.name} ({doc.wordCount.toLocaleString()} words)
                </option>
              ))}
            </select>
          </div>

          {/* Doc B */}
          <div className="p-3 rounded-lg border border-slate-200 bg-slate-50/70">
            <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
              Document B (Comparison Target)
            </label>
            <select
              id="compare-doc-b-select"
              value={docBId}
              onChange={(e) => setDocBId(e.target.value)}
              className="w-full text-xs font-medium text-slate-800 bg-white border border-slate-300 rounded-md p-1.5 focus:outline-hidden focus:border-indigo-500"
            >
              {allDocuments.map((doc) => (
                <option key={doc.id} value={doc.id} disabled={doc.id === docAId}>
                  {doc.name} ({doc.wordCount.toLocaleString()} words) {doc.id === docAId ? "(Already selected)" : ""}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex items-center justify-between pt-1 border-t border-slate-100">
          <p className="text-xs text-slate-500">
            Analyzes clause deviations, added commitments, metric differences, and risk balance.
          </p>

          <div className="flex items-center gap-2">
            <button
              id="run-compare-button"
              onClick={handleRunCompare}
              disabled={loading || !docB || docAId === docBId}
              className="flex items-center gap-1.5 px-4 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 active:scale-98 disabled:opacity-50 rounded-lg shadow-xs transition-all"
            >
              {loading ? (
                <>
                  <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                  <span>Comparing Documents...</span>
                </>
              ) : (
                <>
                  <ArrowRightLeft className="h-3.5 w-3.5" />
                  <span>Run Comparative Analysis</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {error && (
        <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-center gap-2">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Result Card */}
      <div className="flex-1 bg-white rounded-xl border border-slate-200 p-6 md:p-8 overflow-y-auto shadow-2xs">
        {loading ? (
          <div className="flex flex-col items-center justify-center h-64 space-y-4 text-center">
            <div className="relative flex items-center justify-center">
              <div className="h-12 w-12 rounded-full border-2 border-indigo-200 border-t-indigo-600 animate-spin" />
              <ArrowRightLeft className="absolute h-5 w-5 text-indigo-600 animate-pulse" />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-800">Aligning and comparing both documents...</p>
              <p className="text-xs text-slate-500 mt-0.5">
                Gemini is cross-referencing provisions, discrepancies, and balance of terms.
              </p>
            </div>
          </div>
        ) : comparisonResult ? (
          <div className="max-w-3xl mx-auto space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <SplitSquareVertical className="h-4 w-4 text-indigo-600" />
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-700">
                  Comparative Analysis: {docA?.name} vs {docB?.name}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  id="copy-compare-button"
                  onClick={handleCopy}
                  className="flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg transition-colors"
                >
                  {copied ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
                  <span>{copied ? "Copied" : "Copy"}</span>
                </button>
                <button
                  id="download-compare-button"
                  onClick={handleDownload}
                  className="flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg transition-colors"
                >
                  <Download className="h-3.5 w-3.5" />
                  <span>Export</span>
                </button>
              </div>
            </div>

            <div className="prose prose-slate max-w-none prose-headings:font-semibold prose-h1:text-xl prose-h2:text-lg prose-h3:text-base prose-p:text-xs md:prose-p:text-sm prose-p:leading-relaxed prose-li:text-xs md:prose-li:text-sm prose-table:text-xs">
              <ReactMarkdown>{comparisonResult}</ReactMarkdown>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-64 text-center max-w-md mx-auto">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 mb-3 border border-indigo-100">
              <SplitSquareVertical className="h-6 w-6" />
            </div>
            <h3 className="text-sm font-semibold text-slate-800">Side-by-Side Comparison</h3>
            <p className="text-xs text-slate-500 mt-1 mb-4">
              Select any two documents from your library to examine clause deltas, policy divergence, and risk differences.
            </p>
            <button
              id="empty-compare-btn"
              onClick={handleRunCompare}
              disabled={!docB || docAId === docBId}
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 rounded-lg shadow-xs transition-colors"
            >
              <ArrowRightLeft className="h-3.5 w-3.5" />
              <span>Compare Selected Documents</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
