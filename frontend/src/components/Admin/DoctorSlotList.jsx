import React, { useEffect, useState } from "react";
import api from "../../api";

const DoctorSlotList = () => {
  const [slots, setSlots] = useState([]);
  const [error, setError] = useState("");

  const user = JSON.parse(localStorage.getItem("user")); // parse the stored user object

  useEffect(() => {
    const fetchSlots = async () => {
      try {
        const response = await api.get(`/api/users/slots/all/`);
        setSlots(response.data);
      } catch (err) {
        setError("Failed to load slots.");
        console.error(err.response?.data || err.message);
      }
    };

    if (user?.id) {
      fetchSlots();
    }
  }, [user]);

  return (
    <div className="max-w-4xl mx-auto mt-10 bg-white p-6 rounded shadow">
      <h2 className="text-2xl font-bold text-blue-700 mb-4">My Available Slots</h2>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      {slots.length === 0 ? (
        <p className="text-gray-600">No slots available.</p>
      ) : (
        <table className="w-full table-auto border">
          <thead>
            <tr className="bg-blue-100 text-left">
              <th className="px-4 py-2 border">Date</th>
              <th className="px-4 py-2 border">Start Time</th>
              <th className="px-4 py-2 border">End Time</th>
              <th className="px-4 py-2 border">Booked</th>
            </tr>
          </thead>
          <tbody>
            {slots.map((slot) => (
              <tr key={slot.id} className="border-t">
                <td className="px-4 py-2 border">{slot.date}</td>
                <td className="px-4 py-2 border">{slot.start_time}</td>
                <td className="px-4 py-2 border">{slot.end_time}</td>
                <td className="px-4 py-2 border">
                  {slot.is_booked ? (
                    <span className="text-red-600 font-semibold">Yes</span>
                  ) : (
                    <span className="text-green-600 font-semibold">No</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default DoctorSlotList;
