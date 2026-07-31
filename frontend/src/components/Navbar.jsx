import React from 'react';
import { AppBar, Toolbar, Typography, Box, Button, Chip, Container } from '@mui/material';
import { School, AutoAwesome, Add } from './MuiIcons';

export default function Navbar({ onReset, currentStep }) {
  return (
    <AppBar position="sticky">
      <Container maxWidth="lg">
        <Toolbar disableGutters sx={{ justifyContent: 'space-between' }}>
          <Box 
            sx={{ display: 'flex', alignItems: 'center', gap: 1.5, cursor: 'pointer' }}
            onClick={() => onReset('landing')}
          >
            <Box
              sx={{
                width: 36,
                height: 36,
                borderRadius: 2,
                backgroundColor: 'primary.main',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#ffffff',
              }}
            >
              <School fontSize="small" />
            </Box>
            <Typography variant="h6" sx={{ fontWeight: 700, color: 'text.primary', letterSpacing: '-0.01em' }}>
              LectureCapture <Typography component="span" variant="h6" color="primary.main" sx={{ fontWeight: 700 }}>AI v2</Typography>
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Chip
              icon={<AutoAwesome style={{ fontSize: 16, color: '#1a73e8' }} />}
              label="Mistral AI Powered"
              size="small"
              sx={{
                backgroundColor: 'primary.light',
                color: 'primary.dark',
                fontWeight: 500,
                border: '1px solid #c2e7ff',
                display: { xs: 'none', sm: 'inline-flex' }
              }}
            />
            {currentStep !== 'landing' && (
              <Button 
                variant="outlined" 
                size="small"
                startIcon={<Add />}
                onClick={() => onReset('upload')}
                sx={{ borderColor: '#dadce0', color: 'text.primary' }}
              >
                New Upload
              </Button>
            )}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
