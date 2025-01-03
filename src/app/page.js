"use client"

import React, { useEffect, useState } from 'react';
import BookingForm from './components/BookingForm';
import BookingSummary from './components/BookingSummary';
import toast, { Toaster } from 'react-hot-toast';

const page = () => {
  const [summary, setSummary] = useState(null);
  const [showForm, setShowForm] = useState(true);
  useEffect(() => {
    
  }, [showForm])
  
  return (
    <div className="h-screen w-full">
      <Toaster />
      {summary ? (
        <BookingSummary booking={summary}  setShowForm={setShowForm}  setSummary={setSummary}/>
      ) : (
        showForm && <BookingForm setSummary={setSummary} setShowForm={setShowForm} />
      )}
    </div>
  );
};

export default page;
