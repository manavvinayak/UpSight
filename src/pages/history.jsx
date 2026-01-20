import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { storage } from '../utils/storage';
import Logo from '../components/Logo';

const History = () => {
  const { user, signout } = useAuth();
  const navigate = useNavigate();
  const [uploads, setUploads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedUpload, setSelectedUpload] = useState(null);
  const [originalUrl, setOriginalUrl] = useState('');
  const [processedUrl, setProcessedUrl] = useState('');
  const [zoom, setZoom] = useState(1);

  useEffect(() => {
    loadUploads();
  }, [user]);

  const loadUploads = async () => {
    try {
      const userUploads = await storage.getUserUploads(user.id);
      // Sort by most recent first
      const sorted = userUploads.sort((a, b) => 
        new Date(b.createdAt) - new Date(a.createdAt)
      );
      setUploads(sorted);
    } catch (error) {
      console.error('Failed to load uploads:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewUpload = async (upload) => {
    try {
      setSelectedUpload(upload);
      
      // Load files from storage
      const originalBlob = await storage.getFile(upload.originalFileKey);
      const processedBlob = await storage.getFile(upload.processedFileKey);
      
      if (originalBlob) {
        setOriginalUrl(URL.createObjectURL(originalBlob));
      }
      if (processedBlob) {
        setProcessedUrl(URL.createObjectURL(processedBlob));
      }
    } catch (error) {
      console.error('Failed to load upload:', error);
    }
  };

  const handleDelete = async (uploadId) => {
    if (!confirm('Are you sure you want to delete this upload?')) {
      return;
    }

    try {
      await storage.deleteUpload(user.id, uploadId);
      setUploads(uploads.filter(u => u.id !== uploadId));
      
      if (selectedUpload?.id === uploadId) {
        setSelectedUpload(null);
        setOriginalUrl('');
        setProcessedUrl('');
      }
    } catch (error) {
      console.error('Failed to delete upload:', error);
    }
  };

  const handleSignout = () => {
    signout();
    navigate('/signin');
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <Logo className="hover:opacity-80 transition-opacity cursor-pointer" onClick={() => navigate('/')} />
          <div className="flex items-center gap-3">
            <span className="text-sm text-slate-600">{user?.email}</span>
            <button
              onClick={() => navigate('/')}
              className="px-4 py-2 text-sm font-medium text-slate-900 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
            >
              Upload
            </button>
            <button
              onClick={handleSignout}
              className="px-4 py-2 text-sm font-medium text-white bg-slate-800 rounded-lg hover:bg-slate-900 transition-colors"
            >
              Sign Out
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h2 className="text-2xl font-bold text-slate-900 mb-6">Document History</h2>

        {loading ? (
          <div className="bg-white rounded-lg shadow-sm p-8 border border-slate-200 text-center">
            <p className="text-slate-600">Loading...</p>
          </div>
        ) : uploads.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-12 border border-slate-200 text-center">
            {/* Document Icon */}
            <div className="flex justify-center mb-4">
              <svg className="w-20 h-20 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <p className="text-slate-600 text-lg mb-6">No uploads yet</p>
            <button
              onClick={() => navigate('/')}
              className="px-6 py-2.5 bg-slate-800 text-white rounded-lg hover:bg-slate-900 transition-colors font-medium"
            >
              Upload Your First Document
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {uploads.map((upload) => (
              <div key={upload.id}>
                {/* Upload Card */}
                <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-4">
                    {/* Thumbnail */}
                    <div className="w-24 h-24 shrink-0 bg-slate-100 rounded-lg border border-slate-200 flex items-center justify-center overflow-hidden">
                      <svg className="w-10 h-10 text-slate-400" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd"/>
                      </svg>
                    </div>
                    
                    {/* Metadata */}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-slate-900 truncate">{upload.filename}</h3>
                      <p className="text-sm text-slate-600 mt-1">{formatDate(upload.createdAt)}</p>
                      <div className="mt-2">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          upload.status === 'completed' 
                            ? 'bg-emerald-100 text-emerald-700' 
                            : 'bg-blue-100 text-blue-700'
                        }`}>
                          {upload.status === 'completed' && (
                            <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                            </svg>
                          )}
                          {upload.status}
                        </span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleViewUpload(upload)}
                        className="px-4 py-2 text-sm font-medium text-white bg-slate-800 rounded-lg hover:bg-slate-900 transition-colors"
                      >
                        View
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(upload.id);
                        }}
                        className="px-3 py-2 text-sm font-medium text-red-500 border border-red-500 rounded-lg hover:bg-red-50 transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>

                {/* Preview - Shows directly below this card when selected */}
                {selectedUpload?.id === upload.id && (
                  <div className="mt-4 bg-white rounded-lg shadow-sm border border-slate-200 p-6">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
                      <div>
                        <h3 className="text-xl font-semibold text-slate-900">
                          {selectedUpload.filename}
                        </h3>
                        <p className="text-sm text-slate-600 mt-1">
                          {formatDate(selectedUpload.createdAt)}
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <label className="text-sm font-medium text-slate-900">Zoom:</label>
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
                        <button
                          onClick={() => {
                            setSelectedUpload(null);
                            setOriginalUrl('');
                            setProcessedUrl('');
                            setZoom(1);
                          }}
                          className="ml-2 text-slate-400 hover:text-slate-600"
                          title="Close"
                        >
                          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Original */}
                      <div className="border-2 border-slate-200 rounded-lg overflow-hidden">
                        <div className="bg-slate-100 px-4 py-2.5 border-b border-slate-200">
                          <h4 className="text-sm font-semibold text-slate-700">Original</h4>
                        </div>
                        <div className="overflow-auto max-h-[500px] p-4 bg-slate-50 flex items-center justify-center">
                          {originalUrl ? (
                            <img
                              src={originalUrl}
                              alt="Original document"
                              style={{ transform: `scale(${zoom})`, transformOrigin: 'top left' }}
                              className="transition-transform shadow-md"
                            />
                          ) : (
                            <div className="flex items-center justify-center h-48">
                              <p className="text-slate-400">Loading...</p>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Processed */}
                      <div className="border-2 border-slate-800 rounded-lg overflow-hidden">
                        <div className="bg-slate-800 px-4 py-2.5 border-b border-slate-900">
                          <h4 className="text-sm font-semibold text-white">Processed</h4>
                        </div>
                        <div className="overflow-auto max-h-[500px] p-4 bg-white flex items-center justify-center">
                          {processedUrl ? (
                            <img
                              src={processedUrl}
                              alt="Processed document"
                              style={{ transform: `scale(${zoom})`, transformOrigin: 'top left' }}
                              className="transition-transform shadow-md"
                            />
                          ) : (
                            <div className="flex items-center justify-center h-48">
                              <p className="text-slate-400">Loading...</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default History;
