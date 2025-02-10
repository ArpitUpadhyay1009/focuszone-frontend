import { Link } from "react-router-dom";
import "./ForgotBox.css";
import React from "react";

const ForgotBox = () => {
  return (
    <>
      <div className="flex flex-col items-center justify-center bg-transparent">
        <div className="bg-white p-6 rounded-lg shadow-lg w-100">
          <h2 className="text-xl font-bold text-left font-[Poppins] mb-4">
            Enter OTP
          </h2>
          <form>
            <input
              type="text"
              placeholder="Enter OTP"
              className="w-full p-2 border rounded-lg text-left focus:ring-2 focus:ring-[#fff]"
            />
            <Link to="/reset">
              <button
                type="submit"
                className="mt-4 w-full bg-[#7500CA] text-white py-2 rounded-lg hover:bg-[#7500CA] transition hover:grow"
              >
                Submit
              </button>
            </Link>
          </form>
        </div>
      </div>
    </>
  );
};

export default ForgotBox;
