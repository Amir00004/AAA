import { useState } from "react";
import api from "../api";
import {useNavigate} from "react-router-dom";
import { ACCESS_TOKEN } from "../constants";
import { REFRESH_TOKEN } from "../constants";


function Register() {
    const [formData, setFormData] = useState({
        email: "",
        password: "",
        first_name: "",
        last_name: "",
        date_of_birth: "",
        phone_number: "",
        role: "patient",
        gender: "",
        medical_history: "",
        specialization: "",
        experience_years: "",
        license_number: "",
        bio: "",
    });
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
    
        try {
            const res = await api.post("/api/users/register/", formData, {
                headers: {
                    "Content-Type": "application/json",
                },
            });
    
            console.log("API Response:", res);
    
            if (res.status === 201) {
                alert("Registration successful! Please log in.");
                navigate("/login");
            } else {
                alert("Error: " + JSON.stringify(res.data));
            }
        } catch (error) {
            console.error("Error Details:", error);
    
            alert(
                "Something went wrong: " + 
                (error.response ? JSON.stringify(error.response.data) : error.message)
            );
        } finally {
            setLoading(false);
        }
    };
    
    return  ( 
        <div className="max-w-md mx-auto p-8 bg-white shadow-2xl rounded-3xl border border-blue-100 mt-10">
        <h2 className="text-3xl font-bold text-center text-blue-600 mb-6">Register</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Email" className="border border-gray-300 bg-gray-50 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 transition" required />
          <input type="password" name="password" value={formData.password} onChange={handleChange} placeholder="Password" className="border border-gray-300 bg-gray-50 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 transition" required />
          <input type="text" name="first_name" value={formData.first_name} onChange={handleChange} placeholder="First Name" className="border border-gray-300 bg-gray-50 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 transition" required />
          <input type="text" name="last_name" value={formData.last_name} onChange={handleChange} placeholder="Last Name" className="border border-gray-300 bg-gray-50 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 transition" required />
          <input type="date" name="date_of_birth" value={formData.date_of_birth} onChange={handleChange} placeholder="Date of Birth" className="border border-gray-300 bg-gray-50 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 transition" required />
          <input type="text" name="phone_number" value={formData.phone_number} onChange={handleChange} placeholder="Phone Number" className="border border-gray-300 bg-gray-50 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 transition" required />
          <input type="text" name="address" value={formData.address} onChange={handleChange} placeholder="Home Address" className="border border-gray-300 bg-gray-50 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 transition" required />
          <select name="role" value={formData.role} onChange={handleChange} className="border border-gray-300 bg-gray-50 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 transition">
            <option value="patient">Patient</option>
            <option value="doctor">Doctor</option>
            <option value="admin">Admin</option>
          </select>
      
          {formData.role === "patient" && (
            <>
              <select name="gender" value={formData.gender} onChange={handleChange} className="border border-gray-300 bg-gray-50 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 transition" required>
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
              <textarea name="medical_history" value={formData.medical_history} onChange={handleChange} placeholder="Medical History" className="border border-gray-300 bg-gray-50 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 transition" />
            </>
          )}
      
          {formData.role === "doctor" && (
            <>
              <input type="text" name="specialization" value={formData.specialization} onChange={handleChange} placeholder="Specialization" className="border border-gray-300 bg-gray-50 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 transition" required />
              <input type="number" name="experience_years" value={formData.experience_years} onChange={handleChange} placeholder="Years of Experience" className="border border-gray-300 bg-gray-50 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 transition" required />
              <input type="text" name="license_number" value={formData.license_number} onChange={handleChange} placeholder="License Number" className="border border-gray-300 bg-gray-50 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 transition" required />
              <textarea name="bio" value={formData.bio} onChange={handleChange} placeholder="Brief Bio" className="border border-gray-300 bg-gray-50 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 transition" />
            </>
          )}
      
          <button type="submit" className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-4 py-3 rounded-xl font-semibold hover:from-blue-600 hover:to-purple-600 transition shadow-lg disabled:opacity-60" disabled={loading}>
            {loading ? "Adding..." : "Add User"}
          </button>
        </form>
      </div>
      
    );
};

export default Register