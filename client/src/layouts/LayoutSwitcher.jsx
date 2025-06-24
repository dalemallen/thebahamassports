import { useAuth0 } from "@auth0/auth0-react";
import { useUser } from "../context/UserContext";
import MainLayout from "./MainLayout.jsx";
import OnboardingLayout from "./OnboardingLayout.jsx";
import DashboardLayout from "./DashboardLayout.jsx";

const LayoutSwitcher = ({ children }) => {
  const { isAuthenticated, user } = useAuth0();
  console.log('user: ', user);
  const { dbUser } = useUser();
  console.log('dbUser: ', dbUser);

  if (!isAuthenticated) {
    return <MainLayout>{children}</MainLayout>;
  }

  if (isAuthenticated && dbUser?.onboarding_complete === false) {
    return <OnboardingLayout>{children}</OnboardingLayout>;
  }

  if (isAuthenticated && dbUser?.onboarding_complete === true) {
    return <DashboardLayout>{children}</DashboardLayout>;
  }

  return <MainLayout>{children}</MainLayout>; // fallback
};

export default LayoutSwitcher;
