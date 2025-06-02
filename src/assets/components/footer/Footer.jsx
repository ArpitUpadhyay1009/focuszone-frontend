import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

function Footer() {
    return (
        <footer className="footer px-3 py-[1%]">
            <Link to="/terms-and-conditions" className="footer-link text-gray-600 px-4">Terms and Conditions</Link>
            <Link to="/data-privacy" className="footer-link text-gray-600 px-4">Data Privacy</Link>
            <Link to="/contact-us" className="footer-link text-gray-600 px-4">Contact Us</Link>
            <Link to="/cookies" className="footer-link text-gray-600 px-4">Cookies and Preferences</Link>
        </footer>
    );
}

export default Footer;