import React, {useEffect} from 'react';

const BookingSummary = ({ booking, setShowForm, setSummary}) => {

   
    const onBookAgain = () => {
      setSummary(null)
      setShowForm(true);
      console.log("HEllo");
    };


  return (
    <div className="max-w-lg mx-auto p-8 bg-white shadow-lg rounded-lg mt-10">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Booking Summary</h2>
      
      <div className="space-y-4">
        <p className="text-lg">
          <strong className="font-semibold text-gray-700">Name:</strong> {booking.name}
        </p>
        <p className="text-lg">
          <strong className="font-semibold text-gray-700">Contact:</strong> {booking.contact}
        </p>
        <p className="text-lg">
          <strong className="font-semibold text-gray-700">Date:</strong> {booking.date}
        </p>
        <p className="text-lg">
          <strong className="font-semibold text-gray-700">Time:</strong> {booking.time}
        </p>
        <p className="text-lg">
          <strong className="font-semibold text-gray-700">Guests:</strong> {booking.guests}
        </p>
      </div>

      <div className="mt-8">
        <button
          onClick={onBookAgain}
          className="w-full py-2 px-4 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300"
        >
          Book Again
        </button>
      </div>
    </div>
  );
};

export default BookingSummary;
