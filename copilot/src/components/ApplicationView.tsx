"use client";

import { Application } from "@/types";
import { useState } from "react";
import ProfilePanel from "./ProfilePanel";
import PDFViewer from "./PDFViewer";

interface ApplicationViewProps {
  application: Application;
}

export default function ApplicationView({ application }: ApplicationViewProps) {
  const [selectedDoc, setSelectedDoc] = useState<string>(
    application.documents.length > 0 ? application.documents[0] : ""
  );

  return (
    <div className="flex h-full w-full overflow-hidden">
      {/* Left Panel: Profile and AI Copilot */}
      <div className="flex-1 min-w-[500px] border-r border-neutral-200 dark:border-neutral-800 overflow-y-auto">
        <ProfilePanel application={application} />
      </div>

      {/* Right Panel: PDF Viewer */}
      <div className="w-[500px] xl:w-[600px] 2xl:w-[800px] shrink-0 bg-neutral-100 dark:bg-neutral-900 flex flex-col overflow-hidden">
        <div className="h-12 border-b border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 flex items-center px-4 gap-2 shrink-0 overflow-x-auto">
          {application.documents.map((doc) => (
            <button
              key={doc}
              onClick={() => setSelectedDoc(doc)}
              className={`px-3 py-1.5 text-xs font-medium rounded-md whitespace-nowrap transition-colors ${
                selectedDoc === doc 
                  ? "bg-neutral-200 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100" 
                  : "text-neutral-500 hover:bg-neutral-100 dark:hover:bg-neutral-900"
              }`}
            >
              {doc}
            </button>
          ))}
        </div>
        <div className="flex-1 overflow-hidden relative">
          <PDFViewer appId={application.id} documentName={selectedDoc} />
        </div>
      </div>
    </div>
  );
}
