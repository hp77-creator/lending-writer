"use client";

import { useState, useEffect } from "react";
import { Application } from "@/types";
import { calculateEMI, formatCurrency } from "@/lib/utils";
import { Calculator, IndianRupee, Percent, Calendar } from "lucide-react";

interface EMICalculatorProps {
  application: Application | null;
}

export default function EMICalculator({ application }: EMICalculatorProps) {
  const defaultAmount = application?.profile.requested_amount || 100000;
  const defaultTenure = application?.profile.requested_tenure_months || 12;

  const [principal, setPrincipal] = useState<number>(defaultAmount);
  const [interestRate, setInterestRate] = useState<number>(14);
  const [tenure, setTenure] = useState<number>(defaultTenure);

  useEffect(() => {
    if (application) {
      setPrincipal(application.profile.requested_amount);
      setTenure(application.profile.requested_tenure_months);
      setInterestRate(14);
    }
  }, [application]);

  const emi = calculateEMI(principal, interestRate, tenure);
  const totalAmount = emi * tenure;
  const totalInterest = totalAmount - principal;

  return (
    <div className="w-full h-full bg-white dark:bg-neutral-950 flex flex-col overflow-y-auto">
      <div className="p-4 border-b border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 shrink-0 flex items-center gap-2">
        <Calculator className="w-5 h-5 text-blue-600 dark:text-blue-400" />
        <h2 className="text-lg font-bold tracking-tight">EMI Calculator</h2>
      </div>

      <div className="p-4 space-y-6">
        {/* EMI Result Card */}
        <div className="bg-blue-600 text-white rounded-xl p-5 shadow-sm">
          <div className="text-blue-100 text-xs font-medium uppercase tracking-wider mb-1">Monthly EMI</div>
          <div className="text-3xl font-bold tracking-tight mb-4">{formatCurrency(emi)}</div>
          
          <div className="grid grid-cols-2 gap-4 text-sm pt-4 border-t border-blue-500/50">
            <div>
              <div className="text-blue-200 text-xs mb-0.5">Total Interest</div>
              <div className="font-medium">{formatCurrency(totalInterest)}</div>
            </div>
            <div>
              <div className="text-blue-200 text-xs mb-0.5">Total Amount</div>
              <div className="font-medium">{formatCurrency(totalAmount)}</div>
            </div>
          </div>
        </div>

        {/* Sliders / Inputs */}
        <div className="space-y-5">
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300 flex items-center gap-1.5">
                <IndianRupee className="w-4 h-4 text-neutral-400" />
                Principal Amount
              </label>
              <span className="text-sm font-bold text-neutral-900 dark:text-neutral-100">
                {formatCurrency(principal)}
              </span>
            </div>
            <input
              type="range"
              min="10000"
              max="5000000"
              step="10000"
              value={principal}
              onChange={(e) => setPrincipal(Number(e.target.value))}
              className="w-full h-2 bg-neutral-200 rounded-lg appearance-none cursor-pointer dark:bg-neutral-800 accent-blue-600"
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300 flex items-center gap-1.5">
                <Percent className="w-4 h-4 text-neutral-400" />
                Interest Rate (p.a.)
              </label>
              <span className="text-sm font-bold text-neutral-900 dark:text-neutral-100">
                {interestRate}%
              </span>
            </div>
            <input
              type="range"
              min="1"
              max="36"
              step="0.5"
              value={interestRate}
              onChange={(e) => setInterestRate(Number(e.target.value))}
              className="w-full h-2 bg-neutral-200 rounded-lg appearance-none cursor-pointer dark:bg-neutral-800 accent-blue-600"
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300 flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-neutral-400" />
                Tenure (Months)
              </label>
              <span className="text-sm font-bold text-neutral-900 dark:text-neutral-100">
                {tenure} mo
              </span>
            </div>
            <input
              type="range"
              min="1"
              max="120"
              step="1"
              value={tenure}
              onChange={(e) => setTenure(Number(e.target.value))}
              className="w-full h-2 bg-neutral-200 rounded-lg appearance-none cursor-pointer dark:bg-neutral-800 accent-blue-600"
            />
          </div>
        </div>
        
        {application && (
          <div className="bg-neutral-50 dark:bg-neutral-900/50 border border-neutral-200 dark:border-neutral-800 p-3 rounded-lg text-xs text-neutral-600 dark:text-neutral-400">
            <strong>Note:</strong> Auto-filled with applicant's requested amount ({formatCurrency(application.profile.requested_amount)}) and tenure ({application.profile.requested_tenure_months} months).
          </div>
        )}
      </div>
    </div>
  );
}
