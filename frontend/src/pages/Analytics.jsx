import React, { useState } from 'react';
import {
  Box,
  Typography,
  Grid,
  Paper,
  useTheme,
  LinearProgress,
} from '@mui/material';

const MetricCard = ({ title, value, change, color }) => {
  const theme = useTheme();
  
  return (
    <Paper
      elevation={0}
      sx={{
        p: 3,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        transition: 'transform 0.2s ease-in-out',
        '&:hover': {
          transform: 'translateY(-4px)',
        },
        border: `1px solid ${theme.palette.divider}`,
      }}
    >
      <Typography variant="h6" gutterBottom fontWeight={600}>
        {title}
      </Typography>
      <Typography
        variant="h4"
        sx={{
          color: color,
          fontWeight: 700,
          mb: 1,
        }}
      >
        {value}
      </Typography>
      <Typography
        variant="body2"
        sx={{
          color: change >= 0 ? 'success.main' : 'error.main',
        }}
      >
        {change >= 0 ? '+' : ''}{change}% from last hour
      </Typography>
    </Paper>
  );
};

const ModelMetrics = ({ name, metrics }) => {
  const theme = useTheme();
  
  return (
    <Paper
      elevation={0}
      sx={{
        p: 3,
        height: '100%',
        border: `1px solid ${theme.palette.divider}`,
      }}
    >
      <Typography variant="h6" gutterBottom fontWeight={600}>
        {name}
      </Typography>
      {metrics.map((metric) => (
        <Box key={metric.name} sx={{ mb: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant="body2">{metric.name}</Typography>
            <Typography variant="body2" fontWeight={600}>
              {metric.value}%
            </Typography>
          </Box>
          <LinearProgress
            variant="determinate"
            value={metric.value}
            sx={{
              height: 8,
              borderRadius: 4,
              backgroundColor: theme.palette.mode === 'dark'
                ? 'rgba(255, 255, 255, 0.08)'
                : 'rgba(0, 0, 0, 0.08)',
              '& .MuiLinearProgress-bar': {
                borderRadius: 4,
              },
            }}
          />
        </Box>
      ))}
    </Paper>
  );
};

const Analytics = () => {
  const theme = useTheme();
  const [selectedModel, setSelectedModel] = useState(null);

  // Mock data - replace with real-time data from your backend
  const metrics = [
    { title: 'Total Requests', value: '2.5k', change: 12.5, color: theme.palette.primary.main },
    { title: 'Avg Response Time', value: '45ms', change: -8.2, color: theme.palette.warning.main },
    { title: 'Success Rate', value: '99.9%', change: 0.5, color: theme.palette.success.main },
    { title: 'Active Models', value: '8', change: 33.3, color: theme.palette.info.main },
  ];

  const modelMetrics = [
    {
      name: 'Ultralytics Pose Model',
      metrics: [
        { name: 'Accuracy', value: 95 },
        { name: 'F1 Score', value: 92 },
        { name: 'Precision', value: 94 },
      ],
    },
    {
      name: 'Image Recognition Model',
      metrics: [
        { name: 'Accuracy', value: 88 },
        { name: 'Recall', value: 86 },
        { name: 'mAP', value: 82 },
      ],
    },
  ];

  const handleModelClick = (model) => {
    setSelectedModel(model);
  };

  return (
    <Box>
      <Typography
        variant="h4"
        sx={{
          mb: 4,
          fontWeight: 700,
          background: theme.palette.mode === 'dark'
            ? 'linear-gradient(45deg, #2196f3 30%, #21CBF3 90%)'
            : 'linear-gradient(45deg, #2196f3 30%, #1976d2 90%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
        }}
      >
        Live Analytics
      </Typography>

      <Grid container spacing={3}>
        {metrics.map((metric) => (
          <Grid item xs={12} sm={6} md={3} key={metric.title}>
            <MetricCard {...metric} />
          </Grid>
        ))}

        {modelMetrics.map((model) => (
          <Grid item xs={12} md={6} key={model.name} onClick={() => handleModelClick(model)}>
            <ModelMetrics {...model} />
          </Grid>
        ))}
      </Grid>

      {selectedModel && (
        <Box mt={4}>
          <Typography variant="h5">Selected Model for Live Analysis: {selectedModel.name}</Typography>
        </Box>
      )}
    </Box>
  );
};

export default Analytics;
