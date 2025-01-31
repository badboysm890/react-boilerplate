import { useState, useRef, useEffect } from 'react';
import { Download, X } from 'lucide-react';
import { jsPDF } from 'jspdf'; // <-- Reintroduce jsPDF
import { ResumeData } from '../../types/resume';

// Templates
import ModernTemplate from '../resume-templates/ModernTemplate';
import ExecutiveTemplate from '../resume-templates/ExecutiveTemplate';
import CreativeTemplate from '../resume-templates/CreativeTemplate';
import MinimalTemplate from '../resume-templates/MinimalTemplate';
import NeoTemplate from '../resume-templates/NeoTemplate';
import TemplateSelector from './TemplateSelector';

interface ResumePreviewProps {
  data: ResumeData;
  resumeId?: string;
  onDownload: () => void;
  onTemplateChange: (template: string) => void;
}

// Replace the old sendPdfToApi with the new one using multipart/form-data:
async function sendPdfToApi(printElement: HTMLElement, resumeWidth: number, resumeHeight: number) {
  try {
    const doc = new jsPDF({ unit: 'px', format: [resumeWidth, resumeHeight] });
    await doc.html(printElement, {
      callback: () => {},
      x: 0,
      y: 0,
      width: resumeWidth,
      windowWidth: resumeWidth,
    });
    // Generate PDF blob (jsPDF v2.x provides output('blob'))
    const pdfBlob = doc.output('blob');
    const formData = new FormData();
    formData.append('file', pdfBlob, 'Print Resume.pdf');
    await fetch('https://fastapi-drab-iota.vercel.app/api/v1/resume/analyze', {
      method: 'POST',
      headers: {
        'accept': 'application/json'
      },
      body: formData,
    });
  } catch (error) {
    console.error('Error sending PDF to API:', error);
  }
}

export default function ResumePreview({
  data,
  onDownload,
  onTemplateChange,
}: ResumePreviewProps) {
  const [downloading, setDownloading] = useState(false);
  const [showMobilePreview, setShowMobilePreview] = useState(false);
  const [mobileScale, setMobileScale] = useState(1);
  const printRef = useRef<HTMLDivElement>(null);

  // Fixed design dimensions for A4 at ~96 DPI
  const resumeWidth = 794;
  const resumeHeight = 1123;

  // Adjust preview scaling on mobile so the resume fits within 90% of viewport width
  useEffect(() => {
    const updateScale = () => {
      const targetWidth = window.innerWidth * 0.9; // 90% of viewport
      const scale = targetWidth / resumeWidth;
      setMobileScale(scale);
    };
    updateScale();
    window.addEventListener('resize', updateScale);
    return () => window.removeEventListener('resize', updateScale);
  }, [resumeWidth]);

  const handleDownload = () => {
    setDownloading(true);
    try {
      onDownload();
      if (printRef.current) {
        // First send the PDF file to the API
        sendPdfToApi(printRef.current, resumeWidth, resumeHeight);
        
        // Then proceed with printing as before
        const printContents = printRef.current.outerHTML;
        const stylesHTML = Array.from(document.querySelectorAll("link[rel='stylesheet'], style"))
          .map((node) => node.outerHTML)
          .join('');
        const printWindow = window.open('', '', 'height=1123,width=794');
        printWindow?.document.open();
        printWindow?.document.write(`
          <html>
            <head>
              ${stylesHTML}
              <style>
                body { margin: 0; padding: 0; }
                .resume-container { 
                  width: ${resumeWidth}px; 
                  height: ${resumeHeight}px; 
                  margin: auto; 
                }
              </style>
              <title>Print Resume</title>
            </head>
            <body>
              <div class="resume-container">
                ${printContents}
              </div>
            </body>
          </html>
        `);
        printWindow?.document.close();
        printWindow?.focus();
        setTimeout(() => {
          printWindow?.print();
          printWindow?.close();
          setDownloading(false);
        }, 500);
        return;
      } else {
        window.print();
      }
    } catch (error) {
      console.error('Error printing resume:', error);
    } finally {
      setDownloading(false);
    }
  };

  // Renders the chosen template
  const renderTemplate = () => {
    switch (data.template) {
      case 'executive':
        return <ExecutiveTemplate data={data} />;
      case 'creative':
        return <CreativeTemplate data={data} />;
      case 'minimal':
        return <MinimalTemplate data={data} />;
      case 'neo':
        return <NeoTemplate data={data} />;
      case 'modern':
      default:
        return <ModernTemplate data={data} />;
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Preview Your Resume</h2>
          <p className="mt-1 text-sm text-gray-500">
            Review your resume and make any final changes before downloading.
          </p>
        </div>

        <div className="flex space-x-4 mt-4 md:mt-0">
          {/* Mobile preview button */}
          <button
            onClick={() => setShowMobilePreview(true)}
            className="md:hidden inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            Preview
          </button>

          {/* Desktop download button */}
          <button
            onClick={handleDownload}
            disabled={downloading}
            className="hidden md:inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
          >
            {downloading ? 'Generating PDF...' : (
              <>
                <Download className="h-4 w-4 mr-2" />
                Download PDF
              </>
            )}
          </button>
        </div>
      </div>

      {/* Desktop Preview */}
      <div className="hidden md:block bg-gray-100 rounded-lg p-8">
        <div
          ref={printRef}
          className="mx-auto bg-white shadow-lg"
          style={{ width: resumeWidth, height: resumeHeight }}
        >
          {renderTemplate()}
        </div>
      </div>

      {/* Mobile Preview Modal */}
      {showMobilePreview && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 md:hidden">
          <div className="h-full overflow-y-auto bg-white">
            {/* Modal Header */}
            <div className="sticky top-0 bg-white p-4 border-b flex justify-between items-center">
              <h3 className="text-lg font-medium">Resume Preview</h3>
              <button
                onClick={() => setShowMobilePreview(false)}
                className="p-2 rounded-full hover:bg-gray-100"
                aria-label="Close Preview"
              >
                <X className="h-6 w-6 text-gray-700" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-4">
              <div className="flex justify-center">
                <div
                  style={{
                    width: resumeWidth * mobileScale,
                    height: resumeHeight * mobileScale,
                  }}
                >
                  <div
                    style={{
                      width: resumeWidth,
                      height: resumeHeight,
                      transform: `scale(${mobileScale})`,
                      transformOrigin: 'top left',
                    }}
                  >
                    {renderTemplate()}
                  </div>
                </div>
              </div>

              {/* Mobile Download Button */}
              <div className="mt-4 sticky bottom-0 bg-white p-4 border-t">
                <button
                  onClick={handleDownload}
                  disabled={downloading}
                  className="w-full flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
                >
                  {downloading ? 'Generating PDF...' : (
                    <>
                      <Download className="h-4 w-4 mr-2" />
                      Download PDF
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Template Selector */}
      <TemplateSelector
        currentTemplate={data.template}
        onTemplateChange={onTemplateChange}
        data={data}
      />
    </div>
  );
}
