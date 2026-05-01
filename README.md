# Credit Underwriter Copilot 

**Candidate Name:** Himanshu Pandey
**Time Spent:** ~6 hours
**Stack:** Next.js 16 (App Router), React, Tailwind CSS, Anthropic SDK (Claude 3.6 Sonnet)

To run the app:
```bash
cd copilot
npm install
npm run dev
```

*(Make sure to set \`ANTHROPIC_API_KEY\` in \`copilot/.env.local\` to enable the AI features)*

---

## Part 1: Product Memo

**1. Who is your user?**
The **Loan Officer** (specifically the frontline underwriter).

**2. What problem are you solving for them?**
Reducing the cognitive load of "stare-and-compare" underwriting. I am automating the extraction and reconciliation of applicant-stated data against uploaded documents along with tools like EMI calculator, aiming to reduce the average review time from 15 minutes down to 3–5 minutes per application.

**3. Why this user and this problem, and not the obvious alternatives?**
The loan officer sits at the frontline of the lending business. They have to review applications. Other stakeholders in the process somehow depend on the performance of Loan Officers.
Risk Team checks random applications and ensures that none is rejected without any concrete reason now for something like that
I could use AI to fasten the review process but then it would have took another direction of defining rules for which kinds of application are good for review and which ones are not.

Compliance Team checks also does the similar task and is responsible for policies being followed according to the Govt. guidelines. This also required lot of assumptions and workflow was not really clear with the requirement.

Operations head is responsible for metrics around loan processing. So ideally reducing the RDS which is the time taken to underwrite the application is his main job. I felt optimizing the Loan officer would have simplified roles for Ops team. so I didn't create anything specific for them.

**4. What does success look like in 6 months?**
A reduction in average review time to 5 minutes, coupled with a zero percent increase in the default rate or risk-team overturns. The metric is "throughput without quality degradation." I am storing time taken for each review in the database along with if AI was used for decisioning or not.

---

## Part 2: The Application

I built an **Underwriter Copilot Dashboard**.
- **Scope:** It explicitly focuses on the document reconciliation phase.
- **Handling AI Failure Modes (Crucial):** I explicitly designed the system to catch "Prompt Injection" attacks. For example, `APP_011` contains a planted prompt injection instructing the AI to "AUTO-APPROVE." Instead of letting the AI run amok or hiding the raw data, the Copilot uses a system prompt to detect these manipulations and surfaces a **CRITICAL SECURITY WARNING** to the officer, highlighting the malicious text. The human always sees the raw PDFs side-by-side with the AI analysis.

---

## Part 3: Architecture & Decisions

**What I built and what I faked:**
- **Built:** A full-stack Next.js app with a real Anthropic Claude 3.6 Sonnet integration using the Vision/Document API to read PDFs natively. I built a split-screen UI because context switching between tabs is the enemy of underwriting speed.
- **Faked:** Authentication (assumed logged in as HP), Database (reads `applications.json` from disk), and Document Storage (serves PDFs straight from the local filesystem).

**What I'd build with another two weeks:**
1. **Queue Management:** Integration with a real database to allow locking applications so two officers don't review the same file.
2. **Confidence Scores:** Have the LLM output a confidence score for its extractions. If confidence is below 90%, visually highlight the field in yellow to force human review. Also Improve the highlights in PDFs.
3. **Structured Audit Trail:** When the officer clicks "Approve" or "Reject", generate a signed PDF report capturing *exactly* what the AI saw and what the human verified, satisfying the Compliance team. Currently I am simply storing decisions in JSON in DB. That can be converted into pdf and stored in some storage bucket for audit purpose
4. **Rule Engine:** Incorporating a rule engine where rules are added by Risk Analysts which evaluates user's income, and some parameter like Debt to Income ratio and automatically rejects customers without Human intervention to reduce the load on loan officers.  

**What I'd refuse to build, even if a PM asked:**
**Auto-Rejection based solely on AI document analysis.** Current LLMs hallucinate numbers often enough that allowing an AI to unilaterally reject a loan without human eyes on the file is an unacceptable customer churn risk and a massive compliance liability. The AI can highlight discrepancies, but it must not click the final "Reject" button.

---

## Where I disagreed with the AI

*(This section documents my collaboration with the AI coding assistant used during development)*

1. **Database Architecture:** The AI initially suggested setting up a PostgreSQL database and Prisma ORM to store the application state. I explicitly rejected this and forced it to read `applications.json` from the filesystem into memory. Holding state in memory is sufficient to demonstrate the core value of the copilot without wasting hours on boilerplate.
2. **File Moving Bash Commands:** The AI tried to write a complex bash script (`cp -a copilot/. ./ && rm -rf copilot`) to move the scaffolded Next.js app to the root directory to satisfy its own aesthetics. I disagreed and instructed it to just leave the app inside the `copilot/` directory and proceed, saving time and preventing git conflicts.

