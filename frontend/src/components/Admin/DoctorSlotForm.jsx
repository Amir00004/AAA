import React, { useState } from "react";
import api from "../../api";

const DoctorSlotForm = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const [form, setForm] = useState({
    doctor: user.id,
    date: "",
    start_time: "",
    end_time: ""
  });

  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess("");
    setError("");

    try {
        const response = await api.post("/api/users/slots/create/", form);
        console.log('Response from API:', response); // Log the response
        setSuccess("Slot created successfully!");
        setForm({ date: "", start_time: "", end_time: "" });
      } catch (err) {
        console.error('Error details:', err.response ? err.response.data : err.message);
        setError("Failed to create slot.");
      }
    };

  return (
    <div className="max-w-md mx-auto bg-white shadow p-6 rounded-md mt-10">
      <h2 className="text-2xl font-semibold text-blue-700 mb-4">Add Available Slot</h2>
      {success && <p className="text-green-600 mb-2">{success}</p>}
      {error && <p className="text-red-500 mb-2">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium">Date</label>
          <input
            type="date"
            name="date"
            value={form.date}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Start Time</label>
          <input
            type="time"
            name="start_time"
            value={form.start_time}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium">End Time</label>
          <input
            type="time"
            name="end_time"
            value={form.end_time}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Create Slot
        </button>
      </form>
    </div>
  );
};

export default DoctorSlotForm;
