import * as pdfjsLib from 'pdfjs-dist';

// Set up PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

// Convert PDF first page to image
export const pdfToImage = async (pdfFile) => {
  try {
    const arrayBuffer = await pdfFile.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    
    // Get first page
    const page = await pdf.getPage(1);
    
    // Set scale for better quality
    const scale = 2;
    const viewport = page.getViewport({ scale });
    
    // Create canvas
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    canvas.width = viewport.width;
    canvas.height = viewport.height;
    
    // Render page
    await page.render({
      canvasContext: context,
      viewport: viewport
    }).promise;
    
    // Convert canvas to blob
    return new Promise((resolve) => {
      canvas.toBlob((blob) => {
        resolve(new File([blob], 'pdf-page-1.png', { type: 'image/png' }));
      }, 'image/png');
    });
  } catch (error) {
    console.error('PDF to image conversion error:', error);
    throw new Error('Failed to convert PDF to image');
  }
};
