

 
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
  const amount = 0.8; // Reduced from 1.8 to avoid artifacts
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
         
        
         const enhancedCanvas = await enhanceImage(img);
        
          enhancedCanvas.toBlob((blob) => {
          const enhancedUrl = URL.createObjectURL(blob);
           
          resolve({
            success: true,
            originalUrl: imageUrl,
            correctedUrl: enhancedUrl,
            blob: blob
          });
        }, 'image/png', 0.95);
      } catch (error) {
        console.error('Processing error:', error);
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
