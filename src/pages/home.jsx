import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { storage } from '../utils/storage';
import { processDocument, loadOpenCV } from '../utils/documentProcessor';
import { pdfToImage } from '../utils/pdfProcessor';
import { uploadDocument } from '../services/api';
import Logo from '../components/Logo';
import Footer from '../components/Footer';

const Home = () => {
  const { user, signout } = useAuth();
  const navigate = useNavigate();

  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [uploadSuccess, setUploadSuccess] = useState(false);

  const [originalPreview, setOriginalPreview] = useState('');
  const [correctedPreview, setCorrectedPreview] = useState('');

  const [zoom, setZoom] = useState(1);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // No OpenCV loading needed anymore - instant ready!

  const handleFileChange = async (e) => {
    const selected = e.target.files[0];
    if (!selected) return;

    const valid = ['image/png', 'image/jpeg', 'image/jpg', 'application/pdf'];
    if (!valid.includes(selected.type)) {
      setError('Please select PNG, JPEG or PDF');
      return;
    }

    setFile(selected);
    setError('');
    setOriginalPreview('');
    setCorrectedPreview('');
    setUploadSuccess(false);
    
    // Show preview for image files
    if (selected.type.startsWith('image/')) {
      const previewUrl = URL.createObjectURL(selected);
      setOriginalPreview(previewUrl);
    } else if (selected.type === 'application/pdf') {
      // For PDFs, convert to show preview but don't upload yet
      setLoading(true);
      try {
        const convertedImage = await pdfToImage(selected);
        const previewUrl = URL.createObjectURL(convertedImage);
        setOriginalPreview(previewUrl);
      } catch (pdfError) {
        console.error('PDF preview failed:', pdfError);
        setError(`PDF preview failed: ${pdfError.message}`);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleProcess = async () => {
    if (!file) {
      setError('Please select a file first');
      return;
    }

    setLoading(true);
    setError('');
    setCorrectedPreview(''); // Clear any previous results

    try {
      let imageFile = file;

      // Convert PDF to image if needed
      if (file.type === 'application/pdf') {
        console.log('Processing PDF file:', file.name);
        imageFile = await pdfToImage(file);
        console.log('✓ PDF converted successfully');
      }

      // Process with native Canvas API
      console.log('Processing document...');
      const result = await processDocument(imageFile);

      if (!result.success) {
        throw new Error(result.message || 'Processing failed');
      }

      // Convert result URLs to File objects for upload
      const originalBlob = await fetch(result.originalUrl).then(r => r.blob());
      const originalFile = new File([originalBlob], file.name, { type: 'image/png' });
      const processedFile = new File([result.blob], file.name, { type: 'image/png' });

      // Upload to server
      console.log('Uploading to server...');
      await uploadDocument(originalFile, processedFile, file.name);
      
      // Save to local storage as backup
      const uploadId = Date.now().toString();
      const originalKey = `${user.id}_${uploadId}_original`;
      const processedKey = `${user.id}_${uploadId}_processed`;

      await storage.saveFile(originalKey, originalBlob);
      await storage.saveFile(processedKey, result.blob);

      await storage.saveUpload(user.id, {
        id: uploadId,
        userId: user.id,
        filename: file.name,
        originalFileKey: originalKey,
        processedFileKey: processedKey,
        status: 'completed',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });

      setOriginalPreview(result.originalUrl);
      setCorrectedPreview(result.correctedUrl || '');
      setUploadSuccess(true);
      setTimeout(() => setUploadSuccess(false), 3000);
      console.log('✓ Processing and upload completed successfully');
    } catch (e) {
      console.error('Processing error:', e);
      setError(`Failed to process document: ${e.message || 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  const handleSignout = () => {
    signout();
    navigate('/signin');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <header className="bg-white border-b border-slate-200 shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex justify-between items-center">
          <Logo className="hover:opacity-80 transition-opacity cursor-pointer" onClick={() => navigate('/')} />
          
          {/* Desktop Menu */}
          <div className="hidden md:flex gap-3 items-center">
            <span className="text-sm text-slate-600">{user?.email}</span>
            <button 
              onClick={() => navigate('/history')} 
              className="px-4 py-2 text-sm font-medium text-slate-900 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
            >
              History
            </button>
            <button 
              onClick={handleSignout} 
              className="px-4 py-2 text-sm font-medium text-white bg-slate-800 rounded-lg hover:bg-slate-900 transition-colors"
            >
              Sign Out
            </button>
          </div>

          {/* Mobile Hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-slate-100 transition-colors"
            aria-label="Toggle menu"
          >
            <svg className="w-6 h-6 text-slate-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-slate-200 bg-white">
            <div className="px-4 py-3 space-y-3">
              <div className="px-3 py-2 text-sm text-slate-600 bg-slate-50 rounded-lg">
                {user?.email}
              </div>
              <button 
                onClick={() => { navigate('/history'); setMobileMenuOpen(false); }} 
                className="w-full px-4 py-2.5 text-sm font-medium text-slate-900 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors text-left"
              >
                History
              </button>
              <button 
                onClick={() => { handleSignout(); setMobileMenuOpen(false); }} 
                className="w-full px-4 py-2.5 text-sm font-medium text-white bg-slate-800 rounded-lg hover:bg-slate-900 transition-colors text-left"
              >
                Sign Out
              </button>
            </div>
          </div>
        )}
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-6">
        <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm border-2 border-slate-300">
          <h2 className="text-lg sm:text-xl font-semibold text-slate-900 mb-1">Upload Document</h2>
          <p className="text-xs sm:text-sm text-blue-700 mb-4">Smart document scanning, right in your browser</p>
          
          {uploadSuccess && (
            <div className="bg-green-50 border border-green-500 text-green-700 p-3 mb-4 text-sm rounded-lg flex items-center gap-2">
              <svg className="w-5 h-5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
              </svg>
              <span className="font-medium">Document uploaded to cloud successfully!</span>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-500 text-red-500 p-3 mb-4 text-sm rounded-lg flex items-start gap-2">
              <svg className="w-5 h-5 shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"/>
              </svg>
              <div className="flex-1">
                <p className="font-medium">{error}</p>
                {originalPreview && (
                  <button 
                    onClick={() => { setError(''); handleProcess(); }} 
                    className="text-sm underline mt-1 hover:text-red-600"
                  >
                    Retry
                  </button>
                )}
              </div>
            </div>
          )}

          <div className="mb-4">
            <label 
              htmlFor="file-upload"
              className="relative block w-full border-2 border-dashed border-slate-300 rounded-lg p-6 sm:p-8 text-center hover:border-blue-600 transition-colors cursor-pointer group"
            >
              <input
                id="file-upload"
                type="file"
                accept="image/png,image/jpeg,image/jpg,application/pdf"
                onChange={handleFileChange}
                className="sr-only"
              />
              <svg className="mx-auto h-10 w-10 sm:h-12 sm:w-12 text-slate-400 group-hover:text-blue-600 transition-colors" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <p className="mt-2 text-sm font-medium text-slate-900">Click to upload a document</p>
              <p className="mt-1 text-xs text-slate-600">or drag and drop</p>
            </label>
          </div>

          {file && (
            <div className="p-3 bg-blue-50 rounded-lg border border-blue-200 mb-4 flex items-center gap-2">
              <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd"/>
              </svg>
              <p className="text-sm text-slate-900 flex-1">
                <span className="font-medium">Selected:</span> {file.name}
              </p>
            </div>
          )}

          <button
            onClick={handleProcess}
            disabled={loading || !file}
            className="w-full bg-slate-800 text-white py-3.5 px-4 rounded-lg hover:bg-slate-900 disabled:bg-slate-400 disabled:cursor-not-allowed font-medium transition-colors flex items-center justify-center gap-2"
          >
            {loading && (
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            )}
            {loading ? 'Processing…' : 'Process Document'}
          </button>
        </div>

        {(originalPreview || correctedPreview) && (
          <div className="mt-6 bg-white p-4 sm:p-6 rounded-lg shadow-sm border border-slate-200">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
              <h2 className="text-lg sm:text-xl font-semibold text-slate-900">Before / After</h2>
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium text-slate-900">Zoom:</span>
                <input
                  type="range"
                  min="0.5"
                  max="3"
                  step="0.1"
                  value={zoom}
                  onChange={(e) => setZoom(parseFloat(e.target.value))}
                  className="w-32 accent-blue-600"
                />
                <span className="text-sm text-slate-600 min-w-[3rem] text-right">{Math.round(zoom * 100)}%</span>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              {originalPreview && (
                <div className="border-2 border-slate-200 rounded-lg overflow-hidden">
                  <div className="bg-slate-100 px-4 py-2.5 border-b border-slate-200">
                    <h3 className="text-sm font-semibold text-slate-700">Original</h3>
                  </div>
                  <div className="overflow-auto max-h-[500px] p-4 bg-slate-50 flex items-center justify-center">
                    <img
                      src={originalPreview}
                      alt="original document"
                      style={{ transform: `scale(${zoom})`, transformOrigin: 'top left' }}
                      className="transition-transform shadow-md"
                    />
                  </div>
                </div>
              )}
              
              {correctedPreview && (
                <div className="border-2 border-slate-800 rounded-lg overflow-hidden">
                  <div className="bg-slate-800 px-4 py-2.5 border-b border-slate-900">
                    <h3 className="text-sm font-semibold text-white">Processed</h3>
                  </div>
                  <div className="overflow-auto max-h-[500px] p-4 bg-white flex items-center justify-center">
                    <img
                      src={correctedPreview}
                      alt="processed document"
                      style={{ transform: `scale(${zoom})`, transformOrigin: 'top left' }}
                      className="transition-transform shadow-md"
                    />
                  </div>
                </div>
              )}
            </div>

            {correctedPreview && (
              <div className="mt-4 p-3 bg-emerald-50 border border-emerald-600 rounded-lg">
                <p className="text-sm text-emerald-600 font-medium">
                  ✓ Document scanned successfully with clean, professional look!
                </p>
              </div>
            )}
          </div>
        )}

        <div className="mt-6 bg-white p-4 sm:p-6 rounded-lg border border-slate-200">
          <h3 className="text-base sm:text-lg font-semibold text-blue-600 mb-4">How It Works</h3>
          <div className="flex flex-col md:flex-row items-start gap-4 md:gap-3">
            <div className="flex items-start gap-3 w-full md:flex-1">
              <div className="w-10 h-10 rounded-lg bg-amber-50 flex items-center justify-center shrink-0">
                <svg className="w-5 h-5 text-amber-500" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2 6a2 2 0 012-2h5l2 2h5a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" />
                </svg>
              </div>
              <div className="flex-1">
                <h4 className="text-sm sm:text-base font-medium text-slate-900">Upload</h4>
                <p className="text-xs sm:text-sm text-slate-600 mt-0.5">Drag & drop or click to upload</p>
              </div>
            </div>

            <svg className="hidden md:block w-6 h-6 text-blue-600 shrink-0 mt-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>

            <div className="flex items-start gap-3 w-full md:flex-1">
              <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </div>
              <div className="flex-1">
                <h4 className="text-sm sm:text-base font-medium text-slate-900">Process</h4>
                <p className="text-xs sm:text-sm text-slate-600 mt-0.5">AI enhances contrast & clarity</p>
              </div>
            </div>

            <svg className="hidden md:block w-6 h-6 text-blue-600 shrink-0 mt-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>

            <div className="flex items-start gap-3 w-full md:flex-1">
              <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center shrink-0">
                <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                </svg>
              </div>
              <div className="flex-1">
                <h4 className="text-sm sm:text-base font-medium text-slate-900">Download</h4>
                <p className="text-xs sm:text-sm text-slate-600 mt-0.5">Get your clear document instantly</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 bg-white p-4 sm:p-6 md:p-8 rounded-lg border border-slate-200 shadow-sm">
          <h3 className="text-base sm:text-lg md:text-xl font-semibold text-blue-600 mb-4 sm:mb-6">Supports various document types</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            <div className="group">
              <div className="aspect-3/2 bg-slate-50 rounded-lg border-2 border-slate-200 overflow-hidden hover:border-blue-300 transition-colors">
                <img 
                  src="https://plus.unsplash.com/premium_photo-1728313181661-5b93fbfe362a?q=80&w=784&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" 
                  alt="ID card example" 
                  className="w-full h-full object-cover"
                />
              </div>
              <p className="text-xs sm:text-sm font-medium text-slate-700 mt-2 sm:mt-3">ID cards, badges</p>
            </div>

            <div className="group">
              <div className="aspect-3/2 bg-slate-50 rounded-lg border-2 border-slate-200 overflow-hidden hover:border-blue-300 transition-colors">
                <img 
                  src="https://plus.unsplash.com/premium_photo-1679856789519-790899bcaa09?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" 
                  alt="Resume example" 
                  className="w-full h-full object-cover"
                />
              </div>
              <p className="text-xs sm:text-sm font-medium text-slate-700 mt-2 sm:mt-3">Resumes, reports</p>
            </div>

            <div className="group">
              <div className="aspect-3/2 bg-slate-50 rounded-lg border-2 border-slate-200 overflow-hidden hover:border-blue-300 transition-colors">
                <img 
                  src="https://images.unsplash.com/photo-1616861771635-49063a4636ed?q=80&w=1074&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" 
                  alt="Printed document example" 
                  className="w-full h-full object-cover"
                />
              </div>
              <p className="text-xs sm:text-sm font-medium text-slate-700 mt-2 sm:mt-3">Printed documents</p>
            </div>

            <div className="group">
              <div className="aspect-3/2 bg-slate-50 rounded-lg border-2 border-slate-200 overflow-hidden hover:border-blue-300 transition-colors">
                <img 
                  src="https://images.unsplash.com/photo-1665624856648-0e84b440176d?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" 
                  alt="Receipt example" 
                  className="w-full h-full object-cover"
                />
              </div>
              <p className="text-xs sm:text-sm font-medium text-slate-700 mt-2 sm:mt-3">Receipts, invoices</p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Home;
