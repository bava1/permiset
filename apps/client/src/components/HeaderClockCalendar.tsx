import React, { useState, useEffect } from 'react';
import { Typography, Box } from '@mui/material';

const HeaderClockCalendar: React.FC = () => {
  const [dateTime, setDateTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setDateTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatDate = (date: Date) =>
    date.toLocaleDateString('cs-CZ', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

  const formatTime = (date: Date) =>
    date.toLocaleTimeString('cs-CZ', { hour: '2-digit', minute: '2-digit', second: '2-digit' });

  return (
    <Box
      padding={1}
      color="white"
    >
      <Typography sx={{ opacity: 0.8 }} variant="h6" component="div">
      {formatTime(dateTime)} {formatDate(dateTime)} 
      </Typography>
    </Box>
  );
};

export default HeaderClockCalendar;
