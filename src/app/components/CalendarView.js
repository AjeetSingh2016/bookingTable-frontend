import React, { useState } from 'react';
import Calendar from 'react-calendar';

const CalendarView = ({ onDateSelect }) => {
  const [date, setDate] = useState(new Date());

  const handleDateChange = (newDate) => {
    setDate(newDate);
    onDateSelect(newDate);
  };

  return (
    <div className="max-w-md mx-auto mt-10">
      <h2 className="text-xl font-bold mb-6 text-center">Select Reservation Date</h2>
      <Calendar
        onChange={handleDateChange}
        value={date}
        minDate={new Date()}
      />
    </div>
  );
};

export default CalendarView;
