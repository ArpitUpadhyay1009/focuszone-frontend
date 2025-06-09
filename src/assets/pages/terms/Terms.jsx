import "./Terms.css";
import React from 'react';
import Navbar from "../../components/navbar/Navbar"
import AnimatedBackground from "../../components/AnimatedBackground/AnimatedBackground"
import Footer from "../../components/footer/Footer";

import '../../components/common/ThemeStyles.css'; // Import ThemeStyles

const Terms = () => {
  return (
    <>
    <div>
        <AnimatedBackground />
        <Navbar />
        <div className="mt-[1%] flex-col justify-center pb-10"> {/* Added pb-10 for spacing before footer */}
            <h1 className="text-center text-2xl font-[Poppins] font-semibold">Terms & Conditions</h1>
            {/* Apply theme-box and adjust text color */}
            <div className="theme-box w-[90vw] mx-auto rounded-xl mt-[2%] p-6 md:p-8 shadow-lg">
                <h2 className="text-2xl font-semibold font-[Poppins] mb-2">FocusZone Terms and Conditions</h2>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">Last updated: June 03, 2025</p>

                <p className="mb-4">
                    Please read these terms and conditions carefully before using Our Service.
                </p>

                <section className="mb-6">
                    <h3 className="text-xl font-semibold font-[Poppins] mb-2">User Accounts and Data Deletion</h3>
                    <p className="mb-2">
                        You may be required to create an account to access certain features of the Service. 
                        You agree to provide accurate, complete, and current information and to keep it updated. 
                        You are responsible for safeguarding your account and for any activities or actions under your credentials.
                    </p>
                    <p>
                        If You wish to terminate Your account, You may do so at any time by contacting Us at focuszone@streaming-ventures.com. 
                        Upon deletion of Your account, we will delete or anonymize Your data in accordance with applicable data protection laws and our Privacy Policy.
                    </p>
                </section>

                <section className="mb-6">
                    <h3 className="text-xl font-semibold font-[Poppins] mb-2">User-Generated Content</h3>
                    <p className="mb-2">
                        If You post, upload, or otherwise share content through the Service (e.g., task lists, messages, profile information), 
                        You retain ownership of such content but grant the Company a worldwide, non-exclusive, royalty-free license to use, 
                        display, reproduce, and distribute such content solely for providing and improving the Service.
                    </p>
                    <p>
                        You represent and warrant that you have the right to post any content You submit and that such content does not infringe 
                        the rights of any third party. We reserve the right, but not the obligation, to remove content that violates these 
                        Terms or is otherwise objectionable.
                    </p>
                </section>

                <section className="mb-6">
                    <h3 className="text-xl font-semibold font-[Poppins] mb-2">Fees and Payments</h3>
                    <p>
                        Currently, the Service is provided free of charge. We reserve the right to introduce paid features or services in the future. 
                        If such features are introduced, we will inform You in advance and update these Terms accordingly.
                    </p>
                </section>

                <section className="mb-6">
                    <h3 className="text-xl font-semibold font-[Poppins] mb-2">Cookies</h3>
                    <p>
                        Our Website may use cookies and similar tracking technologies as described in our Privacy Policy to enhance user 
                        experience and analyze usage. By using the Service, You consent to the use of cookies in accordance with Our Privacy Policy.
                    </p>
                </section>

                <section className="mb-6">
                    <h3 className="text-xl font-semibold font-[Poppins] mb-2">Force Majeure</h3>
                    <p>
                        The Company shall not be held liable for any failure or delay in performance due to events beyond its reasonable control, 
                        including but not limited to internet outages, system failures, natural disasters, pandemics, strikes, war, 
                        governmental actions, or acts of God.
                    </p>
                </section>

                <section className="mb-6">
                    <h3 className="text-xl font-semibold font-[Poppins] mb-2">Indemnification</h3>
                    <p className="mb-2">
                        You agree to indemnify, defend, and hold harmless the Company and its affiliates, officers, agents, employees, 
                        and partners from and against any claims, liabilities, damages, losses, and expenses (including legal fees) 
                        arising out of or in connection with:
                    </p>
                    <ul className="list-disc list-inside ml-4">
                        <li>Your use or misuse of the Service</li>
                        <li>Your violation of these Terms</li>
                        <li>Your violation of any third-party rights</li>
                    </ul>
                </section>

                <section className="mb-6">
                    <h3 className="text-xl font-semibold font-[Poppins] mb-2">Accessibility</h3>
                    <p>
                        We strive to ensure that our Service is accessible to as many users as possible. If you encounter accessibility 
                        issues or have suggestions for improvement, please contact us at focuszone@streaming-ventures.com.
                    </p>
                </section>

                <section className="mb-6">
                    <h3 className="text-xl font-semibold font-[Poppins] mb-2">Governing Law</h3>
                    <p className="mb-2">
                        The laws of Germany, excluding its conflicts of law rules, shall govern these Terms and Your use of the Service. 
                        Place of jurisdiction shall be Berlin.
                    </p>
                    <p>
                        Your use of the Service may also be subject to other local, state, national, or international laws.
                    </p>
                </section>
            </div>
        </div>
        <Footer />
    </div>
    </>
  )
}

export default Terms;