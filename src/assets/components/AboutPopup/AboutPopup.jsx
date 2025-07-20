import React, { useEffect, useRef } from 'react';
import './AboutPopup.css';

const AboutPopup = ({ isOpen, onClose }) => {
  const popupRef = useRef(null);

  // Close popup when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        onClose();
      }
    };

    // Close on Escape key
    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden'; // Prevent scrolling when popup is open
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div 
        ref={popupRef}
        className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col animate-fadeIn"
      >
        <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">About Focuszone.io</h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-white"
            aria-label="Close"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className="overflow-y-auto p-6 space-y-6 text-gray-700 dark:text-gray-300">
          <div className="space-y-4">
            <p className="text-lg">
              <a href="http://focuszone.io/" className="text-blue-600 dark:text-blue-400 hover:underline">Focuszone.io</a> is a gamified Pomodoro timer designed to supercharge your productivity. Combining the proven <strong>Pomodoro Technique</strong> with a built-in <strong>Focus Music Box</strong>, it helps you stay concentrated during deep work, study, or creative tasks.
            </p>
            
            <p className="text-lg">
              What makes Focuszone.io unique? We've built in an integrated <strong>Music Box</strong>, featuring specially curated music scientifically designed to boost concentration, sustain mental energy, and keep you in the zone. No need to switch between apps, stay focused and motivated with the perfect background sound for every session.
            </p>
            
            <p className="text-lg">
              And every successful focus session earns you <strong>coins</strong>. Use them to <strong>build and upgrade your virtual workspace</strong>, turning productivity into a rewarding game.
            </p>
          </div>

          <div className="bg-blue-50 dark:bg-blue-900/30 p-4 rounded-lg">
            <h3 className="text-xl font-semibold mb-3 text-blue-800 dark:text-blue-200">🎯 How to Use Focuszone.io</h3>
            <ol className="list-decimal pl-5 space-y-2">
              <li><strong>Add your tasks</strong> for the day.</li>
              <li><strong>Set session estimates</strong> for each task (1 session = 25 min of work).</li>
              <li><strong>Start the timer</strong> and let the <strong>Focuszone Music Box</strong> enhance your concentration.</li>
              <li><strong>Earn coins</strong> for every session completed.</li>
              <li><strong>Upgrade your workspace</strong> with the coins and unlock new levels.</li>
              <li>Take <strong>short and long breaks</strong> to recharge between cycles.</li>
            </ol>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-3 text-gray-800 dark:text-white">✨ Why Focuszone.io?</h3>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>Combines <strong>focus-enhancing music</strong> with productivity tracking.</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span><strong>Gamified rewards</strong> keep you motivated to stay consistent.</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>Helps fight procrastination with structured, timed sessions.</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>Accessible on desktop and mobile — no downloads required.</span>
              </li>
              <li className="flex items-start md:col-span-2">
                <span className="mr-2">•</span>
                <span>Turns boring work into a fun, interactive experience.</span>
              </li>
            </ul>
          </div>

          <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
            <h3 className="text-xl font-semibold mb-3 text-gray-800 dark:text-white">💰 Coin Distribution System</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow">
                <h4 className="font-medium text-center mb-2">Level 2</h4>
                <p className="text-center text-2xl font-bold text-yellow-500">1 coin</p>
              </div>
              <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow">
                <h4 className="font-medium text-center mb-2">Level 3-5</h4>
                <p className="text-center text-2xl font-bold text-yellow-500">5 coins</p>
              </div>
              <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow">
                <h4 className="font-medium text-center mb-2">Level 6-8</h4>
                <p className="text-center text-2xl font-bold text-yellow-500">10 coins</p>
              </div>
              <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow">
                <h4 className="font-medium text-center mb-2">Level 9-12</h4>
                <p className="text-center text-2xl font-bold text-yellow-500">20 coins</p>
              </div>
              <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow">
                <h4 className="font-medium text-center mb-2">Level 13-15</h4>
                <p className="text-center text-2xl font-bold text-yellow-500">40 coins</p>
              </div>
              <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow">
                <h4 className="font-medium text-center mb-2">Level 15-20</h4>
                <p className="text-center text-2xl font-bold text-yellow-500">60 coins</p>
              </div>
              <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow">
                <h4 className="font-medium text-center mb-2">Level 21-25</h4>
                <p className="text-center text-2xl font-bold text-yellow-500">100 coins</p>
              </div>
              <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow">
                <h4 className="font-medium text-center mb-2">Level 36-40</h4>
                <p className="text-center text-2xl font-bold text-yellow-500">150 coins</p>
              </div>
              <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow">
                <h4 className="font-medium text-center mb-2">Level 41-45</h4>
                <p className="text-center text-2xl font-bold text-yellow-500">200 coins</p>
              </div>
              <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow sm:col-span-2 lg:col-span-1">
                <h4 className="font-medium text-center mb-2">Level 46-50</h4>
                <p className="text-center text-2xl font-bold text-yellow-500">300 coins</p>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-3 text-gray-800 dark:text-white">🏆 Progress Bar Items</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {[
                'Level 1: Starting Level',
                'Level 2: Bed',
                'Level 3: Side Table with a lamp',
                'Level 4: Bookshelves',
                'Level 5: Storage',
                'Level 6: Rug',
                'Level 7: Center table',
                'Level 8: Books',
                'Level 9: Computer Setup',
                'Level 10: Boxes for storage',
                'Level 11: Exercising Equipment',
                'Level 12: Pictures on the wall',
                'Level 13: Coffee and Cookies',
                'Level 14: Clock',
                'Level 15: Cactus Plant on the window',
                'Level 16: Houseplant',
                'Level 17: Stationary',
                'Level 18: Slippers',
                'Level 19: Dustbin',
                'Level 20: Moon Lamp',
                'Level 21: Jewellery Box',
                'Level 22: Succulent House Pot',
                'Level 23: Picture frame',
                'Level 24: Additional books',
                'Level 25: Laundry baskets',
                'Level 26: Rubik\'s cube',
                'Level 27: Candles',
                'Level 28: Additional Books',
                'Level 29: Globe',
                'Level 30: Climber house plant',
                'Level 31: Snake house plant',
                'Level 32: Double floor layout',
                'Level 33: Single couch',
                'Level 34: Rectangle table',
                'Level 35: Center Table',
                'Level 36: Side table for the couch',
                'Level 37: Aquarium',
                'Level 38: More storage',
                'Level 39: Hangers',
                'Level 40: Carpet',
                'Level 41: Pictures',
                'Level 42: Large Houseplant',
                'Level 43: Jacket',
                'Level 44: Books and useful stuff',
                'Level 45: Teddy Bear',
                'Level 46: Side Table with book',
                'Level 47: House plant near the window',
                'Level 48: Coffee and Cookies',
                'Level 49: Food Plate',
                'Level 50: Cat'
              ].map((item, index) => (
                <div 
                  key={index}
                  className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow hover:shadow-md transition-shadow"
                >
                  <p className="text-sm">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
          <button
            onClick={onClose}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors"
          >
            Got it, let's focus! 🚀
          </button>
        </div>
      </div>
    </div>
  );
};

export default AboutPopup;
