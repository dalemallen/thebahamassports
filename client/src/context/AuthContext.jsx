import { createContext, useContext, useEffect, useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const { user, getAccessTokenSilently, isAuthenticated, isLoading } = useAuth0();
  const [accessToken, setAccessToken] = useState(null);

  useEffect(() => {
    if (isAuthenticated && user && !isLoading) {

      getAccessTokenSilently().then(setAccessToken).catch(console.error);

  const role = sessionStorage.getItem('pendingRole');
    if (!role) return;

    sessionStorage.removeItem('pendingRole');

    fetch('/api/users/register-user', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        auth0_id: user.sub,
        email: user.email,
        first_name: user.given_name,
        last_name: user.family_name,
        role: role
      })
    })
    .then(res => {
      if (!res.ok) throw new Error('Registration failed');
      return res.json();
    })
    .catch(err => {
      console.error('DB registration error:', err);
    // window.location.href = '/?account_error=true'; // or show toast/snackbar
    });
  }
  }, [isAuthenticated, getAccessTokenSilently]);

  return (
    <AuthContext.Provider value={{ user, accessToken, isAuthenticated, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
