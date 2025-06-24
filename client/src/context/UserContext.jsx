import { createContext, useContext, useState, useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';

const UserContext = createContext();
const namespace = "https://thebahamassports.com/roles";

export const UserProvider = ({ children }) => {
  const { isAuthenticated, getAccessTokenSilently, user, isLoading } = useAuth0();
  const [dbUser, setDbUser] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [selectedRole, setSelectedRole] = useState(() => sessionStorage.getItem("pendingRole"));
  const [needsOnboarding, setNeedsOnboarding] = useState(false);
  const [userLoading, setUserLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!isAuthenticated || !user) return;

      try {
        const res = await fetch(`/api/users/${user.sub}`);
        console.log('res: ', res);
        if (!res.ok) throw new Error("User not found in DB");
        const data = await res.json();

        setDbUser(data);
        setUserRole(data.role);
        setNeedsOnboarding(!data.onboarding_complete);
      } catch (err) {
        console.error("UserContext DB fetch error:", err);
        setNeedsOnboarding(true);
      } finally {
        setUserLoading(false);
      }
    };

    fetchUserData();
  }, [isAuthenticated, user]);

  return (
    <UserContext.Provider
      value={{
        user,
        isAuthenticated,
        isLoading,
        dbUser,
        userRole,
        selectedRole,
        setSelectedRole,
        needsOnboarding,
        userLoading
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
