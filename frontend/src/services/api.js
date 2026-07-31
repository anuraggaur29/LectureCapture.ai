import axios from 'axios';

// Live production backend fallback URL
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'https://lecturecapture-ai-backend.vercel.app';

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

  return response.data;
}
