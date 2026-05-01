import { useState, useEffect, useRef, useCallback } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';
import { Loader2 } from 'lucide-react';

// Initialize PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

interface PDFViewerProps {
  appId: string;
  documentName: string;
  searchQuery?: string;
}

export default function PDFViewer({ appId, documentName, searchQuery }: PDFViewerProps) {
  const [numPages, setNumPages] = useState<number>();
  const [isLoading, setIsLoading] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);

  // Reset loading state when document changes
  useEffect(() => {
    setIsLoading(true);
  }, [documentName]);

  // Auto-scroll to the first highlighted <mark> element when rendering completes
  useEffect(() => {
    if (!isLoading && searchQuery && containerRef.current) {
      // Small timeout to ensure the text layer is fully injected into the DOM
      const timer = setTimeout(() => {
        const markElement = containerRef.current?.querySelector('mark');
        if (markElement) {
          markElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [isLoading, searchQuery]);

  if (!documentName) {
    return (
      <div className="w-full h-full flex items-center justify-center text-neutral-400 bg-neutral-100 dark:bg-neutral-900">
        <p>No document selected</p>
      </div>
    );
  }

  const pdfUrl = `/api/documents/${appId}/${documentName}`;

  function onDocumentLoadSuccess({ numPages }: { numPages: number }): void {
    setNumPages(numPages);
    setIsLoading(false);
  }

  // Custom text renderer for highlighting
  const textRenderer = useCallback(
    (textItem: { str: string }) => {
      if (!searchQuery) return textItem.str;
      
      const str = textItem.str;
      const lowerStr = str.toLowerCase();
      const lowerQuery = searchQuery.toLowerCase();
      
      if (lowerStr.includes(lowerQuery)) {
        // Split by case-insensitive regex and wrap matches in <mark>
        const regex = new RegExp(`(${searchQuery})`, 'gi');
        return str.replace(regex, (match) => `<mark class="bg-yellow-300 text-black font-bold px-0.5 rounded shadow-sm">${match}</mark>`);
      }
      return str;
    },
    [searchQuery]
  );

  return (
    <div 
      ref={containerRef}
      className="absolute inset-0 bg-neutral-200 dark:bg-neutral-800 overflow-y-auto overflow-x-hidden flex flex-col items-center py-8"
    >
      {isLoading && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-neutral-100/80 dark:bg-neutral-900/80 z-10 backdrop-blur-sm">
          <Loader2 className="w-8 h-8 animate-spin text-blue-500 mb-4" />
          <p className="text-sm font-medium text-neutral-600 dark:text-neutral-400">Rendering Document...</p>
        </div>
      )}

      <div className="max-w-[850px] w-full px-4">
        <Document
          file={pdfUrl}
          onLoadSuccess={onDocumentLoadSuccess}
          loading={null}
          className="flex flex-col gap-6 items-center w-full"
        >
          {Array.from(new Array(numPages || 0), (el, index) => (
            <div key={`page_${index + 1}`} className="bg-white rounded shadow-lg overflow-hidden w-full relative">
              {/* Force the page to take full width of its container */}
              <Page
                pageNumber={index + 1}
                customTextRenderer={textRenderer}
                renderTextLayer={true}
                renderAnnotationLayer={false}
                width={800} // Standard width, will scale via CSS if container is smaller
                className="w-full flex justify-center pdf-page"
              />
            </div>
          ))}
        </Document>
      </div>

      {/* Global styles for react-pdf text layer */}
      <style dangerouslySetInnerHTML={{__html: `
        .react-pdf__Page__textContent {
          opacity: 1 !important; /* Make sure text layer is visible/interactive */
          color: transparent; /* Keep native text invisible but selectable */
        }
        .react-pdf__Page__textContent mark {
          color: black !important;
          background-color: #fde047 !important; /* yellow-300 */
          box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
          border-radius: 2px;
          padding: 0 2px;
        }
        .pdf-page canvas {
          max-width: 100%;
          height: auto !important;
        }
      `}} />
    </div>
  );
}
