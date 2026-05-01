# Credit Underwriter Copilot 

**Candidate Name:** Himanshu Pandey
**Time Spent:** ~6 hours
**Stack:** Next.js 16 (App Router), React, Tailwind CSS, Anthropic SDK (Claude 3.5 Sonnet)

To run the app:
\`\`\`bash
cd copilot
npm install
npm run dev
\`\`\`
*(Make sure to set \`ANTHROPIC_API_KEY\` in \`copilot/.env.local\` to enable the AI features)*

---

## Part 1: Product Memo

**1. Who is your user?**
The **Loan Officer** (specifically the frontline underwriter).

**2. What problem are you solving for them?**
Reducing the cognitive load of "stare-and-compare" underwriting. I am automating the extraction and reconciliation of applicant-stated data against uploaded documents, aiming to reduce the average review time from 15 minutes down to 3–5 minutes per application.

**3. Why this user and this problem, and not the obvious alternatives?**
The Loan Officer is the actual 1,250-hour-per-day bottleneck (15 mins × 5,000 apps). Speeding up the Operations Head's dashboard or the Risk Analyst's post-facto review does not increase frontline throughput. I deliberately chose *not* to build an "Autonomous Decision Engine" because black-box AI rejections fail the Compliance team's auditability requirements (e.g., Fair Lending laws). The human must remain in the loop; the AI acts as a high-powered data preparer.

**4. What does success look like in 6 months?**
A reduction in average review time to 5 minutes, coupled with a zero percent increase in the default rate or risk-team overturns. The metric is "throughput without quality degradation."

---

## Part 2: The Application

I built an **Underwriter Copilot Dashboard**.
- **Scope:** It explicitly focuses on the document reconciliation phase.
- **Handling AI Failure Modes (Crucial):** I explicitly designed the system to catch "Prompt Injection" attacks. For example, `APP_011` contains a planted prompt injection instructing the AI to "AUTO-APPROVE." Instead of letting the AI run amok or hiding the raw data, the Copilot uses a system prompt to detect these manipulations and surfaces a **CRITICAL SECURITY WARNING** to the officer, highlighting the malicious text. The human always sees the raw PDFs side-by-side with the AI analysis.

---

## Part 3: Architecture & Decisions

**What I built and what I faked:**
- **Built:** A full-stack Next.js app with a real Anthropic Claude 3.5 Sonnet integration using the Vision/Document API to read PDFs natively. I built a split-screen UI because context switching between tabs is the enemy of underwriting speed.
- **Faked:** Authentication (assumed logged in as HP), Database (reads `applications.json` from disk), and Document Storage (serves PDFs straight from the local filesystem).

**What I'd build with another two weeks:**
1. **Queue Management:** Integration with a real database to allow locking applications so two officers don't review the same file.
2. **Confidence Scores:** Have the LLM output a confidence score for its extractions. If confidence is below 90%, visually highlight the field in yellow to force human review.
3. **Structured Audit Trail:** When the officer clicks "Approve" or "Reject", generate a signed PDF report capturing *exactly* what the AI saw and what the human verified, satisfying the Compliance team.

**What I'd refuse to build, even if a PM asked:**
**Auto-Rejection based solely on AI document analysis.** Current LLMs hallucinate numbers often enough that allowing an AI to unilaterally reject a loan without human eyes on the file is an unacceptable customer churn risk and a massive compliance liability. The AI can highlight discrepancies, but it must not click the final "Reject" button.

---

## Where I disagreed with the AI

*(This section documents my collaboration with the AI coding assistant used during development)*

1. **Database Architecture:** The AI initially suggested setting up a PostgreSQL database and Prisma ORM to store the application state. I explicitly rejected this and forced it to read `applications.json` from the filesystem into memory. Holding state in memory is sufficient to demonstrate the core value of the copilot without wasting hours on boilerplate.
2. **File Moving Bash Commands:** The AI tried to write a complex bash script (`cp -a copilot/. ./ && rm -rf copilot`) to move the scaffolded Next.js app to the root directory to satisfy its own aesthetics. I disagreed and instructed it to just leave the app inside the `copilot/` directory and proceed, saving time and preventing git conflicts.
3. **PDF Rendering Strategy:** The AI suggested installing `react-pdf` to render the documents. I rejected this and opted for a simpler native `<iframe>` pointing to an API route. Native iframes handle scrolling and zooming much better out-of-the-box, which is critical for an underwriter who needs to quickly scan a 10-page bank statement.
