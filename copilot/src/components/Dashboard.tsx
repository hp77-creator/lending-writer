"use client";

import { useState } from "react";
import { Application } from "@/types";
import Sidebar from "./Sidebar";
import ApplicationView from "./ApplicationView";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";

interface DashboardProps {
  initialApplications: Application[];
}

export default function Dashboard({ initialApplications }: DashboardProps) {
  const [selectedAppId, setSelectedAppId] = useState<string | null>(
    initialApplications.length > 0 ? initialApplications[0].id : null
  );

  const selectedApp = initialApplications.find((app) => app.id === selectedAppId) || null;

  return (
    <div className="flex h-full w-full overflow-hidden">
      <PanelGroup direction="horizontal">
        <Panel defaultSize={25} minSize={15} maxSize={40} className="border-r border-neutral-200 dark:border-neutral-800">
          <Sidebar 
            applications={initialApplications} 
            selectedAppId={selectedAppId} 
            onSelectApp={setSelectedAppId} 
          />
        </Panel>
        
        <PanelResizeHandle className="w-1.5 bg-transparent hover:bg-blue-500/50 active:bg-blue-500 transition-colors cursor-col-resize z-20 -ml-[1px]" />
        
        <Panel defaultSize={75} minSize={50}>
          <main className="h-full w-full flex overflow-hidden">
            {selectedApp ? (
              <ApplicationView application={selectedApp} />
            ) : (
              <div className="flex-1 flex items-center justify-center text-neutral-500">
                Select an application to begin review.
              </div>
            )}
          </main>
        </Panel>
      </PanelGroup>
    </div>
  );
}
