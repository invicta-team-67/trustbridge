import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Notice the './page/' added to the paths here!
import LandingPage from './pages/Landing'; 
import SignUp from './pages/SignUp';  
import Login from './pages/Login';
import Onboarding from './pages/Onboarding';
     

const App = () => {
  return (
    <Router>
      <Routes>
        {/* The Landing Page loads on the default path */}
        <Route path="/" element={<LandingPage />} />
        
        {/* The Sign Up page loads when the URL is /signup */}
        <Route path="/signup" element={<SignUp />} />

        <Route path="/login" element={<Login />} />
        <Route path="/onboarding" element={<Onboarding />} />    
      </Routes>
    </Router>
  );
};

export default App;