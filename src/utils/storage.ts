// Maximum size for localStorage (in bytes)
const MAX_STORAGE_SIZE = 5 * 1024 * 1024; // 5MB

interface StoredResume {
  id: string;
  name: string;
  size: string;
  previewUrl: string;
  timestamp: number;
}

export const resumeStorage = {
  savePreview(id: string, name: string, size: string, previewUrl: string) {
    try {
      // Get existing previews
      const previews = this.getAllPreviews();
      
      // Add new preview
      previews[id] = {
        id,
        name,
        size,
        previewUrl,
        timestamp: Date.now()
      };

      // Calculate total size
      let totalSize = 0;
      const sortedPreviews = Object.values(previews)
        .sort((a, b) => b.timestamp - a.timestamp);

      // Remove oldest previews if exceeding size limit
      while (totalSize > MAX_STORAGE_SIZE && sortedPreviews.length > 0) {
        const oldest = sortedPreviews.pop();
        if (oldest) {
          delete previews[oldest.id];
        }
      }

      localStorage.setItem('resume_previews', JSON.stringify(previews));
      return true;
    } catch (error) {
      console.error('Error saving preview to localStorage:', error);
      return false;
    }
  },

  getPreview(id: string): StoredResume | null {
    try {
      const previews = this.getAllPreviews();
      return previews[id] || null;
    } catch (error) {
      console.error('Error getting preview from localStorage:', error);
      return null;
    }
  },

  getAllPreviews(): Record<string, StoredResume> {
    try {
      const stored = localStorage.getItem('resume_previews');
      return stored ? JSON.parse(stored) : {};
    } catch (error) {
      console.error('Error getting all previews from localStorage:', error);
      return {};
    }
  },

  removePreview(id: string) {
    try {
      const previews = this.getAllPreviews();
      delete previews[id];
      localStorage.setItem('resume_previews', JSON.stringify(previews));
      return true;
    } catch (error) {
      console.error('Error removing preview from localStorage:', error);
      return false;
    }
  },

  clearPreviews() {
    try {
      localStorage.removeItem('resume_previews');
      return true;
    } catch (error) {
      console.error('Error clearing previews from localStorage:', error);
      return false;
    }
  }
};