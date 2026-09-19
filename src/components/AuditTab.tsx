import React, { useState } from "react";
import { DocumentItem } from "../types";
import { ShieldAlert, Sparkles, Download, Copy, Check, RefreshCw, AlertTriangle, CheckCircle } from "lucide-react";
import ReactMarkdown from "react-markdown";

interface AuditTabProps {
  document: DocumentItem;
  onUpdateAudit: (docId: string, auditReport: string) => void;
}

export const AuditTab: React.FC<AuditTabProps> = ({
  document,
  onUpdateAudit,
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const report = document.auditReport;

  const handleRunAudit = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/documents/audit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          document: {
            name: document.name,
            type: document.type,
            content: document.content,
          },
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Failed to audit document.");
      }

      onUpdateAudit(document.id, data.audit);
    } catch (err: any) {
      setError(err.message || "Failed to complete risk & compliance audit.");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (!report) return;
    navigator.clipboard.writeText(report);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    if (!report) return;
    const blob = new Blob([report], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = window.document.createElement("a");
    link.href = url;
    link.download = `${document.name.replace(/\.[^/.]+$/, "")}_Risk_Audit.md`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div id="audit-tab-container" className="flex flex-col h-full space-y-4">
      {/* Action Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 bg-white rounded-xl border border-slate-200 shadow-2xs">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-50 text-amber-600 border border-amber-200">
            <ShieldAlert className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-xs font-semibold text-slate-800">Risk, Obligation & Compliance Audit</h3>
            <p className="text-[11px] text-slate-500">
              Scans for liabilities, deadlines, missing clauses, and exposure
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            id="run-audit-button"
            onClick={handleRunAudit}
            disabled={loading}
            className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 active:scale-98 disabled:opacity-50 rounded-lg shadow-xs transition-all"
          >
            {loading ? (
              <>
                <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                <span>Auditing Clauses...</span>
              </>
            ) : (
              <>
                <Sparkles className="h-3.5 w-3.5 text-amber-400" />
                <span>{report ? "Re-Audit Document" : "Run Full Audit"}</span>
              </>
            )}
          </button>

          {report && (
            <>
              <button
                id="copy-audit-button"
                onClick={handleCopy}
                className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg transition-colors"
                title="Copy audit report"
              >
                {copied ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
                <span>{copied ? "Copied" : "Copy"}</span>
              </button>
              <button
                id="download-audit-button"
                onClick={handleDownload}
                className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg transition-colors"
                title="Export as Markdown"
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
          <p className="font-semibold">Audit Execution Failed</p>
          <p className="mt-0.5">{error}</p>
        </div>
      )}

      {/* Audit Report Canvas */}
      <div className="flex-1 bg-white rounded-xl border border-slate-200 p-6 md:p-8 overflow-y-auto shadow-2xs">
        {loading ? (
          <div className="flex flex-col items-center justify-center h-64 space-y-4 text-center">
            <div className="relative flex items-center justify-center">
              <div className="h-12 w-12 rounded-full border-2 border-amber-200 border-t-amber-600 animate-spin" />
              <ShieldAlert className="absolute h-5 w-5 text-amber-600 animate-pulse" />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-800">Auditing clauses and liabilities...</p>
              <p className="text-xs text-slate-500 mt-0.5">
                Scanning for indemnity caps, termination penalties, SLA risks, and operational deadlines.
              </p>
            </div>
          </div>
        ) : report ? (
          <div className="max-w-3xl mx-auto space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <span className="flex h-2 w-2 rounded-full bg-emerald-500" />
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-700">
                  Audit Findings & Obligations
                </span>
              </div>
              <span className="text-[11px] font-mono text-slate-400">{document.name}</span>
            </div>

            <div className="prose prose-slate max-w-none prose-headings:font-semibold prose-h1:text-xl prose-h2:text-lg prose-h3:text-base prose-p:text-xs md:prose-p:text-sm prose-p:leading-relaxed prose-li:text-xs md:prose-li:text-sm prose-table:text-xs">
              <ReactMarkdown>{report}</ReactMarkdown>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-64 text-center max-w-md mx-auto">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-50 text-amber-600 mb-3 border border-amber-100">
              <AlertTriangle className="h-6 w-6" />
            </div>
            <h3 className="text-sm font-semibold text-slate-800">No audit has been run yet</h3>
            <p className="text-xs text-slate-500 mt-1 mb-4">
              Audit this document to automatically detect high/medium/low severity risks, notice deadlines, indemnification caps, and ambiguous provisions.
            </p>
            <button
              id="empty-audit-btn"
              onClick={handleRunAudit}
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg shadow-xs transition-colors"
            >
              <ShieldAlert className="h-3.5 w-3.5 text-amber-400" />
              <span>Run Risk & Obligation Audit</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
