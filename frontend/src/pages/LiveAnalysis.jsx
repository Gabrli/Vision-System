import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import {
    Box,
    Container,
    Typography,
    Radio,
    RadioGroup,
    FormControlLabel,
    Button,
    Paper,
    Card,
    CardContent,
    Grid,
    Fade,
    CircularProgress,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    IconButton,
    Chip,
    ToggleButton,
    ToggleButtonGroup,
    Divider,
    Switch,
    FormGroup
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { 
    PlayArrow, 
    Stop, 
    Visibility, 
    PersonPin, 
    CropFree,
    CompareArrows,
    Speed,
    CheckCircle
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';

// Styled components
const StyledContainer = styled(Container)(({ theme }) => ({
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
}));

const VideoContainer = styled(Paper)(({ theme }) => ({
    aspectRatio: '16/9',
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    borderRadius: theme.spacing(2),
    backgroundColor: 'rgba(0, 0, 0, 0.02)',
    backdropFilter: 'blur(8px)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
    padding: theme.spacing(2),
}));

const ControlButton = styled(Button)(({ theme }) => ({
    margin: theme.spacing(1),
    padding: theme.spacing(1, 3),
    borderRadius: theme.spacing(2),
}));


// Simplified NeonButton styled component
const NeonButton = styled(Button)(({ theme }) => ({
    borderRadius: '50px',
    padding: '8px 24px',
    backgroundColor: '#1976d2',
    color: 'white',
    boxShadow: '0 4px 14px rgba(25, 118, 210, 0.3)',
    transition: 'all 0.2s ease-in-out',
    '&:hover': {
        backgroundColor: '#1565c0',
        boxShadow: '0 6px 20px rgba(25, 118, 210, 0.4)',
        transform: 'translateY(-1px)'
    },
    '&:disabled': {
        backgroundColor: '#bdbdbd',
        color: '#757575',
        boxShadow: 'none'
    }
}));

// Model selection button component
const ModelButton = styled(Button)(({ theme, selected, modelColor }) => ({
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    border: 'none',
    borderRadius: '12px',
    padding: '12px 24px',
    minWidth: '120px',
    backgroundColor: selected 
        ? theme.palette.mode === 'dark' 
            ? modelColor 
            : modelColor
        : theme.palette.mode === 'dark' 
            ? 'rgba(255, 255, 255, 0.05)' 
            : 'rgba(0, 0, 0, 0.04)',
    color: selected 
        ? 'white' 
        : theme.palette.text.primary,
    boxShadow: selected 
        ? theme.palette.mode === 'dark'
            ? `0 0 20px ${modelColor}40, 0 4px 12px rgba(0, 0, 0, 0.3)`
            : `0 4px 20px ${modelColor}40`
        : 'none',
    '&:hover': {
        transform: 'translateY(-1px)',
        backgroundColor: selected 
            ? theme.palette.mode === 'dark'
                ? modelColor
                : modelColor
            : theme.palette.mode === 'dark' 
                ? 'rgba(255, 255, 255, 0.08)' 
                : 'rgba(0, 0, 0, 0.08)',
        boxShadow: selected 
            ? theme.palette.mode === 'dark'
                ? `0 0 30px ${modelColor}60, 0 6px 16px rgba(0, 0, 0, 0.4)`
                : `0 6px 24px ${modelColor}50`
            : '0 2px 8px rgba(0, 0, 0, 0.1)',
    },
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '4px',
    textTransform: 'none',
    fontWeight: 500,
}));

// Model info data
const modelInfo = {
    objectDetection: {
        title: "Detection",
        icon: <CropFree sx={{ fontSize: 24 }} />,
        color: '#6366F1', // Modern purple/indigo
    },
    segmentation: {
        title: "Segmentation",
        icon: <Visibility sx={{ fontSize: 24 }} />,
        color: '#10B981', // Modern emerald green
    },
    pose: {
        title: "Pose",
        icon: <PersonPin sx={{ fontSize: 24 }} />,
        color: '#F59E0B', // Modern amber/orange
    }
};

// Split view component for multiple models
const SplitViewContainer = styled(Box)(({ theme }) => ({
    display: 'grid',
    gap: theme.spacing(2),
    height: '100%',
    gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
}));

// Main component
const LiveAnalysis = () => {
    const [cameras, setCameras] = useState([]);
    const [selectedModel, setSelectedModel] = useState('objectDetection');
    
    // Add this state to track if we're actively streaming
    const [isStreaming, setIsStreaming] = useState(false);
    const [activeStreams, setActiveStreams] = useState({}); // Track which model is active for each camera

    // Modify the useEffect to check existing streams when mounting
    useEffect(() => {
        const checkExistingStreams = async () => {
            try {
                // Fetch cameras first
                const response = await axios.get('http://localhost:8000/api/cameras');
                const liveCameras = response.data.filter(camera => 
                    camera.stream_type.toLowerCase() === 'live'
                );
                
                // Check if any streams are active by attempting to fetch frames
                const camerasWithStreamStatus = await Promise.all(liveCameras.map(async (camera) => {
                    try {
                        const frameResponse = await axios.get(
                            `http://localhost:8000/process_frame/${camera.id}`,
                            { responseType: 'blob' }
                        );
                        // If we get a successful response, the stream is active
                        const isActive = frameResponse.status === 200;
                        return {
                            ...camera,
                            isStreaming: isActive,
                            videoSrc: isActive ? URL.createObjectURL(frameResponse.data) : '',
                        };
                    } catch (error) {
                        return {
                            ...camera,
                            isStreaming: false,
                            videoSrc: '',
                        };
                    }
                }));

                setCameras(camerasWithStreamStatus);
                setIsStreaming(camerasWithStreamStatus.some(cam => cam.isStreaming));
            } catch (error) {
                console.error("Error checking existing streams:", error);
            }
        };

        checkExistingStreams();
    }, []);

    // Modify the frame fetching useEffect
    useEffect(() => {
        const intervals = {};
        
        // Create separate intervals for each streaming camera
        cameras.forEach(camera => {
            if (camera.isStreaming) {
                intervals[camera.id] = setInterval(async () => {
                    try {
                        const response = await axios.get(
                            `http://localhost:8000/process_frame/${camera.id}`,
                            { responseType: 'blob' }
                        );
                        
                        const url = URL.createObjectURL(response.data);
                        
                        setCameras(prevCameras => {
                            return prevCameras.map(prevCamera => {
                                if (prevCamera.id === camera.id) {
                                    // Cleanup old URL
                                    if (prevCamera.videoSrc) {
                                        URL.revokeObjectURL(prevCamera.videoSrc);
                                    }
                                    return { ...prevCamera, videoSrc: url };
                                }
                                return prevCamera;
                            });
                        });
                    } catch (error) {
                        console.error(`Error fetching frame for camera ${camera.id}:`, error);
                    }
                }, 100); // 100ms interval for each camera
            }
        });
        
        // Cleanup function
        return () => {
            // Clear all intervals
            Object.values(intervals).forEach(interval => clearInterval(interval));
            
            // Cleanup URLs if stopping all streams
            if (!isStreaming) {
                cameras.forEach(camera => {
                    if (camera.videoSrc) {
                        URL.revokeObjectURL(camera.videoSrc);
                    }
                });
            }
        };
    }, [cameras, isStreaming]);

    const startWebcamStream = async () => {
        try {
            // Start all cameras with selected model
            await Promise.all(cameras.map(async (camera) => {
                await axios.post(`http://localhost:8000/start_camera_stream/${camera.id}`, {
                    model_type: selectedModel,
                });
            }));
            
            const updatedCameras = cameras.map(camera => ({
                ...camera,
                isStreaming: true,
            }));
            
            setCameras(updatedCameras);
            setIsStreaming(true);
        } catch (error) {
            console.error('Error starting camera streams:', error);
        }
    };

    const stopWebcamStream = async () => {
        try {
            // Stop all cameras
            await Promise.all(cameras.map(async (camera) => {
                await axios.post(`http://localhost:8000/stop_camera_stream/${camera.id}`);
            }));
            
            const updatedCameras = cameras.map(camera => ({
                ...camera,
                isStreaming: false,
                videoSrc: '',
            }));
            
            setCameras(updatedCameras);
            setIsStreaming(false);
        } catch (error) {
            console.error('Error stopping camera streams:', error);
        }
    };

    const startSingleCamera = async (cameraId) => {
        try {
            await axios.post(`http://localhost:8000/start_camera_stream/${cameraId}`, {
                model_type: selectedModel,
            });
            
            const updatedCameras = cameras.map(camera => ({
                ...camera,
                isStreaming: camera.id === cameraId ? true : camera.isStreaming,
            }));
            
            setCameras(updatedCameras);
            setIsStreaming(true);
        } catch (error) {
            console.error(`Error starting camera ${cameraId} stream:`, error);
        }
    };

    const handleModelSelection = (modelType) => {
        setSelectedModel(modelType);
    };

    const stopSingleCamera = async (cameraId) => {
        try {
            await axios.post(`http://localhost:8000/stop_camera_stream/${cameraId}`);
            
            const updatedCameras = cameras.map(camera => ({
                ...camera,
                isStreaming: camera.id === cameraId ? false : camera.isStreaming,
                videoSrc: camera.id === cameraId ? '' : camera.videoSrc,
            }));
            
            setCameras(updatedCameras);
            setIsStreaming(updatedCameras.some(cam => cam.isStreaming));
        } catch (error) {
            console.error(`Error stopping camera ${cameraId} stream:`, error);
        }
    };

    return (
        <StyledContainer maxWidth="xl">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <Typography 
                    variant="h3" 
                    align="center" 
                    gutterBottom 
                    sx={{ 
                        color: '#1976d2',
                        mb: 4,
                        fontWeight: 600,
                        background: 'linear-gradient(45deg, #1976d2 30%, #21CBF3 90%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                    }}
                >
                    Live Analysis Studio
                </Typography>

                {/* Model Selection Buttons */}
                <Box sx={{ mb: 4, display: 'flex', justifyContent: 'center' }}>
                    <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap', justifyContent: 'center' }}>
                        {Object.entries(modelInfo).map(([key, info]) => (
                            <motion.div
                                key={key}
                                whileHover={{ scale: 1.03 }}
                                whileTap={{ scale: 0.97 }}
                            >
                                <ModelButton 
                                    selected={selectedModel === key}
                                    onClick={() => handleModelSelection(key)}
                                    modelColor={info.color}
                                >
                                    <Box sx={{ 
                                        color: selectedModel === key ? 'inherit' : info.color,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }}>
                                        {info.icon}
                                    </Box>
                                    <Typography variant="body2" sx={{ fontSize: '0.875rem' }}>
                                        {info.title}
                                    </Typography>
                                </ModelButton>
                            </motion.div>
                        ))}
                    </Box>
                </Box>

                {/* Control Buttons */}
                <Box sx={{ 
                    display: 'flex',
                    justifyContent: 'center',
                    gap: 2,
                    mb: 4
                }}>
                    <NeonButton
                        disabled={cameras.some(camera => camera.isStreaming)}
                        onClick={startWebcamStream}
                        startIcon={<PlayArrow />}
                        size="large"
                    >
                        Start Analysis
                    </NeonButton>
                    <NeonButton
                        disabled={!cameras.some(camera => camera.isStreaming)}
                        onClick={stopWebcamStream}
                        startIcon={<Stop />}
                        size="large"
                        sx={{
                            backgroundColor: '#d32f2f',
                            '&:hover': {
                                backgroundColor: '#c62828',
                            }
                        }}
                    >
                        Stop All
                    </NeonButton>
                </Box>


                {/* Camera Grid */}
                <Grid container spacing={3} sx={{ minHeight: '600px' }}>
                    {cameras.map((camera) => (
                        <Grid item xs={12} md={6} key={camera.id}>
                            <VideoContainer sx={{ height: '400px' }}>
                                {camera.isStreaming ? (
                                    <>
                                        <Box sx={{
                                            position: 'relative',
                                            width: '100%',
                                            height: '100%',
                                            borderRadius: 2,
                                            overflow: 'hidden',
                                        }}>
                                            <motion.img
                                                src={camera.videoSrc || 'path/to/default/image.jpg'}
                                                alt={`Stream from ${camera.source_name}`}
                                                style={{ 
                                                    width: '100%',
                                                    height: '100%',
                                                    objectFit: 'cover'
                                                }}
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                transition={{ duration: 0.3 }}
                                            />
                                            
                                            {/* Camera name overlay - top left */}
                                            <Box sx={{
                                                position: 'absolute',
                                                top: 16,
                                                left: 16,
                                                padding: '8px 16px',
                                                borderRadius: '50px',
                                                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                                                backdropFilter: 'blur(4px)',
                                                transition: 'opacity 0.3s',
                                                opacity: 0.8,
                                                '&:hover': {
                                                    opacity: 1
                                                }
                                            }}>
                                                <Typography sx={{
                                                    color: 'rgba(255, 255, 255, 0.9)',
                                                    fontSize: '0.95rem',
                                                    fontWeight: 500,
                                                    fontFamily: '"Plus Jakarta Sans", "Inter", -apple-system, sans-serif',
                                                    letterSpacing: '-0.02em',
                                                    textTransform: 'capitalize'
                                                }}>
                                                    {camera.source_name || `Camera ${camera.id}`}
                                                </Typography>
                                            </Box>
                                            
                                            {/* Bottom left corner stop button */}
                                            <Box sx={{
                                                position: 'absolute',
                                                bottom: 16,
                                                left: 16,
                                                transition: 'opacity 0.3s',
                                                opacity: 0.7,
                                                '&:hover': {
                                                    opacity: 1
                                                }
                                            }}>
                                                <Button
                                                    variant="contained"
                                                    color="error"
                                                    onClick={() => stopSingleCamera(camera.id)}
                                                    size="small"
                                                    startIcon={<Stop sx={{ fontSize: '1rem' }} />}
                                                    sx={{
                                                        minWidth: 'auto',
                                                        py: 0.5,
                                                        px: 1.5,
                                                        borderRadius: '50px',
                                                        backgroundColor: 'rgba(220, 53, 69, 0.9)',
                                                        backdropFilter: 'blur(4px)',
                                                        fontSize: '0.85rem',
                                                        textTransform: 'none',
                                                        boxShadow: '0 4px 12px rgba(220, 53, 69, 0.3)',
                                                        '&:hover': {
                                                            backgroundColor: 'rgba(201, 42, 58, 0.95)',
                                                            boxShadow: '0 6px 16px rgba(220, 53, 69, 0.4)',
                                                            transform: 'translateY(-1px)'
                                                        }
                                                    }}
                                                >
                                                    Stop
                                                </Button>
                                            </Box>
                                        </Box>
                                    </>
                                ) : (
                                    <Box sx={{ 
                                        display: 'flex', 
                                        flexDirection: 'column', 
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        height: '100%',
                                        gap: 3,
                                        p: 4,
                                        textAlign: 'center'
                                    }}>
                                        <Typography variant="h6" sx={{ 
                                            color: theme => theme.palette.mode === 'dark' 
                                                ? 'rgba(255, 255, 255, 0.7)'
                                                : '#1a237e',
                                            fontSize: '2rem',
                                            fontWeight: 700,
                                            mb: 2,
                                            fontFamily: '"Plus Jakarta Sans", "Inter", -apple-system, sans-serif',
                                            letterSpacing: '-0.04em',
                                            position: 'relative',
                                            display: 'inline-block',
                                            '&::after': {
                                                content: '""',
                                                position: 'absolute',
                                                bottom: '-8px',
                                                left: '50%',
                                                transform: 'translateX(-50%)',
                                                width: '40px',
                                                height: '3px',
                                                background: theme => theme.palette.mode === 'dark' 
                                                    ? 'linear-gradient(90deg, #6366f1, #8b5cf6)'
                                                    : 'linear-gradient(90deg, #4f46e5, #6366f1)',
                                                borderRadius: '2px',
                                                transition: 'width 0.3s ease',
                                            },
                                            '&:hover::after': {
                                                width: '60px',
                                            },
                                            textTransform: 'capitalize',
                                            textShadow: theme => theme.palette.mode === 'dark' 
                                                ? '0 2px 10px rgba(99, 102, 241, 0.2)' 
                                                : 'none',
                                            '&:hover': {
                                                background: theme => theme.palette.mode === 'dark'
                                                    ? 'linear-gradient(90deg, #6366f1, #8b5cf6)'
                                                    : 'linear-gradient(90deg, #4f46e5, #6366f1)',
                                                WebkitBackgroundClip: 'text',
                                                WebkitTextFillColor: 'transparent',
                                            }
                                        }}>
                                            {(camera.source_name || `Camera ${camera.id}`).toLowerCase()}
                                        </Typography>
                                        <NeonButton
                                            onClick={() => startSingleCamera(camera.id)}
                                            startIcon={<PlayArrow />}
                                        >
                                            Start Stream
                                        </NeonButton>
                                        <Typography variant="body2" color="text.secondary" sx={{ 
                                            maxWidth: '80%',
                                            mt: 2,
                                            opacity: 0.8
                                        }}>
                                            Click to begin real-time analysis
                                        </Typography>
                                    </Box>
                                )}
                            </VideoContainer>
                        </Grid>
                    ))}
                </Grid>
            </motion.div>
        </StyledContainer>
    );
};

export default LiveAnalysis;