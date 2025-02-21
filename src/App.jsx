import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import { Home } from "../src/assets/pages/home/Home";
import Dashboard from "./assets/pages/dashboard/Dashboard";
import Login from "./assets/pages/login/Login";
import Register from "./assets/pages/register/Register";
import ForgotPassword from "./assets/pages/forgotPassword/ForgotPassword";
import ResetPassword from "./assets/pages/resetPassword/resetPassword";
import VerifyOtp from "./assets/pages/verifyotp/VerifyOtp";
function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot" element={<ForgotPassword />} />
          <Route path="/reset" element={<ResetPassword />} />
          <Route path="/verify-otp" element={<VerifyOtp />} />
          <Route path="/home" element={<Dashboard />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
