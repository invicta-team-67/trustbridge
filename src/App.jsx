import { Route, BrowserRouter as Router, Routes } from "react-router-dom";

import ForgotPassword from "./pages/auth/ForgotPassword";
import Login from "./pages/auth/Login";
import PasswordResetSuccess from "./pages/auth/PasswordResetSuccess";
import ResetPassword from "./pages/auth/ResetPassword";
import Dashboard from "./pages/dashboard/dashboard";
import LandingPage from "./pages/Landing";
import Onboarding from "./pages/onboarding/Onboarding";
import SignUp from "./pages/onboarding/SignUp";
import VerifiedCertificate from "./pages/onboarding/VerifiedCertificate";
import TransactionLayout from "./pages/transaction/TransactionLayout";

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
        <Route path="/new-transaction" element={<TransactionLayout />} />
        
      </Routes>
    </Router>
  );
};

export default App;
