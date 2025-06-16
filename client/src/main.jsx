import React from 'react';
import ReactDOM from 'react-dom/client';
import { Auth0Provider } from '@auth0/auth0-react';
import { BrowserRouter } from 'react-router-dom';

import App from './App';
import { AuthProvider } from './context/AuthContext';
import { UserProvider } from './context/UserContext';
import { SportsProvider } from './context/SportsContext';

ReactDOM.createRoot(document.getElementById('root')).render(
  <Auth0Provider
    domain={import.meta.env.VITE_AUTH0_DOMAIN}
    clientId={import.meta.env.VITE_AUTH0_CLIENT_ID}
    authorizationParams={{
      redirect_uri: window.location.origin,
      audience: import.meta.env.VITE_AUTH0_AUDIENCE,
      scope: "openid profile email"

    }}
  >
    <BrowserRouter>
      <AuthProvider>
        <UserProvider>
            <SportsProvider>
              <App />
               </SportsProvider>
        </UserProvider>
      </AuthProvider>
    </BrowserRouter>
  </Auth0Provider>
);
