import React from "react"
import { BrowserRouter, Routes, Route,  Navigate } from "react-router-dom"
import Login from "./pages/Login"
import Register from "./pages/Register"

import NotFound from "./pages/NotFound"
import Geoloc from "./pages/Geoloc"
import Home from './pages/Home';
import About from './pages/About';
import Appointment from './pages/Appointment';
import Contact from './pages/Contact';
import Service from './pages/Service';
import Search from './components/Search';
import Pricing from './pages/Pricing';
import PatientDashboard from "./pages/admin/PatientDashboard";
import DoctorDashboard from "./pages/admin/DoctorDashboard";
import AdminDashboard from "./pages/admin/AdminDashboard";
import ProtectedRoute from "./components/ProtectedRoute"
import Header from "./components/Headers"
import './App.css'
import Car from "./components/Car"

const PrivateRoute = ({ element, role }) => {
  const user = JSON.parse(localStorage.getItem("user"));
  
  if (!user) {
      return <Navigate to="/login" />;
  }

  if (user.role !== role) {
      return <Navigate to="/" />;
  }

  return element;
};

function Logout(){
  localStorage.clear()
  return <Navigate to="/login"/>
}

function RegisterAndLogout(){
  localStorage.clear()
  return <Register/>
}

function App() {

  return (
    
    <BrowserRouter>
    <Car />
      <Routes>
        <Route 
          path="/"
          element={
            <>
              <Header />
              <Car />
              <Search />
              <Home/>
            </>
          }/>
        <Route path="/about" element={
          <>
          <Header />
          <Car />
          <Search />
          <About />
          </>} />
        <Route path="/appointment" element={
          <>
          <ProtectedRoute>
          <Header />
          <Search />
          <Appointment />
          </ProtectedRoute>
          </>} />
        <Route path="/contact" element={
          <>
          <Header />
          <Search />
          <Contact />
          </>} />
        <Route path="/service" element={
          <>
          <Header />
          <Search />
          <Service />
          </>} />
        <Route path="/price" element={
          <>
          <Header />
          <Search />
          <Pricing />
          </>} />
          <Route 
          path="/location"
          element={
            <>
              <Header />
              <Search />
              <Geoloc/>
              </>
          }/>
          <Route 
            path="/login"
            element={
              <>
              <Header />
              <Search />
                <Login/>
                </>
          }/>
          <Route 
            path="/logout"
            element={
                <Logout/>
          }/>
          <Route 
            path="/register"
            element={
              <>
              <Header />
              <Search />
                <RegisterAndLogout/>
                </>
          }/>
          <Route 
            path="*"
            element={
              <>
              <Header />
              <Search />
                <NotFound/>
                </>
          }/>
          <Route 
            path="/dashboard/patient" 
            element={
              <ProtectedRoute>
              <Header />
              <Search />
            <PrivateRoute element={<PatientDashboard />} 
            role="patient" />
            </ProtectedRoute>
          } 
          />
          <Route 
            path="/dashboard/doctor" 
            element={
              <ProtectedRoute>
                <Car />
              <Header />
              <Search />
                <PrivateRoute element={<DoctorDashboard />} 
            role="doctor" />
            </ProtectedRoute>
          } />
          <Route 
            path="/dashboard/admin/*" 
            element={
              <ProtectedRoute>
                <Header />
                <PrivateRoute element={<AdminDashboard />} 
                role="admin" />
              </ProtectedRoute>
          } />
      </Routes>
    </BrowserRouter>
  )
}

export default App
