import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Helmet } from "react-helmet";
import "./App.css";
import Home from "@pages/home/Home.jsx";
import Dashboard from "@pages/dashboard/Dashboard.jsx";
import Login from "@pages/login/Login.jsx";
import Register from "@pages/register/Register.jsx";
import ForgotPassword from "@pages/forgotPassword/ForgotPassword.jsx";
import ResetPassword from "@pages/resetPassword/ResetPassword.jsx";
import VerifyOtp from "@pages/verifyotp/VerifyOtp.jsx";
import AdminDashboard from "@pages/admin/AdminDashboard";
import NotFound from "@pages/notFound/NotFound.jsx";
import DataPrivacy from "@pages/dataPrivacy/DataPrivacy";
import BrowserTracker from "@components/BrowserTracker";
import StudyWTok from "@pages/studyWTok/StudyWTok";
import Terms from "@pages/terms/Terms";
import Contact from "@pages/contact/Contact";
import Cookie from "@pages/cookie/Cookie";

function App() {
  // Structured data for organization
  const structuredDataOrganization = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "FocusZone",
    "url": "https://focuszone.io",
    "logo": "https://focuszone.io/logo.png",
    "description": "FocusZone.io – The Gamified Pomodoro Timer That Makes You Want to Study Turn study time into game time with FocusZone.io — the ultimate gamified Pomodoro timer built for students. Every minute you focus earns you coins, XP, and room upgrades. Use our Pomodoro and countdown timers to stay on track, complete tasks, and unlock stylish furniture to customize your virtual study room. Plug into our embedded, focus-optimized Spotify playlist, scientifically designed and frequently updated to keep you deep in the zone. Track your streaks, monitor your stats, and enjoy study sessions that actually motivate you. Keep leveling up — who knows… maybe a secret second floor unlocks when you least expect it?"
  };

  // Structured data for web application
  const structuredDataWebApp = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "FocusZone",
    "applicationCategory": "ProductivityApplication",
    "operatingSystem": "Web",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    }
  };

  return (
    <>
      <BrowserTracker />
      <Helmet>
        <script type="application/ld+json">
          {JSON.stringify(structuredDataOrganization)}
        </script>
        <script type="application/ld+json">
          {JSON.stringify(structuredDataWebApp)}
        </script>
      </Helmet>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/verify-otp" element={<VerifyOtp />} />
          <Route path="/home" element={<Dashboard />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="*" element={<NotFound />} />
          <Route path="/data-privacy" element={<DataPrivacy />} />
          <Route path="/studyw.tok" element={<StudyWTok />} />
          <Route path="/terms-and-conditions" element={<Terms />} />
          <Route path="/contact-us" element={<Contact />} />
          <Route path="/cookies" element={<Cookie />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
