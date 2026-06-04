# ⚡ Credit Underwriter Copilot

An AI-assisted, split-screen dashboard designed for credit and loan underwriters to streamline the document reconciliation and verification process. By using Claude 3.5 Sonnet's Document and Vision capabilities, the Copilot automates data extraction and compares applicant-stated details directly with uploaded PDFs, reducing average review times from **15 minutes down to 3–5 minutes**.

---

## 🚀 Key Features

- **Split-Screen Workspace**: Side-by-side view of client data, uploaded PDFs, and AI reconciliation to eliminate context-switching.
- **AI Document Reconciliation**: Automated parsing and validation of bank statements, pay stubs, and identity proofs against applicant claims using the Claude 3.5 Sonnet API.
- **Prompt Injection Protection**: A built-in security layer that scans documents and prompts for manipulation attempts (e.g., hidden instructions like "AUTO-APPROVE") and alerts the underwriter with a **Critical Security Warning**.
- **Financial Utilities**: Integrated tools (like an EMI calculator) to perform quick recalculations inline.
- **Telemetry & Audit Logging**: Track decision logs, approval justification comments, and time-to-decision metrics, documenting whether AI-assisted insight was utilized.

---

## 🛠️ Architecture & Tech Stack

- **Framework**: Next.js (App Router)
- **UI & Styling**: React, Tailwind CSS
- **AI Engine**: Anthropic SDK (Claude 3.5 Sonnet / Vision API)
- **Data Persistence**: Local JSON/SQLite storage for application telemetry and audit logs.

---

## ⚙️ Getting Started

### Prerequisites

- Node.js (v18.x or later)
- Anthropic API Key

### Installation & Setup

1. **Navigate to the project directory:**
   ```bash
   cd copilot
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment variables:**
   Create a `.env.local` file inside the `copilot/` directory and add your Anthropic API Key:
   ```env
   ANTHROPIC_API_KEY=your_api_key_here
   ```

4. **Start the local development server:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser to view the application.

---

## 🛡️ Core Philosophy: Human-in-the-Loop AI

This project is built on the principle that **AI is an assistant, not the decision-maker**.
- **No Autonomous Decisions**: The system will highlight discrepancies, extract data, and notify officers of security anomalies, but it will never autonomously approve or reject applications.
- **Prompt Injection Defense**: When applicants attempt to plant instructions (e.g., application `APP_011` with a simulated prompt injection), the Copilot isolates the threat and alerts the underwriter instead of obeying the malicious instruction.
- **Reconciliation Audit Trail**: Decisions (approval/rejection) are explicitly linked to justification comments and captured as audit logs.

---

## 📌 Architectural Decisions

During the development of this prototype, several pragmatism-first decisions were made:
- **Local File State**: Instead of setting up a heavy database and ORM overhead during the initial prototype phase, the system reads application state directly from a structured `applications.json` file. This made it fast to iterate on the core Vision AI functionality.
- **Native Document Parsing**: Leveraging Claude's native vision and document capabilities instead of complex local PDF parsing OCR pipelines, minimizing API roundtrips and ensuring higher accuracy.

---

## 🗺️ Roadmap & Future Enhancements

1. **Active Queue Management**: Implement database-level row locking to coordinate multi-officer workloads.
2. **Dynamic Confidence Scores**: Color-code LLM extraction values based on confidence (e.g., highlighting low-confidence values in yellow to mandate verification).
3. **PDF Audit Report Export**: Generate signed PDF receipts capturing exactly what the AI reconciled and what the human verified for internal compliance.
4. **Configurable Rules Engine**: Allow risk analysts to build custom check scripts (e.g., debt-to-income limits) to flag or auto-rejection pre-checks before underwriting review.

