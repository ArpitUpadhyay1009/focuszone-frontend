// src/pages/ForgotPassword.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import AnimatedBackground from "@components/AnimatedBackground/AnimatedBackground.jsx";
import Navbar from "@components/Navbar/Navbar.jsx";
import "@components/registerBox/RegisterBox.css"; // Import the CSS

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await axios.post(`/api/auth/forgot-password`, { email });
      navigate('/reset-password', { state: { email } });
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    }
  };

  return (
    <>
      <Navbar />
      <AnimatedBackground />
      <div className="flex justify-center items-center bg-transparent mt-[10%]">
        <div className="register-box p-6 rounded-lg shadow-lg w-110">
          <h2 className="text-4xl font-[Poppins] text-left font-medium mb-4 register-text">
            Forgot Password
          </h2>
          <form onSubmit={handleSubmit}>
            <input
              type="email"
              required
              className="register-input w-full p-2 border rounded mb-4"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <button type="submit" className="w-full bg-purple-700 text-white p-2 rounded">
              Send OTP
            </button>
          </form>
          {error && <p className="text-red-600 mt-4">{error}</p>}
        </div>
      </div>
    </>
  );
};

export default ForgotPassword;
