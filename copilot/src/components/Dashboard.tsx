"use client";

import { useState, useRef, useEffect } from "react";
import { Application } from "@/types";
import { Users, Calculator, Settings } from "lucide-react";
import Sidebar from "@/components/Sidebar";
import EMICalculator from "@/components/EMICalculator";
import ApplicationView from "@/components/ApplicationView";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";

interface DashboardProps {
  initialApplications: Application[];
}

export default function Dashboard({ initialApplications }: DashboardProps) {
  const [selectedAppId, setSelectedAppId] = useState<string | null>(
    initialApplications.length > 0 ? initialApplications[0].id : null
  );
  const [activeSidebar, setActiveSidebar] = useState<"queue" | "calculator">("queue");
  const [isCollapsed, setIsCollapsed] = useState(false);
  const sidebarRef = useRef<any>(null);
  const [decisions, setDecisions] = useState<Record<string, any>>({});

  useEffect(() => {
    fetch('/api/decisions')
      .then(res => res.json())
      .then(data => {
        if (data.decisions) {
          const decisionsMap: Record<string, any> = {};
          data.decisions.forEach((d: any) => {
            decisionsMap[d.app_id] = d;
          });
          setDecisions(decisionsMap);
        }
      })
      .catch(err => console.error("Failed to fetch decisions:", err));
  }, []);

  const handleDecisionMade = (appId: string, fullDecision: any) => {
    setDecisions(prev => ({ ...prev, [appId]: fullDecision }));
  };

  const selectedApp = initialApplications.find((app) => app.id === selectedAppId) || null;

  return (
    <div className="flex h-full w-full overflow-hidden">
      {/* Global Navigation Rail */}
      <div className="w-14 bg-white dark:bg-neutral-950 border-r border-neutral-200 dark:border-neutral-800 flex flex-col items-center py-4 gap-6 shrink-0 z-20">
        <button
          onClick={() => {
            if (isCollapsed) sidebarRef.current?.expand();
            if (activeSidebar !== "queue") setActiveSidebar("queue");
            else if (!isCollapsed) sidebarRef.current?.collapse();
          }}
          className={`p-2 rounded-lg transition-colors ${!isCollapsed && activeSidebar === 'queue' ? 'bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400' : 'text-neutral-500 hover:bg-neutral-100 dark:hover:bg-neutral-900'}`}
          title="Toggle Queue"
        >
          <Users className="w-5 h-5" />
        </button>
        <button 
          onClick={() => {
            if (isCollapsed) sidebarRef.current?.expand();
            if (activeSidebar !== "calculator") setActiveSidebar("calculator");
            else if (!isCollapsed) sidebarRef.current?.collapse();
          }}
          className={`p-2 rounded-lg transition-colors ${!isCollapsed && activeSidebar === 'calculator' ? 'bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400' : 'text-neutral-500 hover:bg-neutral-100 dark:hover:bg-neutral-900'}`}
          title="EMI Calculator"
        >
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
          {activeSidebar === "queue" ? (
            <Sidebar
              applications={initialApplications}
              selectedAppId={selectedAppId}
              onSelectApp={setSelectedAppId}
              decisions={Object.fromEntries(Object.entries(decisions).map(([k, v]) => [k, v.decision]))}
            />
          ) : (
            <EMICalculator application={selectedApp} />
          )}
        </Panel>

        <PanelResizeHandle className="w-1.5 bg-transparent hover:bg-blue-500/50 active:bg-blue-500 transition-colors cursor-col-resize z-20 -ml-[1px]" />

        <Panel defaultSize={75} minSize={50}>
          <main className="h-full w-full flex overflow-hidden relative">
            {selectedApp ? (
              <ApplicationView
                application={selectedApp}
                decisionObj={decisions[selectedApp.id] || null}
                onDecisionMade={(fullDecision) => handleDecisionMade(selectedApp.id, fullDecision)}
              />
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
