import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
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
import StudyWGram from "@pages/studyWGram/StudyWGram";
import Terms from "@pages/terms/Terms";
import Contact from "@pages/contact/Contact";
import Cookie from "@pages/cookie/Cookie";
import NewsletterSubscription from "@pages/newsletter";
import NewsletterLanding from "@pages/newsletter/NewsletterLanding";
import ProtectedRoute, {
  PublicRoute,
} from "./assets/components/protectedpage/ProtectedRoute";
import { useAuth } from "./assets/context/AuthContext";
import {
  NewsletterProvider,
  useNewsletter,
} from "./assets/context/NewsletterContext";
import NewsletterModal from "./assets/components/NewsletterModal/NewsletterModal";

function App() {
  const { user } = useAuth();

  // Structured data for organization
  const structuredDataOrganization = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "FocusZone",
    url: "https://focuszone.io",
    logo: "https://focuszone.io/logo.png",
    description:
      "FocusZone.io – The Gamified Pomodoro Timer That Makes You Want to Study Turn study time into game time with FocusZone.io — the ultimate gamified Pomodoro timer built for students. Every minute you focus earns you coins, XP, and room upgrades. Use our Pomodoro and countdown timers to stay on track, complete tasks, and unlock stylish furniture to customize your virtual study room. Plug into our embedded, focus-optimized Spotify playlist, scientifically designed and frequently updated to keep you deep in the zone. Track your streaks, monitor your stats, and enjoy study sessions that actually motivate you. Keep leveling up — who knows… maybe a secret second floor unlocks when you least expect it?",
  };

  // Structured data for web application
  const structuredDataWebApp = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "FocusZone",
    applicationCategory: "ProductivityApplication",
    operatingSystem: "Web",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
  };

  return (
    <NewsletterProvider>
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
        <NewsletterModalWrapper />
        <Routes>
          {/* Public routes (only for unauthenticated users) */}
          <Route
            path="/login"
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            }
          />
          <Route
            path="/register"
            element={
              <PublicRoute>
                <Register />
              </PublicRoute>
            }
          />
          <Route
            path="/"
            element={
              <PublicRoute>
                <Home />
              </PublicRoute>
            }
          />

          {/* Step-protected routes (verify-otp temporarily disabled) */}
          {/**
          <Route
            path="/verify-otp"
            element={
              <ProtectedRoute requiredStep="otpSent">
                <VerifyOtp />
              </ProtectedRoute>
            }
          />
          */}
          <Route
            path="/reset-password"
            element={
              <ProtectedRoute requiredStep="resetVerified">
                <ResetPassword />
              </ProtectedRoute>
            }
          />

          {/* Protected routes (authenticated users only) */}
          <Route
            path="/home"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <ProtectedRoute requiredRole="admin">
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/newsletter"
            element={
              <ProtectedRoute>
                <NewsletterSubscription />
              </ProtectedRoute>
            }
          />
          <Route path="/newsletter/subscribe" element={<NewsletterLanding />} />

          {/* Public informational routes */}
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/data-privacy" element={<DataPrivacy />} />
          <Route path="/studyw.tok" element={<StudyWTok />} />
          <Route path="/studyw.gram" element={<StudyWGram />} />
          <Route path="/terms-and-conditions" element={<Terms />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/privacy" element={<DataPrivacy />} />
          <Route path="/privacy-policy" element={<DataPrivacy />} />
          <Route path="/contact-us" element={<Contact />} />
          <Route path="/cookies" element={<Cookie />} />

          {/* 404 route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </NewsletterProvider>
  );
}

// Newsletter Modal Wrapper Component
function NewsletterModalWrapper() {
  const { user } = useAuth();
  const { showNewsletterModal, hideModal } = useNewsletter();

  if (!user) return null;

  return (
    <NewsletterModal
      isOpen={showNewsletterModal}
      onClose={hideModal}
      userEmail={user.email || ""}
    />
  );
}

export default App;
