# Dataset Guide

Here's what's in `data/` and how to use it.

## `data/applications.json`

An array of 20 loan applications. Each has the structure:

```json
{
  "id": "APP_001",
  "profile": {
    "applicant_name": "Rajesh Kumar",
    "age": 34,
    "employment_type": "Salaried",
    "employer": "Infosys Ltd",
    "designation": "Senior Software Engineer",
    "years_at_employer": 8,
    "monthly_income_stated": 180000,
    "requested_amount": 500000,
    "requested_tenure_months": 36,
    "existing_emi_monthly": 15000,
    "existing_emi_note": "Car loan, 6 months remaining",
    "reason_for_loan": "Home renovation — kitchen..."
  },
  "documents": ["salary_slip.pdf", "bank_statement.pdf", "employment_letter.pdf"]
}
```

Think of `profile` as what the applicant typed into the form.
Think of `documents` as what they uploaded as proof.

## `data/documents/APP_XXX/`

Each application folder contains 2–3 PDFs. Which ones depend on whether the applicant is salaried or self-employed:

| Document | Salaried | Self-Employed |
|---|---|---|
| `salary_slip.pdf` | ✓ | — |
| `bank_statement.pdf` (Jan–Mar 2026) | ✓ | ✓ |
| `employment_letter.pdf` | ✓ | — |
| `business_registration.pdf` | — | ✓ |

## Amounts and dates

- All amounts are in Indian Rupees (INR).
- Statement period is 01-Jan-2026 to 31-Mar-2026 (three months).
- "Today" for the purpose of this exercise is **01-Apr-2026** — the officer is reviewing applications submitted at end of March.

## Working with the PDFs

You can handle these however you like:

- **Vision API** — send the PDF/image directly to Claude's vision and ask it to extract fields. Simplest, probably the right move for a weekend.
- **Text extraction** — use a library like `pdfplumber` or `pypdf` to pull text, then pass to the LLM. Cheaper at scale but you'll fight OCR-like quirks on the tables.
- **Fake it** — if OCR isn't the point of your demo, just hardcode extracted text for each application and spend your time on the actual review experience. Totally acceptable — note it in your README.

The PDFs are generated from structured data, so text extraction will work cleanly (they're not scanned images). But nothing stops you from treating them as images if that's simpler.

## A note on realism

The documents are synthetic but patterned after real Indian lending documents. Employer names, bank names, transaction patterns, Indian number formatting (lakhs/crores), etc. You don't need to know any of this context to solve the problem — treat them as generic financial documents if that's easier.
