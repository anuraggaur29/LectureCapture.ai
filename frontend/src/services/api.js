import axios from 'axios';

// Backend URL fallback (for local dev and Vercel production deployment)
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:7860';

export async function processFile(file, onProgress) {
  const formData = new FormData();
  formData.append('file', file);

  const response = await axios.post(`${BACKEND_URL}/api/process`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    onUploadProgress: (progressEvent) => {
      if (onProgress && progressEvent.total) {
        const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        onProgress(percent);
      }
    },
  });

  return response.data; // { success: true, provider_used: "Mistral AI", data: StudySheetResponse }
}
