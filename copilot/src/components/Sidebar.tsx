"use client";

import { Application } from "@/types";
import { cn, formatCurrency } from "@/lib/utils";
import { FileText, User, Briefcase, CheckCircle2, XCircle, AlertCircle } from "lucide-react";

interface SidebarProps {
  applications: Application[];
  selectedAppId: string | null;
  onSelectApp: (id: string) => void;
  decisions?: Record<string, string>;
}

export default function Sidebar({ applications, selectedAppId, onSelectApp, decisions = {} }: SidebarProps) {
  const pendingApps = applications.filter(app => !decisions[app.id]);
  const completedApps = applications.filter(app => decisions[app.id]);

  const renderAppButton = (app: Application) => {
    const isSelected = app.id === selectedAppId;
    const isSelfEmployed = app.profile.employment_type === "Self-Employed";
    const decision = decisions[app.id];
    
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
          <div className="flex items-center gap-2 overflow-hidden pr-2">
            <span className="font-medium text-neutral-900 dark:text-neutral-100 truncate">
              {app.profile.applicant_name}
            </span>
            {decision === 'Approve' && <span title="Approved"><CheckCircle2 className="w-4 h-4 text-green-500 shrink-0" /></span>}
            {decision === 'Reject' && <span title="Rejected"><XCircle className="w-4 h-4 text-red-500 shrink-0" /></span>}
            {decision === 'Request Info' && <span title="Request Info"><AlertCircle className="w-4 h-4 text-neutral-500 shrink-0" /></span>}
          </div>
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
  };

  return (
    <div className="w-full h-full bg-white dark:bg-neutral-950 flex flex-col overflow-hidden">
      <div className="p-4 border-b border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 shrink-0">
        <h2 className="text-lg font-bold tracking-tight">Queue</h2>
      </div>
      
      <div className="flex-1 overflow-y-auto">
        {pendingApps.length > 0 && (
          <div>
            <div className="sticky top-0 bg-neutral-50/95 dark:bg-neutral-900/95 backdrop-blur px-4 py-2 border-b border-neutral-200 dark:border-neutral-800 z-10 shadow-sm">
              <h3 className="text-xs font-bold text-neutral-500 uppercase tracking-wider">
                In Progress ({pendingApps.length})
              </h3>
            </div>
            <div>
              {pendingApps.map(renderAppButton)}
            </div>
          </div>
        )}

        {completedApps.length > 0 && (
          <div>
            <div className="sticky top-0 bg-neutral-50/95 dark:bg-neutral-900/95 backdrop-blur px-4 py-2 border-b border-neutral-200 dark:border-neutral-800 z-10 border-t shadow-sm">
              <h3 className="text-xs font-bold text-neutral-500 uppercase tracking-wider">
                Completed ({completedApps.length})
              </h3>
            </div>
            <div className="opacity-75 hover:opacity-100 transition-opacity">
              {completedApps.map(renderAppButton)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
