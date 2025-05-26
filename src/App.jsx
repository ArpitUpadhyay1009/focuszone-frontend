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

function App() {
  // Structured data for organization
  const structuredDataOrganization = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "FocusZone",
    "url": "https://focuszone.io",
    "logo": "https://focuszone.io/logo.png",
    "description": "FocusZone helps users boost productivity with focus timer, task management, and productivity tracking tools."
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
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
