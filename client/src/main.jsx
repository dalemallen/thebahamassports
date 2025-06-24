import React from 'react';
import ReactDOM from 'react-dom/client';
import { Auth0Provider } from '@auth0/auth0-react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { UserProvider } from './context/UserContext';
import { SportsProvider } from './context/SportsContext';
import App from './App';
import AuthGate from './components/common/AuthGate'; // path might vary

ReactDOM.createRoot(document.getElementById('root')).render(
  <Auth0Provider
    domain={import.meta.env.VITE_AUTH0_DOMAIN}
    clientId={import.meta.env.VITE_AUTH0_CLIENT_ID}
    authorizationParams={{
      // redirect_uri: window.location.origin + "/callback",
      redirect_uri: window.location.origin + "/redirect-handler", // ✅ must match
      audience: import.meta.env.VITE_AUTH0_AUDIENCE,
      scope: "openid profile email"
    }}
  >
    <BrowserRouter>
      <AuthProvider>
        <UserProvider>
          <SportsProvider>
            <AuthGate>
              <App />
            </AuthGate>
          </SportsProvider>
        </UserProvider>
      </AuthProvider>
    </BrowserRouter>
  </Auth0Provider>
);
