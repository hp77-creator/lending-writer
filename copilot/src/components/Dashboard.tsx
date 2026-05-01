"use client";

import { useState, useRef } from "react";
import { Application } from "@/types";
import { Users, Calculator, Settings } from "lucide-react";
import Sidebar from "@/components/Sidebar";
import ApplicationView from "@/components/ApplicationView";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";

interface DashboardProps {
  initialApplications: Application[];
}

export default function Dashboard({ initialApplications }: DashboardProps) {
  const [selectedAppId, setSelectedAppId] = useState<string | null>(
    initialApplications.length > 0 ? initialApplications[0].id : null
  );
  const [isCollapsed, setIsCollapsed] = useState(false);
  const sidebarRef = useRef<any>(null);

  const selectedApp = initialApplications.find((app) => app.id === selectedAppId) || null;

  return (
    <div className="flex h-full w-full overflow-hidden">
      {/* Global Navigation Rail */}
      <div className="w-14 bg-white dark:bg-neutral-950 border-r border-neutral-200 dark:border-neutral-800 flex flex-col items-center py-4 gap-6 shrink-0 z-20">
        <button 
          onClick={() => {
            if (isCollapsed) {
              sidebarRef.current?.expand();
            } else {
              sidebarRef.current?.collapse();
            }
          }}
          className={`p-2 rounded-lg transition-colors ${!isCollapsed ? 'bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400' : 'text-neutral-500 hover:bg-neutral-100 dark:hover:bg-neutral-900'}`}
          title="Toggle Queue"
        >
          <Users className="w-5 h-5" />
        </button>
        <button className="p-2 rounded-lg text-neutral-500 hover:bg-neutral-100 dark:hover:bg-neutral-900 transition-colors" title="EMI Calculator">
          <Calculator className="w-5 h-5" />
        </button>
        <div className="mt-auto">
          <button className="p-2 rounded-lg text-neutral-500 hover:bg-neutral-100 dark:hover:bg-neutral-900 transition-colors" title="Settings">
            <Settings className="w-5 h-5" />
          </button>
        </div>
      </div>

      <PanelGroup direction="horizontal">
        <Panel 
          ref={sidebarRef}
          defaultSize={25} 
          minSize={15} 
          maxSize={40} 
          collapsible={true} 
          collapsedSize={0} 
          onCollapse={() => setIsCollapsed(true)}
          onExpand={() => setIsCollapsed(false)}
          className="border-r border-neutral-200 dark:border-neutral-800"
        >
          <Sidebar 
            applications={initialApplications} 
            selectedAppId={selectedAppId} 
            onSelectApp={setSelectedAppId} 
          />
        </Panel>
        
        <PanelResizeHandle className="w-1.5 bg-transparent hover:bg-blue-500/50 active:bg-blue-500 transition-colors cursor-col-resize z-20 -ml-[1px]" />
        
        <Panel defaultSize={75} minSize={50}>
          <main className="h-full w-full flex overflow-hidden relative">
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
