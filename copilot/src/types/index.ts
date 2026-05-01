export interface ApplicantProfile {
  applicant_name: string;
  age: number;
  employment_type: string;
  employer: string;
  designation: string;
  years_at_employer: number;
  monthly_income_stated: number;
  requested_amount: number;
  requested_tenure_months: number;
  existing_emi_monthly: number;
  existing_emi_note: string;
  reason_for_loan: string;
}

export interface Application {
  id: string;
  profile: ApplicantProfile;
  documents: string[];
}

export interface CopilotAnalysis {
  status: "idle" | "loading" | "complete" | "error";
  extracted_income?: number;
  extracted_employer?: string;
  discrepancies?: string[];
  red_flags?: string[];
  summary?: string;
  error?: string;
}
