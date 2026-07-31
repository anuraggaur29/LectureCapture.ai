import React, { useState } from 'react';
import { Box, Typography, Button, Paper, Chip } from '@mui/material';
import { CloudUpload, PictureAsPdf, Audiotrack, Videocam, Close } from './MuiIcons';

export default function FileDropzone({ selectedFile, onFileSelect, onClearFile }) {
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      onFileSelect(e.dataTransfer.files[0]);
    }
  };

  const getFileIcon = (file) => {
    if (!file) return null;
    const name = file.name.toLowerCase();
    if (name.endsWith('.pdf')) return <PictureAsPdf sx={{ fontSize: 40, color: '#d93025' }} />;
    if (name.endsWith('.mp4') || name.endsWith('.webm')) return <Videocam sx={{ fontSize: 40, color: '#00796b' }} />;
    return <Audiotrack sx={{ fontSize: 40, color: '#1a73e8' }} />;
  };

  const formatSize = (bytes) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / 1048576).toFixed(1) + ' MB';
  };

  return (
    <Box>
      {!selectedFile ? (
        <Paper
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          sx={{
            p: 5,
            textAlign: 'center',
            cursor: 'pointer',
            border: isDragOver ? '2px dashed #1a73e8' : '2px dashed #dadce0',
            backgroundColor: isDragOver ? '#e8f0fe' : '#f8f9fa',
            transition: 'all 0.2s ease-in-out',
            borderRadius: 3,
            '&:hover': {
              borderColor: '#1a73e8',
              backgroundColor: '#f1f3f4',
            },
          }}
          component="label"
        >
          <input
            type="file"
            hidden
            accept=".mp3,.wav,.m4a,.ogg,.mp4,.webm,.pdf,audio/*,video/*,application/pdf"
            onChange={(e) => e.target.files?.[0] && onFileSelect(e.target.files[0])}
          />
          <CloudUpload sx={{ fontSize: 52, color: isDragOver ? 'primary.main' : '#80868b', mb: 1 }} />
          <Typography variant="h6" sx={{ color: 'text.primary', fontWeight: 600 }}>
            Drag & drop your lecture file here
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5, mb: 2 }}>
            or browse from your device
          </Typography>

          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1, flexWrap: 'wrap' }}>
            <Chip icon={<Videocam />} label="Video (.mp4, .webm)" size="small" variant="outlined" />
            <Chip icon={<Audiotrack />} label="Audio (.mp3, .wav, .m4a)" size="small" variant="outlined" />
            <Chip icon={<PictureAsPdf />} label="Document (.pdf)" size="small" variant="outlined" />
          </Box>
        </Paper>
      ) : (
        <Paper
          elevation={1}
          sx={{
            p: 3,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: '#ffffff',
            border: '1px solid #e0e0e0',
            borderRadius: 2,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            {getFileIcon(selectedFile)}
            <Box>
              <Typography variant="subtitle1" sx={{ fontWeight: 600, color: 'text.primary' }}>
                {selectedFile.name}
              </Typography>
              <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                {formatSize(selectedFile.size)} · Ready for AI processing
              </Typography>
            </Box>
          </Box>
          <Button
            size="small"
            color="error"
            onClick={onClearFile}
            startIcon={<Close />}
            sx={{ textTransform: 'none' }}
          >
            Remove
          </Button>
        </Paper>
      )}
    </Box>
  );
}
