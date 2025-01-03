import React, { useState, useEffect } from "react";
import axios from "axios";
import Image from "next/image";

const BookingForm = ({ setSummary, setShowForm }) => {
  const [formData, setFormData] = useState({
    date: "",
    time: "",
    guests: "",
    name: "",
    contact: "",
  });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [bookings, setBookings] = useState([]);
  const [availableSlots, setAvailableSlots] = useState([]);

  const getTodayDate = () => {
    const today = new Date();
    const dd = String(today.getDate()).padStart(2, '0');
    const mm = String(today.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
    const yyyy = today.getFullYear();

    return `${yyyy}-${mm}-${dd}`;
  };

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await axios.get(
          "https://tablebooking-production.up.railway.app/api/bookings"
        );
        setBookings(response.data.bookings);
      } catch (err) {
        console.error("Error fetching bookings:", err);
        setError("Error fetching bookings");
      }
    };

    fetchBookings();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleDateChange = (e) => {
    const selectedDate = e.target.value;
    setFormData({ ...formData, date: selectedDate });
    setAvailableSlots(getAvailableSlotsForDate(selectedDate));
  };

  const getAvailableSlotsForDate = (selectedDate) => {
    const slots = [
      "12:00 AM",
      "1:00 AM",
      "2:00 AM",
      "3:00 AM",
      "4:00 AM",
      "5:00 AM",
      "6:00 AM",
      "7:00 AM",
      "8:00 AM",
      "9:00 AM",
      "10:00 AM",
      "11:00 AM",
      "12:00 PM",
      "1:00 PM",
      "2:00 PM",
      "3:00 PM",
      "4:00 PM",
      "5:00 PM",
      "6:00 PM",
      "7:00 PM",
      "8:00 PM",
      "9:00 PM",
      "10:00 PM",
      "11:00 PM",
    ];

    const existingBookingsForDate = bookings.filter(
      (booking) => booking.date === selectedDate
    );

    const bookedSlots = existingBookingsForDate.map((booking) => booking.time);

    // Get current time to compare with available time slots
    const now = new Date();
    const currentDate = now.toISOString().split("T")[0];
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();

    const filteredSlots = slots.map((slot) => {
      const [hour, minute] = slot.split(":");
      const ampm = slot.includes("AM") ? "AM" : "PM";
      let slotHour = parseInt(hour);
      if (ampm === "PM" && slotHour !== 12) {
        slotHour += 12;
      }
      const slotTime = new Date(selectedDate);
      slotTime.setHours(slotHour, minute === "00" ? 0 : 30);

      if (selectedDate === currentDate) {
        if (
          slotTime.getHours() < currentHour ||
          (slotTime.getHours() === currentHour &&
            slotTime.getMinutes() <= currentMinute)
        ) {
          return { slot, status: "past" };
        }
      }

      return {
        slot,
        status: bookedSlots.includes(slot) ? "booked" : "available",
      };
    });

    return filteredSlots;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.time) {
      setError("Please select a time slot.");
      return;
    }

    const existingBooking = bookings.find(
      (booking) =>
        booking.date === formData.date && booking.time === formData.time
    );
    if (existingBooking) {
      setError("Slot already booked.");
      return;
    }

    try {
      const response = await axios.post(
        "https://tablebooking-production.up.railway.app/api/bookings",
        formData
      );
      setSuccess(true);
      setError(null);
      setSummary(response.data.booking);
      setShowForm(false);
    } catch (err) {
      setError("Error: Unable to create booking.");
    }
  };

  return (
    <div className="flex h-screen">
      {/* Left side - Image section */}
      <div
        className="w-7/12 relative bg-cover bg-gray-900"
        
      >
        <Image
          src="/image.jpg" // Path to your image in the 'public' folder
          alt="Restaurant Image"
          layout="fill" // Fills the entire parent container
          objectFit="cover" // Ensures the image covers the entire div
        />
      </div>

      {/* Right side - Booking form */}
      <div className="w-5/12 p-8 bg-white shadow-lg rounded-lg">
        <h2 className="text-2xl font-bold mb-6 text-center">Book a Table</h2>

        {success && (
          <div className="bg-green-500 text-white p-3 rounded-md mb-5">
            Booking Successful!
          </div>
        )}
        {error && (
          <div className="bg-red-500 text-white p-3 rounded-md mb-5">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2" htmlFor="date">
              Date
            </label>
            <input
              type="date"
              id="date"
              name="date"
              value={formData.date}
              onChange={handleDateChange}
              min={getTodayDate()}
              required
              className="w-full p-2 border border-gray-300 rounded-lg"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-2" htmlFor="time">
              Time
            </label>
            <select
              id="time"
              name="time"
              value={formData.time}
              onChange={handleChange}
              required
              className="w-full p-2 border border-gray-300 rounded-lg"
            >
              <option value="">Select a time slot</option>
              {availableSlots.map((slotObj, index) => (
                <option
                  key={index}
                  value={slotObj.slot}
                  className={
                    slotObj.status === "booked"
                      ? "bg-red-500 text-white"
                      : slotObj.status === "available"
                      ? "bg-green-500 text-white"
                      : "text-gray-500"
                  }
                >
                  {slotObj.slot}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-2" htmlFor="guests">
              Number of Guests
            </label>
            <input
              type="number"
              id="guests"
              name="guests"
              value={formData.guests}
              onChange={handleChange}
              required
              className="w-full p-2 border border-gray-300 rounded-lg"
              min="1"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-2" htmlFor="name">
              Your Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full p-2 border border-gray-300 rounded-lg"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-2" htmlFor="contact">
              Contact Number
            </label>
            <input
              type="text"
              id="contact"
              name="contact"
              value={formData.contact}
              onChange={handleChange}
              required
              className="w-full p-2 border border-gray-300 rounded-lg"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2 px-4 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600"
          >
            Book Table
          </button>
        </form>
      </div>
    </div>
  );
};

export default BookingForm;
