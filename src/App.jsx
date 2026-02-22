import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import LandingPage from './pages/Landing'; 
import SignUp from './pages/onboarding/SignUp';  
import Login from './pages/auth/Login';
import Onboarding from './pages/onboarding/Onboarding';
import ForgotPassword from './pages/auth/ForgotPassword';
import ResetPassword from './pages/auth/ResetPassword';
import PasswordResetSuccess from './pages/auth/PasswordResetSuccess';
import VerifiedCertificate from './pages/onboarding/VerifiedCertificate';
import Dashboard from './pages/dashboard/dashboard';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/signup" element={<SignUp />} />

        <Route path="/login" element={<Login />} />
        <Route path="/forgot" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/reset-success" element={<PasswordResetSuccess />} />
        <Route path="/onboarding" element={<Onboarding />} />   
        <Route path="/certificate" element={<VerifiedCertificate />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </Router>
  );
};

export default App;