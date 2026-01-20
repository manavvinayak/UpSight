import localforage from 'localforage';

// Initialize storage for files
const fileStore = localforage.createInstance({
  name: 'upsight-files'
});

// Initialize storage for metadata
const metadataStore = localforage.createInstance({
  name: 'upsight-metadata'
});

export const storage = {
  // Save file to storage
  async saveFile(key, blob) {
    await fileStore.setItem(key, blob);
  },

  // Get file from storage
  async getFile(key) {
    return await fileStore.getItem(key);
  },

  // Save upload metadata
  async saveUpload(userId, uploadData) {
    const uploads = await this.getUserUploads(userId);
    uploads.push(uploadData);
    await metadataStore.setItem(`uploads_${userId}`, uploads);
    return uploadData;
  },

  // Get all uploads for a user
  async getUserUploads(userId) {
    const uploads = await metadataStore.getItem(`uploads_${userId}`);
    return uploads || [];
  },

  // Get specific upload
  async getUpload(userId, uploadId) {
    const uploads = await this.getUserUploads(userId);
    return uploads.find(u => u.id === uploadId);
  },

  // Update upload status
  async updateUploadStatus(userId, uploadId, status) {
    const uploads = await this.getUserUploads(userId);
    const index = uploads.findIndex(u => u.id === uploadId);
    if (index !== -1) {
      uploads[index].status = status;
      uploads[index].updatedAt = new Date().toISOString();
      await metadataStore.setItem(`uploads_${userId}`, uploads);
    }
  },

  // Delete upload
  async deleteUpload(userId, uploadId) {
    const uploads = await this.getUserUploads(userId);
    const upload = uploads.find(u => u.id === uploadId);
    
    if (upload) {
      // Delete files
      await fileStore.removeItem(upload.originalFileKey);
      if (upload.processedFileKey) {
        await fileStore.removeItem(upload.processedFileKey);
      }
      
      // Remove from metadata
      const filtered = uploads.filter(u => u.id !== uploadId);
      await metadataStore.setItem(`uploads_${userId}`, filtered);
    }
  }
};
