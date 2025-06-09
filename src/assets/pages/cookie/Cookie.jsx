import { useState, useEffect } from 'react';
import { Switch } from '@headlessui/react';
import AnimatedBackground from '../../components/AnimatedBackground/AnimatedBackground';
import Navbar from '../../components/navbar/Navbar';
import Footer from '../../components/footer/Footer';
import './Cookie.css'; // Import the CSS file for styling
import '../../components/common/ThemeStyles.css'; // Import ThemeStyles

const COOKIE_CATEGORIES = {
  necessary: {
    label: 'Necessary Cookies',
    description: 'These cookies are required for the website to function and cannot be switched off.',
    disabled: true,
  },
  analytics: {
    label: 'Analytics Cookies',
    description: 'These cookies help us understand how visitors interact with the website.',
    disabled: false,
  },
  marketing: {
    label: 'Marketing Cookies',
    description: 'These cookies are used to deliver advertisements more relevant to you.',
    disabled: false,
  },
};

export default function Cookie() {
  const [preferences, setPreferences] = useState({
    necessary: true,
    analytics: false,
    marketing: false,
  });

  useEffect(() => {
    const saved = localStorage.getItem('cookiePreferences');
    if (saved) setPreferences(JSON.parse(saved));
  }, []);

  const handleToggle = (category) => {
    if (!COOKIE_CATEGORIES[category].disabled) {
      setPreferences((prev) => ({
        ...prev,
        [category]: !prev[category],
      }));
    }
  };

  const handleSave = () => {
    localStorage.setItem('cookiePreferences', JSON.stringify(preferences));
    alert('Preferences saved!');
    // Optional: update real cookies or notify backend
  };

  return (
    <>
    <AnimatedBackground/>
    <Navbar/>
      <div className="max-w-2xl mx-auto p-6 pb-10"> {/* Added pb-10 for spacing before footer */}
      <h1 className="text-2xl font-bold mb-4 text-center">Cookie Policy</h1>
      
      <div className="theme-box p-6 rounded-lg shadow-lg mb-8">
        <p className="mb-4">
          Our Website may use cookies and similar tracking technologies as described in our Privacy 
          Policy to enhance user experience and analyze usage. By using the Service, You consent to 
          the use of cookies in accordance with Our Privacy Policy.
        </p>

        <h2 className="text-xl font-semibold font-[Poppins] mb-2">Use of Cookies</h2>
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
        <p>
            Cookies are only activated after consent via a cookie banner. Users can revoke or adjust 
            cookie preferences at any time.
        </p>
      </div>

      <h2 className="text-xl font-bold mb-4">Cookie Preferences</h2>
      <p className="mb-6 head-col"> {/* Assuming head-col is for dark mode compatibility */}
        Manage your cookie preferences. You can change them at any time.
      </p>

      <div className="space-y-6">
        {Object.keys(COOKIE_CATEGORIES).map((key) => {
          const category = COOKIE_CATEGORIES[key];
          return (
            <div key={key} className="theme-box flex items-start justify-between p-4 rounded-lg shadow"> {/* Applied theme-box here too */}
              <div>
                <h2 className="text-lg font-semibold">{category.label}</h2> {/* Removed topic-col, theme-box should handle text */}
                <p className="text-sm text-gray-600 dark:text-gray-400">{category.description}</p>
              </div>
              <Switch
                checked={preferences[key]}
                onChange={() => handleToggle(key)}
                disabled={category.disabled}
                className={`${preferences[key] ? 'bg-purple-800' : 'bg-gray-300'} relative inline-flex h-6 w-11 items-center rounded-full transition`}
              >
                <span
                  className={`${
                    preferences[key] ? 'translate-x-6' : 'translate-x-1'
                  } inline-block h-4 w-4 transform rounded-full bg-white transition`}
                />
              </Switch>
            </div>
          );
        })}
      </div>

      <button
        onClick={handleSave}
        className="mt-8 px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-800 transition"
      >
        Save Preferences
      </button>
    </div>
    <div className='mt-[12%]'><Footer/></div>
    
    </>
  );
}
