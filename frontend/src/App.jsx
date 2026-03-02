import './App.css'
import Login from './pages/Login'
import Register from './pages/Register'
import Home from './pages/Home'
import Hospitals from './pages/Hospital'
import Symptomchecker from './pages/Symptomchecker'
import TelemedicineFull from './pages/TelemedicineFull'
import Charity from './pages/Charity'
import Myappoinment from './pages/Myappoinment'
import DonationSuccess from './pages/Donatesuccess'
import Donate from './pages/Donate'
import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Doctors from './pages/Viewdoctor'
import Booking from './pages/Booking'
import MyProfile from './pages/Myprofile'


function App() {
  return (
    <>
      <Navbar />

      <Routes>
        <Route path='/' element={<Home />} />
        <Route path="/doctors" element={<Doctors />} />
        <Route path="/booking" element={<Booking />} />
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register />} />
        <Route path='/hospitals' element={<Hospitals />} />
        <Route path='/symptomchecker' element={<Symptomchecker />} />
        <Route path='/telemedicine' element={<TelemedicineFull />} />
        <Route path='/charity' element={<Charity />} />
        <Route path='/donate' element={<Donate />} />
        <Route path='/donation-success' element={<DonationSuccess />} />
        <Route path='/myappoinment' element={<Myappoinment />} />
        <Route path="/profile" element={<MyProfile />} />
        
      </Routes>
    </>
  )
}

export default App