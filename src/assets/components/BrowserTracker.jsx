import { useEffect } from 'react';
import axios from 'axios';
import getBrowser from '../utils/BrowserTracker';

export default function BrowserTracker() {
  useEffect(() => {
    const browser = getBrowser();
    if (!localStorage.getItem('browserTracked')) {
      axios.post('/api/admin/track-browser', { browser })
        .then(() => {
          localStorage.setItem('browserTracked', 'true');
        })
        .catch((error) => {
          console.error('Error tracking browser:', error);
        });
    }
  }, []);

  return null; // No UI
}
