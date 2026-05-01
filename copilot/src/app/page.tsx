import { promises as fs } from "fs";
import path from "path";
import Dashboard from "@/components/Dashboard";
import { Application } from "@/types";

export default async function Home() {
  // Read data from the parent directory
  const dataPath = path.join(process.cwd(), "../data/applications.json");
  const fileContents = await fs.readFile(dataPath, "utf8");
  const applications: Application[] = JSON.parse(fileContents);

  return (
    <main className="min-h-screen bg-neutral-100 dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 flex flex-col">
      <header className="h-14 bg-white dark:bg-neutral-950 border-b border-neutral-200 dark:border-neutral-800 flex items-center px-6 shrink-0 z-10">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded-md flex items-center justify-center text-white font-bold text-lg">
            P
          </div>
          <h1 className="font-semibold text-lg tracking-tight">Lending Copilot</h1>
        </div>
        <div className="ml-auto flex items-center gap-4 text-sm text-neutral-500">
          <span>Loan Officer: <strong>Aditi Verma</strong></span>
        </div>
      </header>
      
      <div className="flex-1 overflow-hidden">
        <Dashboard initialApplications={applications} />
      </div>
    </main>
  );
}
