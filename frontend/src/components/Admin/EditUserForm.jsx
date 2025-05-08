import { useState, useEffect } from "react";
import { updateUser, getUser } from "../../pages/admin/admin";
import UploadPatientScan from "../../components/Admin/UploadPatientScan";

function EditUserForm({ user, open, onClose, onUserUpdated }) {
    const [formData, setFormData] = useState({
        first_name: "",
        last_name: "",
        date_of_birth: "",
        address: "",
        phone_number: "",
        gender: "",
        medical_history: "",
        specialization: "",
        experience_years: "",
        license_number: "",
        bio: ""
    });

    useEffect(() => {
        if (user) {
            console.log("User Data:", user);
            setFormData({
                first_name: user.first_name || "",
                last_name: user.last_name || "",
                date_of_birth: user.date_of_birth || "",
                address: user.address || "",
                phone_number: user.phone_number || "",
                gender: user.patient?.gender || "",
                medical_history: user.patient?.medical_history || "",
                specialization: user.doctor?.specialization || "",
                experience_years: user.doctor?.experience_years || "",
                license_number: user.doctor?.license_number || "",
                bio: user.doctor?.bio || ""
            });
            console.log("Form Data after update:", formData);
        }
    }, [user]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await updateUser(user.id, formData);
            alert("User updated successfully!");
            onUserUpdated();
            onClose(); 
        } catch (error) {
            console.error("Error updating user:", error);
            alert("Failed to update user.");
        }
    };

    return (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-60 backdrop-blur-sm flex justify-center items-center p-4">
  <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-8 scrollbar-thin scrollbar-thumb-blue-500 scrollbar-track-gray-200 transition-all duration-300">
    <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Edit User Information</h2>

    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Name Fields */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <input
          type="text"
          name="first_name"
          value={formData.first_name}
          onChange={handleChange}
          placeholder="First Name"
          className="p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <input
          type="text"
          name="last_name"
          value={formData.last_name}
          onChange={handleChange}
          placeholder="Last Name"
          className="p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </div>

      {/* Common Info */}
      <input
        type="date"
        name="date_of_birth"
        value={formData.date_of_birth}
        onChange={handleChange}
        className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
      />

      <input
        type="text"
        name="address"
        value={formData.address}
        onChange={handleChange}
        placeholder="Address"
        className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
      />

      <input
        type="text"
        name="phone_number"
        value={formData.phone_number}
        onChange={handleChange}
        placeholder="Phone Number"
        className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
      />

      {/* Patient Fields */}
      {user.role === "patient" && (
        <div className="space-y-4">
          <select
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            <option value="">Select Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>

          <input
            type="text"
            name="medical_history"
            value={formData.medical_history}
            onChange={handleChange}
            placeholder="Medical History"
            className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
          />

          <div className="border-t pt-4">
            <UploadPatientScan patientId={user.patient.id} />
          </div>
        </div>
      )}

      {/* Doctor Fields */}
      {user.role === "doctor" && (
        <div className="space-y-4">
          <input
            type="text"
            name="specialization"
            value={formData.specialization}
            onChange={handleChange}
            placeholder="Specialization"
            className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
          />

          <input
            type="number"
            name="experience_years"
            value={formData.experience_years}
            onChange={handleChange}
            placeholder="Years of Experience"
            className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
          />

          <input
            type="text"
            name="license_number"
            value={formData.license_number}
            onChange={handleChange}
            placeholder="License Number"
            className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
          />

          <textarea
            name="bio"
            value={formData.bio}
            onChange={handleChange}
            placeholder="Brief Bio"
            rows={4}
            className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none"
          />
        </div>
      )}

      {/* Buttons */}
      <div className="flex justify-end gap-4 pt-6">
        <button
          type="button"
          onClick={onClose}
          className="bg-gray-400 hover:bg-gray-500 text-white font-medium px-6 py-2 rounded-xl transition"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded-xl transition"
        >
          Save
        </button>
      </div>
    </form>
  </div>
</div>

    );
}

export default EditUserForm;