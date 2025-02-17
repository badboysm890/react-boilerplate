import * as pdfjsLib from 'pdfjs-dist';

// Set specific version and use full HTTPS URLs
const PDFJS_VERSION = '4.10.38';
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${PDFJS_VERSION}/pdf.worker.min.mjs`;

export async function convertPDFToImage(
  file: File,
  onProgress: (progress: number) => void
): Promise<string> {
  try {
    console.log('Starting PDF conversion...');
    // Start progress
    onProgress(10);
    console.log('Progress: 10% - Initializing...');
    
    // Read the PDF file
    const arrayBuffer = await file.arrayBuffer();
    onProgress(30);
    console.log('Progress: 30% - File loaded');
    
    // Configure PDF.js with specific version
    const loadingTask = pdfjsLib.getDocument({
      data: arrayBuffer,
      cMapUrl: `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${PDFJS_VERSION}/cmaps/`,
      cMapPacked: true,
    });
    
    onProgress(50);
    console.log('Progress: 50% - PDF document loading');
    
    const pdf = await loadingTask.promise;
    onProgress(60);
    console.log('Progress: 60% - PDF document loaded');
    
    // Get the first page
    const page = await pdf.getPage(1);
    onProgress(70);
    console.log('Progress: 70% - First page loaded');
    
    // Set the scale for better quality
    const viewport = page.getViewport({ scale: 2.0 });
    
    // Create a canvas
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    
    if (!context) {
      throw new Error('Could not get canvas context');
    }
    
    canvas.height = viewport.height;
    canvas.width = viewport.width;
    
    onProgress(80);
    console.log('Progress: 80% - Canvas prepared');
    
    // Render the PDF page to the canvas
    const renderContext = {
      canvasContext: context,
      viewport: viewport,
    };
    
    console.log('Starting page render...');
    await page.render(renderContext).promise;
    onProgress(90);
    console.log('Progress: 90% - Page rendered');
    
    // Convert canvas to PNG data URL
    const dataUrl = canvas.toDataURL('image/png');
    onProgress(100);
    console.log('Progress: 100% - Conversion complete');
    
    return dataUrl;
  } catch (error) {
    console.error('Error converting PDF to image:', error);
    throw error;
  }
}