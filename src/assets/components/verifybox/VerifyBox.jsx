import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const VerifyOTP = () => {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState(""); // User enters OTP
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await axios.post(
        "http://localhost:3001/api/auth/verify-otp",
        {
          email,
          otp,
        }
      );

      alert("Email verified successfully!");
      navigate("/login"); // Redirect to login page
    } catch (error) {
      if (error.response) {
        if (error.response.status === 400) {
          alert("Invalid or expired OTP. Please try again.");
        } else {
          alert("Server error! Please try again later.");
          navigate("/server-error"); // Redirect on server error
        }
      } else {
        console.error("Unexpected error:", error);
        navigate("/server-error");
      }
    }
  };

  return (
    <div className="flex justify-center items-center bg-transparent">
      <div className="bg-white p-8 rounded-xl shadow-lg w-96">
        <h2 className="text-3xl font-semibold text-left font-[Poppins] text-gray-800 mb-4">
          Verify OTP
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Enter Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-3 py-2 border-none bg-gray-200 font-[Poppins] rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          <input
            type="text"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            required
            className="w-full px-3 py-2 border-none bg-gray-200 font-[Poppins] rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          <button
            type="submit"
            className="w-full bg-purple-700 font-[Poppins] text-white py-2 rounded-lg cursor-pointer hover:bg-purple-800 transition shadow-[0px_-4px_10px_rgba(128,0,128,0.3)]"
          >
            Verify OTP
          </button>
        </form>
      </div>
    </div>
  );
};

export default VerifyOTP;
