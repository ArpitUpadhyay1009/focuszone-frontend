import { useState, useEffect } from 'react';
import { Switch } from '@headlessui/react';
import AnimatedBackground from '../../components/AnimatedBackground/AnimatedBackground';
import Navbar from '../../components/navbar/Navbar';
import Footer from '../../components/footer/Footer';

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
      <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Cookie Preferences</h1>
      <p className="mb-6 text-gray-600">
        Manage your cookie preferences. You can change them at any time.
      </p>

      <div className="space-y-6">
        {Object.keys(COOKIE_CATEGORIES).map((key) => {
          const category = COOKIE_CATEGORIES[key];
          return (
            <div key={key} className="flex items-start justify-between bg-gray-100 p-4 rounded-lg">
              <div>
                <h2 className="text-lg font-semibold">{category.label}</h2>
                <p className="text-sm text-gray-600">{category.description}</p>
              </div>
              <Switch
                checked={preferences[key]}
                onChange={() => handleToggle(key)}
                disabled={category.disabled}
                className={`${preferences[key] ? 'bg-blue-600' : 'bg-gray-300'} relative inline-flex h-6 w-11 items-center rounded-full transition`}
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
        className="mt-8 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
      >
        Save Preferences
      </button>
    </div>
    <div className='mt-[12%]'><Footer/></div>
    
    </>
  );
}
