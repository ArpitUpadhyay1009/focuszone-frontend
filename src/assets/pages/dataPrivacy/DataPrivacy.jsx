import "./DataPrivacy.css";
import React from 'react';
import Navbar from "../../components/navbar/Navbar"
import AnimatedBackground from "../../components/AnimatedBackground/AnimatedBackground"
import Footer from "../../components/footer/Footer";
import '../../components/common/ThemeStyles.css'; // Import ThemeStyles

const DataPrivacy = () => {
  return (
    <>
    <div>
        <AnimatedBackground />
        <Navbar />
        <div className="mt-[1%] flex-col justify-center pb-10"> {/* Added pb-10 for spacing before footer */}
            <h1 className="text-center text-2xl font-[Poppins] font-semibold">Data Privacy Notice</h1>
            {/* Apply theme-box and adjust text color for "Last updated" */}
            <div className="theme-box w-[90vw] mx-auto rounded-xl mt-[2%] p-6 md:p-8 shadow-lg">
                <h2 className="text-2xl font-semibold font-[Poppins] mb-2">Privacy Policy</h2>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">Last updated: June 03, 2025</p>

                <p className="mb-4">
                    This privacy policy explains how Weschta & von Hoch Streaming Ventures GbR ("we", "us", or "our") 
                    processes your personal data when you use our service FocusZone ("Service"), accessible at 
                    www.focuszone.io. This policy applies to all pages of our website and related subdomains.
                </p>

                <section className="mb-6">
                    <h3 className="text-xl font-semibold font-[Poppins] mb-2">1. Responsible Entity</h3>
                    <p>Weschta & von Hoch Streaming Ventures GbR</p>
                    <p>Kemperplatz 1, 10785 Berlin, Germany</p>
                    <p>Email: focuszone@streaming-ventures.com</p>
                </section>

                <section className="mb-6">
                    <h3 className="text-xl font-semibold font-[Poppins] mb-2">2. Overview of Data Processing</h3>
                    <p className="mb-1"><strong>Types of Data Processed:</strong></p>
                    <ul className="list-disc list-inside mb-3 ml-4">
                        <li>Name (if provided)</li>
                        <li>Email address (if provided)</li>
                        <li>User-generated content (tasks, statistics, input data)</li>
                        <li>Device and browser data</li>
                        <li>Cookies and analytics data (if consented)</li>
                        <li>IP address</li>
                    </ul>
                    <p className="mb-1"><strong>Data Subjects:</strong></p>
                    <ul className="list-disc list-inside mb-3 ml-4">
                        <li>Users of the website and platform</li>
                    </ul>
                    <p className="mb-1"><strong>Purposes of Processing:</strong></p>
                    <ul className="list-disc list-inside ml-4">
                        <li>Operation of the Service</li>
                        <li>Provision of content and functionality</li>
                        <li>Usage analysis and improvement</li>
                        <li>Security and fraud prevention</li>
                        <li>Communication if initiated by user</li>
                    </ul>
                </section>

                <section className="mb-6">
                    <h3 className="text-xl font-semibold font-[Poppins] mb-2">3. Legal Basis</h3>
                    <ul className="list-disc list-inside ml-4">
                        <li><strong className="font-medium">Consent (Art. 6 para. 1 lit. a GDPR):</strong> For analytics, cookies, tracking tools, and newsletters if introduced.</li>
                        <li><strong className="font-medium">Contract performance (Art. 6 para. 1 lit. b GDPR):</strong> If users interact with our Service.</li>
                        <li><strong className="font-medium">Legitimate interests (Art. 6 para. 1 lit. f GDPR):</strong> For security, service improvement, and basic analytics.</li>
                    </ul>
                </section>

                <section className="mb-6">
                    <h3 className="text-xl font-semibold font-[Poppins] mb-2">4. Hosting and Log Files</h3>
                    <p className="mb-2">
                        Our hosting provider stores data about each access to the server in server log files. This includes:
                    </p>
                    <ul className="list-disc list-inside mb-2 ml-4">
                        <li>Accessed pages</li>
                        <li>IP address</li>
                        <li>Browser type and version</li>
                        <li>Operating system</li>
                        <li>Referrer URL</li>
                        <li>Time of access</li>
                    </ul>
                    <p className="mb-2"><strong>Storage duration:</strong> Log files are deleted after 30 days unless needed for investigation.</p>
                    <p><strong>Security Measures:</strong> TLS encryption, access control, and secure server infrastructure in Germany.</p>
                </section>

                <section className="mb-6">
                    <h3 className="text-xl font-semibold font-[Poppins] mb-2">5. Use of Cookies</h3>
                    <p className="mb-2">We use cookies to:</p>
                    <ul className="list-disc list-inside mb-2 ml-4">
                        <li>Ensure technical functionality of the site</li>
                        <li>Store user preferences</li>
                        <li>Measure and analyze traffic (with consent)</li>
                    </ul>
                    <p className="mb-2">Cookies are classified as:</p>
                    <ul className="list-disc list-inside mb-2 ml-4">
                        <li>Essential cookies: Needed for the Service to function</li>
                        <li>Analytics cookies (e.g., Google Analytics, Hotjar)</li>
                        <li>Marketing cookies (e.g., Meta Pixel, if activated)</li>
                    </ul>
                    <p>Cookies are only activated after consent via a cookie banner. Users can revoke or adjust cookie preferences at any time.</p>
                </section>

                <section className="mb-6">
                    <h3 className="text-xl font-semibold font-[Poppins] mb-2">6. Web Analytics and Tracking (Future Use)</h3>
                    <p className="mb-2">We may use tools like:</p>
                    <ul className="list-disc list-inside mb-2 ml-4">
                        <li>Google Analytics</li>
                        <li>Meta Pixel</li>
                        <li>Hotjar</li>
                    </ul>
                    <p>These services help us understand how the Service is used. Data may be transferred outside the EU under Standard Contractual Clauses.</p>
                </section>

                <section className="mb-6">
                    <h3 className="text-xl font-semibold font-[Poppins] mb-2">7. Social Media Presence</h3>
                    <p className="mb-2">
                        We maintain presences on platforms like Instagram, TikTok, and LinkedIn. If you interact with our pages there, 
                        the respective platforms' privacy policies apply. We may be jointly responsible with Meta (Facebook/Instagram) 
                        for certain insights (Page Insights).
                    </p>
                </section>

                <section className="mb-6">
                    <h3 className="text-xl font-semibold font-[Poppins] mb-2">8. User Rights Under GDPR</h3>
                    <p className="mb-2">You may contact us at any time to exercise your rights:</p>
                    <ul className="list-disc list-inside mb-2 ml-4">
                        <li>Access to your data (Art. 15 GDPR)</li>
                        <li>Rectification (Art. 16 GDPR)</li>
                        <li>Deletion (Art. 17 GDPR)</li>
                        <li>Restriction (Art. 18 GDPR)</li>
                        <li>Data portability (Art. 20 GDPR)</li>
                        <li>Objection to processing (Art. 21 GDPR)</li>
                        <li>Withdrawal of consent (Art. 7 para. 3 GDPR)</li>
                    </ul>
                    <p>
                        You also have the right to lodge a complaint with the supervisory authority: 
                        Berliner Beauftragte für Datenschutz und Informationsfreiheit, Friedrichstr. 219, 10969 Berlin
                    </p>
                </section>

                <section className="mb-6">
                    <h3 className="text-xl font-semibold font-[Poppins] mb-2">9. Data Storage and Deletion</h3>
                    <p>
                        We store data only as long as necessary for the purposes stated, or until you request deletion. 
                        Legal retention periods remain unaffected.
                    </p>
                </section>

                <section className="mb-6">
                    <h3 className="text-xl font-semibold font-[Poppins] mb-2">10. Data Transfers to Third Countries</h3>
                    <p>
                        If tools like Google Analytics or Meta Pixel are used, data may be transferred to the U.S. or 
                        other countries outside the EU. These transfers are secured via Standard Contractual Clauses (Art. 46 GDPR).
                    </p>
                </section>

                <section className="mb-6">
                    <h3 className="text-xl font-semibold font-[Poppins] mb-2">11. Security Measures</h3>
                    <p className="mb-2">We implement:</p>
                    <ul className="list-disc list-inside ml-4">
                        <li>SSL/TLS encryption</li>
                        <li>Secure access controls</li>
                        <li>Pseudonymization where appropriate</li>
                        <li>Regular system updates</li>
                    </ul>
                </section>

                <section className="mb-6">
                    <h3 className="text-xl font-semibold font-[Poppins] mb-2">12. Changes to This Policy</h3>
                    <p>
                        We may update this policy. Changes will be communicated via the website and noted by the "Last Updated" date above.
                    </p>
                </section>
            </div>
        </div>
        <Footer />
    </div>
    </>
  )
}

export default DataPrivacy