import React from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import CreateUser from './components/CreateUser';
import Login from './components/Login';
import Student from './components/Student';
import Role from './components/Role';
import Header from './components/Header';
import Teacher from './components/Teacher';
import Admin from './components/Admin';

function Navigators() {
  const location = useLocation();  // Hook to get the current location

  return (
    <>
      {/* Conditionally render Header based on the current route */}
      {location.pathname !== '/login' && <Header />}
      
      <Routes>
        <Route path="/" element={<Student />} /> 
        <Route path="/createuser" element={<CreateUser />} />
        <Route path="/login" element={<Login />} />
        <Route path="/role" element={<Role />} />
        <Route path="/teacher" element={<Teacher />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </>
  );
}

export default Navigators;
