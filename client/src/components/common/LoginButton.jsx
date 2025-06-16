import { useAuth0 } from '@auth0/auth0-react';

export default function LoginButton({ role }) {
  const { loginWithRedirect } = useAuth0();

  const handleLogin = () => {
    // Store role in sessionStorage so we can retrieve it after redirect
    sessionStorage.setItem('pendingRole', role);

    loginWithRedirect({
      appState: { role }, // optional, may not survive reload
      authorizationParams: {
        redirect_uri: window.location.origin + "/callback", // or your redirect URL
      },
    });
  };

  return (
    <button onClick={handleLogin}>Login as {role}</button>
  );
}
