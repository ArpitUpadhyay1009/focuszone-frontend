import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import Home from "@pages/home/Home.jsx";
import Dashboard from "@pages/dashboard/Dashboard.jsx";
import Login from "@pages/login/Login.jsx";
import Register from "@pages/register/Register.jsx";
import ForgotPassword from "@pages/forgotPassword/ForgotPassword.jsx";
import ResetPassword from "@pages/resetPassword/ResetPassword.jsx";
import VerifyOtp from "@pages/verifyotp/VerifyOtp.jsx";
function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/verify-otp" element={<VerifyOtp />} />
          <Route path="/home" element={<Dashboard />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
