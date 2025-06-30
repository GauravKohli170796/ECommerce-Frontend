import React, { useEffect, useState } from 'react';
import {
  startOfMonth,
  endOfMonth,
  getDate,
  getDay,
  eachDayOfInterval,
  format,
  addMonths,
  subMonths,
  isAfter
} from 'date-fns';

import {
  Box,
  Grid,
  Typography,
  IconButton,
  Paper,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  Divider,
} from '@mui/material';
import { ArrowBack, ArrowForward } from '@mui/icons-material';
import { showNotificationMsg } from '../../services/createNotification';
import { AppConst, notificationType } from '../../constants/AppConst';
import { useNavigate } from 'react-router-dom';
import { axiosProtectedInstance } from '../../services/axiosInstance';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import DirectionsWalkIcon from '@mui/icons-material/DirectionsWalk';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';
import NotesIcon from '@mui/icons-material/Notes';


const CalendarGrid: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<any>(null);
  const navigate = useNavigate();
  const today = new Date();
  const [currentDate, setCurrentDate] = useState(startOfMonth(today));
  const [calenderData, setCalenderData] = useState<{ [key: string]: any }>({});

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });
  const startDayIndex = getDay(monthStart);

  const handleNextMonth = () => {
    const nextMonth = addMonths(currentDate, 1);
    if (!isAfter(startOfMonth(nextMonth), startOfMonth(today))) {
      console.log(nextMonth);
      setCurrentDate(nextMonth);
    }
  };

  const handlePrevMonth = () => {
    const prevMonth = subMonths(currentDate, 1);
    console.log(prevMonth);
    setCurrentDate(prevMonth);
  };

  const emptySlots = Array.from({ length: startDayIndex });

  useEffect(() => {
    const tokenDetails = localStorage.getItem(AppConst.storageKeys.accessToken);
    if (!tokenDetails) {
      showNotificationMsg("You need to login first.", notificationType.WARNING);
      navigate("/auth/login");
      return;
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigate]);

  useEffect(() => {
    getCalenderData();
  }, [currentDate]);

  const getCalenderData = async () => {
    const endDate = endOfMonth(currentDate);
    const res = await axiosProtectedInstance.get(`/api/v1/fitness/getFitnessMonthCalender/${currentDate}/${endDate}`);
    if (res.data?.length) {
      const parsedCalenderData = parseCalenderData(res.data);
      setCalenderData(parsedCalenderData);
    }
  }

  const parseCalenderData = (fitnessData: any[]) => {
    const parsedData: { [key: string]: any } = {};
    fitnessData.forEach((data) => {
      const key = String(format(new Date(data.walkDateTime), 'yyyy-MM-dd'));
      if (parsedData[key]) {
        const keyData = parsedData[key];
        keyData.distanceKm += data.distanceKm
        keyData.durationMinutes += data.durationMinutes
        keyData.note += ` ${data.note}`
      }
      else {
        parsedData[key] = data;
      }
    });
    console.log(parsedData);
    return parsedData;
  }

  return (
    <Paper elevation={3} sx={{ p: 3, my: 4, mx: 'auto', borderRadius: 2, marginX: { xs: 0.5, sm: 2, md: 3 } }}>
      {/* Navigation Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <IconButton onClick={handlePrevMonth}>
          <ArrowBack />
        </IconButton>
        <Typography variant="h6" fontWeight="bold" sx={{ color: "#9c27b0" }}>
          {format(currentDate, 'MMMM yyyy')}
        </Typography>
        <IconButton onClick={handleNextMonth} disabled={isAfter(addMonths(currentDate, 1), today)} >
          <ArrowForward />
        </IconButton>
      </Box>

      {/* Weekday Headers */}
      <Grid container columns={7}>
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
          <Grid item xs={1} key={day} sx={{ textAlign: 'center', fontWeight: 'bold', mb: 2, color: "#9c27b0" }}>
            {day}
          </Grid>
        ))}
      </Grid>

      {/* Days Grid */}
      <Grid container columns={7}>
        {emptySlots.map((_, i) => (
          <Grid item xs={1} key={`empty-${i}`} sx={{ height: 48 }} />
        ))}

        {days.map((date) => {
          const calenderDate = String(format(new Date(date), 'yyyy-MM-dd'));
          if (calenderData[calenderDate]) {
            return <Grid item xs={1} key={date.toISOString()} sx={{ py: 0.5, px: 0.5, textAlign: 'center' }}>
              <Box
                sx={{
                  width: 36,
                  height: 36,
                  borderRadius: '50%',
                  border: "2px solid #4CAF50",
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mx: 'auto',
                  fontWeight: 'bold',
                  fontSize:"15px"
                }}
                onClick={() => {
                  setSelectedDate(calenderDate);
                  setOpen(true);
                }}
              >
                {getDate(date)}
              </Box>
              {/* </Tooltip> */}
            </Grid>
          }
          else {
            return <Grid item xs={1} key={date.toISOString()} sx={{ py: 1, px: 0.5, textAlign: 'center' }}>
              <Box
                sx={{
                  width: 36,
                  height: 36,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mx: 'auto',
                  fontWeight: 200,
                  fontSize:"15px"
                }}
              >
                {getDate(date)}
              </Box>
            </Grid>
          }
        })}
      </Grid>
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogContent>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: 1.5,
              maxWidth: 300
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <AccessTimeIcon fontSize="small" color="primary" />
              <Typography variant="body2"><strong>Duration:</strong> {calenderData[selectedDate]?.durationMinutes ?? 'N/A'} min</Typography>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <DirectionsWalkIcon fontSize="small" color="success" />
              <Typography variant="body2"><strong>Distance:</strong> {calenderData[selectedDate]?.distanceKm ?? 'N/A'} km</Typography>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <LocalFireDepartmentIcon fontSize="small" color="error" />
              <Typography variant="body2"><strong>Calories:</strong> {calenderData[selectedDate]?.caloriesBurned ?? 'N/A'} kcal</Typography>
            </Box>

            <Divider />

            <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
              <NotesIcon fontSize="small" color="action" />
              <Typography variant="body2"><strong>Notes:</strong> {calenderData[selectedDate]?.note || 'N/A'}</Typography>
            </Box>
          </Box>
        </DialogContent>
      </Dialog>
    </Paper>
  );
};

export default CalendarGrid;
