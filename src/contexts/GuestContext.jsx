import { createContext, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { useGuestToken } from '../hooks/useGuestToken';

const GuestContext = createContext(null);

export function GuestProvider({ children }) {
  const { token } = useParams();
  const guestData = useGuestToken(token);

  return (
    <GuestContext.Provider value={{ token, ...guestData }}>
      {children}
    </GuestContext.Provider>
  );
}

export function useGuest() {
  const context = useContext(GuestContext);
  if (!context) throw new Error('useGuest must be used within GuestProvider');
  return context;
}
