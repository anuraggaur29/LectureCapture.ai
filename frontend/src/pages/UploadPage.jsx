import React, { useState } from 'react';
import { Box, Container, Typography, Card, CardContent, Button, Alert } from '@mui/material';
import FileDropzone from '../components/FileDropzone';
import { AutoAwesome, ArrowBack } from '../components/MuiIcons';

export default function UploadPage({ onSubmitFile, onBack }) {
  const [file, setFile] = useState(null);
  const [error, setError] = useState('');

  const handleProcess = () => {
    if (!file) {
      setError('Please select a Video, Audio, or PDF file to process.');
      return;
    }
    setError('');
    onSubmitFile(file);
  };

  return (
    <Container maxWidth="md" sx={{ py: 6 }}>
      <Button
        startIcon={<ArrowBack />}
        onClick={onBack}
        sx={{ mb: 3, color: 'text.secondary' }}
      >
        Back to Home
      </Button>

      <Card sx={{ p: { xs: 2, md: 4 } }}>
        <CardContent>
          <Typography variant="h4" sx={{ fontWeight: 700, color: 'text.primary', mb: 1 }}>
            Upload Lecture or Reading Material
          </Typography>
          <Typography variant="body1" sx={{ color: 'text.secondary', mb: 4 }}>
            Select an Audio recording (.mp3, .wav), Video (.mp4), or PDF file (.pdf). Our AI will extract the content and generate a structured 1-page study sheet.
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError('')}>
              {error}
            </Alert>
          )}

          <FileDropzone
            selectedFile={file}
            onFileSelect={(selected) => {
              setFile(selected);
              setError('');
            }}
            onClearFile={() => setFile(null)}
          />

          <Box sx={{ mt: 4, textAlign: 'right' }}>
            <Button
              variant="contained"
              color="primary"
              size="large"
              disabled={!file}
              onClick={handleProcess}
              startIcon={<AutoAwesome />}
              sx={{
                py: 1.5,
                px: 4,
                fontSize: '1rem',
                borderRadius: 2,
              }}
            >
              Generate Study Sheet
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
}
