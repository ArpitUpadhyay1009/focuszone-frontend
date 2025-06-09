import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

function Footer() {
    return (
        <footer className="footer">
            <div className="max-w-6xl mx-auto px-4">
                <div className="footer-links">
                    <Link to="/terms-and-conditions" className="footer-link">Terms and Conditions</Link>
                    <Link to="/data-privacy" className="footer-link">Data Privacy</Link>
                    <Link to="/contact-us" className="footer-link">Contact Us</Link>
                    <Link to="/cookies" className="footer-link">Cookies and Preferences</Link>
                </div>
            </div>
        </footer>
    );
}

export default Footer;