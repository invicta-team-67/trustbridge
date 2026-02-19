import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Notice the './page/' added to the paths here!
import LandingPage from './pages/Landing'; 
import SignUp from './pages/SignUp';           

const App = () => {
  return (
    <Router>
      <Routes>
        {/* The Landing Page loads on the default path */}
        <Route path="/" element={<LandingPage />} />
        
        {/* The Sign Up page loads when the URL is /signup */}
        <Route path="/signup" element={<SignUp />} />
      </Routes>
    </Router>
  );
};

export default App;