# AI Document Assistant

An intelligent full-stack document assistant and analysis suite powered by Google Gemini (`gemini-3.8-flash`) and modern React. The application provides contextual question answering, multi-tier executive summaries, automated risk & obligation auditing, language translation & rewriting, and side-by-side document comparisons.

---

## 🌟 Key Features

### 1. 🔍 Header Question Section & Contextual Q&A
- **Header Quick-Ask Bar**: Query the currently selected document directly from the top navigation bar at any time.
- **Smart Suggested Questions**: Auto-generated questions tailored to each document's domain (agreements, research, financial earnings, or compliance policies).
- **Grounded Responses**: Citations and direct quotes pulled from document context.
- **Interactive Highlight-to-Ask**: Select any excerpt in the document reader to instantly trigger an AI deep dive.

### 2. 📑 Executive Summaries
- **Executive Brief**: Structured high-level summary designed for leadership, highlighting key pillars, quantitative metrics, and decisions.
- **Quick TL;DR**: A focused, 2–3 sentence takeaway.
- **Comprehensive Section Breakdown**: In-depth section-by-section analysis.
- **Export**: Copy markdown directly or export as a downloadable `.md` file.

### 3. 🛡️ Risk, Obligation & Compliance Audit
- Scans agreements and policies for liabilities and commitments.
- Categorizes findings by severity: **High**, **Medium**, and **Low**.
- Extracts notice deadlines, indemnification caps, and ambiguous provisions.

### 4. ✍️ Transformation & Restyling
- **Tone & Style Rewriter**: Transform documents into Executive Briefs, Plain English (ELI5), Technical Specs, Formal Legal Tone, or Team Memos.
- **Multilingual Translation**: Translate document content into 10+ languages (Spanish, French, German, Japanese, Chinese, etc.).
- **Automated FAQ Generation**: Generate comprehensive lists of questions and answers.
- **Structured Data Extraction**: Extract entities, dates, metrics, and parameters into formatted Markdown tables.

### 5. ⚖️ Comparative Analysis
- Cross-reference two documents or agreement versions side-by-side.
- Highlights clause deltas, policy divergence, and strategic implications.

### 6. 📂 Multiformat Ingestion & Document Library
- Supports **PDF** (via native Gemini multimodal document processing), **Markdown**, **TXT**, **CSV**, and **JSON**.
- Drag-and-drop file upload or direct text paste.
- Comes pre-loaded with sample documents (Enterprise SLA, Cognitive Clinical Study, Q3 Financial Earnings, and Corporate Information Security Policy).

---

## 🛠️ Technology Stack

- **Frontend**: React 19, TypeScript, Tailwind CSS, Lucide Icons, `react-markdown`
- **Backend**: Express.js with Vite middleware
- **AI Engine**: Google Gen AI SDK (`@google/genai`) using `gemini-3.8-flash`
- **Build & Dev**: Vite 8, `esbuild`, `tsx`

---

## 🚀 Getting Started

### Prerequisites

- Node.js 20+
- A Google Gemini API Key (set as `GEMINI_API_KEY`)

### Environment Variables

Create a `.env` file in the project root:

```env
GEMINI_API_KEY="your-gemini-api-key"
PORT=3000
```

### Installation

```bash
# Install dependencies
npm install
```

### Running Locally

```bash
# Start the full-stack development server
npm run dev
```

The application will be accessible at `http://localhost:3000`.

### Production Build

```bash
# Build frontend and server bundle
npm run build

# Start the compiled production server
npm start
```

### Python Ready-to-Paste Version (`app.py`)

A standalone, ready-to-run Python version is included in `app.py` utilizing the official `google-genai` SDK and Streamlit:

```bash
# Install Python dependencies
pip install google-genai streamlit pypdf

# Export API key
export GEMINI_API_KEY="your-gemini-api-key"

# Run Streamlit app
streamlit run app.py
```

---

## 📁 Project Structure

```
├── .env.example                    # Environment variable template
├── app.py                          # Ready-to-paste Python Streamlit/CLI companion
├── index.html                      # HTML entry point with fonts & metadata
├── metadata.json                   # App capabilities and permissions
├── package.json                    # Dependencies and build scripts
├── server.ts                       # Express backend proxying Gemini API routes
├── vite.config.ts                  # Vite build and dev configuration
└── src/
    ├── main.tsx                    # React DOM entry point
    ├── App.tsx                     # Main layout & workspace state manager
    ├── index.css                   # Global styles & Tailwind configuration
    ├── types.ts                    # TypeScript interfaces and types
    ├── data/
    │   └── sampleDocuments.ts      # Built-in sample documents
    └── components/
        ├── DocumentSidebar.tsx     # Document library, filters & search
        ├── DocumentUploadModal.tsx # Upload modal (PDF, TXT, MD, CSV, Paste)
        ├── HeaderQuestionSection.tsx# Header quick question bar & suggestions
        ├── DocumentViewer.tsx      # Document reader & highlight-to-ask
        ├── SummaryTab.tsx          # Multi-tier document summarizer
        ├── ChatTab.tsx             # Interactive contextual chat
        ├── AuditTab.tsx            # Risk & obligations compliance auditor
        ├── TransformTab.tsx        # Rewrite, translate, and FAQ extraction
        └── CompareTab.tsx          # Side-by-side document comparison
```

---

## 🔒 Security & Privacy

All interactions with the Gemini API are proxied securely through server-side routes in `server.ts`. API keys are never exposed to the client browser.
