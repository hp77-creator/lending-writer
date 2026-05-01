"use client";

import { Application } from "@/types";
import { formatCurrency } from "@/lib/utils";
import AICopilot from "./AICopilot";

interface ProfilePanelProps {
  application: Application;
}

export default function ProfilePanel({ application }: ProfilePanelProps) {
  const { profile } = application;

  return (
    <div className="p-6 flex flex-col gap-8 relative">
      {/* Header Info */}
      <div className="flex justify-between items-start gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight mb-1">{profile.applicant_name}</h2>
          <div className="flex items-center gap-2 text-sm text-neutral-500">
            <span>{profile.age} years old</span>
            <span>•</span>
            <span>{profile.employment_type}</span>
          </div>
        </div>
        
        {/* Action Buttons */}
        <div className="flex gap-2 shrink-0 mt-1">
          <button className="px-4 bg-red-50 text-red-700 dark:bg-red-950/30 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/50 py-1.5 rounded-md text-sm font-medium transition-colors border border-red-200 dark:border-red-900/50">
            Reject
          </button>
          <button className="px-4 bg-neutral-100 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-700 py-1.5 rounded-md text-sm font-medium transition-colors border border-neutral-200 dark:border-neutral-700">
            Request Info
          </button>
          <button className="px-4 bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 hover:bg-neutral-800 dark:hover:bg-neutral-200 py-1.5 rounded-md text-sm font-medium transition-colors">
            Approve
          </button>
        </div>
      </div>

      {/* AI Copilot Section (The Core Value Add) */}
      <div className="rounded-xl border border-blue-200 dark:border-blue-900/50 bg-blue-50/50 dark:bg-blue-900/10 overflow-hidden shadow-sm">
        <div className="bg-blue-100/50 dark:bg-blue-900/20 px-4 py-3 border-b border-blue-200/50 dark:border-blue-900/50 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
            <h3 className="font-semibold text-blue-900 dark:text-blue-100 text-sm">Underwriter Copilot</h3>
          </div>
        </div>
        <div className="p-4">
          <AICopilot application={application} />
        </div>
      </div>

      {/* Stated Profile Data */}
      <div>
        <h3 className="text-sm font-semibold uppercase tracking-wider text-neutral-500 mb-4">Applicant Stated Profile</h3>
        <div className="grid grid-cols-2 gap-y-4 gap-x-8 text-sm">
          <div>
            <div className="text-neutral-500 mb-1">Employer</div>
            <div className="font-medium">{profile.employer}</div>
            <div className="text-xs text-neutral-500 mt-0.5">{profile.designation} • {profile.years_at_employer} yrs</div>
          </div>
          <div>
            <div className="text-neutral-500 mb-1">Stated Monthly Income</div>
            <div className="font-medium">{formatCurrency(profile.monthly_income_stated)}</div>
          </div>
          <div>
            <div className="text-neutral-500 mb-1">Requested Amount</div>
            <div className="font-medium">{formatCurrency(profile.requested_amount)}</div>
            <div className="text-xs text-neutral-500 mt-0.5">{profile.requested_tenure_months} months</div>
          </div>
          <div>
            <div className="text-neutral-500 mb-1">Existing EMI</div>
            <div className="font-medium">{formatCurrency(profile.existing_emi_monthly)}</div>
            {profile.existing_emi_note && (
              <div className="text-xs text-neutral-500 mt-0.5">
                {profile.existing_emi_note}
              </div>
            )}
          </div>
        </div>
        
        <div className="mt-4">
          <div className="text-neutral-500 text-sm mb-1">Reason for Loan</div>
          <p className="text-sm bg-neutral-50 dark:bg-neutral-900 p-3 rounded-lg border border-neutral-100 dark:border-neutral-800">
            {profile.reason_for_loan}
          </p>
        </div>
      </div>
    </div>
  );
}
