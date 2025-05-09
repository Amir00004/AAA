import React, { useEffect, useState } from "react";
import {
  User,
  Calendar,
  FileText,
  CreditCard,
  Shield,
} from "lucide-react";
import { getUser } from "../../pages/admin/admin";
import ReserveSlot from "../../components/ReserveSlot";
import api from "../../api";
import PaymentForm from "../../components/PaymentForm";
import PatientCalendar from "../../components/Admin/PatientCalendar";
import ScanUpload from "../../components/ScanUpload";
import Navbar from "../../components/Admin/Navbar";


const PatientDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [userData, setUserData] = useState(null);
  const [scanImages, setScanImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [appointments, setAppointments] = useState([]);
  const [error, setError] = useState("");
  const [predictionResult, setPredictionResult] = useState(null);
  const [predictionError, setPredictionError] = useState("");

  const fetchUserData = async () => {
    try {
      const storedUser = JSON.parse(localStorage.getItem("user"));
      if (!storedUser) {
        setError("No user found.");
        return;
      }
      if (!storedUser?.id) {
        setError("Invalid user data.");
        return;
      }
      const response = await getUser(storedUser.id);
      setUserData(response);
      setScanImages(response?.patient?.scan_images || []);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch user data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const storedUser = JSON.parse(localStorage.getItem("user"));
        if (storedUser?.id) {
          const response = await api.get(`/api/users/patient/appointments/`);
          setAppointments(response.data);
        } else {
          setError("Invalid user data.");
        }
      } catch (err) {
        console.error(err);
        setError("Failed to fetch appointments.");
      }
    };

    fetchUserData();
    fetchAppointments();
  }, []);

  const handlePassToAI = async (imageUrl) => {
    try {
      setPredictionError("");
      setPredictionResult(null);

      const response = await fetch(`${imageUrl}`);
      const blob = await response.blob();
      const formData = new FormData();
      formData.append("scan", blob, "scan.png");

      const predictResponse = await api.post("/api/users/predict/", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      console.log("Prediction response:", predictResponse.data);
      predictResponse.data.image = imageUrl;
      setPredictionResult(predictResponse.data);
    } catch (err) {
      console.error("Prediction error:", err);
      setPredictionError("Failed to get prediction. Please try again.");
    }
  };

  const handleUploadSuccess = () => {
    fetchUserData(); // Refresh scan images after successful upload
  };

  const renderOverview = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <div className="flex items-center">
            <User className="h-8 w-8 text-blue-500" />
            <div className="ml-4">
              <p className="text-sm text-gray-500">Full Name</p>
              <p className="text-2xl font-semibold text-gray-900">
                {userData?.first_name} {userData?.last_name}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <div className="flex items-center">
            <Calendar className="h-8 w-8 text-green-500" />
            <div className="ml-4">
              <p className="text-sm text-gray-500">Appointments</p>
              <p className="text-2xl font-semibold text-gray-900">{appointments.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <div className="flex items-center">
            <FileText className="h-8 w-8 text-amber-500" />
            <div className="ml-4">
              <p className="text-sm text-gray-500">Scans Uploaded</p>
              <p className="text-2xl font-semibold text-gray-900">{scanImages.length}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Profile Summary</h3>
        <div className="space-y-4">
          <div className="flex items-start">
            <div className="flex-shrink-0 text-blue-500">
              <User className="h-5 w-5" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-gray-900">
                {userData?.first_name} {userData?.last_name} ({userData?.email})
              </p>
              <p className="text-xs text-gray-500">Gender: {userData?.patient?.gender || "N/A"}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderProfile = () => (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">Profile Details</h3>
      {error && <p className="text-red-500 mb-6">{error}</p>}
      {userData && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-gray-700">
          <div>
            <h4 className="text-sm font-medium text-gray-500">Full Name</h4>
            <p className="text-gray-900">{userData.first_name} {userData.last_name}</p>
          </div>
          <div>
            <h4 className="text-sm font-medium text-gray-500">Email</h4>
            <p className="text-gray-900">{userData.email}</p>
          </div>
          <div>
            <h4 className="text-sm font-medium text-gray-500">Date of Birth</h4>
            <p className="text-gray-900">{userData.date_of_birth}</p>
          </div>
          <div>
            <h4 className="text-sm font-medium text-gray-500">Phone Number</h4>
            <p className="text-gray-900">{userData.phone_number}</p>
          </div>
          <div className="md:col-span-2">
            <h4 className="text-sm font-medium text-gray-500">Address</h4>
            <p className="text-gray-900">{userData.address}</p>
          </div>
          <div className="md:col-span-2">
            <h4 className="text-sm font-medium text-gray-500">Gender</h4>
            <p className="text-gray-900">{userData.patient?.gender || "N/A"}</p>
          </div>
          <div className="md:col-span-2">
            <h4 className="text-sm font-medium text-gray-500">Medical History</h4>
            <p className="text-gray-900 whitespace-pre-line">{userData.patient?.medical_history || "N/A"}</p>
          </div>
        </div>
      )}
    </div>
  );

  const renderAppointments = () => (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">Your Appointments</h3>
      {appointments.length > 0 ? (
        <div className="space-y-4">
          {appointments.map((appointment) => (
            <div
              key={appointment.id}
              className="p-4 bg-gray-50 rounded-lg border border-gray-200"
            >
              <p className="text-sm text-gray-900">
                <strong>Doctor:</strong> {appointment.doctor_first_name} {appointment.doctor_last_name}
              </p>
              <p className="text-sm text-gray-900">
                <strong>Date:</strong> {appointment.appointment_date}
              </p>
              <p className="text-sm text-gray-900">
                <strong>Time:</strong> {appointment.appointment_time}
              </p>
              <p className="text-sm text-gray-900">
                <strong>Reason:</strong> {appointment.reason || "No reason provided"}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500 italic">You have no upcoming appointments.</p>
      )}
    </div>
  );

  const renderScans = () => (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">Uploaded Lab Scans</h3>
      {scanImages.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {scanImages.map((scan) => (
            <div key={scan.id} className="flex flex-col items-center">
              <img
                src={`${scan.image}`}
                alt={`Scan ${scan.id}`}
                className="w-full max-w-xs rounded-xl shadow-sm border border-gray-200"
              />
              <p className="text-sm text-gray-500 mt-2">
                Uploaded: {new Date(scan.uploaded_at).toLocaleDateString()}
              </p>
              <div className="mt-4 space-x-4">
                <a
                  href={`${scan.image}`}
                  download
                  className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
                >
                  Download
                </a>
                <button
                  onClick={() => {
                    handlePassToAI(scan.image);
                    document.getElementById('results')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition"
                >
                  Pass to AI
                </button>
                
              </div>
            </div>
          ))}
          
        </div>
        
      ) : (
        <p className="text-gray-500 italic">No scans uploaded yet.</p>
      )}
      {predictionResult && (
        <div id="results" className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <h2 className="text-lg font-semibold mb-2">Preview:</h2>
          <img src={predictionResult.image} alt="Scan Preview" className="w-full max-w-md rounded-lg shadow" />*
          <h4 className="text-lg font-semibold text-gray-900">AI Prediction Results</h4>
          <p className="text-sm text-gray-900">
            <strong>Normal:</strong> {(predictionResult.normal * 100).toFixed(2)}%
          </p>
          <p className="text-sm text-gray-900">
            <strong>Lung Opacity:</strong> {(predictionResult.lungop * 100).toFixed(2)}%
          </p>
          <p className="text-sm text-gray-900">
            <strong>Pneumonia:</strong> {(predictionResult.pneumonia * 100).toFixed(2)}%
          </p>
        </div>
      )}
      {predictionError && (
        <p className="mt-4 text-red-500">{predictionError}</p>
      )}
      <div className="mt-6">
        <ScanUpload />
      </div>
    </div>
  );

  const renderBookAppointment = () => (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">Book an Appointment</h3>
      <ReserveSlot />
    </div>
  );

  const renderPayment = () => (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">Payment Information</h3>
      <PaymentForm />
    </div>
  );

  const renderCalendar = () => (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">Appointment Calendar</h3>
      <PatientCalendar />
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-600 text-lg">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="h-8"></div>
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar */}
          <div className="w-full md:w-64 flex-shrink-0">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center space-x-4 mb-6">
                <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                  <Shield className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">Patient Dashboard</h2>
                  <p className="text-sm text-gray-500">Manage Your Health</p>
                </div>
              </div>
              <nav className="space-y-2">
                <button
                  onClick={() => setActiveTab("overview")}
                  className={`w-full flex items-center space-x-2 px-4 py-2 text-sm font-medium rounded-lg ${
                    activeTab === "overview"
                      ? "bg-blue-50 text-blue-700"
                      : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  <User className="h-5 w-5" />
                  <span>Overview</span>
                </button>
                <button
                  onClick={() => setActiveTab("profile")}
                  className={`w-full flex items-center space-x-2 px-4 py-2 text-sm font-medium rounded-lg ${
                    activeTab === "profile"
                      ? "bg-blue-50 text-blue-700"
                      : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  <User className="h-5 w-5" />
                  <span>Profile</span>
                </button>
                <button
                  onClick={() => setActiveTab("appointments")}
                  className={`w-full flex items-center space-x-2 px-4 py-2 text-sm font-medium rounded-lg ${
                    activeTab === "appointments"
                      ? "bg-blue-50 text-blue-700"
                      : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  <Calendar className="h-5 w-5" />
                  <span>Appointments</span>
                </button>
                <button
                  onClick={() => setActiveTab("scans")}
                  className={`w-full flex items-center space-x-2 px-4 py-2 text-sm font-medium rounded-lg ${
                    activeTab === "scans"
                      ? "bg-blue-50 text-blue-700"
                      : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  <FileText className="h-5 w-5" />
                  <span>Scans</span>
                </button>
                <button
                  onClick={() => setActiveTab("book-appointment")}
                  className={`w-full flex items-center space-x-2 px-4 py-2 text-sm font-medium rounded-lg ${
                    activeTab === "book-appointment"
                      ? "bg-blue-50 text-blue-700"
                      : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  <Calendar className="h-5 w-5" />
                  <span>Book Appointment</span>
                </button>
                <button
                  onClick={() => setActiveTab("payment")}
                  className={`w-full flex items-center space-x-2 px-4 py-2 text-sm font-medium rounded-lg ${
                    activeTab === "payment"
                      ? "bg-blue-50 text-blue-700"
                      : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  <CreditCard className="h-5 w-5" />
                  <span>Payment</span>
                </button>
                <button
                  onClick={() => setActiveTab("calendar")}
                  className={`w-full flex items-center space-x-2 px-4 py-2 text-sm font-medium rounded-lg ${
                    activeTab === "calendar"
                      ? "bg-blue-50 text-blue-700"
                      : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  <Calendar className="h-5 w-5" />
                  <span>Calendar</span>
                </button>
              </nav>
            </div>
          </div>
          {/* Main Content */}
          <div className="flex-1">
            {activeTab === "overview" && renderOverview()}
            {activeTab === "profile" && renderProfile()}
            {activeTab === "appointments" && renderAppointments()}
            {activeTab === "scans" && renderScans()}
            {activeTab === "book-appointment" && renderBookAppointment()}
            {activeTab === "payment" && renderPayment()}
            {activeTab === "calendar" && renderCalendar()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientDashboard;  