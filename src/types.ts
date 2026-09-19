export type DocumentType = "pdf" | "text" | "markdown" | "csv" | "json";

export interface DocumentItem {
  id: string;
  name: string;
  type: DocumentType;
  size: number;
  content: string; // raw text or base64 data URL
  textContent: string; // displayable text for reading & statistics
  wordCount: number;
  charCount: number;
  createdAt: string;
  category: "Contract" | "Financial" | "Research" | "Policy" | "General";
  summary?: {
    tldr?: string;
    executive?: string;
    detailed?: string;
  };
  auditReport?: string;
  suggestedQuestions?: string[];
}

export interface ChatMessage {
  id: string;
  role: "user" | "model";
  text: string;
  timestamp: string;
  citations?: string[];
}

export type AssistantTab = "summary" | "chat" | "audit" | "transform" | "compare" | "viewer";

export interface TransformState {
  action: "rewrite" | "translate" | "faq" | "extract_table";
  option: string;
  result: string;
  loading: boolean;
}
