import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Notice the './page/' added to the paths here!
import LandingPage from './pages/Landing'; 
import SignUp from './pages/onboarding/SignUp';  
import Login from './pages/auth/Login';
import Onboarding from './pages/onboarding/Onboarding';
import ForgotPassword from './pages/auth/ForgotPassword';
import ResetPassword from './pages/auth/ResetPassword';
import PasswordResetSuccess from './pages/auth/PasswordResetSuccess';
import OnboardingStep2 from './pages/onboarding/OnboardingStep2';
import OnboardingStep3 from './pages/onboarding/OnboardingStep3';
import VerifiedCertificate from './pages/onboarding/VerifiedCertificate';



const App = () => {
  return (
    <Router>
      <Routes>
        {/* The Landing Page loads on the default path */}
        <Route path="/" element={<LandingPage />} />
        
        {/* The Sign Up page loads when the URL is /signup */}
        <Route path="/signup" element={<SignUp />} />

        <Route path="/login" element={<Login />} />
        <Route path="/forgot" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/reset-success" element={<PasswordResetSuccess />} />
        <Route path="/onboarding" element={<Onboarding />} />  
        <Route path="/onboarding-step-2" element={<OnboardingStep2 />} />  
        <Route path="/certificate" element={<VerifiedCertificate />} />
        <Route path="/onboarding-step-3" element={<OnboardingStep3 />} />  
      </Routes>
    </Router>
  );
};

export default App;