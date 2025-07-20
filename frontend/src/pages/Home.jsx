import React from 'react';
import { Box, Typography, Paper, Grid, Button, useTheme } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { Science, Speed, Analytics } from '@mui/icons-material';

const FeatureCard = ({ icon, title, description, sx }) => {
  const theme = useTheme();
  return (
    <Paper
      sx={{
        p: 3,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        overflow: 'hidden',
        transition: 'transform 0.2s ease-in-out',
        '&:hover': {
          transform: 'translateY(-4px)',
        },
        ...sx,
      }}
      elevation={0}
    >
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          right: 0,
          p: 2,
          opacity: 0.1,
          transform: 'translateX(20%) translateY(-20%)',
        }}
      >
        {React.cloneElement(icon, { sx: { fontSize: 100 } })}
      </Box>
      <Typography variant="h6" gutterBottom color="primary" fontWeight={600}>
        {title}
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        {description}
      </Typography>
    </Paper>
  );
};

const Home = () => {
  const navigate = useNavigate();
  const theme = useTheme();

  return (
    <Box
      sx={{
        maxWidth: 'xl',
        mx: 'auto',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        gap: 6,
      }}
    >
      <Box
        sx={{
          textAlign: 'center',
          pt: { xs: 4, sm: 6, md: 8 },
        }}
      >
        <Typography
          variant="h3"
          gutterBottom
          sx={{
            fontWeight: 800,
            background: theme.palette.mode === 'dark'
              ? 'linear-gradient(45deg, #2196f3 30%, #21CBF3 90%)'
              : 'linear-gradient(45deg, #2196f3 30%, #1976d2 90%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          Welcome to AI System
        </Typography>
        <Typography
          variant="h6"
          color="text.secondary"
          sx={{
            mb: 4,
            maxWidth: 'md',
            mx: 'auto',
          }}
        >
          A powerful platform for managing and deploying AI models with ease
        </Typography>
        <Button
          variant="contained"
          size="large"
          onClick={() => navigate('/dashboard')}
          sx={{
            px: 4,
            py: 1.5,
            fontSize: '1.1rem',
            boxShadow: theme.palette.mode === 'dark'
              ? '0 0 20px rgba(33, 150, 243, 0.3)'
              : '0 4px 20px rgba(0, 0, 0, 0.1)',
          }}
        >
          Get Started
        </Button>
      </Box>

      <Grid container spacing={4}>
        <Grid item xs={12} md={4}>
          <FeatureCard
            icon={<Science />}
            title="AI Models"
            description="Deploy and manage machine learning models with our intuitive interface. Support for multiple model types and easy integration."
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <FeatureCard
            icon={<Speed />}
            title="Real-time Processing"
            description="Process data in real-time with high-performance endpoints. Monitor model performance and get instant insights."
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <FeatureCard
            icon={<Analytics />}
            title="Analytics"
            description="Comprehensive analytics dashboard to monitor your models' performance, usage patterns, and system health."
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default Home;
