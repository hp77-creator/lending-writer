"use client";

import { Application } from "@/types";
import { useState, useEffect } from "react";
import ProfilePanel from "./ProfilePanel";
import PDFViewer from "./PDFViewer";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";

interface ApplicationViewProps {
  application: Application;
}

export default function ApplicationView({ application }: ApplicationViewProps) {
  const [selectedDoc, setSelectedDoc] = useState<string>(
    application.documents.length > 0 ? application.documents[0] : ""
  );

  // Reset selected document if we switch to an application that doesn't have it
  useEffect(() => {
    if (!application.documents.includes(selectedDoc)) {
      setSelectedDoc(application.documents.length > 0 ? application.documents[0] : "");
    }
  }, [application.documents, selectedDoc]);

  return (
    <div className="flex h-full w-full overflow-hidden">
      <PanelGroup direction="horizontal">
        <Panel defaultSize={45} minSize={30} maxSize={70} className="border-r border-neutral-200 dark:border-neutral-800 flex flex-col h-full overflow-hidden">
          <div className="h-full overflow-y-auto">
            <ProfilePanel application={application} />
          </div>
        </Panel>
        
        <PanelResizeHandle className="w-1.5 bg-transparent hover:bg-blue-500/50 active:bg-blue-500 transition-colors cursor-col-resize z-20 -ml-[1px]" />
        
        <Panel defaultSize={55} minSize={30} className="flex flex-col h-full overflow-hidden">
          <div className="w-full h-full bg-neutral-100 dark:bg-neutral-900 flex flex-col overflow-hidden">
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
        </Panel>
      </PanelGroup>
    </div>
  );
}
