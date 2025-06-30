import React from 'react';
import { Box, Typography, Grid, Card, CardContent, Divider } from '@mui/material';
import DirectionsWalkIcon from '@mui/icons-material/DirectionsWalk';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import StairsOutlinedIcon from '@mui/icons-material/StairsOutlined';
import { Gauge, gaugeClasses } from '@mui/x-charts/Gauge'
import { FitnessWidgetProps } from '../../models/fitnessModels';

const HealthWidget = ({ title, totalCalories, totalDistance, totalDuration, goalDistanceKm, goalCaloriesBurned, goalDurationMinutes, totalSteps, goalStepsWalk, totalDays }: FitnessWidgetProps) => {
  return (
    <Box sx={{ p: 2, bgcolor: '#f8f9fa', borderRadius: 2 }}>
      <Typography variant="h6" fontWeight={600} gutterBottom>
        {title}
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={6}>
          <Card elevation={2} sx={{ borderRadius: 3 }}>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Typography variant="subtitle2" color="#2196f3" fontWeight="700" gutterBottom>
                  Distance
                </Typography>
                <DirectionsWalkIcon sx={{ color: "#2196f3" }} />
              </Box>
              <Typography variant="body2" fontWeight="700">{totalDistance}/{goalDistanceKm} km</Typography>
              <Divider sx={{ my: 1 }} />
              <Box display="flex" flexDirection="column" alignItems="center">
                <Gauge
                  value={goalDistanceKm > 0 ? parseInt(String((totalDistance / goalDistanceKm) * 100)) : 0}
                  startAngle={0}
                  endAngle={360}
                  innerRadius="60%"
                  outerRadius="100%"
                  width={120}
                  height={120}
                  sx={(theme) => ({
                    [`& .${gaugeClasses.valueText}`]: {
                      fontSize: 15,
                      fontWeight: 500,
                      fontStyle: "oblique"
                    },
                    [`& .${gaugeClasses.valueArc}`]: {
                      fill: '#2196f3',
                    }
                  })}
                  text={({ value }) => `${value}%`}
                />
                <Typography variant="body2" fontWeight="400">{parseFloat(String((totalDistance/totalDays).toFixed(2)))} km/day</Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={6}>
          <Card elevation={2} sx={{ borderRadius: 3 }}>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Typography variant="subtitle2" color="#ff9800" fontWeight="700" gutterBottom>
                  Calorie
                </Typography>
                <LocalFireDepartmentIcon sx={{ color: "#ff9800" }} />
              </Box>
              <Typography variant="body2" fontWeight="700">{totalCalories}/{goalCaloriesBurned} kcal</Typography>
              <Divider sx={{ my: 1 }} />
              <Box display="flex" flexDirection="column" alignItems="center">
                <Gauge
                  value={goalCaloriesBurned > 0 ? parseInt(String((totalCalories / goalCaloriesBurned) * 100)) : 0}
                  startAngle={0}
                  endAngle={360}
                  innerRadius="60%"
                  outerRadius="100%"
                  width={120}
                  height={120}
                  sx={(theme) => ({
                    [`& .${gaugeClasses.valueText}`]: {
                      fontSize: 15,
                      fontWeight: 500,
                      fontStyle: "oblique"
                    },
                    [`& .${gaugeClasses.valueArc}`]: {
                      fill: '#ff9800',
                    }
                  })}
                  text={({ value }) => `${value}%`}
                />
                   <Typography variant="body2" fontWeight="400">{parseFloat(String((totalCalories/totalDays).toFixed(2)))} kcal/day</Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={6}>
          <Card elevation={2} sx={{ borderRadius: 3 }}>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Typography variant="subtitle2" color="#ff5722" fontWeight="700" gutterBottom>
                  Duration
                </Typography>
                <AccessTimeIcon sx={{ color: "#ff5722" }} />
              </Box>
              <Typography variant="body2" fontWeight="700">{totalDuration}/{goalDurationMinutes} min</Typography>
              <Divider sx={{ my: 1 }} />
              <Box display="flex" flexDirection="column" alignItems="center">
                <Gauge
                  value={goalDurationMinutes > 0 ? parseInt(String((totalDuration / goalDurationMinutes) * 100)) : 0}
                  startAngle={0}
                  endAngle={360}
                  innerRadius="60%"
                  outerRadius="100%"
                  width={120}
                  height={120}
                  sx={(theme) => ({
                    [`& .${gaugeClasses.valueText}`]: {
                      fontSize: 15,
                      fontWeight: 500,
                      fontStyle: "oblique"
                    },
                    [`& .${gaugeClasses.valueArc}`]: {
                      fill: '#ff5722',
                    }
                  })}
                  text={({ value }) => `${value}%`}
                />
                <Typography variant="body2" fontWeight="400">{parseFloat(String((totalDuration/totalDays).toFixed(2)))} min/day</Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={6}>
          <Card elevation={2} sx={{ borderRadius: 3 }}>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Typography variant="subtitle2" color="#4CAF50" fontWeight="700" gutterBottom>
                  Steps
                </Typography>
                <StairsOutlinedIcon sx={{ color: "#4CAF50" }} />
              </Box>
              <Typography variant="body2" fontWeight="700">{totalSteps}/{goalStepsWalk} steps</Typography>
              <Divider sx={{ my: 1 }} />
              <Box display="flex" flexDirection="column" alignItems="center">
                <Gauge
                  value={goalStepsWalk > 0 ? parseInt(String((totalSteps / goalStepsWalk) * 100)) : 0}
                  startAngle={0}
                  endAngle={360}
                  innerRadius="60%"
                  outerRadius="100%"
                  width={120}
                  height={120}
                  sx={(theme) => ({
                    [`& .${gaugeClasses.valueText}`]: {
                      fontSize: 15,
                      fontWeight: 500,
                      fontStyle: "oblique"
                    },
                    [`& .${gaugeClasses.valueArc}`]: {
                      fill: '#4CAF50',
                    }
                  })}
                  text={({ value }) => `${value}%`}
                />
                   <Typography variant="body2" fontWeight="400">{parseFloat(String((totalSteps/totalDays).toFixed(2)))} steps/day</Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default HealthWidget;
