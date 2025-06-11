import { createContext, useContext, useEffect, useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const { user, getAccessTokenSilently, isAuthenticated, isLoading } = useAuth0();
  const [accessToken, setAccessToken] = useState(null);

  useEffect(() => {
    if (isAuthenticated) {
      getAccessTokenSilently().then(setAccessToken).catch(console.error);
    }
  }, [isAuthenticated, getAccessTokenSilently]);

  return (
    <AuthContext.Provider value={{ user, accessToken, isAuthenticated, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
