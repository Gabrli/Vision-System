import React, { useState } from 'react';
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
    CircularProgress
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { Upload } from '@mui/icons-material';
import { motion } from 'framer-motion';

// Reuse the same styled components from LiveAnalysis
const StyledContainer = styled(Container)(({ theme }) => ({
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
}));

const VideoContainer = styled(Paper)(({ theme }) => ({
    aspectRatio: '16/9',
    maxWidth: '800px',
    width: '100%',
    margin: '0 auto',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    borderRadius: theme.spacing(2),
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[8],
}));

const ControlButton = styled(Button)(({ theme }) => ({
    margin: theme.spacing(1),
    padding: theme.spacing(1, 3),
    borderRadius: theme.spacing(2),
}));

const ModelCard = styled(Card)(({ theme }) => ({
    height: '100%',
    borderRadius: theme.spacing(2),
    transition: 'transform 0.2s',
    '&:hover': {
        transform: 'translateY(-4px)',
    },
}));

const VideoAnalysis = () => {
    const [selectedModel, setSelectedModel] = useState('objectDetection');
    const [uploadProgress, setUploadProgress] = useState(0);
    const [isProcessing, setIsProcessing] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);

    const handleFileSelect = (event) => {
        const file = event.target.files[0];
        if (file) {
            setSelectedFile(file);
        }
    };

    const handleUpload = async () => {
        if (!selectedFile) return;

        const formData = new FormData();
        formData.append('file', selectedFile);
        formData.append('model_type', selectedModel);

        setIsProcessing(true);
        try {
            await axios.post('http://localhost:8000/upload_video', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                onUploadProgress: (progressEvent) => {
                    const progress = Math.round(
                        (progressEvent.loaded * 100) / progressEvent.total
                    );
                    setUploadProgress(progress);
                },
            });
            
            setUploadProgress(0);
            setSelectedFile(null);
            // Reset file input
            const fileInput = document.getElementById('video-upload');
            if (fileInput) fileInput.value = '';
            
        } catch (error) {
            console.error('Error uploading video:', error);
        } finally {
            setIsProcessing(false);
            setUploadProgress(0);
        }
    };

    return (
        <StyledContainer maxWidth="xl">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <Typography variant="h3" align="center" gutterBottom 
                    sx={{ 
                        background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        mb: 4
                    }}>
                    Video Analysis with YOLO
                </Typography>

                <Grid container spacing={4}>
                    <Grid item xs={12} md={4}>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                            <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
                                <Typography variant="h6" gutterBottom>Select Model</Typography>
                                <RadioGroup
                                    value={selectedModel}
                                    onChange={(e) => setSelectedModel(e.target.value)}
                                >
                                    {[
                                        ['objectDetection', 'Object Detection'],
                                        ['segmentation', 'Segmentation'],
                                        ['pose', 'Pose Estimation']
                                    ].map(([value, label]) => (
                                        <FormControlLabel
                                            key={value}
                                            value={value}
                                            disabled={isProcessing}
                                            control={<Radio />}
                                            label={label}
                                        />
                                    ))}
                                </RadioGroup>
                            </Paper>

                            <Fade in={true}>
                                <ModelCard elevation={4}>
                                    <CardContent>
                                        <motion.div
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            transition={{ duration: 0.5 }}
                                        >
                                            {selectedModel === 'objectDetection' && (
                                                <Box>
                                                    <Typography variant="h6" color="primary" gutterBottom>
                                                        YOLOv8s Object Detection
                                                    </Typography>
                                                    <Typography variant="body2" color="text.secondary">
                                                        Identifies and locates multiple objects in videos with 
                                                        bounding boxes and confidence scores.
                                                    </Typography>
                                                </Box>
                                            )}
                                            {selectedModel === 'segmentation' && (
                                                <Box>
                                                    <Typography variant="h6" color="primary" gutterBottom>
                                                        YOLOv8n-seg Segmentation
                                                    </Typography>
                                                    <Typography variant="body2" color="text.secondary">
                                                        Creates pixel-precise masks for each detected object in videos.
                                                    </Typography>
                                                </Box>
                                            )}
                                            {selectedModel === 'pose' && (
                                                <Box>
                                                    <Typography variant="h6" color="primary" gutterBottom>
                                                        YOLOv8n-pose Estimation
                                                    </Typography>
                                                    <Typography variant="body2" color="text.secondary">
                                                        Detects human body keypoints and creates skeleton overlays 
                                                        in videos.
                                                    </Typography>
                                                </Box>
                                            )}
                                        </motion.div>
                                    </CardContent>
                                </ModelCard>
                            </Fade>

                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                <input
                                    accept="video/*"
                                    style={{ display: 'none' }}
                                    id="video-upload"
                                    type="file"
                                    onChange={handleFileSelect}
                                    disabled={isProcessing}
                                />
                                <label htmlFor="video-upload">
                                    <ControlButton
                                        component="span"
                                        variant="contained"
                                        color="primary"
                                        disabled={isProcessing}
                                        startIcon={<Upload />}
                                        fullWidth
                                    >
                                        Select Video
                                    </ControlButton>
                                </label>
                                {selectedFile && (
                                    <Typography variant="body2" color="text.secondary" align="center">
                                        Selected: {selectedFile.name}
                                    </Typography>
                                )}
                                <ControlButton
                                    variant="contained"
                                    color="secondary"
                                    disabled={!selectedFile || isProcessing}
                                    onClick={handleUpload}
                                    fullWidth
                                >
                                    Process Video
                                </ControlButton>
                            </Box>
                        </Box>
                    </Grid>

                    <Grid item xs={12} md={8}>
                        <Box sx={{ 
                            display: 'flex', 
                            justifyContent: 'center', 
                            alignItems: 'center',
                            height: '100%',
                            flexDirection: 'column',
                            gap: 2
                        }}>
                            {isProcessing && (
                                <>
                                    <CircularProgress 
                                        variant={uploadProgress > 0 ? "determinate" : "indeterminate"} 
                                        value={uploadProgress}
                                    />
                                    <Typography variant="body1" color="text.secondary">
                                        {uploadProgress > 0 
                                            ? `Uploading: ${uploadProgress}%`
                                            : 'Processing video...'}
                                    </Typography>
                                </>
                            )}
                            {!isProcessing && !selectedFile && (
                                <Typography variant="h6" color="text.secondary">
                                    Select a video file to begin analysis
                                </Typography>
                            )}
                        </Box>
                    </Grid>
                </Grid>
            </motion.div>
        </StyledContainer>
    );
};

export default VideoAnalysis; 