import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import Home from "@pages/home/Home";
import Dashboard from "@pages/dashboard/Dashboard";
import Login from "@pages/login/Login";
import Register from "@pages/register/Register";
import ForgotPassword from "@pages/forgotPassword/ForgotPassword";
import VerifyOtp from "@pages/verifyotp/VerifyOtp";
function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot" element={<ForgotPassword />} />
          <Route path="/verify-otp" element={<VerifyOtp />} />
          <Route path="/home" element={<Dashboard />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
