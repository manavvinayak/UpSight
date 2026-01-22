// Base API URL
const API_URL = 'http://localhost:5000/api';

// Helper function to get auth token
const getAuthToken = () => {
  return localStorage.getItem('token');
};

// Upload document with original and processed images
export const uploadDocument = async (originalFile, processedBlob, fileName) => {
  try {
    const formData = new FormData();
    formData.append('original', originalFile);
    formData.append('processed', processedBlob, fileName);
    formData.append('fileName', fileName);

    const token = getAuthToken();
    const response = await fetch(`${API_URL}/documents/upload`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: formData
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to upload document');
    }

    return await response.json();
  } catch (error) {
    console.error('Upload document error:', error);
    throw error;
  }
};

// Get all documents for the authenticated user
export const getDocuments = async () => {
  try {
    const token = getAuthToken();
    const response = await fetch(`${API_URL}/documents`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to fetch documents');
    }

    return await response.json();
  } catch (error) {
    console.error('Get documents error:', error);
    throw error;
  }
};

// Get a single document by ID
export const getDocument = async (id) => {
  try {
    const token = getAuthToken();
    const response = await fetch(`${API_URL}/documents/${id}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to fetch document');
    }

    return await response.json();
  } catch (error) {
    console.error('Get document error:', error);
    throw error;
  }
};

// Delete a document
export const deleteDocument = async (id) => {
  try {
    const token = getAuthToken();
    const response = await fetch(`${API_URL}/documents/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to delete document');
    }

    return await response.json();
  } catch (error) {
    console.error('Delete document error:', error);
    throw error;
  }
};
