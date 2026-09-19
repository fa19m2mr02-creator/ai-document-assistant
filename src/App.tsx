import React, { useState, useEffect } from "react";
import { DocumentItem, AssistantTab, ChatMessage } from "./types";
import { SAMPLE_DOCUMENTS } from "./data/sampleDocuments";
import { DocumentSidebar } from "./components/DocumentSidebar";
import { DocumentUploadModal } from "./components/DocumentUploadModal";
import { SummaryTab } from "./components/SummaryTab";
import { ChatTab } from "./components/ChatTab";
import { AuditTab } from "./components/AuditTab";
import { TransformTab } from "./components/TransformTab";
import { CompareTab } from "./components/CompareTab";
import { DocumentViewer } from "./components/DocumentViewer";
import { HeaderQuestionSection } from "./components/HeaderQuestionSection";
import {
  FileText,
  Sparkles,
  MessageSquare,
  ShieldAlert,
  Wand2,
  SplitSquareVertical,
  Menu,
  X,
  Plus,
  ExternalLink,
} from "lucide-react";

export default function App() {
  const [documents, setDocuments] = useState<DocumentItem[]>(() => {
    const saved = localStorage.getItem("ai_doc_assistant_docs");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Error loading documents from storage:", e);
      }
    }
    return SAMPLE_DOCUMENTS;
  });

  const [selectedDocId, setSelectedDocId] = useState<string>(
    documents[0]?.id || SAMPLE_DOCUMENTS[0].id
  );

  const [activeTab, setActiveTab] = useState<AssistantTab>("summary");
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Chat message map: docId -> ChatMessage[]
  const [chatHistoryMap, setChatHistoryMap] = useState<Record<string, ChatMessage[]>>({});
  const [chatLoading, setChatLoading] = useState(false);

  // Sync documents to localStorage
  useEffect(() => {
    try {
      localStorage.setItem("ai_doc_assistant_docs", JSON.stringify(documents));
    } catch (e) {
      // Catch quota exceeded if user stored huge files
      console.warn("Storage quota warning:", e);
    }
  }, [documents]);

  const currentDoc = documents.find((d) => d.id === selectedDocId) || documents[0] || SAMPLE_DOCUMENTS[0];

  // Fetch suggested questions for new documents if missing
  useEffect(() => {
    if (currentDoc && (!currentDoc.suggestedQuestions || currentDoc.suggestedQuestions.length === 0)) {
      fetch("/api/documents/suggest-questions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          document: {
            name: currentDoc.name,
            type: currentDoc.type,
            content: currentDoc.content,
          },
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.questions) {
            setDocuments((prev) =>
              prev.map((d) =>
                d.id === currentDoc.id ? { ...d, suggestedQuestions: data.questions } : d
              )
            );
          }
        })
        .catch((err) => console.error("Error fetching suggested questions:", err));
    }
  }, [currentDoc?.id]);

  const handleAddDocument = (newDoc: DocumentItem) => {
    setDocuments((prev) => [newDoc, ...prev]);
    setSelectedDocId(newDoc.id);
    setActiveTab("summary");
  };

  const handleDeleteDocument = (id: string) => {
    if (documents.length <= 1) return;
    const remaining = documents.filter((d) => d.id !== id);
    setDocuments(remaining);
    if (selectedDocId === id) {
      setSelectedDocId(remaining[0].id);
    }
  };

  const handleUpdateSummary = (
    docId: string,
    mode: "tldr" | "executive" | "detailed",
    content: string
  ) => {
    setDocuments((prev) =>
      prev.map((d) => {
        if (d.id === docId) {
          return {
            ...d,
            summary: {
              ...d.summary,
              [mode]: content,
            },
          };
        }
        return d;
      })
    );
  };

  const handleUpdateAudit = (docId: string, auditReport: string) => {
    setDocuments((prev) =>
      prev.map((d) => (d.id === docId ? { ...d, auditReport } : d))
    );
  };

  const handleSendChatMessage = async (question: string) => {
    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      role: "user",
      text: question,
      timestamp: new Date().toISOString(),
    };

    const currentMessages = chatHistoryMap[currentDoc.id] || [];
    const updatedMessages = [...currentMessages, userMsg];

    setChatHistoryMap((prev) => ({
      ...prev,
      [currentDoc.id]: updatedMessages,
    }));

    setChatLoading(true);

    try {
      const response = await fetch("/api/documents/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          document: {
            name: currentDoc.name,
            type: currentDoc.type,
            content: currentDoc.content,
          },
          question,
          history: currentMessages.slice(-6),
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Failed to get an answer.");
      }

      const botMsg: ChatMessage = {
        id: `msg-${Date.now() + 1}`,
        role: "model",
        text: data.answer,
        timestamp: new Date().toISOString(),
      };

      setChatHistoryMap((prev) => ({
        ...prev,
        [currentDoc.id]: [...updatedMessages, botMsg],
      }));
    } catch (err: any) {
      const errorMsg: ChatMessage = {
        id: `msg-${Date.now() + 1}`,
        role: "model",
        text: `**Assistant Error:** ${err.message || "Failed to process request."}`,
        timestamp: new Date().toISOString(),
      };
      setChatHistoryMap((prev) => ({
        ...prev,
        [currentDoc.id]: [...updatedMessages, errorMsg],
      }));
    } finally {
      setChatLoading(false);
    }
  };

  const handleClearChat = () => {
    setChatHistoryMap((prev) => ({
      ...prev,
      [currentDoc.id]: [],
    }));
  };

  const handleAskAboutSelection = (selectedText: string) => {
    setActiveTab("chat");
    handleSendChatMessage(
      `Please explain the following excerpt from this document, analyze its implications or risks, and clarify any complex terms:\n\n> "${selectedText}"`
    );
  };

  const handleAskFromHeader = (question: string) => {
    setActiveTab("chat");
    handleSendChatMessage(question);
  };

  const tabs: Array<{
    id: AssistantTab;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
  }> = [
    { id: "summary", label: "Executive Summary", icon: Sparkles },
    { id: "chat", label: "Q&A Chat", icon: MessageSquare },
    { id: "audit", label: "Risk & Obligations", icon: ShieldAlert },
    { id: "transform", label: "Transform & Rewrite", icon: Wand2 },
    { id: "compare", label: "Compare Documents", icon: SplitSquareVertical },
    { id: "viewer", label: "Document Reader", icon: FileText },
  ];

  return (
    <div id="ai-document-assistant-app" className="flex h-screen w-screen overflow-hidden bg-slate-100 text-slate-900 font-sans antialiased">
      {/* Sidebar: Desktop */}
      <div className="hidden lg:block h-full">
        <DocumentSidebar
          documents={documents}
          selectedDocId={selectedDocId}
          onSelectDocument={(id) => {
            setSelectedDocId(id);
          }}
          onOpenUpload={() => setIsUploadOpen(true)}
          onDeleteDocument={handleDeleteDocument}
        />
      </div>

      {/* Sidebar: Mobile drawer */}
      {isSidebarOpen && (
        <div className="fixed inset-0 z-40 flex lg:hidden">
          <div
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs"
            onClick={() => setIsSidebarOpen(false)}
          />
          <div className="relative z-50 flex h-full w-80 max-w-[85vw] bg-white shadow-xl animate-in slide-in-from-left duration-200">
            <DocumentSidebar
              documents={documents}
              selectedDocId={selectedDocId}
              onSelectDocument={(id) => {
                setSelectedDocId(id);
                setIsSidebarOpen(false);
              }}
              onOpenUpload={() => {
                setIsUploadOpen(true);
                setIsSidebarOpen(false);
              }}
              onDeleteDocument={handleDeleteDocument}
            />
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="absolute top-4 right-3 p-1.5 text-slate-400 hover:text-slate-600 rounded-lg"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>
      )}

      {/* Main Content Workspace */}
      <main className="flex-1 flex flex-col h-full overflow-hidden bg-slate-100">
        {/* Top Navigation Bar */}
        <header className="h-16 px-4 md:px-6 bg-white border-b border-slate-200 flex items-center justify-between shrink-0 shadow-2xs gap-3">
          <div className="flex items-center gap-3 shrink-0">
            {/* Mobile Sidebar Trigger */}
            <button
              id="mobile-sidebar-toggle"
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="flex lg:hidden h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50"
            >
              <Menu className="h-5 w-5" />
            </button>

            {/* Current Document Pill */}
            <div className="flex items-center gap-2 max-w-[150px] sm:max-w-xs md:max-w-sm">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 border border-indigo-100">
                <FileText className="h-4 w-4" />
              </div>
              <div className="truncate">
                <h2 className="text-xs md:text-sm font-bold text-slate-900 truncate" title={currentDoc.name}>
                  {currentDoc.name}
                </h2>
                <div className="flex items-center gap-2 text-[11px] text-slate-500">
                  <span className="font-semibold text-indigo-600">{currentDoc.category}</span>
                  <span>•</span>
                  <span>{currentDoc.wordCount.toLocaleString()} words</span>
                  <span>•</span>
                  <span className="uppercase text-[9px] font-mono px-1 py-0.2 rounded bg-slate-100 text-slate-600">
                    {currentDoc.type}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Question Section in Header */}
          <HeaderQuestionSection
            currentDocument={currentDoc}
            onAskQuestion={handleAskFromHeader}
            loading={chatLoading}
          />

          {/* Quick upload trigger on header */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              id="header-add-document-btn"
              onClick={() => setIsUploadOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg shadow-2xs transition-colors"
            >
              <Plus className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Add Document</span>
            </button>
          </div>
        </header>

        {/* Feature Tabs Bar */}
        <div className="px-4 md:px-6 pt-3 bg-white border-b border-slate-200 shrink-0">
          <nav id="feature-tabs-navigation" className="flex items-center gap-1 overflow-x-auto scrollbar-none">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  id={`tab-btn-${tab.id}`}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 pb-3 px-3 text-xs font-semibold border-b-2 transition-all whitespace-nowrap cursor-pointer ${
                    isActive
                      ? "border-indigo-600 text-indigo-600"
                      : "border-transparent text-slate-600 hover:text-slate-900 hover:border-slate-300"
                  }`}
                >
                  <Icon className={`h-4 w-4 ${isActive ? "text-indigo-600" : "text-slate-400"}`} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Active Tab Workspace Container */}
        <div className="flex-1 p-4 md:p-6 overflow-hidden">
          {activeTab === "summary" && (
            <SummaryTab
              document={currentDoc}
              onUpdateSummary={handleUpdateSummary}
            />
          )}

          {activeTab === "chat" && (
            <ChatTab
              document={currentDoc}
              messages={chatHistoryMap[currentDoc.id] || []}
              onSendMessage={handleSendChatMessage}
              onClearChat={handleClearChat}
              loading={chatLoading}
            />
          )}

          {activeTab === "audit" && (
            <AuditTab
              document={currentDoc}
              onUpdateAudit={handleUpdateAudit}
            />
          )}

          {activeTab === "transform" && (
            <TransformTab
              document={currentDoc}
            />
          )}

          {activeTab === "compare" && (
            <CompareTab
              currentDocument={currentDoc}
              allDocuments={documents}
            />
          )}

          {activeTab === "viewer" && (
            <DocumentViewer
              document={currentDoc}
              onAskAboutSelection={handleAskAboutSelection}
            />
          )}
        </div>
      </main>

      {/* Upload Document Modal */}
      <DocumentUploadModal
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        onAddDocument={handleAddDocument}
      />
    </div>
  );
}
