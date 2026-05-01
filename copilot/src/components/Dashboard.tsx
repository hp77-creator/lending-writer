"use client";

import { useState } from "react";
import { Application } from "@/types";
import Sidebar from "./Sidebar";
import ApplicationView from "./ApplicationView";

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
      <Sidebar 
        applications={initialApplications} 
        selectedAppId={selectedAppId} 
        onSelectApp={setSelectedAppId} 
      />
      
      <main className="flex-1 flex overflow-hidden">
        {selectedApp ? (
          <ApplicationView application={selectedApp} />
        ) : (
          <div className="flex-1 flex items-center justify-center text-neutral-500">
            Select an application to begin review.
          </div>
        )}
      </main>
    </div>
  );
}
