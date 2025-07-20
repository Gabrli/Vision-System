import React, { useState } from 'react';
import {
  Box,
  Button,
  TextField,
  Paper,
  Typography,
  CircularProgress,
  useTheme,
  Alert,
} from '@mui/material';
import { useMutation } from 'react-query';
import { predictModel } from '../../services/api';
import { Send as SendIcon } from '@mui/icons-material';

const ModelPrediction = () => {
  const [input, setInput] = useState('');
  const theme = useTheme();
  
  const mutation = useMutation(predictModel, {
    onSuccess: (data) => {
      console.log('Prediction result:', data);
    },
    onError: (error) => {
      console.error('Prediction error:', error);
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    try {
      const data = JSON.parse(input);
      mutation.mutate(data);
    } catch (error) {
      console.error('Invalid JSON input');
    }
  };

  return (
    <Paper
      elevation={0}
      sx={{
        p: 3,
        height: '100%',
        minHeight: 400,
        border: `1px solid ${theme.palette.divider}`,
      }}
    >
      <Typography
        variant="h6"
        gutterBottom
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          color: theme.palette.primary.main,
          fontWeight: 600,
        }}
      >
        Model Prediction
      </Typography>
      
      <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
        <TextField
          fullWidth
          multiline
          rows={4}
          label="Input Data (JSON)"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          margin="normal"
          variant="outlined"
          placeholder='{"features": [1, 2, 3]}'
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: 2,
            },
          }}
        />
        <Button
          type="submit"
          variant="contained"
          color="primary"
          disabled={mutation.isLoading}
          endIcon={mutation.isLoading ? <CircularProgress size={20} /> : <SendIcon />}
          sx={{
            mt: 2,
            px: 4,
            py: 1.2,
            borderRadius: 2,
            boxShadow: theme.palette.mode === 'dark'
              ? '0 0 20px rgba(33, 150, 243, 0.3)'
              : '0 4px 20px rgba(0, 0, 0, 0.1)',
          }}
        >
          Predict
        </Button>
      </Box>
      
      {mutation.data && (
        <Box sx={{ mt: 4 }}>
          <Typography variant="subtitle1" gutterBottom fontWeight={600}>
            Result:
          </Typography>
          <Paper
            variant="outlined"
            sx={{
              p: 2,
              backgroundColor: theme.palette.mode === 'dark'
                ? 'rgba(255, 255, 255, 0.05)'
                : 'rgba(0, 0, 0, 0.02)',
              borderRadius: 2,
            }}
          >
            <pre style={{ margin: 0, overflow: 'auto' }}>
              {JSON.stringify(mutation.data, null, 2)}
            </pre>
          </Paper>
        </Box>
      )}
      
      {mutation.error && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {mutation.error.message}
        </Alert>
      )}
    </Paper>
  );
};

export default ModelPrediction;
