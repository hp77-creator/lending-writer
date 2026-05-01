"use client";

import { Application } from "@/types";
import { cn, formatCurrency } from "@/lib/utils";
import { FileText, User, Briefcase } from "lucide-react";

interface SidebarProps {
  applications: Application[];
  selectedAppId: string | null;
  onSelectApp: (id: string) => void;
}

export default function Sidebar({ applications, selectedAppId, onSelectApp }: SidebarProps) {
  return (
    <div className="w-80 h-full bg-white dark:bg-neutral-950 border-r border-neutral-200 dark:border-neutral-800 flex flex-col shrink-0 overflow-y-auto">
      <div className="p-4 border-b border-neutral-200 dark:border-neutral-800 sticky top-0 bg-white/90 dark:bg-neutral-950/90 backdrop-blur z-10">
        <h2 className="text-sm font-semibold text-neutral-500 uppercase tracking-wider">Queue ({applications.length})</h2>
      </div>
      
      <div className="flex-1 overflow-y-auto">
        {applications.map((app) => {
          const isSelected = app.id === selectedAppId;
          const isSelfEmployed = app.profile.employment_type === "Self-Employed";
          
          return (
            <button
              key={app.id}
              onClick={() => onSelectApp(app.id)}
              className={cn(
                "w-full text-left p-4 border-b border-neutral-100 dark:border-neutral-800/50 hover:bg-neutral-50 dark:hover:bg-neutral-900/50 transition-colors",
                isSelected && "bg-blue-50 dark:bg-blue-900/20 border-l-4 border-l-blue-600"
              )}
            >
              <div className="flex justify-between items-start mb-1">
                <span className="font-medium text-neutral-900 dark:text-neutral-100 truncate pr-2">
                  {app.profile.applicant_name}
                </span>
                <span className="text-xs font-mono text-neutral-400 bg-neutral-100 dark:bg-neutral-800 px-1.5 py-0.5 rounded shrink-0">
                  {app.id}
                </span>
              </div>
              
              <div className="flex items-center text-xs text-neutral-500 mb-2 gap-3">
                <div className="flex items-center gap-1">
                  {isSelfEmployed ? <Briefcase className="w-3 h-3" /> : <User className="w-3 h-3" />}
                  <span className="truncate">{app.profile.employer}</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between mt-3">
                <div className="flex items-center gap-1.5 text-xs text-neutral-500">
                  <FileText className="w-3.5 h-3.5" />
                  <span>{app.documents.length} docs</span>
                </div>
                <span className="font-medium text-sm text-neutral-700 dark:text-neutral-300">
                  {formatCurrency(app.profile.requested_amount)}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
