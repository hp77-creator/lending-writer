"use client";

import { useState, useEffect } from "react";
import { Application } from "@/types";
import { formatCurrency } from "@/lib/utils";
import AICopilot from "@/components/AICopilot";
import { useReviewTimer } from "@/hooks/useReviewTimer";

import { CopilotAnalysis } from "@/types";

interface ProfilePanelProps {
  application: Application;
  decisionObj: any | null;
  onDecisionMade: (fullDecision: any) => void;
  onCitationClick?: (docName: string, query: string) => void;
}

export default function ProfilePanel({ application, decisionObj, onDecisionMade, onCitationClick }: ProfilePanelProps) {
  const { profile } = application;
  const { getTimeSpentSeconds } = useReviewTimer(application.id);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [comment, setComment] = useState("");
  const [aiUsed, setAiUsed] = useState(false);
  const [aiInsight, setAiInsight] = useState<CopilotAnalysis | null>(null);
  const [pendingDecision, setPendingDecision] = useState<string | null>(null);

  const handleDecision = async (selectedDecision: string) => {
    if (!comment.trim()) return; // Prevent submission if comment is empty
    
    setIsSubmitting(true);
    const timeSpentSeconds = getTimeSpentSeconds();

    try {
      const payload = {
        appId: application.id,
        decision: selectedDecision,
        timeSpentSeconds,
        aiUsed,
        aiInsight: aiInsight ? JSON.stringify(aiInsight) : null,
        comment
      };
      
      const res = await fetch('/api/decisions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        onDecisionMade(payload);
      }
    } catch (err) {
      console.error("Failed to save decision:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

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
        
        {/* Action Buttons or Decision Badge */}
        <div className="flex flex-col items-end gap-2 shrink-0 w-64">
          {decisionObj ? (
            <div className="flex flex-col gap-2 w-full">
              <div className={`px-4 py-1.5 rounded-md text-sm font-medium border text-center ${
                decisionObj.decision === 'Approve' ? 'bg-green-50 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-900/50' :
                decisionObj.decision === 'Reject' ? 'bg-red-50 text-red-700 border-red-200 dark:bg-red-950/30 dark:text-red-400 dark:border-red-900/50' :
                'bg-neutral-100 text-neutral-700 border-neutral-200 dark:bg-neutral-800 dark:text-neutral-300 dark:border-neutral-700'
              }`}>
                Decision: {decisionObj.decision}
              </div>
              <div className="text-xs bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 p-2 rounded text-neutral-600 dark:text-neutral-400 whitespace-pre-wrap">
                <span className="font-semibold block mb-1">Underwriter Comment:</span>
                {decisionObj.comment}
              </div>
              {decisionObj.ai_used === 1 && (
                <div className="text-[10px] text-blue-600 dark:text-blue-400 flex items-center justify-end gap-1">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                  AI Copilot was utilized
                </div>
              )}
            </div>
          ) : (
            <div className="flex flex-col gap-2 w-full">
              {!pendingDecision ? (
                <div className="flex gap-2 w-full">
                  <button 
                    onClick={() => setPendingDecision('Reject')}
                    className="flex-1 bg-red-50 text-red-700 dark:bg-red-950/30 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/50 py-1.5 rounded-md text-sm font-medium transition-colors border border-red-200 dark:border-red-900/50"
                  >
                    Reject
                  </button>
                  <button 
                    onClick={() => setPendingDecision('Request Info')}
                    className="flex-1 bg-neutral-100 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-700 py-1.5 rounded-md text-sm font-medium transition-colors border border-neutral-200 dark:border-neutral-700"
                  >
                    Request Info
                  </button>
                  <button 
                    onClick={() => setPendingDecision('Approve')}
                    className="flex-1 bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 hover:bg-neutral-800 dark:hover:bg-neutral-200 py-1.5 rounded-md text-sm font-medium transition-colors"
                  >
                    Approve
                  </button>
                </div>
              ) : (
                <div className="flex flex-col gap-2 w-full animate-in fade-in zoom-in-95 duration-200">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">
                      Confirming: {pendingDecision}
                    </span>
                  </div>
                  <textarea 
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Required: Enter decision reasoning..."
                    className="w-full text-sm p-2 rounded-md border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 resize-none h-20 outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400 transition-all"
                  />
                  <div className="flex gap-2 w-full mt-1">
                    <button 
                      onClick={() => {
                        setPendingDecision(null);
                        setComment("");
                      }}
                      disabled={isSubmitting}
                      className="flex-1 bg-neutral-100 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-700 py-1.5 rounded-md text-sm font-medium transition-colors disabled:opacity-50"
                    >
                      Cancel
                    </button>
                    <button 
                      onClick={() => handleDecision(pendingDecision)}
                      disabled={isSubmitting || !comment.trim()}
                      className={`flex-[2] text-white py-1.5 rounded-md text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                        pendingDecision === 'Approve' ? 'bg-green-600 hover:bg-green-700' :
                        pendingDecision === 'Reject' ? 'bg-red-600 hover:bg-red-700' :
                        'bg-blue-600 hover:bg-blue-700'
                      }`}
                    >
                      {isSubmitting ? 'Saving...' : `Confirm ${pendingDecision}`}
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
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
          <AICopilot 
            application={application} 
            onCitationClick={onCitationClick}
            onAnalysisUpdate={(analysis, hasStarted) => {
              setAiUsed(hasStarted);
              setAiInsight(analysis);
            }}
          />
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
