import React from 'react';
import { Box, Container, Typography, Button, Grid, Card, CardContent, Stack, Chip } from '@mui/material';
import { AutoAwesome, Description, Speed, ArrowForward } from '../components/MuiIcons';

export default function LandingPage({ onStart }) {
  return (
    <Box sx={{ py: { xs: 6, md: 10 } }}>
      <Container maxWidth="lg">
        {/* HERO SECTION */}
        <Box sx={{ textAlign: 'center', maxWidth: 800, mx: 'auto', mb: 8 }}>
          <Chip
            icon={<AutoAwesome style={{ fontSize: 16, color: '#1a73e8' }} />}
            label="LectureCapture AI v2 — Mistral AI Powered"
            sx={{
              mb: 3,
              px: 1.5,
              py: 0.5,
              fontWeight: 600,
              fontSize: '0.875rem',
              backgroundColor: 'primary.light',
              color: 'primary.dark',
              border: '1px solid #c2e7ff',
            }}
          />
          <Typography
            variant="h1"
            sx={{
              fontSize: { xs: '2.25rem', sm: '3.25rem', md: '3.75rem' },
              fontWeight: 700,
              lineHeight: 1.15,
              color: 'text.primary',
              mb: 2.5,
            }}
          >
            Turn Lectures & PDFs into{' '}
            <Typography
              component="span"
              variant="inherit"
              color="primary.main"
              sx={{ fontWeight: 700 }}
            >
              1-Page Study Sheets
            </Typography>
          </Typography>
          <Typography
            variant="h6"
            sx={{ color: 'text.secondary', fontWeight: 400, mb: 4, lineHeight: 1.6 }}
          >
            Upload any Video, Audio recording, or PDF slides. Get a concise, exam-focused 1-to-2 page Study Sheet with Learning Objectives, Key Concepts, Definitions, Formulas, Examples & Revision Notes in seconds.
          </Typography>

          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="center">
            <Button
              variant="contained"
              color="primary"
              size="large"
              onClick={onStart}
              endIcon={<ArrowForward />}
              sx={{
                py: 1.5,
                px: 4,
                fontSize: '1rem',
                borderRadius: 2,
              }}
            >
              Get Started — Upload Lecture
            </Button>
          </Stack>
        </Box>

        {/* FEATURES GRID */}
        <Grid container spacing={3} sx={{ mt: 2 }}>
          <Grid item xs={12} md={4}>
            <Card sx={{ height: '100%', backgroundColor: '#ffffff', p: 1 }}>
              <CardContent>
                <Box
                  sx={{
                    width: 44,
                    height: 44,
                    borderRadius: 2,
                    backgroundColor: 'primary.light',
                    color: 'primary.main',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mb: 2,
                  }}
                >
                  <Description />
                </Box>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 1, color: 'text.primary' }}>
                  Video, Audio & PDF Support
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.6 }}>
                  Directly process audio (.mp3, .wav), lecture videos (.mp4), or reading PDFs. Automatic speech transcription & document text extraction.
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card sx={{ height: '100%', backgroundColor: '#ffffff', p: 1 }}>
              <CardContent>
                <Box
                  sx={{
                    width: 44,
                    height: 44,
                    borderRadius: 2,
                    backgroundColor: 'secondary.light',
                    color: 'secondary.main',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mb: 2,
                  }}
                >
                  <AutoAwesome />
                </Box>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 1, color: 'text.primary' }}>
                  Mistral AI Architecture
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.6 }}>
                  Engineered with a modular Provider Abstraction layer powered by Mistral AI, delivering zero transcript bloat and structured JSON outputs.
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card sx={{ height: '100%', backgroundColor: '#ffffff', p: 1 }}>
              <CardContent>
                <Box
                  sx={{
                    width: 44,
                    height: 44,
                    borderRadius: 2,
                    backgroundColor: '#e6f4ea',
                    color: '#1e8e3e',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mb: 2,
                  }}
                >
                  <Speed />
                </Box>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 1, color: 'text.primary' }}>
                  Exam-Ready 1-Page Format
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.6 }}>
                  Structured JSON rendered into 10 high-yield sections: Objectives, Concepts, Definitions, Formulas, Common Mistakes & Revision Notes.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
