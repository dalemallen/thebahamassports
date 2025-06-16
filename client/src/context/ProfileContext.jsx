import {jwtDecode} from "jwt-decode";
import { useAuth0 } from "@auth0/auth0-react";
import { useState, useEffect, createContext, useContext } from "react";

const ProfileContext = createContext();

export const ProfileProvider = ({ children }) => {
  const { isAuthenticated, getAccessTokenSilently, user } = useAuth0();
  console.log('user: ', user);
  const [userRole, setUserRole] = useState(null);
  console.log('userRole: ', userRole);
const [needsOnboarding, setNeedsOnboarding] = useState(false);
  const namespace = "https://thebahamassports.com/roles";



useEffect(() => {
  const checkOnboarding = async () => {
    if (!isAuthenticated || !userRole) return;

    try {
      const res = await fetch(`/api/users/${user.sub}`); // or your endpoint
      const data = await res.json();
      console.log('data: ', data);

      if (!data || !data.profileCompleted) {
        setNeedsOnboarding(true);
      } else {
        setNeedsOnboarding(false);
      }
    } catch (err) {
      console.error("Error checking onboarding status", err);
      setNeedsOnboarding(true); // fallback to force onboarding
    }
  };

  checkOnboarding();

    const fetchRole = async () => {
      if (!isAuthenticated) return;
      try {
        const token = await getAccessTokenSilently({
          audience: import.meta.env.VITE_AUTH0_AUDIENCE,
        });
        const decoded = jwtDecode(token);
        const roles = decoded[namespace];
        if (roles && roles.length > 0) {
          setUserRole(roles[0]); // or store full array
        }
      } catch (error) {
        console.error("Error fetching role:", error);
      }
    };
    fetchRole();
  }, [isAuthenticated, getAccessTokenSilently]);

  return (
    <ProfileContext.Provider value={{ user, userRole, isAuthenticated, needsOnboarding  }}>
      {children}
    </ProfileContext.Provider>
  );
};

export const useProfile = () => useContext(ProfileContext);
