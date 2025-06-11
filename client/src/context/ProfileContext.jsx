import { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from './AuthContext';
import axios from 'axios';

const ProfileContext = createContext();

export const ProfileProvider = ({ children }) => {
  const { accessToken, isAuthenticated } = useAuth();
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    if (isAuthenticated && accessToken) {
      axios.get('/api/profile', {
        headers: { Authorization: `Bearer ${accessToken}` }
      }).then(res => setProfile(res.data)).catch(console.error);
    }
  }, [accessToken, isAuthenticated]);

  return (
    <ProfileContext.Provider value={{ profile, setProfile }}>
      {children}
    </ProfileContext.Provider>
  );
};

export const useProfile = () => useContext(ProfileContext);
