

// Edge detection using Sobel operator
const detectEdges = (imageData, width, height) => {
  const data = imageData.data;
  const edges = new Uint8ClampedArray(width * height);
  
  // Convert to grayscale and apply Sobel
  for (let y = 1; y < height - 1; y++) {
    for (let x = 1; x < width - 1; x++) {
      // Sobel kernels
      let gx = 0, gy = 0;
      
      for (let ky = -1; ky <= 1; ky++) {
        for (let kx = -1; kx <= 1; kx++) {
          const idx = ((y + ky) * width + (x + kx)) * 4;
          const gray = (data[idx] + data[idx + 1] + data[idx + 2]) / 3;
          
          // Sobel X and Y
          gx += gray * (kx === -1 ? -1 : kx === 1 ? 1 : 0) * (Math.abs(ky) === 1 ? 1 : 2);
          gy += gray * (ky === -1 ? -1 : ky === 1 ? 1 : 0) * (Math.abs(kx) === 1 ? 1 : 2);
        }
      }
      
      const magnitude = Math.sqrt(gx * gx + gy * gy);
      edges[y * width + x] = magnitude > 50 ? 255 : 0;
    }
  }
  
  return edges;
};

// Find largest quadrilateral
const findLargestQuadrilateral = (edges, width, height) => {
  // Find edge points
  const edgePoints = [];
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      if (edges[y * width + x] === 255) {
        edgePoints.push({ x, y });
      }
    }
  }
  
  if (edgePoints.length < 4) return null;
  
  // Find corner candidates
  const corners = [];
  
  // Top-left region
  let topLeft = null, minDist = Infinity;
  for (const p of edgePoints) {
    const dist = p.x + p.y;
    if (dist < minDist) {
      minDist = dist;
      topLeft = p;
    }
  }
  if (topLeft) corners.push(topLeft);
  
  // Top-right region
  let topRight = null; minDist = Infinity;
  for (const p of edgePoints) {
    const dist = (width - p.x) + p.y;
    if (dist < minDist) {
      minDist = dist;
      topRight = p;
    }
  }
  if (topRight) corners.push(topRight);
  
  // Bottom-right region
  let bottomRight = null; minDist = Infinity;
  for (const p of edgePoints) {
    const dist = (width - p.x) + (height - p.y);
    if (dist < minDist) {
      minDist = dist;
      bottomRight = p;
    }
  }
  if (bottomRight) corners.push(bottomRight);
  
  // Bottom-left region
  let bottomLeft = null; minDist = Infinity;
  for (const p of edgePoints) {
    const dist = p.x + (height - p.y);
    if (dist < minDist) {
      minDist = dist;
      bottomLeft = p;
    }
  }
  if (bottomLeft) corners.push(bottomLeft);
  
  if (corners.length !== 4) return null;
  
  return [topLeft, topRight, bottomRight, bottomLeft];
};

// Apply perspective transformation
const applyPerspectiveTransform = (sourceCanvas, corners) => {
  const srcPoints = corners;
  
  // Calculate destination dimensions
  const widthTop = Math.sqrt(Math.pow(srcPoints[1].x - srcPoints[0].x, 2) + Math.pow(srcPoints[1].y - srcPoints[0].y, 2));
  const widthBottom = Math.sqrt(Math.pow(srcPoints[2].x - srcPoints[3].x, 2) + Math.pow(srcPoints[2].y - srcPoints[3].y, 2));
  const heightLeft = Math.sqrt(Math.pow(srcPoints[3].x - srcPoints[0].x, 2) + Math.pow(srcPoints[3].y - srcPoints[0].y, 2));
  const heightRight = Math.sqrt(Math.pow(srcPoints[2].x - srcPoints[1].x, 2) + Math.pow(srcPoints[2].y - srcPoints[1].y, 2));
  
  const maxWidth = Math.max(widthTop, widthBottom);
  const maxHeight = Math.max(heightLeft, heightRight);
  
  // Create destination canvas
  const dstCanvas = document.createElement('canvas');
  dstCanvas.width = maxWidth;
  dstCanvas.height = maxHeight;
  const dstCtx = dstCanvas.getContext('2d');
  
  // Destination points (rectangle)
  const dstPoints = [
    { x: 0, y: 0 },
    { x: maxWidth, y: 0 },
    { x: maxWidth, y: maxHeight },
    { x: 0, y: maxHeight }
  ];
  
  // Simple perspective transform using bilinear interpolation
  const srcCtx = sourceCanvas.getContext('2d');
  const srcData = srcCtx.getImageData(0, 0, sourceCanvas.width, sourceCanvas.height);
  const dstData = dstCtx.createImageData(maxWidth, maxHeight);
  
  for (let y = 0; y < maxHeight; y++) {
    for (let x = 0; x < maxWidth; x++) {
      // Normalized coordinates
      const u = x / maxWidth;
      const v = y / maxHeight;
      
      // Bilinear interpolation to find source coordinates
      const srcX = (1 - v) * ((1 - u) * srcPoints[0].x + u * srcPoints[1].x) +
                   v * ((1 - u) * srcPoints[3].x + u * srcPoints[2].x);
      const srcY = (1 - v) * ((1 - u) * srcPoints[0].y + u * srcPoints[1].y) +
                   v * ((1 - u) * srcPoints[3].y + u * srcPoints[2].y);
      
      const sx = Math.floor(srcX);
      const sy = Math.floor(srcY);
      
      if (sx >= 0 && sx < sourceCanvas.width && sy >= 0 && sy < sourceCanvas.height) {
        const srcIdx = (sy * sourceCanvas.width + sx) * 4;
        const dstIdx = (y * maxWidth + x) * 4;
        
        dstData.data[dstIdx] = srcData.data[srcIdx];
        dstData.data[dstIdx + 1] = srcData.data[srcIdx + 1];
        dstData.data[dstIdx + 2] = srcData.data[srcIdx + 2];
        dstData.data[dstIdx + 3] = 255;
      }
    }
  }
  
  dstCtx.putImageData(dstData, 0, 0);
  return dstCanvas;
};

// Auto-crop document
const autoCropDocument = (imageElement) => {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    canvas.width = imageElement.width;
    canvas.height = imageElement.height;
    
    ctx.drawImage(imageElement, 0, 0);
    
    try {
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      
      // Detect edges
      console.log('Detecting edges...');
      const edges = detectEdges(imageData, canvas.width, canvas.height);
      
      // Find quadrilateral
      console.log('Finding document corners...');
      const corners = findLargestQuadrilateral(edges, canvas.width, canvas.height);
      
      if (corners) {
        console.log('Document corners found:', corners);
        // Apply perspective transform
        const croppedCanvas = applyPerspectiveTransform(canvas, corners);
        resolve(croppedCanvas);
      } else {
        console.log('No document detected, using original image');
        resolve(canvas);
      }
    } catch (error) {
      console.error('Auto-crop error:', error);
      resolve(canvas);
    }
  });
};

const unsharpMask = (imageData, width, height) => {
  const data = imageData.data;
  const blurred = new Uint8ClampedArray(data);
  
  for (let y = 1; y < height - 1; y++) {
    for (let x = 1; x < width - 1; x++) {
      const idx = (y * width + x) * 4;
      
      for (let c = 0; c < 3; c++) {
        // Simple box blur
        let sum = 0;
        for (let ky = -1; ky <= 1; ky++) {
          for (let kx = -1; kx <= 1; kx++) {
            const kidx = ((y + ky) * width + (x + kx)) * 4 + c;
            sum += data[kidx];
          }
        }
        blurred[idx + c] = sum / 9;
      }
    }
  }
  
  // Apply gentle unsharp mask
  const amount = 0.8;
  for (let i = 0; i < data.length; i += 4) {
    for (let c = 0; c < 3; c++) {
      const original = data[i + c];
      const blur = blurred[i + c];
      const sharpened = original + amount * (original - blur);
      data[i + c] = Math.min(255, Math.max(0, sharpened));
    }
  }
  
  return imageData;
};

// Balanced enhancement for clean document look with text clarity
const enhanceImage = (imageElement) => {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    canvas.width = imageElement.width;
    canvas.height = imageElement.height;
    
    // Draw original
    ctx.drawImage(imageElement, 0, 0);
    
    // Get image data
    let imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    
     imageData = unsharpMask(imageData, canvas.width, canvas.height);
    
    // Step 2: Gentle contrast and brightness sample
    const contrast = 1.4;  
    const brightness = 20;
    
    for (let i = 0; i < data.length; i += 4) {
       for (let c = 0; c < 3; c++) {
        data[i + c] = ((data[i + c] - 128) * contrast + 128) + brightness;
        data[i + c] = Math.min(255, Math.max(0, data[i + c]));
      }
    }
    
    //   Clean up backgrounds (light areas)
    for (let i = 0; i < data.length; i += 4) {
      const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
      
       if (avg > 190) {
        const boost = (255 - avg) * 0.4;
        data[i] = Math.min(255, data[i] + boost);
        data[i + 1] = Math.min(255, data[i + 1] + boost);
        data[i + 2] = Math.min(255, data[i + 2] + boost);
      }
      
      // Slightly darken text areas  cite
      if (avg < 120) {
        const reduction = avg * 0.05;
        data[i] = Math.max(0, data[i] - reduction);
        data[i + 1] = Math.max(0, data[i + 1] - reduction);
        data[i + 2] = Math.max(0, data[i + 2] - reduction);
      }
    }
    
    // Put enhanced image back
    ctx.putImageData(imageData, 0, 0);
    
    resolve(canvas);
  });
};

 export const loadOpenCV = () => {
  console.log(' Using native Canvas API with clean document enhancement');
  return Promise.resolve(true);
};

 export const processDocument = async (imageFile) => {
  const imageUrl = URL.createObjectURL(imageFile);
  const img = new Image();
  
  return new Promise((resolve, reject) => {
    img.onload = async () => {
      try {
        // Step 1: Auto-crop and perspective correction
        console.log('Starting auto-crop...');
        const croppedCanvas = await autoCropDocument(img);
        
        // Step 2: Create enhanced canvas
        console.log('Enhancing cropped document...');
        const enhancedCanvas = document.createElement('canvas');
        enhancedCanvas.width = croppedCanvas.width;
        enhancedCanvas.height = croppedCanvas.height;
        
        // Copy cropped canvas to enhancement canvas
        const enhanceCtx = enhancedCanvas.getContext('2d');
        enhanceCtx.drawImage(croppedCanvas, 0, 0);
        
        // Get image data and enhance
        let imageData = enhanceCtx.getImageData(0, 0, enhancedCanvas.width, enhancedCanvas.height);
        const data = imageData.data;
        
        imageData = unsharpMask(imageData, enhancedCanvas.width, enhancedCanvas.height);
        
        const contrast = 1.4;  
        const brightness = 20;
        
        for (let i = 0; i < data.length; i += 4) {
          for (let c = 0; c < 3; c++) {
            data[i + c] = ((data[i + c] - 128) * contrast + 128) + brightness;
            data[i + c] = Math.min(255, Math.max(0, data[i + c]));
          }
        }
        
        for (let i = 0; i < data.length; i += 4) {
          const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
          
          if (avg > 190) {
            const boost = (255 - avg) * 0.4;
            data[i] = Math.min(255, data[i] + boost);
            data[i + 1] = Math.min(255, data[i + 1] + boost);
            data[i + 2] = Math.min(255, data[i + 2] + boost);
          }
          
          if (avg < 120) {
            const reduction = avg * 0.05;
            data[i] = Math.max(0, data[i] - reduction);
            data[i + 1] = Math.max(0, data[i + 1] - reduction);
            data[i + 2] = Math.max(0, data[i + 2] - reduction);
          }
        }
        
        enhanceCtx.putImageData(imageData, 0, 0);
        
        enhancedCanvas.toBlob((blob) => {
          if (!blob) {
            console.warn('Blob creation failed, using original');
            resolve({
              success: true,
              originalUrl: imageUrl,
              correctedUrl: imageUrl,
              blob: imageFile
            });
            return;
          }
          
          const enhancedUrl = URL.createObjectURL(blob);
          console.log('Document processed successfully');
          
          resolve({
            success: true,
            originalUrl: imageUrl,
            correctedUrl: enhancedUrl,
            blob: blob
          });
        }, 'image/png', 0.95);
      } catch (error) {
        console.warn('Processing fallback to original:', error.message);
        resolve({
          success: true,
          originalUrl: imageUrl,
          correctedUrl: imageUrl,
          blob: imageFile
        });
      }
    };
    
    img.onerror = () => reject(new Error('Failed to load image'));
    img.src = imageUrl;
  });
};
