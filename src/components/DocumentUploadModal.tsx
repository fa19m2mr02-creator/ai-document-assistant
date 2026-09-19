import React, { useState, useRef } from "react";
import { DocumentItem } from "../types";
import { Upload, FileText, X, AlertCircle, Sparkles } from "lucide-react";

interface DocumentUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddDocument: (doc: DocumentItem) => void;
}

export const DocumentUploadModal: React.FC<DocumentUploadModalProps> = ({
  isOpen,
  onClose,
  onAddDocument,
}) => {
  const [activeTab, setActiveTab] = useState<"file" | "paste">("file");
  const [pasteTitle, setPasteTitle] = useState("");
  const [pasteContent, setPasteContent] = useState("");
  const [pasteCategory, setPasteCategory] = useState<DocumentItem["category"]>("General");
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const processFile = async (file: File) => {
    setError(null);
    const fileName = file.name;
    const extension = fileName.split(".").pop()?.toLowerCase() || "";
    const isPdf = extension === "pdf" || file.type === "application/pdf";

    try {
      if (isPdf) {
        // Read as data URL for PDF
        const reader = new FileReader();
        reader.onload = (e) => {
          const dataUrl = e.target?.result as string;
          // Approximate word count from file size or basic estimate
          const approxWords = Math.max(100, Math.round(file.size / 7));
          const newDoc: DocumentItem = {
            id: `doc-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
            name: fileName,
            type: "pdf",
            size: file.size,
            content: dataUrl,
            textContent: `[PDF Document: ${fileName}] (${Math.round(file.size / 1024)} KB) - Processed via native Gemini Multimodal Document Intelligence.`,
            wordCount: approxWords,
            charCount: file.size,
            createdAt: new Date().toISOString(),
            category: "General",
          };
          onAddDocument(newDoc);
          onClose();
        };
        reader.onerror = () => {
          setError("Failed to read the PDF file.");
        };
        reader.readAsDataURL(file);
      } else {
        // Read as plain text for txt, md, csv, json, etc.
        const reader = new FileReader();
        reader.onload = (e) => {
          const text = (e.target?.result as string) || "";
          const words = text.trim().split(/\s+/).filter(Boolean).length;
          const detectedType: DocumentItem["type"] =
            extension === "md"
              ? "markdown"
              : extension === "csv"
              ? "csv"
              : extension === "json"
              ? "json"
              : "text";

          let category: DocumentItem["category"] = "General";
          const lower = (fileName + " " + text).toLowerCase();
          if (lower.includes("agreement") || lower.includes("contract") || lower.includes("sla") || lower.includes("terms")) {
            category = "Contract";
          } else if (lower.includes("revenue") || lower.includes("financial") || lower.includes("earning") || lower.includes("balance sheet")) {
            category = "Financial";
          } else if (lower.includes("study") || lower.includes("clinical") || lower.includes("research") || lower.includes("experiment")) {
            category = "Research";
          } else if (lower.includes("policy") || lower.includes("handbook") || lower.includes("compliance") || lower.includes("security")) {
            category = "Policy";
          }

          const newDoc: DocumentItem = {
            id: `doc-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
            name: fileName,
            type: detectedType,
            size: file.size,
            content: text,
            textContent: text,
            wordCount: words,
            charCount: text.length,
            createdAt: new Date().toISOString(),
            category,
          };
          onAddDocument(newDoc);
          onClose();
        };
        reader.onerror = () => {
          setError("Failed to read text file.");
        };
        reader.readAsText(file);
      }
    } catch (err: any) {
      setError(err.message || "Unable to parse selected file.");
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFile(e.target.files[0]);
    }
  };

  const handlePasteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pasteTitle.trim() || !pasteContent.trim()) {
      setError("Please provide both a document title and text content.");
      return;
    }
    const words = pasteContent.trim().split(/\s+/).filter(Boolean).length;
    const newDoc: DocumentItem = {
      id: `doc-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      name: pasteTitle.trim().endsWith(".txt") || pasteTitle.trim().endsWith(".md")
        ? pasteTitle.trim()
        : `${pasteTitle.trim()}.txt`,
      type: "text",
      size: new Blob([pasteContent]).size,
      content: pasteContent,
      textContent: pasteContent,
      wordCount: words,
      charCount: pasteContent.length,
      createdAt: new Date().toISOString(),
      category: pasteCategory,
    };
    onAddDocument(newDoc);
    onClose();
  };

  return (
    <div
      id="upload-modal-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4"
    >
      <div
        id="upload-modal-card"
        className="w-full max-w-xl rounded-2xl bg-white border border-slate-200 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200"
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/70">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 border border-indigo-100">
              <Upload className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-slate-900">Add Document</h2>
              <p className="text-xs text-slate-500">Upload a PDF, TXT, Markdown, CSV file or paste text</p>
            </div>
          </div>
          <button
            id="close-upload-modal-button"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Tab Toggle */}
        <div className="flex border-b border-slate-200 px-6 pt-3 bg-white">
          <button
            id="tab-upload-file-button"
            onClick={() => setActiveTab("file")}
            className={`pb-3 px-4 text-xs font-semibold border-b-2 transition-colors ${
              activeTab === "file"
                ? "border-indigo-600 text-indigo-600"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            Upload File (PDF, TXT, MD, CSV)
          </button>
          <button
            id="tab-paste-text-button"
            onClick={() => setActiveTab("paste")}
            className={`pb-3 px-4 text-xs font-semibold border-b-2 transition-colors ${
              activeTab === "paste"
                ? "border-indigo-600 text-indigo-600"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            Paste Text Content
          </button>
        </div>

        {/* Error notification */}
        {error && (
          <div className="mx-6 mt-4 flex items-center gap-2 rounded-lg bg-rose-50 border border-rose-200 p-3 text-xs text-rose-700">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <div className="p-6">
          {activeTab === "file" ? (
            <div>
              <div
                id="file-dropzone"
                onDragOver={(e) => {
                  e.preventDefault();
                  setDragOver(true);
                }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`flex flex-col items-center justify-center rounded-xl border-2 border-dashed p-8 text-center cursor-pointer transition-all ${
                  dragOver
                    ? "border-indigo-500 bg-indigo-50/50 scale-[0.99]"
                    : "border-slate-300 hover:border-indigo-400 hover:bg-slate-50/70"
                }`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  id="document-file-input"
                  className="hidden"
                  accept=".pdf,.txt,.md,.markdown,.csv,.json,.rtf"
                  onChange={handleFileChange}
                />
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-indigo-50 text-indigo-600 mb-3 border border-indigo-100 shadow-xs">
                  <FileText className="h-6 w-6" />
                </div>
                <p className="text-sm font-medium text-slate-800">
                  Drag and drop your document here, or <span className="text-indigo-600 hover:underline">browse files</span>
                </p>
                <p className="mt-1 text-xs text-slate-500">
                  Supports PDF, TXT, Markdown, CSV, and JSON (up to 20MB)
                </p>

                <div className="mt-4 flex flex-wrap justify-center gap-2">
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-slate-100 text-slate-600">
                    PDF (Native Multimodal)
                  </span>
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-slate-100 text-slate-600">
                    Agreements & Contracts
                  </span>
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-slate-100 text-slate-600">
                    Financial Reports
                  </span>
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-slate-100 text-slate-600">
                    Research Papers
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <form onSubmit={handlePasteSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Document Title</label>
                <input
                  id="paste-document-title"
                  type="text"
                  placeholder="e.g. Master Service Agreement v2.0"
                  value={pasteTitle}
                  onChange={(e) => setPasteTitle(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-800 placeholder-slate-400 focus:border-indigo-500 focus:outline-hidden focus:ring-2 focus:ring-indigo-100"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Category</label>
                  <select
                    id="paste-document-category"
                    value={pasteCategory}
                    onChange={(e) => setPasteCategory(e.target.value as any)}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-800 focus:border-indigo-500 focus:outline-hidden focus:ring-2 focus:ring-indigo-100 bg-white"
                  >
                    <option value="General">General</option>
                    <option value="Contract">Contract / SLA</option>
                    <option value="Financial">Financial / Earnings</option>
                    <option value="Research">Research / Academic</option>
                    <option value="Policy">Policy / Compliance</option>
                  </select>
                </div>
                <div className="flex items-end pb-1 text-xs text-slate-500">
                  <Sparkles className="h-3.5 w-3.5 mr-1 text-indigo-500" />
                  Gemini will auto-generate initial questions
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Content</label>
                <textarea
                  id="paste-document-content"
                  rows={7}
                  placeholder="Paste the full text of your document, memo, clause, or policy here..."
                  value={pasteContent}
                  onChange={(e) => setPasteContent(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 p-3 text-sm font-mono text-slate-800 placeholder-slate-400 focus:border-indigo-500 focus:outline-hidden focus:ring-2 focus:ring-indigo-100 resize-none"
                  required
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  id="cancel-paste-button"
                  onClick={onClose}
                  className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  id="submit-paste-button"
                  className="px-5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs transition-colors"
                >
                  Create Document
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
