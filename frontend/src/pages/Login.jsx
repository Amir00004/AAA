import { useState } from "react";
import api from "../api";
import { useNavigate } from "react-router-dom";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../constants";

function Login() {
    const [formData, setFormData] = useState({
        email: "",
        password: "",
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
            const res = await api.post("/api/token", formData);
            console.log("Login successful:", res.data);
    
            // Store tokens
            localStorage.setItem(ACCESS_TOKEN, res.data.access);
            localStorage.setItem(REFRESH_TOKEN, res.data.refresh);
    
            // Store user object
            const user = { name: res.data.name, role: res.data.role, id: res.data.id };
            localStorage.setItem("user", JSON.stringify(user));
    
            // Notify other components about login
            window.dispatchEvent(new Event("storage"));
    
            console.log("User stored:", user);
            navigate("/");
        } catch (error) {
            console.error("Login failed:", error);
            alert("Invalid credentials");
        } finally {
            setLoading(false);
        }
    };    


    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-100 via-white to-pink-100 flex items-center justify-center px-4 w-full">
            <div className="bg-white p-10 rounded-3xl shadow-2xl w-full max-w-md border border-blue-100">
                <h2 className="text-3xl font-extrabold mb-8 text-center text-blue-700">Login to Your Account</h2>
                <form className="space-y-6" onSubmit={handleSubmit}>
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Email</label>
                    <input
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-gray-50 shadow-inner focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                    type="email"
                    name="email"
                    placeholder="you@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    />
                </div>
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Password</label>
                    <input
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-gray-50 shadow-inner focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                    type="password"
                    name="password"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    />
                </div>
                <button
                    className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-semibold py-3 rounded-xl shadow-lg transition disabled:opacity-60"
                    type="submit"
                    disabled={loading}
                >
                    {loading ? "Logging in..." : "Login"}
                </button>
                </form>
            </div>
            </div>

  );
};

export default Login;
