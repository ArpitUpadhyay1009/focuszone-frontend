import "./Contact.css";
import React from 'react';
import Navbar from "../../components/navbar/Navbar"
import AnimatedBackground from "../../components/AnimatedBackground/AnimatedBackground"
import Footer from "../../components/footer/Footer";
import '../../components/common/ThemeStyles.css'; // Import ThemeStyles

const Contact = () => {
  return (
    <>
    <div>
        <AnimatedBackground />
        <Navbar />
        <div className="mt-[1%] flex-col justify-center pb-10"> {/* Added pb-10 for spacing before footer */}
            <h1 className="text-center text-2xl font-[Poppins] font-semibold">Contact Us</h1>
            {/* Apply theme-box and adjust text color */}
            <div className="theme-box w-[90vw] md:w-[60vw] lg:w-[50vw] mx-auto rounded-xl mt-[2%] p-6 md:p-8 shadow-lg text-center">
                <p className="text-lg mb-4">
                    Have questions, feedback, or need support?
                </p>
                <p className="text-lg mb-4">
                    We're here to help. Just drop us an email at:
                </p>
                <a href="mailto:focuszone@streaming-ventures.com" className="text-xl font-semibold text-purple-600 dark:text-purple-400 hover:underline">
                    focuszone@streaming-ventures.com
                </a>
                <p className="text-lg mt-4">
                    and we’ll get back to you as soon as possible.
                </p>
            </div>
        </div>
        <Footer />
    </div>
    </>
  )
}

export default Contact;