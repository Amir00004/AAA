import React, { useState, useEffect } from "react";
import api from "../api";
 // To redirect after booking

const ReserveSlot = () => {
  const [slots, setSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [reason, setReason] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    // Fetch available slots for booking
    api.get("/api/users/slots/") // API endpoint for available slots
      .then((response) => {
        setSlots(response.data);
      })
      .catch((error) => {
        setError("Error fetching available slots.");
        console.error(error);
      });
  }, []);

  const handleSlotSelect = (slot) => {
    setSelectedSlot(slot); // Set the selected slot
  };

  const handleBooking = () => {
    if (!selectedSlot) {
      setError("Please select a slot.");
      return;
    }

    if (!reason) {
      setError("Please provide a reason for the appointment.");
      return;
    }

    const appointmentData = {
      slot: selectedSlot.id,
      reason: reason,
    };

    api
      .post("/api/users/appointments/", appointmentData)
      .then((response) => {
        setSuccessMessage("Your appointment has been booked successfully!");
        setError("");
        setReason(""); 
        setSelectedSlot(null); 
      })
      .catch((error) => {
        setError("Error booking the appointment. Please try again.");
        console.error(error);
      });
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-3xl font-semibold text-center mb-6">Reserve a Slot</h2>
      {error && (
        <div className="text-red-500 bg-red-100 p-3 rounded-md mb-4">
          {error}
        </div>
      )}
      {successMessage && (
        <div className="text-green-500 bg-green-100 p-3 rounded-md mb-4">
          {successMessage}
        </div>
      )}

      <div className="mb-6">
        <h3 className="text-xl font-medium mb-3">Available Slots</h3>
        <ul className="space-y-4">
          {slots.length > 0 ? (
            slots.map((slot) => (
              <li
                key={slot.id}
                onClick={() => handleSlotSelect(slot)}
                className={`cursor-pointer p-4 border rounded-lg shadow-sm hover:bg-gray-100 ${
                  selectedSlot?.id === slot.id ? "bg-blue-100" : "bg-white"
                }`}
              >
                <strong className="block text-lg text-blue-600">
                  Doctor: {slot.doctor_name}
                </strong>
                <div className="text-gray-600">
                  <strong>Date:</strong> {slot.date}
                </div>
                <div className="text-gray-600">
                  <strong>Time:</strong> {slot.start_time} - {slot.end_time}
                </div>
              </li>
            ))
          ) : (
            <p className="text-gray-600">No available slots.</p>
          )}
        </ul>
      </div>

      {selectedSlot && (
        <div className="mb-6">
          <h3 className="text-xl font-medium mb-3">Appointment Reason</h3>
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Enter the reason for your appointment"
            rows="4"
            className="w-full p-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          ></textarea>
        </div>
      )}

      <div>
        <button
          onClick={handleBooking}
          disabled={!selectedSlot}
          className="w-full py-3 text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-lg disabled:bg-gray-400"
        >
          Book Appointment
        </button>
      </div>
    </div>
  );
};

export default ReserveSlot;
