import express, { Request, Response } from "express";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";
import { createServer as createViteServer } from "vite";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

// Helper to get GoogleGenAI client
function getGenAI(): GoogleGenAI {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not set. Please configure it in your environment or Settings > Secrets.");
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
}

// Build contents payload depending on document structure (supports base64 PDF or raw text)
interface DocumentPayload {
  name: string;
  type: string; // 'pdf' | 'text' | 'markdown' | 'csv'
  content: string; // raw text or base64 data URL
  mimeType?: string;
}

function createDocParts(doc: DocumentPayload) {
  if (doc.type === "pdf" && doc.content.startsWith("data:")) {
    const matches = doc.content.match(/^data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+);base64,(.*)$/);
    if (matches && matches[2]) {
      return [
        {
          inlineData: {
            mimeType: matches[1] || "application/pdf",
            data: matches[2],
          },
        },
      ];
    }
  }
  // Fallback to text part
  return [
    {
      text: `Document Name: ${doc.name}\n\n=== DOCUMENT CONTENT ===\n${doc.content}\n=== END DOCUMENT CONTENT ===`,
    },
  ];
}

// Health check
app.get("/api/health", (_req: Request, res: Response) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Endpoint: Generate Summary
app.post("/api/documents/summarize", async (req: Request, res: Response) => {
  try {
    const { document, mode = "executive" } = req.body as {
      document: DocumentPayload;
      mode: "tldr" | "executive" | "detailed";
    };

    if (!document || !document.content) {
      return res.status(400).json({ error: "Document payload is missing or empty." });
    }

    const ai = getGenAI();

    let instruction = "";
    if (mode === "tldr") {
      instruction = "Provide a high-impact, 2-3 sentence TL;DR summary capturing the primary objective and critical takeaway of this document.";
    } else if (mode === "detailed") {
      instruction = "Provide an in-depth, section-by-section breakdown of the document with key findings, data points, architectural/contractual nuances, and conclusions.";
    } else {
      instruction = "Provide an executive summary tailored for senior decision-makers. Include: 1) Executive Overview, 2) Key Pillars / Highlights (bullet points), 3) Critical Metrics or Requirements, and 4) Concluding Takeaways.";
    }

    const docParts = createDocParts(document);

    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: [
        ...docParts,
        {
          text: `You are an elite document intelligence assistant. ${instruction}\nFormat your output cleanly using markdown with clear headings, bold callouts, and bullet points. Be precise and objective. Avoid generic filler words.`,
        },
      ],
    });

    return res.json({ summary: response.text });
  } catch (error: any) {
    console.error("Summarization error:", error);
    return res.status(500).json({ error: error.message || "Failed to generate document summary." });
  }
});

// Endpoint: Question & Answer / Chat with Document
app.post("/api/documents/chat", async (req: Request, res: Response) => {
  try {
    const { document, question, history = [] } = req.body as {
      document: DocumentPayload;
      question: string;
      history?: Array<{ role: "user" | "model"; text: string }>;
    };

    if (!document || !question) {
      return res.status(400).json({ error: "Document and question are required." });
    }

    const ai = getGenAI();
    const docParts = createDocParts(document);

    // Format chat history context if provided
    let conversationContext = "";
    if (history.length > 0) {
      conversationContext = "\nPrior conversation history:\n" +
        history.map((h) => `${h.role === "user" ? "User" : "Assistant"}: ${h.text}`).join("\n\n");
    }

    const promptText = `
You are an expert Document Assistant.
Answer the user's question directly based on the provided document content.
Rules:
1. Always cite or quote the relevant sections or terms when available (format citations in blockquotes or italicized quotes).
2. If the document does not contain enough information to answer definitively, clearly state what is missing and provide the closest relevant context from the document.
3. Be concise, precise, and professional.

${conversationContext}

User Question: ${question}
`;

    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: [
        ...docParts,
        { text: promptText },
      ],
    });

    return res.json({ answer: response.text });
  } catch (error: any) {
    console.error("Chat error:", error);
    return res.status(500).json({ error: error.message || "Failed to process question." });
  }
});

// Endpoint: Audit / Risk & Obligation Extractor
app.post("/api/documents/audit", async (req: Request, res: Response) => {
  try {
    const { document } = req.body as { document: DocumentPayload };
    if (!document || !document.content) {
      return res.status(400).json({ error: "Document payload is missing." });
    }

    const ai = getGenAI();
    const docParts = createDocParts(document);

    const promptText = `
You are a senior compliance, legal, and operational auditor.
Analyze the provided document thoroughly and extract:
1. **Critical Risks & Red Flags**: Categorized by severity (High, Medium, Low) with rationale and clause reference.
2. **Action Items & Obligations**: List who is responsible for what, along with any specified timelines, deadlines, or dependencies.
3. **Key Financial, Legal, or Operational Commitments**: Notice periods, liability caps, warranties, payment terms, or performance thresholds.
4. **Missing Clauses or Ambiguities**: Significant gaps or vaguely phrased terms that pose potential vulnerability.

Present the analysis in clean, structured Markdown with tables or callout boxes where appropriate.
`;

    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: [
        ...docParts,
        { text: promptText },
      ],
    });

    return res.json({ audit: response.text });
  } catch (error: any) {
    console.error("Audit error:", error);
    return res.status(500).json({ error: error.message || "Failed to perform document audit." });
  }
});

// Endpoint: Transform (Rewrite, Translate, FAQ, Extract Data)
app.post("/api/documents/transform", async (req: Request, res: Response) => {
  try {
    const { document, action, option } = req.body as {
      document: DocumentPayload;
      action: "rewrite" | "translate" | "faq" | "extract_table";
      option?: string;
    };

    if (!document || !action) {
      return res.status(400).json({ error: "Document and action are required." });
    }

    const ai = getGenAI();
    const docParts = createDocParts(document);

    let prompt = "";
    if (action === "rewrite") {
      const tone = option || "Executive Brief";
      prompt = `Rewrite and rephrase the key substance of this document in the following tone/style: "${tone}". Ensure all primary facts remain accurate while transforming the voice and delivery.`;
    } else if (action === "translate") {
      const language = option || "Spanish";
      prompt = `Translate the essence and key sections of this document into ${language}. Maintain professional terminology, accurate context, and natural native phrasing.`;
    } else if (action === "faq") {
      prompt = `Generate a comprehensive list of 6-8 Frequently Asked Questions (FAQs) and answers based strictly on the content of this document. Include both introductory concepts and tricky edge cases.`;
    } else if (action === "extract_table") {
      prompt = `Extract all structured entities, metrics, dates, obligations, financial values, or parameters from this document into clean Markdown comparison/summary tables.`;
    }

    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: [
        ...docParts,
        { text: prompt },
      ],
    });

    return res.json({ result: response.text });
  } catch (error: any) {
    console.error("Transform error:", error);
    return res.status(500).json({ error: error.message || "Failed to transform document." });
  }
});

// Endpoint: Compare two documents
app.post("/api/documents/compare", async (req: Request, res: Response) => {
  try {
    const { docA, docB } = req.body as {
      docA: DocumentPayload;
      docB: DocumentPayload;
    };

    if (!docA || !docB) {
      return res.status(400).json({ error: "Two documents are required for comparison." });
    }

    const ai = getGenAI();

    const promptText = `
You are an expert document comparative analyst.
Compare the two documents provided below:
- Document A: "${docA.name}"
- Document B: "${docB.name}"

Provide:
1. **Executive Comparison Overview**: Core differences in scope, purpose, or stance.
2. **Key Clause / Metric Diffs**: A comparison table highlighting specific additions, modifications, or deletions between Document A and Document B.
3. **Strategic & Risk Implications**: Which version is more favorable, restrictive, or advantageous, and why.
4. **Recommendation / Conclusion**: Summary advice based on the differences.

Document A Content:
${docA.content.slice(0, 50000)}

Document B Content:
${docB.content.slice(0, 50000)}
`;

    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: [{ text: promptText }],
    });

    return res.json({ comparison: response.text });
  } catch (error: any) {
    console.error("Compare error:", error);
    return res.status(500).json({ error: error.message || "Failed to compare documents." });
  }
});

// Endpoint: Generate suggested questions for a document
app.post("/api/documents/suggest-questions", async (req: Request, res: Response) => {
  try {
    const { document } = req.body as { document: DocumentPayload };
    if (!document) {
      return res.status(400).json({ error: "Document payload missing." });
    }

    const ai = getGenAI();
    const docParts = createDocParts(document);

    const prompt = `
Generate 4 insightful, specific questions that a user reading this document would likely want to ask.
Return your answer ONLY as a JSON array of 4 strings, for example:
["What is the penalty for early termination?", "How is data encryption handled?", "What are the primary quarterly revenue drivers?", "Who are the key signatories?"]
Do not include markdown code fence formatting. Return raw JSON array only.
`;

    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: [
        ...docParts,
        { text: prompt },
      ],
    });

    let questions: string[] = [];
    try {
      const cleanText = (response.text || "").replace(/```json/g, "").replace(/```/g, "").trim();
      questions = JSON.parse(cleanText);
    } catch {
      questions = [
        "What are the primary goals and key findings of this document?",
        "Are there any critical deadlines or obligations mentioned?",
        "What are the most significant risks or contingencies?",
        "Can you summarize the main conclusions?",
      ];
    }

    return res.json({ questions });
  } catch (error: any) {
    console.error("Questions error:", error);
    return res.json({
      questions: [
        "What are the main objectives of this document?",
        "What obligations or deadlines are specified?",
        "What are the key risks or liabilities?",
        "What actions are recommended next?",
      ],
    });
  }
});

// Vite & Static file serving
async function start() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req: Request, res: Response) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server listening on http://0.0.0.0:${PORT}`);
  });
}

start();
