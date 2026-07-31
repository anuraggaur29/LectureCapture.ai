import React, { useEffect, useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  CircularProgress,
  LinearProgress,
  Alert,
  Button,
  Stepper,
  Step,
  StepLabel,
  Paper
} from '@mui/material';
import { AutoAwesome, Refresh } from '../components/MuiIcons';
import { processFile } from '../services/api';

export default function ProcessingPage({ file, onSuccess, onError, onRetry }) {
  const [activeStep, setActiveStep] = useState(0);
  const [uploadPercent, setUploadPercent] = useState(0);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    let isMounted = true;

    async function runPipeline() {
      try {
        setActiveStep(0);
        const response = await processFile(file, (percent) => {
          if (isMounted) setUploadPercent(percent);
        });

        if (!isMounted) return;

        setActiveStep(1);
        await new Promise((r) => setTimeout(r, 600));

        setActiveStep(2);
        await new Promise((r) => setTimeout(r, 600));

        if (response && response.success) {
          onSuccess(response.data, response.provider_used);
        } else {
          throw new Error('Invalid response received from server.');
        }
      } catch (err) {
        if (!isMounted) return;
        const msg = err.response?.data?.detail || err.message || 'Processing failed. Please check your API key and file format.';
        setErrorMessage(msg);
        if (onError) onError(msg);
      }
    }

    if (file) {
      runPipeline();
    }

    return () => {
      isMounted = false;
    };
  }, [file]);

  return (
    <Container maxWidth="sm" sx={{ py: 10 }}>
      <Card sx={{ p: 4, textAlign: 'center' }}>
        <CardContent>
          {!errorMessage ? (
            <>
              <Box sx={{ position: 'relative', display: 'inline-flex', mb: 3 }}>
                <CircularProgress
                  size={72}
                  thickness={4}
                  color="primary"
                />
                <Box
                  sx={{
                    top: 0,
                    left: 0,
                    bottom: 0,
                    right: 0,
                    position: 'absolute',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'primary.main',
                  }}
                >
                  <AutoAwesome />
                </Box>
              </Box>

              <Typography variant="h5" sx={{ fontWeight: 700, color: 'text.primary', mb: 1 }}>
                Generating Study Sheet…
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary', mb: 4 }}>
                Mistral AI is analyzing your lecture material and constructing structured revision notes.
              </Typography>

              {/* MUI STEPPER */}
              <Paper variant="outlined" sx={{ p: 3, backgroundColor: '#f8f9fa', borderRadius: 2 }}>
                <Stepper activeStep={activeStep} orientation="vertical">
                  <Step key={0}>
                    <StepLabel>
                      <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                        Step 1: Uploading File
                      </Typography>
                    </StepLabel>
                    {activeStep === 0 && (
                      <Box sx={{ width: '100%', mt: 1, mb: 1 }}>
                        <LinearProgress variant="determinate" value={uploadPercent} sx={{ borderRadius: 1, height: 6 }} />
                        <Typography variant="caption" sx={{ color: 'text.secondary', mt: 0.5, display: 'block' }}>
                          {uploadPercent}% uploaded
                        </Typography>
                      </Box>
                    )}
                  </Step>

                  <Step key={1}>
                    <StepLabel>
                      <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                        Step 2: Extracting Text Content
                      </Typography>
                    </StepLabel>
                  </Step>

                  <Step key={2}>
                    <StepLabel>
                      <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                        Step 3: Synthesizing JSON Study Sheet (Mistral AI)
                      </Typography>
                    </StepLabel>
                  </Step>
                </Stepper>
              </Paper>
            </>
          ) : (
            <>
              <Alert severity="error" sx={{ mb: 3, textAlign: 'left' }}>
                {errorMessage}
              </Alert>
              <Button
                variant="contained"
                color="primary"
                startIcon={<Refresh />}
                onClick={onRetry}
                sx={{ mt: 2 }}
              >
                Try Another File
              </Button>
            </>
          )}
        </CardContent>
      </Card>
    </Container>
  );
}
