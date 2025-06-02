import React from "react";
import VerifyBox from "@components/verifybox/VerifyBox.jsx";
import AnimatedBackground from "@components/AnimatedBackground/AnimatedBackground.jsx";
import Footer from "../../components/footer/Footer";

const VerifyOtp = () => {
  return (
    <>
      <AnimatedBackground />
      <img
        src="/logo.png"
        alt="logo"
        className="h-25 w-25 ml-[47%] mt-[12%] p-4"
      />
      <div className="ml-[1%]">
        <VerifyBox />
      </div>
      <div className="mt-[14%]"><Footer/></div>
      
    </>
  );
};

export default VerifyOtp;
