import React from 'react';
import ReactDOM from 'react-dom/client';
import { Auth0Provider } from '@auth0/auth0-react';
import { BrowserRouter } from 'react-router-dom';

import App from './App';
import { AuthProvider } from './context/AuthContext';
import { RoleProvider } from './context/RoleContext';
import { ProfileProvider } from './context/ProfileContext';
import { SportsProvider } from './context/SportsContext';

ReactDOM.createRoot(document.getElementById('root')).render(
  <Auth0Provider
    domain={import.meta.env.VITE_AUTH0_DOMAIN}
    clientId={import.meta.env.VITE_AUTH0_CLIENT_ID}
    authorizationParams={{
      redirect_uri: window.location.origin,
      audience: import.meta.env.VITE_AUTH0_AUDIENCE,
    }}
  >
    <BrowserRouter>
      <AuthProvider>
        <RoleProvider>
          <ProfileProvider>
            <SportsProvider>
              <App />
               </SportsProvider>
          </ProfileProvider>
        </RoleProvider>
      </AuthProvider>
    </BrowserRouter>
  </Auth0Provider>
);
