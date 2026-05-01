"use client";

import { Application } from "@/types";
import { useState, useEffect } from "react";
import ProfilePanel from "@/components/ProfilePanel";
import dynamic from "next/dynamic";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";

const PDFViewer = dynamic(() => import("@/components/PDFViewer"), { 
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex flex-col items-center justify-center text-neutral-400 bg-neutral-100 dark:bg-neutral-900">
      <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4" />
      <p className="text-sm">Loading PDF Viewer...</p>
    </div>
  )
});

interface ApplicationViewProps {
  application: Application;
  decision: string | null;
  onDecisionMade: (decision: string) => void;
}

export default function ApplicationView({ application, decision, onDecisionMade }: ApplicationViewProps) {
  const [selectedDoc, setSelectedDoc] = useState<string>(
    application.documents.length > 0 ? application.documents[0] : ""
  );
  const [searchQuery, setSearchQuery] = useState<string>("");

  const handleCitationClick = (docName: string, query: string) => {
    setSelectedDoc(docName);
    setSearchQuery(query);
  };

  // Reset selected document if we switch to an application
  useEffect(() => {
    if (!application.documents.includes(selectedDoc)) {
      setSelectedDoc(application.documents.length > 0 ? application.documents[0] : "");
    }
    setSearchQuery("");
  }, [application.documents, selectedDoc]);

  return (
    <div className="flex h-full w-full overflow-hidden">
      <PanelGroup direction="horizontal">
        <Panel defaultSize={45} minSize={30} maxSize={70} className="border-r border-neutral-200 dark:border-neutral-800 flex flex-col h-full overflow-hidden">
          <div className="h-full overflow-y-auto">
            <ProfilePanel 
              application={application} 
              decision={decision} 
              onDecisionMade={onDecisionMade}
              onCitationClick={handleCitationClick}
            />
          </div>
        </Panel>
        
        <PanelResizeHandle className="w-1.5 bg-transparent hover:bg-blue-500/50 active:bg-blue-500 transition-colors cursor-col-resize z-20 -ml-[1px]" />
        
        <Panel defaultSize={55} minSize={30} className="flex flex-col h-full overflow-hidden">
          <div className="w-full h-full bg-neutral-100 dark:bg-neutral-900 flex flex-col overflow-hidden">
            <div className="h-12 border-b border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 flex items-center px-4 gap-2 shrink-0 overflow-x-auto">
              {application.documents.map((doc) => (
                <button
                  key={doc}
                  onClick={() => {
                    setSelectedDoc(doc);
                    setSearchQuery("");
                  }}
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
              <PDFViewer appId={application.id} documentName={selectedDoc} searchQuery={searchQuery} />
            </div>
          </div>
        </Panel>
      </PanelGroup>
    </div>
  );
}
