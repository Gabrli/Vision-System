import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Grid, 
  useTheme, 
  ToggleButton, 
  ToggleButtonGroup,
  Card,
  CardContent,
  Chip,
  Divider
} from '@mui/material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import axios from 'axios';
import { format, parseISO } from 'date-fns';
import { VideoCamera, ChartLine, Calendar } from '@phosphor-icons/react';
import { styled } from '@mui/material/styles';

const StyledToggleButtonGroup = styled(ToggleButtonGroup)(({ theme }) => ({
  backgroundColor: 'white',
  borderRadius: '28px',
  padding: '4px',
  boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
  '& .MuiToggleButton-root': {
    border: 'none',
    borderRadius: '24px',
    padding: '8px 16px',
    textTransform: 'none',
    fontSize: '0.875rem',
    fontWeight: 500,
    color: 'rgba(0, 0, 0, 0.6)',
    '&:hover': {
      backgroundColor: 'rgba(25, 118, 210, 0.08)',
    },
    '&.Mui-selected': {
      backgroundColor: theme.palette.primary.main,
      color: 'white',
      '&:hover': {
        backgroundColor: theme.palette.primary.dark,
      },
    },
  },
  '& .MuiToggleButtonGroup-grouped': {
    margin: '0 4px',
    '&:first-of-type': {
      marginLeft: 0,
    },
    '&:last-of-type': {
      marginRight: 0,
    },
  },
}));

const Dashboard = () => {
  const theme = useTheme();
  const [selectedModel, setSelectedModel] = useState('all');
  const [dailyData, setDailyData] = useState([]);
  const [weeklyData, setWeeklyData] = useState([]);
  const [stats, setStats] = useState({
    totalDetections: 0,
    objectDetections: 0,
    segmentations: 0,
    poseEstimations: 0
  });
  const [selectedClass, setSelectedClass] = useState('all');
  const [classOptions, setClassOptions] = useState([]);

  const handleModelChange = (event, newModel) => {
    if (newModel !== null) {
      setSelectedModel(newModel);
    }
  };

  useEffect(() => {
    fetchDetectionStats();
    fetchClassOptions();
  }, [selectedModel]);

  const fetchDetectionStats = async () => {
    try {
      const dailyResponse = await axios.get(`http://localhost:8000/api/detection-stats/daily?model=${selectedModel}`);
      const weeklyResponse = await axios.get(`http://localhost:8000/api/detection-stats/weekly?model=${selectedModel}`);
      const statsResponse = await axios.get('http://localhost:8000/api/detection-stats/summary');
      
      setDailyData(dailyResponse.data.map(item => ({
        ...item,
        hour: format(parseISO(item.timestamp), 'HH:mm'),
        count: parseInt(item.count)
      })));

      setWeeklyData(weeklyResponse.data.map(item => ({
        ...item,
        date: format(parseISO(item.date), 'MMM dd'),
        count: parseInt(item.count)
      })));

      setStats(statsResponse.data);
    } catch (error) {
      console.error('Error fetching detection stats:', error);
    }
  };

  const fetchClassOptions = async () => {
    try {
      const response = await axios.get(`http://localhost:8000/api/detection-stats/classes?model=${selectedModel}`);
      setClassOptions(response.data);
    } catch (error) {
      console.error('Error fetching class options:', error);
    }
  };

  return (
    <Box sx={{ p: 3 }} >
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        mb: 4 
      }}>
        <Typography
          variant="h4"
          sx={{
            fontWeight: 700,
            background: 'linear-gradient(45deg, #2196f3 30%, #21CBF3 90%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          Detection Analytics
        </Typography>

        <StyledToggleButtonGroup
          value={selectedModel}
          exclusive
          onChange={handleModelChange}
          aria-label="model selection"
        >
          <ToggleButton value="all">All Models</ToggleButton>
          <ToggleButton value="objectDetection">Object Detection</ToggleButton>
          <ToggleButton value="segmentation">Segmentation</ToggleButton>
          <ToggleButton value="pose">Pose Estimation</ToggleButton>
        </StyledToggleButtonGroup>
      </Box>

      {/* Stats Cards - More compact */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} md={3}>
          <Card elevation={0} sx={{ 
            bgcolor: 'primary.light', 
            color: 'primary.contrastText',
            height: '120px'
          }}>
            <CardContent sx={{ py: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="subtitle1">Total Detections</Typography>
                <VideoCamera size={20} />
              </Box>
              <Typography variant="h4" sx={{ mt: 1, fontWeight: 'bold' }}>
                {stats.totalDetections}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card elevation={0} sx={{ 
            bgcolor: 'success.light',
            height: '120px'
          }}>
            <CardContent sx={{ py: 2 }}>
              <Typography variant="subtitle1" color="success.contrastText">Object Detections</Typography>
              <Typography variant="h4" sx={{ mt: 1, fontWeight: 'bold' }} color="success.contrastText">
                {stats.objectDetections}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card elevation={0} sx={{ 
            bgcolor: 'warning.light',
            height: '120px'
          }}>
            <CardContent sx={{ py: 2 }}>
              <Typography variant="subtitle1" color="warning.contrastText">Segmentations</Typography>
              <Typography variant="h4" sx={{ mt: 1, fontWeight: 'bold' }} color="warning.contrastText">
                {stats.segmentations}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card elevation={0} sx={{ 
            bgcolor: 'info.light',
            height: '120px'
          }}>
            <CardContent sx={{ py: 2 }}>
              <Typography variant="subtitle1" color="info.contrastText">Pose Estimations</Typography>
              <Typography variant="h4" sx={{ mt: 1, fontWeight: 'bold' }} color="info.contrastText">
                {stats.poseEstimations}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        {/* Today's Detections Chart */}
        <Grid item xs={12}>
          <Paper 
            elevation={0} 
            sx={{ 
              p: 3, 
              mb: 3, 
              bgcolor: 'background.paper',
              borderRadius: 2,
              border: 1,
              borderColor: 'divider'
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <ChartLine size={24} style={{ marginRight: '8px' }} />
                <Typography variant="h6">Today's Detections</Typography>
              </Box>
              
              {/* Class Filter Chips */}
              {selectedModel !== 'all' && (
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Chip
                    label="All Classes"
                    onClick={() => setSelectedClass('all')}
                    color={selectedClass === 'all' ? 'primary' : 'default'}
                    variant={selectedClass === 'all' ? 'filled' : 'outlined'}
                  />
                  {classOptions.map((className) => (
                    <Chip
                      key={className}
                      label={className}
                      onClick={() => setSelectedClass(className)}
                      color={selectedClass === className ? 'primary' : 'default'}
                      variant={selectedClass === className ? 'filled' : 'outlined'}
                    />
                  ))}
                </Box>
              )}
            </Box>
            <Divider sx={{ mb: 3 }} />
            <Box sx={{ height: 300 }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={dailyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke={theme.palette.divider} />
                  <XAxis 
                    dataKey="hour"
                    tick={{ fill: theme.palette.text.secondary }}
                  />
                  <YAxis 
                    tick={{ fill: theme.palette.text.secondary }}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: theme.palette.background.paper,
                      border: `1px solid ${theme.palette.divider}`
                    }}
                    formatter={(value, name) => [value, 'Detections']}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="count" 
                    stroke={theme.palette.primary.main}
                    strokeWidth={2}
                    dot={{ fill: theme.palette.primary.main }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </Box>
          </Paper>
        </Grid>

        {/* Weekly Analysis Chart */}
        <Grid item xs={12}>
          <Paper 
            elevation={0} 
            sx={{ 
              p: 3,
              bgcolor: 'background.paper',
              borderRadius: 2,
              border: 1,
              borderColor: 'divider'
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Calendar size={24} style={{ marginRight: '8px' }} />
              <Typography variant="h6">Weekly Detection Analysis</Typography>
            </Box>
            <Divider sx={{ mb: 3 }} />
            <Box sx={{ height: 300 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={weeklyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke={theme.palette.divider} />
                  <XAxis 
                    dataKey="date"
                    tick={{ fill: theme.palette.text.secondary }}
                  />
                  <YAxis 
                    tick={{ fill: theme.palette.text.secondary }}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: theme.palette.background.paper,
                      border: `1px solid ${theme.palette.divider}`
                    }}
                  />
                  <Bar 
                    dataKey="count" 
                    fill={theme.palette.primary.main}
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;
