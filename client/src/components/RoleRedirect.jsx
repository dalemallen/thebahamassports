import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import jwt_decode from 'jwt-decode';
import { useAuth0 } from '@auth0/auth0-react';

const RoleRedirect = () => {
  const { isAuthenticated, getIdTokenClaims, isLoading } = useAuth0();
  const navigate = useNavigate();

  useEffect(() => {
    const handleRedirect = async () => {
      if (!isAuthenticated) return;

      const tokenClaims = await getIdTokenClaims();
      const decoded = jwt_decode(tokenClaims.__raw);

      const roles = decoded['https://thebahamassports.com/roles'] || [];

      // Priority: one role only — adjust logic if multi-role dashboard needed
      if (roles.includes('athlete')) navigate('/dashboard/athlete');
      else if (roles.includes('coach')) navigate('/dashboard/coach');
      else if (roles.includes('federation')) navigate('/dashboard/federation');
      else if (roles.includes('organizer')) navigate('/dashboard/organizer');
      else if (roles.includes('team')) navigate('/dashboard/team');
      else navigate('/dashboard/general'); // fallback
    };

    handleRedirect();
  }, [isAuthenticated, getIdTokenClaims, navigate]);

  return null;
};

export default RoleRedirect;
