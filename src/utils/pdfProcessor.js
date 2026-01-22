import * as pdfjsLib from 'pdfjs-dist';

// Set up PDF.js worker - using more reliable unpkg CDN
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;

// Convert PDF first page to image
export const pdfToImage = async (pdfFile) => {
  try {
    console.log('Starting PDF conversion...', pdfFile.name);
    const arrayBuffer = await pdfFile.arrayBuffer();
    console.log('ArrayBuffer created, size:', arrayBuffer.byteLength);
    
    const loadingTask = pdfjsLib.getDocument({ 
      data: arrayBuffer,
    });
    const pdf = await loadingTask.promise;
    console.log('PDF loaded, pages:', pdf.numPages);
    
    // Get first page
    const page = await pdf.getPage(1);
    console.log('First page loaded');
    
    // Set scale for better quality
    const scale = 2;
    const viewport = page.getViewport({ scale });
    console.log('Viewport created:', viewport.width, 'x', viewport.height);
    
    // Create canvas
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    canvas.width = viewport.width;
    canvas.height = viewport.height;
    
    // Render page
    console.log('Rendering page...');
    await page.render({
      canvasContext: context,
      viewport: viewport
    }).promise;
    console.log('Page rendered successfully');
    
    // Convert canvas to blob
    return new Promise((resolve, reject) => {
      canvas.toBlob((blob) => {
        if (!blob) {
          reject(new Error('Failed to create blob from canvas'));
          return;
        }
        console.log('Blob created, size:', blob.size);
        const file = new File([blob], 'pdf-page-1.png', { type: 'image/png' });
        resolve(file);
      }, 'image/png');
    });
  } catch (error) {
    console.error('PDF to image conversion error:', error);
    console.error('Error details:', error.message, error.stack);
    throw new Error(`Failed to convert PDF to image: ${error.message}`);
  }
};
