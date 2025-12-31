import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import DashboardLayout from './layouts/DashboardLayout';
import Attendance from './pages/Attendance';
import Messages from './pages/Messages';
import Teachers from './pages/Teachers';
import Students from './pages/Students';
import Classes from './pages/Classes';
import Exams from './pages/Exams';
import Finance from './pages/Finance';
import Library from './pages/Library';
import Hostel from './pages/Hostel';
import Transport from './pages/Transport';
import Radio from './pages/Radio';
import RadioSubject from './pages/Radio/Subject';
import Sports from './pages/Sports';
import GroupStudies from './pages/GroupStudies';
import Inventory from './pages/Inventory';

function App() {
  // Mock auth state for now
  const isAuthenticated = true; // Set to false to test login redirect

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        
        <Route path="/" element={isAuthenticated ? <DashboardLayout /> : <Navigate to="/login" />}>
          <Route index element={<Dashboard />} />
          <Route path="attendance" element={<Attendance />} />
          <Route path="messages" element={<Messages />} />
          <Route path="teachers" element={<Teachers />} />
          <Route path="students" element={<Students />} />
          <Route path="classes" element={<Classes />} />
          <Route path="exams" element={<Exams />} />
          <Route path="finance" element={<Finance />} />
          <Route path="library" element={<Library />} />
          <Route path="hostel" element={<Hostel />} />
          <Route path="transport" element={<Transport />} />
          <Route path="radio" element={<Radio />} />
          <Route path="radio/:subject" element={<RadioSubject />} />
          <Route path="sports" element={<Sports />} />
          <Route path="group-studies" element={<GroupStudies />} />
          <Route path="inventory" element={<Inventory />} />
        </Route>

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
