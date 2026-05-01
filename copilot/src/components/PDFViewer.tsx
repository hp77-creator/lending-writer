"use client";

interface PDFViewerProps {
  appId: string;
  documentName: string;
}

export default function PDFViewer({ appId, documentName }: PDFViewerProps) {
  if (!documentName) {
    return (
      <div className="w-full h-full flex items-center justify-center text-neutral-400 bg-neutral-100 dark:bg-neutral-900">
        <p>No document selected</p>
      </div>
    );
  }

  // Use the API route to serve the PDF from the external data directory
  const pdfUrl = `/api/documents/${appId}/${documentName}`;

  return (
    <div className="w-full h-full bg-neutral-200 dark:bg-neutral-800 flex flex-col">
      <iframe
        src={`${pdfUrl}#toolbar=0&navpanes=0&scrollbar=1`}
        className="w-full h-full flex-1 border-0"
        title={`Document: ${documentName}`}
      />
    </div>
  );
}
