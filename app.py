"""
AI Document Assistant - Python Application (Ready to Paste & Run)
=================================================================
A comprehensive document intelligence tool powered by Google Gemini (gemini-2.5-flash / gemini-2.0-flash / gemini-1.5-flash).
Features:
 - Document Ingestion: PDF, TXT, Markdown, CSV, JSON, or paste text
 - Executive Summaries: TL;DR, Executive Brief, and In-depth breakdown
 - Contextual Q&A Chat: Interactive conversation grounded in document text
 - Risk & Obligations Audit: High/Med/Low liabilities, SLA penalties & deadlines
 - Transformation & Rewriting: Change tone, translate, extract FAQs & tabular data
 - Comparative Analysis: Compare two documents side-by-side

Quick Setup:
 1. Install dependencies:
      pip install google-genai streamlit pypdf
 2. Set your Gemini API Key:
      export GEMINI_API_KEY="your-api-key-here"
 3. Run the application:
      streamlit run app.py
"""

import os
import sys
import base64
from typing import List, Optional

# Try importing Streamlit and Gemini SDK
try:
    import streamlit as st
    HAS_STREAMLIT = True
except ImportError:
    HAS_STREAMLIT = False

try:
    from google import genai
    from google.genai import types
    HAS_GENAI = True
except ImportError:
    HAS_GENAI = False

try:
    import pypdf
    HAS_PYPDF = True
except ImportError:
    HAS_PYPDF = False


# ==========================================
# GEMINI CLIENT INITIALIZATION
# ==========================================
def get_gemini_client(api_key: Optional[str] = None) -> genai.Client:
    key = api_key or os.environ.get("GEMINI_API_KEY")
    if not key:
        raise ValueError(
            "GEMINI_API_KEY is not set. Please set the environment variable "
            "or enter your key in the sidebar."
        )
    return genai.Client(api_key=key)


DEFAULT_MODEL = "gemini-2.5-flash"


# ==========================================
# CORE DOCUMENT ANALYSIS FUNCTIONS
# ==========================================
def generate_summary(client: genai.Client, doc_name: str, doc_text: str, mode: str = "executive") -> str:
    """Generate TL;DR, Executive Brief, or In-depth section breakdown."""
    if mode == "tldr":
        instruction = "Provide a high-impact, 2-3 sentence TL;DR summary capturing the core objective and main takeaway."
    elif mode == "detailed":
        instruction = "Provide an in-depth, section-by-section breakdown with critical findings, metrics, and conclusions."
    else:
        instruction = (
            "Provide an executive summary tailored for leadership. Include: "
            "1) Executive Overview, 2) Key Pillars / Highlights (bullet points), "
            "3) Critical Metrics or Requirements, and 4) Actionable Recommendations."
        )

    prompt = f"""You are an elite document intelligence assistant.
Document Name: {doc_name}

=== DOCUMENT CONTENT ===
{doc_text}
=== END DOCUMENT CONTENT ===

{instruction}
Format output with clean markdown headings and bullet points."""

    response = client.models.generate_content(
        model=DEFAULT_MODEL,
        contents=prompt,
    )
    return response.text or "No summary generated."


def answer_document_question(client: genai.Client, doc_name: str, doc_text: str, question: str, history: List[dict] = None) -> str:
    """Answer questions grounded strictly in the document text with direct citations."""
    context_str = f"Document: {doc_name}\n\n=== DOCUMENT TEXT ===\n{doc_text}\n=== END DOCUMENT TEXT ==="
    
    prompt = f"""{context_str}

User Question: {question}

Instructions:
1. Answer the question thoroughly and objectively based ONLY on the provided document content.
2. Quote relevant clauses or sentences as evidence whenever possible (e.g. > "quote from text").
3. If the answer cannot be determined from the document, clearly state: "This document does not contain sufficient information regarding [topic]."
4. Use clear markdown formatting."""

    response = client.models.generate_content(
        model=DEFAULT_MODEL,
        contents=prompt,
    )
    return response.text or "No answer returned."


def audit_document_risks(client: genai.Client, doc_name: str, doc_text: str) -> str:
    """Scan document for risks, liabilities, and obligations."""
    prompt = f"""You are a senior compliance auditor and risk analyst.
Document Name: {doc_name}

=== DOCUMENT CONTENT ===
{doc_text}
=== END DOCUMENT CONTENT ===

Perform a thorough Risk & Obligations Audit with the following structure:
# 🛡️ Risk & Obligations Audit Report

## 1. Executive Risk Level
Provide an overall risk rating (LOW / MEDIUM / HIGH / CRITICAL) with justification.

## 2. Red Flags & Liabilities by Severity
- 🔴 High Severity: Critical exposures, uncapped damages, strict termination penalties.
- 🟡 Medium Severity: Notice deadlines, audit rights, operational compliance overhead.
- 🟢 Low Severity / Advisory: Minor ambiguities, boilerplate conditions.

## 3. Key Obligations & Actionable Timelines
Table of obligations with Party Responsible, Description, and Deadline/Trigger.

## 4. Missing or Ambiguous Clauses
Key protections that are missing or vaguely worded.

## 5. Strategic Negotiation & Mitigation Advice
Top 3-4 recommended edits or countermeasures."""

    response = client.models.generate_content(
        model=DEFAULT_MODEL,
        contents=prompt,
    )
    return response.text or "No audit generated."


def transform_document(client: genai.Client, doc_name: str, doc_text: str, action: str, language: str = "Spanish") -> str:
    """Rewrite, translate, or extract FAQs/tables."""
    if action == "rewrite_executive":
        task = "Rewrite this document into a punchy, high-level briefing memo for C-level executives."
    elif action == "rewrite_plain":
        task = "Rewrite this document in plain, crystal-clear English (ELI5) free of unnecessary legalese or jargon."
    elif action == "rewrite_technical":
        task = "Rewrite this document with precise technical specifications, engineering parameters, and structured requirements."
    elif action == "translate":
        task = f"Translate the core content of this document into professional, natural {language}."
    elif action == "faq":
        task = "Extract and formulate 6-8 comprehensive Frequently Asked Questions (FAQs) with detailed answers directly from the document."
    elif action == "table":
        task = "Identify all structured data, figures, terms, and obligations in this document and organize them into clean Markdown tables."
    else:
        task = "Improve the clarity, flow, and conciseness of this document."

    prompt = f"""Document: {doc_name}
=== CONTENT ===
{doc_text}
=== END CONTENT ===

Task: {task}
Provide clean, publication-ready markdown output."""

    response = client.models.generate_content(
        model=DEFAULT_MODEL,
        contents=prompt,
    )
    return response.text or "Transformation failed."


def compare_documents(client: genai.Client, doc_a_name: str, doc_a_text: str, doc_b_name: str, doc_b_text: str) -> str:
    """Perform side-by-side comparative analysis of two documents."""
    prompt = f"""You are an expert contract and policy comparative analyst.
Compare the following two documents:

Document A: {doc_a_name}
=== DOCUMENT A ===
{doc_a_text}
=== END DOCUMENT A ===

Document B: {doc_b_name}
=== DOCUMENT B ===
{doc_b_text}
=== END DOCUMENT B ===

Provide a comprehensive comparative analysis:
# ⚖️ Comparative Document Analysis: {doc_a_name} vs {doc_b_name}

## 1. High-Level Comparison & Scope
Summary of how both documents differ in purpose, length, and approach.

## 2. Side-by-Side Clause & Feature Delta
Compare key sections, commitments, SLA targets, pricing, or terms in a Markdown table.

## 3. Added or Stricter Provisions
List items present in Document B that were missing or looser in Document A.

## 4. Omissions & Relaxed Terms
List items present in Document A that were omitted or weakened in Document B.

## 5. Strategic Recommendation & Risk Balance
Which document is more favorable to the respective parties and why."""

    response = client.models.generate_content(
        model=DEFAULT_MODEL,
        contents=prompt,
    )
    return response.text or "Comparison failed."


# ==========================================
# STREAMLIT USER INTERFACE
# ==========================================
def run_streamlit_app():
    st.set_page_config(
        page_title="AI Document Assistant",
        page_icon="📑",
        layout="wide",
        initial_sidebar_state="expanded",
    )

    # Custom Header Styling
    st.markdown(
        """
        <style>
        .main-header {
            font-size: 1.8rem;
            font-weight: 700;
            color: #1e293b;
            margin-bottom: 0.2rem;
        }
        .sub-header {
            font-size: 0.95rem;
            color: #64748b;
            margin-bottom: 1.2rem;
        }
        </style>
        """,
        unsafe_allow_html=True,
    )

    # Sidebar: API Key & Document Upload
    with st.sidebar:
        st.title("📑 Document Library")
        
        api_key_input = st.text_input(
            "Gemini API Key",
            type="password",
            value=os.environ.get("GEMINI_API_KEY", ""),
            help="Enter your Google Gemini API Key. Can also be set via GEMINI_API_KEY environment variable.",
        )

        st.markdown("---")
        st.subheader("Upload or Paste Document")

        uploaded_file = st.file_uploader(
            "Upload file (PDF, TXT, MD, CSV, JSON)",
            type=["pdf", "txt", "md", "csv", "json"],
        )

        raw_text_input = st.text_area(
            "Or paste raw document text:",
            height=150,
            placeholder="Paste contract, article, report, or notes here...",
        )

        doc_name = "Pasted_Document.txt"
        doc_content = ""

        if uploaded_file is not None:
            doc_name = uploaded_file.name
            if uploaded_file.name.endswith(".pdf"):
                if HAS_PYPDF:
                    reader = pypdf.PdfReader(uploaded_file)
                    doc_content = "\n\n".join([page.extract_text() or "" for page in reader.pages])
                else:
                    st.error("pypdf is required to read PDFs. Please run: pip install pypdf")
            else:
                doc_content = uploaded_file.read().decode("utf-8", errors="ignore")
        elif raw_text_input.strip():
            doc_content = raw_text_input.strip()
        else:
            # Default sample document
            doc_name = "Enterprise_Cloud_SLA_Sample.txt"
            doc_content = """ENTERPRISE CLOUD PLATFORM MASTER SERVICE LEVEL AGREEMENT (SLA)
Effective Date: January 1, 2026

1. SERVICE COMMITMENT & AVAILABILITY
CloudCore Inc. will provide 99.95% Monthly Uptime Percentage for Core Compute and Database services.
Monthly Uptime is calculated as total minutes in a month minus Downtime minutes, divided by total minutes.

2. SERVICE CREDITS
If Monthly Uptime falls below commitments:
- 99.0% to < 99.95%: 10% Service Credit
- 95.0% to < 99.0%: 25% Service Credit
- < 95.0%: 50% Service Credit
Credits apply exclusively toward future billing cycles. Claims must be submitted within 30 days of incident.

3. EXCLUSIONS & LIMITATION OF LIABILITY
Downtime excludes scheduled maintenance (announced with 72-hour notice), DDoS attacks, and third-party telecom failure.
Aggregate liability of CloudCore Inc. under this SLA is capped at the total amount paid by Customer in the preceding 3 months.
Neither party shall be liable for indirect, punitive, or consequential damages.

4. DATA SECURITY & COMPLIANCE
CloudCore will maintain SOC 2 Type II and ISO 27001 certifications. Customer data will be encrypted at rest (AES-256) and in transit (TLS 1.3).
CloudCore must notify Customer of confirmed data breaches within 24 hours of discovery."""

        word_count = len(doc_content.split())
        st.caption(f"**Active Document:** {doc_name} ({word_count:,} words)")

    # Validate Gemini Client
    client = None
    try:
        client = get_gemini_client(api_key_input)
    except Exception as e:
        st.warning(f"⚠️ {e}")
        st.info("Get a free Gemini API key at: https://aistudio.google.com")

    # App Header
    st.markdown('<div class="main-header">AI Document Assistant</div>', unsafe_allow_html=True)
    st.markdown(
        f'<div class="sub-header">Active Document: <b>{doc_name}</b> • {word_count:,} words • Model: {DEFAULT_MODEL}</div>',
        unsafe_allow_html=True,
    )

    # Top Header Question Quick-Ask Bar
    st.markdown("### 🔍 Header Question Section")
    q_col1, q_col2 = st.columns([5, 1])
    with q_col1:
        header_question = st.text_input(
            "Quick question about this document:",
            placeholder=f"Ask anything about {doc_name} (e.g., What are the liability caps?)...",
            label_visibility="collapsed",
        )
    with q_col2:
        ask_btn = st.button("Ask AI", type="primary", use_container_width=True)

    if (ask_btn or header_question) and header_question.strip():
        if not client:
            st.error("Please provide a Gemini API Key first.")
        else:
            with st.spinner("Analyzing document..."):
                ans = answer_document_question(client, doc_name, doc_content, header_question)
                st.markdown("#### 💡 Answer")
                st.markdown(ans)
                st.markdown("---")

    # Main Tabs
    tab_summary, tab_chat, tab_audit, tab_transform, tab_compare, tab_viewer = st.tabs([
        "📑 Summary",
        "💬 Q&A Chat",
        "🛡️ Risk & Obligations",
        "✍️ Transform & Rewrite",
        "⚖️ Compare Documents",
        "📖 Document Reader",
    ])

    # 1. Summary Tab
    with tab_summary:
        st.subheader("Document Summarization")
        sum_mode = st.radio(
            "Summary Level:",
            options=["Executive Brief", "TL;DR (Quick Takeaway)", "In-depth Section Breakdown"],
            horizontal=True,
        )
        mode_key = "executive" if "Executive" in sum_mode else ("tldr" if "TL;DR" in sum_mode else "detailed")

        if st.button("Generate Summary", key="btn_summary"):
            if not client:
                st.error("Please provide a Gemini API Key.")
            else:
                with st.spinner("Synthesizing summary with Gemini..."):
                    summary_text = generate_summary(client, doc_name, doc_content, mode_key)
                    st.markdown(summary_text)

    # 2. Interactive Chat Tab
    with tab_chat:
        st.subheader("Document Q&A Chat")
        if "chat_history" not in st.session_state:
            st.session_state.chat_history = []

        # Display previous chat
        for msg in st.session_state.chat_history:
            with st.chat_message(msg["role"]):
                st.markdown(msg["text"])

        # Chat input
        user_prompt = st.chat_input(f"Ask a question about {doc_name}...")
        if user_prompt:
            st.session_state.chat_history.append({"role": "user", "text": user_prompt})
            with st.chat_message("user"):
                st.markdown(user_prompt)

            if not client:
                st.error("Please provide a Gemini API Key.")
            else:
                with st.chat_message("assistant"):
                    with st.spinner("Thinking..."):
                        bot_reply = answer_document_question(client, doc_name, doc_content, user_prompt)
                        st.markdown(bot_reply)
                        st.session_state.chat_history.append({"role": "assistant", "text": bot_reply})

        if st.session_state.chat_history:
            if st.button("Clear Chat History"):
                st.session_state.chat_history = []
                st.rerun()

    # 3. Risk & Obligations Tab
    with tab_audit:
        st.subheader("Risk, Liabilities & Compliance Auditor")
        st.write("Scan this document for uncapped liabilities, missing terms, notice triggers, and legal exposures.")
        if st.button("Run Risk Audit", key="btn_audit"):
            if not client:
                st.error("Please provide a Gemini API Key.")
            else:
                with st.spinner("Auditing clauses and liabilities..."):
                    audit_res = audit_document_risks(client, doc_name, doc_content)
                    st.markdown(audit_res)

    # 4. Transform & Rewrite Tab
    with tab_transform:
        st.subheader("Transform, Rewrite & Translate")
        t_action = st.selectbox(
            "Select transformation:",
            options=[
                ("rewrite_executive", "Rewrite for C-Level Executives"),
                ("rewrite_plain", "Rewrite in Plain English (ELI5)"),
                ("rewrite_technical", "Rewrite as Technical Specification"),
                ("translate", "Translate into Another Language"),
                ("faq", "Extract Frequently Asked Questions (FAQs)"),
                ("table", "Extract Structured Tables & Figures"),
            ],
            format_func=lambda x: x[1],
        )

        target_lang = "Spanish"
        if t_action[0] == "translate":
            target_lang = st.selectbox(
                "Target Language:",
                ["Spanish", "French", "German", "Japanese", "Chinese (Mandarin)", "Portuguese", "Italian", "Hindi", "Arabic"],
            )

        if st.button("Run Transformation", key="btn_transform"):
            if not client:
                st.error("Please provide a Gemini API Key.")
            else:
                with st.spinner("Transforming document content..."):
                    res = transform_document(client, doc_name, doc_content, t_action[0], target_lang)
                    st.markdown(res)

    # 5. Compare Documents Tab
    with tab_compare:
        st.subheader("Side-by-Side Document Comparison")
        st.write("Compare the active document against a second document or contract version.")

        doc_b_text = st.text_area(
            "Document B Content (paste second contract, amendment, or draft):",
            height=200,
            placeholder="Paste second document content here to compare...",
        )
        doc_b_title = st.text_input("Document B Name:", value="Revised_Version_B.txt")

        if st.button("Compare Documents", key="btn_compare"):
            if not client:
                st.error("Please provide a Gemini API Key.")
            elif not doc_b_text.strip():
                st.warning("Please paste content for Document B to compare.")
            else:
                with st.spinner("Running comparative analysis..."):
                    cmp_res = compare_documents(client, doc_name, doc_content, doc_b_title, doc_b_text)
                    st.markdown(cmp_res)

    # 6. Document Viewer Tab
    with tab_viewer:
        st.subheader(f"📖 Reader: {doc_name}")
        st.text_area("Full Document Text:", doc_content, height=450, disabled=True)


# ==========================================
# CLI / STANDALONE FALLBACK MODE
# ==========================================
def run_cli():
    print("=" * 60)
    print("AI Document Assistant (CLI Mode)")
    print("=" * 60)
    api_key = os.environ.get("GEMINI_API_KEY")
    if not api_key:
        api_key = input("Enter your Gemini API Key: ").strip()

    if not api_key:
        print("Error: No API key provided. Exiting.")
        sys.exit(1)

    client = genai.Client(api_key=api_key)
    print("\n[Tip] To launch the full web interface, run: streamlit run app.py\n")

    sample_text = (
        "Enterprise Master Service Level Agreement:\n"
        "CloudCore commits to 99.95% availability. Unplanned downtime gives 10%-50% credit. "
        "Liability is capped at 3 months paid fees."
    )
    print("Generating sample executive summary...\n")
    print(generate_summary(client, "Sample_SLA.txt", sample_text, "executive"))


if __name__ == "__main__":
    if HAS_STREAMLIT and len(sys.argv) > 1 and "run" in sys.argv[0]:
        # Running via 'streamlit run app.py'
        run_streamlit_app()
    elif HAS_STREAMLIT:
        # If user directly invokes streamlit runner or standard execution
        try:
            run_streamlit_app()
        except Exception:
            run_cli()
    else:
        run_cli()
