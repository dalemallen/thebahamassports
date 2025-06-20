import { useAuth0 } from '@auth0/auth0-react';
import { Button } from '@mui/material';

const LoginButton = ({ role = 'athlete' }) => {
  const { loginWithRedirect } = useAuth0();

  const handleLogin = () => {
    sessionStorage.setItem('pendingRole', role);

    loginWithRedirect({
      appState: { role },
      authorizationParams: {
        redirect_uri: window.location.origin + "/callback", // adjust as needed
      },
    });
  };

  return (
    <Button onClick={handleLogin} variant="contained" color="primary">
      Log In / Sign Up
    </Button>
  );
};

export default LoginButton;
