"use client";

import { useState, useEffect } from "react";
import { Application, CopilotAnalysis } from "@/types";
import { formatCurrency } from "@/lib/utils";
import { AlertCircle, CheckCircle2, ChevronRight, Loader2, ShieldAlert } from "lucide-react";

interface AICopilotProps {
  application: Application;
}

export default function AICopilot({ application }: AICopilotProps) {
  const [analysis, setAnalysis] = useState<CopilotAnalysis>({ status: "idle" });
  const [hasStarted, setHasStarted] = useState(false);

  // Reset when application changes
  useEffect(() => {
    setAnalysis({ status: "idle" });
    setHasStarted(false);
  }, [application.id]);

  const handleAnalyze = async () => {
    setHasStarted(true);
    setAnalysis({ status: "loading" });
    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ application }),
      });
      
      if (!response.ok) {
        throw new Error("Failed to analyze application");
      }
      
      const data = await response.json();
      setAnalysis({ status: "complete", ...data });
    } catch (err) {
      setAnalysis({ 
        status: "error", 
        error: err instanceof Error ? err.message : "An unknown error occurred" 
      });
    }
  };

  if (analysis.status === "idle" && !hasStarted) {
    return (
      <div className="flex flex-col items-center justify-center py-8">
        <button 
          onClick={handleAnalyze} 
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow-sm transition-colors flex items-center gap-2"
        >
          <ShieldAlert className="w-4 h-4" />
          Generate AI Insights
        </button>
        <p className="text-xs text-neutral-500 mt-3 max-w-[280px] text-center">
          Click to analyze documents and verify applicant profile using Claude AI. This consumes API credits.
        </p>
      </div>
    );
  }

  if (analysis.status === "loading") {
    return (
      <div className="flex flex-col items-center justify-center py-6 text-blue-600 dark:text-blue-400">
        <Loader2 className="w-6 h-6 animate-spin mb-3" />
        <p className="text-sm font-medium">Analyzing documents and profile...</p>
        <p className="text-xs opacity-70 mt-1 text-center max-w-[250px]">
          Extracting income, verifying employer, and cross-checking data.
        </p>
      </div>
    );
  }

  if (analysis.status === "error") {
    return (
      <div className="p-4 bg-red-50 dark:bg-red-950/30 text-red-700 dark:text-red-400 rounded-lg text-sm flex items-start gap-3">
        <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
        <div>
          <p className="font-medium mb-1">Analysis Failed</p>
          <p className="opacity-80">{analysis.error}</p>
        </div>
      </div>
    );
  }

  const hasRedFlags = analysis.red_flags && analysis.red_flags.length > 0;
  const hasDiscrepancies = analysis.discrepancies && analysis.discrepancies.length > 0;

  return (
    <div className="space-y-5">
      {/* Red Flags / Prompt Injections */}
      {hasRedFlags && (
        <div className="p-4 bg-red-100 dark:bg-red-900/40 border border-red-300 dark:border-red-800 rounded-lg shadow-sm">
          <div className="flex items-center gap-2 text-red-800 dark:text-red-300 font-bold mb-2">
            <ShieldAlert className="w-5 h-5" />
            CRITICAL SECURITY WARNING
          </div>
          <ul className="space-y-1.5">
            {analysis.red_flags?.map((flag, idx) => (
              <li key={idx} className="text-sm text-red-700 dark:text-red-400 flex items-start gap-2">
                <span className="shrink-0 mt-1">•</span>
                <span dangerouslySetInnerHTML={{ __html: flag }}></span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Extracted Data Comparison */}
      <div className="bg-white dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-800 overflow-hidden shadow-sm">
        <div className="grid grid-cols-3 text-xs font-semibold text-neutral-500 uppercase tracking-wider bg-neutral-50 dark:bg-neutral-950 border-b border-neutral-200 dark:border-neutral-800">
          <div className="p-3">Field</div>
          <div className="p-3 border-l border-neutral-200 dark:border-neutral-800">Stated Profile</div>
          <div className="p-3 border-l border-neutral-200 dark:border-neutral-800">Extracted from Docs</div>
        </div>
        
        {/* Income Row */}
        <div className="grid grid-cols-3 text-sm border-b border-neutral-100 dark:border-neutral-800 last:border-0">
          <div className="p-3 font-medium text-neutral-700 dark:text-neutral-300">Monthly Income</div>
          <div className="p-3 border-l border-neutral-100 dark:border-neutral-800">
            {formatCurrency(application.profile.monthly_income_stated)}
          </div>
          <div className="p-3 border-l border-neutral-100 dark:border-neutral-800 font-medium">
            {analysis.extracted_income ? (
              <span className={
                Math.abs(analysis.extracted_income - application.profile.monthly_income_stated) > 1000 
                  ? "text-amber-600 dark:text-amber-500" 
                  : "text-green-600 dark:text-green-500"
              }>
                {formatCurrency(analysis.extracted_income)}
              </span>
            ) : (
              <span className="text-neutral-400 italic">Could not extract</span>
            )}
          </div>
        </div>

        {/* Employer Row */}
        <div className="grid grid-cols-3 text-sm">
          <div className="p-3 font-medium text-neutral-700 dark:text-neutral-300">Employer</div>
          <div className="p-3 border-l border-neutral-100 dark:border-neutral-800 truncate" title={application.profile.employer}>
            {application.profile.employer}
          </div>
          <div className="p-3 border-l border-neutral-100 dark:border-neutral-800 font-medium truncate" title={analysis.extracted_employer || ""}>
            {analysis.extracted_employer ? (
              <span className={
                application.profile.employer.toLowerCase().includes(analysis.extracted_employer.toLowerCase()) || 
                analysis.extracted_employer.toLowerCase().includes(application.profile.employer.toLowerCase())
                  ? "text-green-600 dark:text-green-500"
                  : "text-amber-600 dark:text-amber-500"
              }>
                {analysis.extracted_employer}
              </span>
            ) : (
              <span className="text-neutral-400 italic">Could not extract</span>
            )}
          </div>
        </div>
      </div>

      {/* Discrepancies */}
      {hasDiscrepancies && !hasRedFlags && (
        <div className="p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800/50 rounded-lg shadow-sm">
          <div className="flex items-center gap-2 text-amber-800 dark:text-amber-400 font-semibold mb-2 text-sm">
            <AlertCircle className="w-4 h-4" />
            Discrepancies Detected
          </div>
          <ul className="space-y-1">
            {analysis.discrepancies?.map((disc, idx) => (
              <li key={idx} className="text-sm text-amber-700 dark:text-amber-500 flex items-start gap-2">
                <span className="shrink-0 mt-1">•</span>
                <span>{disc}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Summary */}
      <div className="text-sm text-neutral-700 dark:text-neutral-300 leading-relaxed bg-white/50 dark:bg-neutral-900/50 p-4 rounded-lg border border-neutral-200/50 dark:border-neutral-800/50 shadow-sm">
        <strong className="text-neutral-900 dark:text-neutral-100 block mb-1">Copilot Summary</strong>
        {analysis.summary}
      </div>

      {/* All Good State */}
      {!hasRedFlags && !hasDiscrepancies && analysis.status === "complete" && (
        <div className="flex items-center justify-center gap-2 text-sm font-medium text-green-600 dark:text-green-500 bg-green-50 dark:bg-green-900/20 py-2 rounded-lg border border-green-200 dark:border-green-800/50">
          <CheckCircle2 className="w-4 h-4" />
          No discrepancies found in documents
        </div>
      )}
    </div>
  );
}
