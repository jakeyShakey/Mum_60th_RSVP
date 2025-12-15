import { useState, useEffect } from 'react';
import { fetchGuestData } from '../api/rsvpService';

/**
 * Custom hook to fetch guest data using provided token
 * @param {string} token - Guest invitation token
 * @returns {Object} - {guestData, loading, error}
 */
export function useGuestToken(token) {
  const [guestData, setGuestData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Check if development mode is enabled
    const isDevMode = import.meta.env.VITE_DEV_MODE === 'true';

    // Dev mode: if no token, use mock data for testing
    if (isDevMode && !token) {
      setGuestData({
        name: "Test Guest & Partner",
        email: "test@example.com",
        partySize: 2,  // Test couple scenario
        rsvpStatus: "pending",
        attendingCount: null,
        foodPreference: null,
        timestamp: null,
      });
      setLoading(false);
      return;
    }

    // Production: require token
    if (!token) {
      setError('No invitation token provided');
      setLoading(false);
      return;
    }

    loadGuestData(token);
  }, [token]);

  /**
   * Load guest data from API with retry logic
   * @param {string} token - Guest invitation token
   * @param {number} retries - Number of retry attempts remaining
   */
  const loadGuestData = async (token, retries = 3) => {
    try {
      const data = await fetchGuestData(token);
      setGuestData(data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching guest data:', err);

      // Retry logic for network failures
      if (retries > 0 && err.message !== 'Invitation not found') {
        console.log(`Retrying... (${retries} attempts left)`);
        setTimeout(() => loadGuestData(token, retries - 1), 1000);
      } else {
        setError(err.message);
        setLoading(false);
      }
    }
  };

  return { guestData, loading, error };
}
