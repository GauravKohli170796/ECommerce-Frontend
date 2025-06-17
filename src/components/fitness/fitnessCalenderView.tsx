import React, { useState } from 'react';
import {
  startOfMonth,
  endOfMonth,
  getDate,
  getDay,
  eachDayOfInterval,
  format,
  addMonths,
  subMonths,
  isAfter,
  isBefore,
  isSameMonth,
  isSameDay,
} from 'date-fns';

import {
  Box,
  Grid,
  Typography,
  IconButton,
  Paper,
} from '@mui/material';
import { ArrowBack, ArrowForward } from '@mui/icons-material';

const CalendarGrid: React.FC = () => {
  const today = new Date();
  const [currentDate, setCurrentDate] = useState(startOfMonth(today));

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });
  const startDayIndex = getDay(monthStart);

  const handleNextMonth = () => {
    const nextMonth = addMonths(currentDate, 1);
    if (!isAfter(startOfMonth(nextMonth), startOfMonth(today))) {
      setCurrentDate(nextMonth);
    }
  };

  const handlePrevMonth = () => {
    const prevMonth = subMonths(currentDate, 1);
    // Always allow navigating to past
    setCurrentDate(prevMonth);
  };

  const emptySlots = Array.from({ length: startDayIndex });

  return (
    <Paper elevation={3} sx={{ p: 2, my:4, maxWidth: 460, mx: 'auto', borderRadius: 2 }}>
      {/* Navigation Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <IconButton onClick={handlePrevMonth}>
          <ArrowBack />
        </IconButton>
        <Typography variant="h6" fontWeight="bold" sx={{color: "#9c27b0"}}>
          {format(currentDate, 'MMMM yyyy')}
        </Typography>
        <IconButton onClick={handleNextMonth} disabled={isAfter(addMonths(currentDate, 1), today)} >
          <ArrowForward />
        </IconButton>
      </Box>

      {/* Weekday Headers */}
      <Grid container columns={7}>
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
          <Grid item xs={1} key={day} sx={{ textAlign: 'center', fontWeight: 'bold', mb: 1 , color: "#9c27b0"}}>
            {day}
          </Grid>
        ))}
      </Grid>

      {/* Days Grid */}
      <Grid container columns={7}>
        {emptySlots.map((_, i) => (
          <Grid item xs={1} key={`empty-${i}`} sx={{ height: 48 }} />
        ))}

        {days.map((date) => (
          <Grid item xs={1} key={date.toISOString()} sx={{ p: 0.5, textAlign: 'center' }}>
            <Box
              sx={{
                width: 36,
                height: 36,
                borderRadius: '50%',
                bgcolor: isSameDay(date, today) ? 'error.main' : '#e0e0e0',
                color: isSameDay(date, today) ? 'white' : 'black',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mx: 'auto',
                fontWeight: 'bold',
                padding:"6px"
              }}
            >
              {getDate(date)}
            </Box>
          </Grid>
        ))}
      </Grid>
    </Paper>
  );
};

export default CalendarGrid;
