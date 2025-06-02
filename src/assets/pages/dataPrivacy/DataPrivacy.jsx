import "./DataPrivacy.css";
import React from 'react';
import Navbar from "../../components/navbar/Navbar"
import AnimatedBackground from "../../components/AnimatedBackground/AnimatedBackground"
import Footer from "../../components/footer/Footer";

const DataPrivacy = () => {
  return (
    <>
    <div>
        <AnimatedBackground />
        <Navbar />
        <div className="mt-[1%] flex-col justify-center">
            <h1 className="text-center text-2xl font-[Poppins] font-semibold">Data Privacy Notice</h1>
            <div className="h-[80vh] w-[90vw] bg-white mx-auto rounded-xl mt-[1%]">
                <h2 className="font-medium text-xl font-[Poppins] text-new px-1">Lorem ipsum</h2>
                <p className="text-new px-1">Lorem ipsum dolor sit amet consectetur adipisicing elit. 
                    Aperiam eligendi quaerat eveniet! Debitis suscipit officia possimus adipisci, 
                    quidem qui, explicabo minus ea corporis ipsam vel corrupti! Incidunt totam ullam 
                    qui.</p>
            </div>
        </div>
        <Footer />
    </div>
    </>
  )
}

export default DataPrivacy