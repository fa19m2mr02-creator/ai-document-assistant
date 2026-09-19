import React, { useState } from "react";
import { DocumentItem } from "../types";
import { Plus, FileText, Search, Trash2, Sparkles, Folder, Shield, DollarSign, BookOpen, Layers } from "lucide-react";

interface DocumentSidebarProps {
  documents: DocumentItem[];
  selectedDocId: string;
  onSelectDocument: (id: string) => void;
  onOpenUpload: () => void;
  onDeleteDocument: (id: string) => void;
}

export const DocumentSidebar: React.FC<DocumentSidebarProps> = ({
  documents,
  selectedDocId,
  onSelectDocument,
  onOpenUpload,
  onDeleteDocument,
}) => {
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("All");

  const categories = ["All", "Contract", "Financial", "Research", "Policy"];

  const filteredDocs = documents.filter((doc) => {
    const matchesSearch = doc.name.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = categoryFilter === "All" || doc.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const getCategoryIcon = (category: DocumentItem["category"]) => {
    switch (category) {
      case "Contract":
        return <Shield className="h-3 w-3 text-indigo-500" />;
      case "Financial":
        return <DollarSign className="h-3 w-3 text-emerald-500" />;
      case "Research":
        return <BookOpen className="h-3 w-3 text-violet-500" />;
      case "Policy":
        return <Layers className="h-3 w-3 text-amber-500" />;
      default:
        return <FileText className="h-3 w-3 text-slate-400" />;
    }
  };

  return (
    <aside
      id="document-sidebar"
      className="flex flex-col h-full w-80 shrink-0 bg-slate-50/70 border-r border-slate-200 select-none overflow-hidden"
    >
      {/* App Branding & Upload Action */}
      <div className="p-4 border-b border-slate-200/80 bg-white">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-xs">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-sm font-bold text-slate-900 leading-tight">AI Document Assistant</h1>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="flex h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[10px] font-medium text-slate-500">Gemini 3.8 Flash</span>
              </div>
            </div>
          </div>
        </div>

        <button
          id="sidebar-add-document-btn"
          onClick={onOpenUpload}
          className="w-full flex items-center justify-center gap-2 py-2 px-3 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 active:scale-98 rounded-lg shadow-xs transition-all cursor-pointer"
        >
          <Plus className="h-4 w-4" />
          <span>Add / Upload Document</span>
        </button>
      </div>

      {/* Filter and Search */}
      <div className="p-3 border-b border-slate-200/80 space-y-2.5 bg-slate-50">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-slate-400" />
          <input
            id="sidebar-search-docs"
            type="text"
            placeholder="Search documents..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 text-xs rounded-lg border border-slate-300/80 bg-white placeholder-slate-400 focus:outline-hidden focus:border-indigo-500 focus:ring-1 focus:ring-indigo-100"
          />
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1 overflow-x-auto pb-0.5 scrollbar-none text-[11px]">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`shrink-0 px-2 py-0.5 rounded-md font-medium transition-colors ${
                categoryFilter === cat
                  ? "bg-slate-800 text-white shadow-2xs"
                  : "bg-white text-slate-600 hover:text-slate-900 border border-slate-200/80"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Documents List */}
      <div id="documents-list-container" className="flex-1 overflow-y-auto p-2.5 space-y-1.5">
        <div className="flex items-center justify-between px-2 pt-1 pb-1 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
          <span>Documents ({filteredDocs.length})</span>
        </div>

        {filteredDocs.length === 0 ? (
          <div className="py-8 text-center px-4">
            <Folder className="h-8 w-8 mx-auto text-slate-300 mb-2" />
            <p className="text-xs font-medium text-slate-600">No documents found</p>
            <p className="text-[11px] text-slate-400 mt-0.5">Try a different search or upload a new file.</p>
          </div>
        ) : (
          filteredDocs.map((doc) => {
            const isSelected = doc.id === selectedDocId;
            return (
              <div
                key={doc.id}
                id={`doc-item-${doc.id}`}
                onClick={() => onSelectDocument(doc.id)}
                className={`group relative flex items-start gap-2.5 p-3 rounded-xl cursor-pointer border transition-all ${
                  isSelected
                    ? "bg-white border-indigo-500/40 shadow-xs ring-1 ring-indigo-500/10"
                    : "bg-white/70 hover:bg-white border-slate-200/80 hover:border-slate-300"
                }`}
              >
                <div
                  className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg mt-0.5 ${
                    isSelected ? "bg-indigo-50 text-indigo-600" : "bg-slate-100 text-slate-500"
                  }`}
                >
                  {getCategoryIcon(doc.category)}
                </div>

                <div className="flex-1 min-w-0 pr-6">
                  <h4
                    className={`text-xs font-semibold truncate leading-tight ${
                      isSelected ? "text-indigo-950" : "text-slate-800"
                    }`}
                    title={doc.name}
                  >
                    {doc.name}
                  </h4>
                  <div className="flex items-center gap-2 mt-1 text-[11px] text-slate-400">
                    <span>{doc.wordCount.toLocaleString()} wds</span>
                    <span>•</span>
                    <span className="uppercase text-[9px] font-mono font-semibold px-1 rounded bg-slate-100 text-slate-600">
                      {doc.type}
                    </span>
                    <span>•</span>
                    <span className="text-[10px] text-slate-500">{doc.category}</span>
                  </div>
                </div>

                {/* Delete doc button (hover) */}
                {documents.length > 1 && (
                  <button
                    id={`delete-doc-${doc.id}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteDocument(doc.id);
                    }}
                    className="absolute right-2.5 top-3 opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-all"
                    title="Delete document"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Sidebar Footer Info */}
      <div className="p-3 border-t border-slate-200 bg-white text-[11px] text-slate-500 flex items-center justify-between">
        <span>Ready for Q&A, Audit & Diffs</span>
        <span className="text-[10px] font-mono text-slate-400">v2.4</span>
      </div>
    </aside>
  );
};
