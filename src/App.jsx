import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Import All Components
import LandingPage from './pages/Landing'; 
import SignUp from './pages/onboarding/SignUp';  
import Login from './pages/auth/Login';
import Onboarding from './pages/onboarding/Onboarding';
import ForgotPassword from './pages/auth/ForgotPassword';
import ResetPassword from './pages/auth/ResetPassword';
import PasswordResetSuccess from './pages/auth/PasswordResetSuccess';
import VerifiedCertificate from './pages/onboarding/VerifiedCertificate';
import Dashboard from './pages/dashboard/dashboard';
import TransactionDashboard from './pages/dashboard/TransactionDashboard';
import LogNewTransaction from './pages/dashboard/LogNewTransaction';
import TransactionReceipt from './pages/dashboard/TransactionReceipt';
import TransactionSuccess from './pages/dashboard/TransactionSuccess';
import TransactionVerification from './pages/dashboard/TransactionVerification';
import TransactionVerifiedSuccess from './pages/dashboard/TransactionVerifiedSuccess';
import TrustReport from './pages/dashboard/TrustReport';
import TrustScore from './pages/dashboard/TrustScore';

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Onboarding & Auth */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgot" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/reset-success" element={<PasswordResetSuccess />} />
        <Route path="/onboarding" element={<Onboarding />} />   
        <Route path="/certificate" element={<VerifiedCertificate />} />

        {/* Dashboard & TrustBridge Ecosystem */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/transaction-dashboard" element={<TransactionDashboard/>} />
        <Route path="/log-new-transaction" element={<LogNewTransaction/>} />
        <Route path="/transaction-receipt" element={<TransactionReceipt/>} />
        <Route path="/transaction-success" element={<TransactionSuccess/>} />
        <Route path="/transaction-verification" element={<TransactionVerification/>} />
        <Route path="/transaction-verified-success" element={<TransactionVerifiedSuccess/>} />
        <Route path="/trust-score" element={<TrustScore/>} />
        <Route path="/trust-report" element={<TrustReport/>} />
      </Routes>
    </Router>
  );
};

export default App;