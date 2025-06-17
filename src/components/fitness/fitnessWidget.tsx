import React from 'react';
import { Box, Typography, Paper } from '@mui/material';
import { FitnessWidgetProps } from '../../models/fitnessModels';

// Widget Component
const FitnessWidget = ({ title, value, unit, icon, color, progress }: FitnessWidgetProps) => {
  return (
    <Paper
      elevation={3}
      sx={{
        p: 3,
        borderRadius: 4,
        bgcolor: 'background.paper',
        minWidth: '200px',
      }}
    >
      <Box display="flex" alignItems="center" gap={2}>
        <Box
          sx={{
            p: 1.5,
            bgcolor: `${color}20`,
            borderRadius: '50%',
            color: color,
          }}
        >
          {icon}
        </Box>
        <Box>
          <Typography variant="subtitle2" sx={{color}} color="text.secondary">
            {title}
          </Typography>
          <Typography variant="h4" fontWeight="bold">
            {value} <Typography variant="body2" sx={{color}} component="span">{unit}</Typography>
          </Typography>
        </Box>
      </Box>
      {progress && (
        <Box sx={{ mt: 2 }}>
          <Box
            sx={{
              height: 4,
              bgcolor: `${color}20`,
              borderRadius: 2,
              overflow: 'hidden',
            }}
          >
            <Box
              sx={{
                height: '100%',
                width: `${progress}%`,
                bgcolor: color,
              }}
            />
          </Box>
          <Typography variant="caption"  sx={{ mt: 0.5, color }}>
            {progress}% of daily goal
          </Typography>
        </Box>
      )}
    </Paper>
  );
};

export default FitnessWidget;