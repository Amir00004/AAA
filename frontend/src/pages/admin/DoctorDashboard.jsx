import React, { useEffect, useState } from "react";
import {
  User,
  Calendar,
  FileText,
  Shield,
  Users,
  Search,
} from "lucide-react";
import { getUser } from "../../pages/admin/admin";
import DoctorSlotForm from "../../components/Admin/DoctorSlotForm";
import DoctorSlotList from "../../components/Admin/DoctorSlotList";
import DoctorAppointments from "../../components/Admin/DoctorAppointments";
import Navbar from "../../components/Admin/Navbar";
import api from "../../api";

const DoctorDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [doctorData, setDoctorData] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [patients, setPatients] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDoctorData = async () => {
      try {
        const storedUser = localStorage.getItem("user");
        if (!storedUser) {
          setError("No user found.");
          return;
        }

        const parsedUser = JSON.parse(storedUser);
        if (!parsedUser?.id) {
          setError("Invalid user data.");
          return;
        }

        const response = await getUser(parsedUser.id);
        console.log(response)
        setDoctorData(response);
        setAppointments(response?.doctor?.appointments || []);

        // Fetch patients assigned to the doctor
        const patientsResponse = await api.get(`/api/users/doctor/patients/`);
        setPatients(patientsResponse.data || []);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch doctor data or patients.");
      } finally {
        setLoading(false);
      }
    };

    fetchDoctorData();
  }, []);

  const renderOverview = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <div className="flex items-center">
            <User className="h-8 w-8 text-blue-500" />
            <div className="ml-4">
              <p className="text-sm text-gray-500">Full Name</p>
              <p className="text-2xl font-semibold text-gray-900">
                {doctorData?.first_name} {doctorData?.last_name}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <div className="flex items-center">
            <Calendar className="h-8 w-8 text-green-500" />
            <div className="ml-4">
              <p className="text-sm text-gray-500">Appointments</p>
              <p className="text-2xl font-semibold text-gray-900">8</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <div className="flex items-center">
            <Users className="h-8 w-8 text-amber-500" />
            <div className="ml-4">
              <p className="text-sm text-gray-500">Patients</p>
              <p className="text-2xl font-semibold text-gray-900">{patients.length}</p>
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
                {doctorData?.first_name} {doctorData?.last_name} ({doctorData?.email})
              </p>
              <p className="text-xs text-gray-500">
                Specialization: {doctorData?.doctor?.specialization || "N/A"}
              </p>
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
      {doctorData && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-gray-700">
          <div>
            <h4 className="text-sm font-medium text-gray-500">Full Name</h4>
            <p className="text-gray-900">{doctorData.first_name} {doctorData.last_name}</p>
          </div>
          <div>
            <h4 className="text-sm font-medium text-gray-500">Email</h4>
            <p className="text-gray-900">{doctorData.email}</p>
          </div>
          <div>
            <h4 className="text-sm font-medium text-gray-500">Specialization</h4>
            <p className="text-gray-900">{doctorData.doctor?.specialization || "N/A"}</p>
          </div>
          <div>
            <h4 className="text-sm font-medium text-gray-500">Phone Number</h4>
            <p className="text-gray-900">{doctorData.phone_number}</p>
          </div>
          <div className="md:col-span-2">
            <h4 className="text-sm font-medium text-gray-500">Address</h4>
            <p className="text-gray-900">{doctorData.address}</p>
          </div>
        </div>
      )}
    </div>
  );

  const renderAppointmentSlots = () => (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">Manage Appointment Slots</h3>
      <DoctorSlotForm />
      <div className="mt-6">
        <DoctorSlotList />
      </div>
    </div>
  );

  const renderPatientAppointments = () => (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">Calender</h3>
        <DoctorAppointments />

    </div>
  );

  const renderPatients = () => (
    <div className="bg-white rounded-xl shadow-sm">
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Patient Management</h3>
          <div className="relative">
            <input
              type="text"
              placeholder="Search patients..."
              className="w-64 pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          </div>
        </div>

        <div className="overflow-x-auto max-h-96 overflow-y-auto">
          <table className="min-w-full">
            <thead>
              <tr className="border-b">
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Gender
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {patients
                .filter((patient) =>
                  `${patient.first_name} ${patient.last_name} ${patient.email}`
                    .toLowerCase()
                    .includes(searchQuery.toLowerCase())
                )
                .map((patient) => (
                  <tr key={patient.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {patient.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {patient.first_name} {patient.last_name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {patient.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {patient.patient?.gender || "N/A"}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
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
                  <h2 className="text-lg font-semibold text-gray-900">Doctor Dashboard</h2>
                  <p className="text-sm text-gray-500">Manage Your Schedule</p>
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
                  onClick={() => setActiveTab("appointment-slots")}
                  className={`w-full flex items-center space-x-2 px-4 py-2 text-sm font-medium rounded-lg ${
                    activeTab === "appointment-slots"
                      ? "bg-blue-50 text-blue-700"
                      : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  <Calendar className="h-5 w-5" />
                  <span>Appointments</span>
                </button>
                <button
                  onClick={() => setActiveTab("Calender")}
                  className={`w-full flex items-center space-x-2 px-4 py-2 text-sm font-medium rounded-lg ${
                    activeTab === "Calender"
                      ? "bg-blue-50 text-blue-700"
                      : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  <Calendar className="h-5 w-5" />
                  <span>Calendar</span>
                </button>
                <button
                  onClick={() => setActiveTab("patients")}
                  className={`w-full flex items-center space-x-2 px-4 py-2 text-sm font-medium rounded-lg ${
                    activeTab === "patients"
                      ? "bg-blue-50 text-blue-700"
                      : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  <Users className="h-5 w-5" />
                  <span>Patients</span>
                </button>
              </nav>
            </div>
          </div>
          {/* Main Content */}
          <div className="flex-1">
            {activeTab === "overview" && renderOverview()}
            {activeTab === "profile" && renderProfile()}
            {activeTab === "appointment-slots" && renderAppointmentSlots()}
            {activeTab === "Calender" && renderPatientAppointments()}
            {activeTab === "patients" && renderPatients()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorDashboard;