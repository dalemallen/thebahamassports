import { createContext, useContext, useState, useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { jwtDecode } from 'jwt-decode';

const UserContext = createContext();
const namespace = "https://thebahamassports.com/roles";

export const UserProvider = ({ children }) => {
  const { isAuthenticated, getAccessTokenSilently, user } = useAuth0();
  const [userRole, setUserRole] = useState(null);
  const [selectedRole, setSelectedRole] = useState(() => sessionStorage.getItem("pendingRole"));
  const [needsOnboarding, setNeedsOnboarding] = useState(false);

  // 🔑 Fetch role from access token or DB
  useEffect(() => {
    const fetchRoleAndOnboarding = async () => {
      if (!isAuthenticated) return;

      try {
        const token = await getAccessTokenSilently({
          audience: import.meta.env.VITE_AUTH0_AUDIENCE,
        });
        const decoded = jwtDecode(token);
        const roles = decoded[namespace];
        if (roles && roles.length > 0) {
          setUserRole(roles[0]);
        }
      } catch (err) {
        console.error("Error decoding role from token", err);
      }

      try {
        const res = await fetch(`/api/users/${user.sub}`);
        const data = await res.json();
        if (!data || !data.profileCompleted) {
          setNeedsOnboarding(true);
        } else {
          setNeedsOnboarding(false);
        }
      } catch (err) {
        console.log("Error checking onboarding", err);
        setNeedsOnboarding(true);
      }
    };

    fetchRoleAndOnboarding();
  }, [isAuthenticated, getAccessTokenSilently, user]);

  return (
    <UserContext.Provider
      value={{
        user,
        isAuthenticated,
        userRole,
        selectedRole,
        setSelectedRole,
        needsOnboarding
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
