import React, { useState } from 'react';
import { Box, ThemeProvider, CssBaseline } from '@mui/material';
import { theme } from './theme/theme';
import Navbar from './components/Navbar';
import LandingPage from './pages/LandingPage';
import UploadPage from './pages/UploadPage';
import ProcessingPage from './pages/ProcessingPage';
import StudySheetPage from './pages/StudySheetPage';

export default function App() {
  const [currentStep, setCurrentStep] = useState('landing');
  const [selectedFile, setSelectedFile] = useState(null);
  const [studySheet, setStudySheet] = useState(null);
  const [providerUsed, setProviderUsed] = useState('Mistral AI');

  const handleStart = () => {
    setCurrentStep('upload');
  };

  const handleSubmitFile = (file) => {
    setSelectedFile(file);
    setCurrentStep('processing');
  };

  const handleProcessSuccess = (sheetData, provider) => {
    setStudySheet(sheetData);
    setProviderUsed(provider || 'Mistral AI');
    setCurrentStep('study-sheet');
  };

  const handleReset = (targetStep = 'landing') => {
    setSelectedFile(null);
    setStudySheet(null);
    setCurrentStep(targetStep);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#f8fafc' }}>
        <Navbar onReset={handleReset} currentStep={currentStep} />
        
        <Box sx={{ flexGrow: 1 }}>
          {currentStep === 'landing' && <LandingPage onStart={handleStart} />}

          {currentStep === 'upload' && (
            <UploadPage
              onSubmitFile={handleSubmitFile}
              onBack={() => setCurrentStep('landing')}
            />
          )}

          {currentStep === 'processing' && (
            <ProcessingPage
              file={selectedFile}
              onSuccess={handleProcessSuccess}
              onRetry={() => setCurrentStep('upload')}
            />
          )}

          {currentStep === 'study-sheet' && (
            <StudySheetPage
              studySheet={studySheet}
              providerUsed={providerUsed}
              onNewUpload={() => handleReset('upload')}
            />
          )}
        </Box>

        <Box
          component="footer"
          sx={{
            py: 3,
            px: 2,
            mt: 'auto',
            textAlign: 'center',
            borderTop: '1px solid #e2e8f0',
            background: '#ffffff',
            color: '#64748b',
            fontSize: '0.875rem',
          }}
        >
          © {new Date().getFullYear()} LectureCapture AI v2 · Mistral AI Powered · Production MVP
        </Box>
      </Box>
    </ThemeProvider>
  );
}
