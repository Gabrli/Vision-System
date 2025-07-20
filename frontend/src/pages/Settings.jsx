import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Grid,
  Collapse,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Card,
  CardContent,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Fade,
  Alert,
  Snackbar,
  Tooltip,
  InputAdornment,
  Divider,
  Container,
  Tab,
  Tabs,
  Avatar
} from '@mui/material';
import { 
  Delete, 
  Edit, 
  Videocam, 
  Add, 
  LocationOn, 
  Info,
  Check,
  Close,
  Settings as SettingsIcon,
  CameraAlt,
  Security,
  Notifications,
  Storage
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';

// Styled components
const StyledCard = styled(Card)(({ theme }) => ({
  borderRadius: 16,
  border: `1px solid ${theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.12)' : 'rgba(0, 0, 0, 0.12)'}`,
  boxShadow: theme.palette.mode === 'dark' 
    ? '0 4px 24px rgba(0, 0, 0, 0.4)' 
    : '0 4px 24px rgba(0, 0, 0, 0.06)',
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: theme.palette.mode === 'dark' 
      ? '0 8px 32px rgba(0, 0, 0, 0.5)' 
      : '0 8px 32px rgba(0, 0, 0, 0.08)',
  },
}));

const CameraCard = styled(Card)(({ theme }) => ({
  borderRadius: 12,
  transition: 'all 0.2s ease',
  cursor: 'pointer',
  border: `1px solid ${theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.08)'}`,
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: theme.shadows[4],
    borderColor: theme.palette.primary.main,
  },
}));

const TabPanel = ({ children, value, index, ...other }) => {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`settings-tabpanel-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ py: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
};

const Settings = () => {
  const [showCameraDialog, setShowCameraDialog] = useState(false);
  const [cameras, setCameras] = useState([]);
  const [editingCamera, setEditingCamera] = useState(null);
  const [tabValue, setTabValue] = useState(0);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [cameraData, setCameraData] = useState({
    source_name: '',
    stream_type: 'live',
    stream: '',
    location: ''
  });

  useEffect(() => {
    fetchCameras();
  }, []);

  const fetchCameras = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/cameras');
      setCameras(response.data);
    } catch (error) {
      console.error('Error fetching cameras:', error);
      alert('Error fetching cameras');
    }
  };

  const handleOpenDialog = (camera = null) => {
    if (camera) {
      setEditingCamera(camera);
      setCameraData({
        source_name: camera.source_name,
        stream_type: camera.stream_type,
        stream: camera.stream,
        location: camera.location
      });
    } else {
      setEditingCamera(null);
      setCameraData({
        source_name: '',
        stream_type: 'live',
        stream: '',
        location: ''
      });
    }
    setShowCameraDialog(true);
  };

  const handleCloseDialog = () => {
    setShowCameraDialog(false);
    setEditingCamera(null);
    setCameraData({
      source_name: '',
      stream_type: 'live',
      stream: '',
      location: ''
    });
  };

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingCamera) {
        // Update existing camera
        await axios.put(`http://localhost:8000/api/cameras/${editingCamera.id}`, cameraData);
        showSnackbar('Camera updated successfully');
      } else {
        // Create new camera
        await axios.post('http://localhost:8000/api/create_camera', cameraData);
        showSnackbar('Camera added successfully');
      }
      
      handleCloseDialog();
      fetchCameras();
      
    } catch (error) {
      console.error('Error saving camera:', error);
      showSnackbar(error.response?.data?.detail || 'Error saving camera', 'error');
    }
  };

  const handleDeleteCamera = async (cameraId) => {
    try {
      await axios.delete(`http://localhost:8000/api/cameras/${cameraId}`);
      fetchCameras();
      showSnackbar('Camera deleted successfully');
    } catch (error) {
      console.error('Error deleting camera:', error);
      showSnackbar('Error deleting camera', 'error');
    }
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ mb: 4 }}>
        <Typography 
          variant="h3" 
          gutterBottom 
          sx={{ 
            fontWeight: 800,
            background: 'linear-gradient(45deg, #6366F1 30%, #8B5CF6 90%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          Settings
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Manage your cameras and system preferences
        </Typography>
      </Box>

      <Paper sx={{ borderRadius: 3, overflow: 'hidden' }}>
        <Tabs 
          value={tabValue} 
          onChange={handleTabChange}
          sx={{ 
            borderBottom: 1, 
            borderColor: 'divider',
            px: 2,
            bgcolor: theme => theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.02)' : 'rgba(0, 0, 0, 0.02)'
          }}
        >
          <Tab icon={<CameraAlt />} label="Cameras" iconPosition="start" />
          <Tab icon={<Security />} label="Security" iconPosition="start" />
          <Tab icon={<Notifications />} label="Notifications" iconPosition="start" />
          <Tab icon={<Storage />} label="Storage" iconPosition="start" />
        </Tabs>

        <Box sx={{ p: 3 }}>
          <TabPanel value={tabValue} index={0}>
            {/* Camera Management Tab */}
            <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="h5" fontWeight={600}>
                Camera Management
              </Typography>
              <Button
                variant="contained"
                startIcon={<Add />}
                onClick={() => handleOpenDialog()}
                sx={{ 
                  borderRadius: 2,
                  textTransform: 'none',
                  px: 3,
                  background: 'linear-gradient(45deg, #6366F1 30%, #8B5CF6 90%)',
                  boxShadow: '0 3px 15px rgba(99, 102, 241, 0.3)',
                  '&:hover': {
                    boxShadow: '0 5px 20px rgba(99, 102, 241, 0.4)',
                  }
                }}
              >
                Add New Camera
              </Button>
            </Box>

            {/* Camera Grid */}
            <Grid container spacing={3}>
              {cameras.map((camera) => (
                <Grid item xs={12} sm={6} md={4} key={camera.id}>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <CameraCard>
                      <CardContent>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Avatar sx={{ bgcolor: 'primary.main', width: 40, height: 40 }}>
                              <Videocam />
                            </Avatar>
                            <Box>
                              <Typography variant="h6" fontWeight={600}>
                                {camera.source_name}
                              </Typography>
                              <Chip 
                                label={camera.stream_type} 
                                size="small" 
                                color={camera.stream_type === 'live' ? 'success' : 'info'}
                                sx={{ mt: 0.5 }}
                              />
                            </Box>
                          </Box>
                          <Box>
                            <Tooltip title="Edit">
                              <IconButton size="small" onClick={() => handleOpenDialog(camera)}>
                                <Edit fontSize="small" />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Delete">
                              <IconButton size="small" color="error" onClick={() => handleDeleteCamera(camera.id)}>
                                <Delete fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          </Box>
                        </Box>
                        
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <LocationOn sx={{ fontSize: 16, color: 'text.secondary' }} />
                            <Typography variant="body2" color="text.secondary">
                              {camera.location || 'No location set'}
                            </Typography>
                          </Box>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Info sx={{ fontSize: 16, color: 'text.secondary' }} />
                            <Typography variant="body2" color="text.secondary" noWrap>
                              {camera.stream}
                            </Typography>
                          </Box>
                        </Box>
                      </CardContent>
                    </CameraCard>
                  </motion.div>
                </Grid>
              ))}
              
              {/* Add Camera Card */}
              <Grid item xs={12} sm={6} md={4}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: cameras.length * 0.1 }}
                >
                  <Card 
                    sx={{ 
                      borderRadius: 3,
                      border: '2px dashed',
                      borderColor: 'divider',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      height: '100%',
                      minHeight: 180,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      '&:hover': {
                        borderColor: 'primary.main',
                        bgcolor: 'action.hover',
                      }
                    }}
                    onClick={() => handleOpenDialog()}
                  >
                    <CardContent sx={{ textAlign: 'center' }}>
                      <Add sx={{ fontSize: 48, color: 'text.secondary', mb: 1 }} />
                      <Typography variant="body1" color="text.secondary">
                        Add New Camera
                      </Typography>
                    </CardContent>
                  </Card>
                </motion.div>
              </Grid>
            </Grid>

          </TabPanel>

          <TabPanel value={tabValue} index={1}>
            <Typography variant="h5" fontWeight={600} gutterBottom>
              Security Settings
            </Typography>
            <Alert severity="info" sx={{ mt: 2 }}>
              Security settings will be available in a future update.
            </Alert>
          </TabPanel>

          <TabPanel value={tabValue} index={2}>
            <Typography variant="h5" fontWeight={600} gutterBottom>
              Notification Preferences
            </Typography>
            <Alert severity="info" sx={{ mt: 2 }}>
              Notification settings will be available in a future update.
            </Alert>
          </TabPanel>

          <TabPanel value={tabValue} index={3}>
            <Typography variant="h5" fontWeight={600} gutterBottom>
              Storage Management
            </Typography>
            <Alert severity="info" sx={{ mt: 2 }}>
              Storage settings will be available in a future update.
            </Alert>
          </TabPanel>
        </Box>
      </Paper>

      {/* Camera Dialog */}
      <Dialog 
        open={showCameraDialog} 
        onClose={handleCloseDialog}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: { borderRadius: 3 }
        }}
      >
        <DialogTitle sx={{ pb: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Videocam color="primary" />
            <Typography variant="h6">
              {editingCamera ? 'Edit Camera' : 'Add New Camera'}
            </Typography>
          </Box>
        </DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  autoFocus
                  fullWidth
                  label="Camera Name"
                  value={cameraData.source_name}
                  onChange={(e) => setCameraData({...cameraData, source_name: e.target.value})}
                  required
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <CameraAlt />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel>Stream Type</InputLabel>
                  <Select
                    value={cameraData.stream_type}
                    onChange={(e) => setCameraData({...cameraData, stream_type: e.target.value})}
                    label="Stream Type"
                    required
                  >
                    <MenuItem value="live">Live Stream</MenuItem>
                    <MenuItem value="recorded">Recorded</MenuItem>
                    <MenuItem value="rtsp">RTSP</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Stream URL/Path"
                  value={cameraData.stream}
                  onChange={(e) => setCameraData({...cameraData, stream: e.target.value})}
                  required
                  placeholder={cameraData.stream_type === 'live' ? '0' : 'rtsp://...'}
                  helperText={cameraData.stream_type === 'live' ? 'Enter webcam index (0 for default)' : 'Enter stream URL'}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Location"
                  value={cameraData.location}
                  onChange={(e) => setCameraData({...cameraData, location: e.target.value})}
                  placeholder="e.g., Front Door, Parking Lot"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LocationOn />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 3 }}>
            <Button onClick={handleCloseDialog} startIcon={<Close />}>
              Cancel
            </Button>
            <Button 
              type="submit" 
              variant="contained" 
              startIcon={<Check />}
              sx={{ 
                background: 'linear-gradient(45deg, #6366F1 30%, #8B5CF6 90%)',
                boxShadow: '0 3px 15px rgba(99, 102, 241, 0.3)',
              }}
            >
              {editingCamera ? 'Update' : 'Add'} Camera
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={() => setSnackbar({ ...snackbar, open: false })} 
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Settings;
