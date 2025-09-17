import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import Lawyers from './pages/Lawyers'
import Login from './pages/Login'
import About from './pages/About'
import Contact from './pages/Contact'
import MyProfile from './pages/MyProfile'
import MyAppointments from './pages/MyAppointments'
import BookAppointment from './pages/BookAppointment'
import TalkToLawyer from './pages/TalkToLawyer'
import IPCSection from './pages/IPCSection'
import LegalAdvice from './pages/LegalAdvice'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import AgoraVideoCall from './components/AgoraVideoCall';
import AudioCall from './components/AudioCall'
import ChatConsultation from './components/ChatConsultation'
import { ToastContainer,toast } from 'react-toastify'
import "react-toastify/dist/ReactToastify.css";
import AppointmentStatus from './pages/AppointmentStatus'
import LawyerNotifications from './pages/LawyerNotifications'
import UserDashboard from './pages/UserDashboard'
import LawyerRegistration from "./pages/LawyerRegistration";
import LawyerLogin from "./pages/LawyerLogin";
import LawyerDashboard from "./pages/LawyerDashboard";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";

const App = () => {
  return (
    <div className='mx-4 sm:mx-[10%]'>
      <ToastContainer/>
      <Navbar/>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/talk-to-lawyer' element={<TalkToLawyer />} />
        <Route path='/lawyers' element={<Lawyers />} />
        <Route path='/lawyers/:practiceArea' element={<Lawyers />} />
        <Route path='/ipc-section' element={<IPCSection />} />
        <Route path='/legal-advice' element={<LegalAdvice />} />
        <Route path='/login' element={<Login />} />
        <Route path='/about' element={<About />} />
        <Route path='/contact' element={<Contact />} />
        <Route path='/my-profile' element={<MyProfile />} />
        <Route path='/my-appointments' element={<MyAppointments />} />
        <Route path="/book-appointment/:lawyerId" element={<BookAppointment />} />
        <Route path="/appointment-status" element={<AppointmentStatus />} />
        <Route path="/lawyer-notifications" element={<LawyerNotifications />} />
        <Route path="/user-dashboard" element={<UserDashboard />} />
        <Route path="/lawyer-registration" element={<LawyerRegistration />} />
        <Route path="/lawyer-login" element={<LawyerLogin />} />
        <Route path="/lawyer-dashboard" element={<LawyerDashboard />} />
        <Route path="/admin-login" element={<AdminLogin />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path='/video-call/:consultationId' element={<AgoraVideoCall />} />
        <Route path="/audio-call/:consultationId" element={<AudioCall />} />
        <Route path="/chat-consultation/:consultationId" element={<ChatConsultation />} />
      </Routes>
      <Footer/>
    </div>
  )
}

export default App
