/**
 * API service for RSVP operations
 * Communicates with Google Apps Script backend
 */

const API_BASE_URL = import.meta.env.VITE_GOOGLE_APPS_SCRIPT_URL;

/**
 * Fetch guest data by token
 * @param {string} token - Guest invitation token
 * @returns {Promise<Object>} Guest data {name, email, rsvpStatus, timestamp}
 */
export async function fetchGuestData(token) {
  if (!API_BASE_URL) {
    throw new Error('Google Apps Script URL not configured');
  }

  const url = `${API_BASE_URL}?token=${encodeURIComponent(token)}`;

  const response = await fetch(url, {
    method: 'GET',
  });

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error('Invitation not found');
    }
    throw new Error('Failed to fetch guest data');
  }

  const data = await response.json();

  // Check if response contains error
  if (data.error) {
    throw new Error(data.error);
  }

  return data;
}

/**
 * Submit RSVP response
 * @param {string} token - Guest invitation token
 * @param {string} response - 'accepted' or 'declined'
 * @param {number} attendingCount - Number of people attending (for accepted only)
 * @param {string} foodPreference - 'indian' or 'english' (for accepted only)
 * @returns {Promise<Object>} Confirmation {success: true, message: string}
 */
export async function submitRSVP(token, response, attendingCount = 0, foodPreference = null) {
  if (!API_BASE_URL) {
    throw new Error('Google Apps Script URL not configured');
  }

  const body = {
    token,
    response,
  };

  // Add attendingCount and foodPreference for accepted RSVPs
  if (response === 'accepted') {
    body.attendingCount = attendingCount;
    body.foodPreference = foodPreference;
  } else {
    // For declined, set attendingCount to 0
    body.attendingCount = 0;
  }

  const res = await fetch(API_BASE_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'text/plain;charset=utf-8',
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || 'Failed to submit RSVP');
  }

  const data = await res.json();

  // Check if response contains error
  if (data.error) {
    throw new Error(data.error);
  }

  return data;
}
