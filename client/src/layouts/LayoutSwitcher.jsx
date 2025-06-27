import { useAuth0 } from "@auth0/auth0-react";
import { useUser } from "../context/AuthContext";
import MainLayout from "./MainLayout.jsx";
import OnboardingLayout from "./OnboardingLayout.jsx";
import DashboardLayout from "./DashboardLayout.jsx";

const LayoutSwitcher = ({ children }) => {

const { user, role, isAuthenticated, isLoading } = useUser();
console.log('role: ', role);

  console.log('user: ', user);

  if (!isAuthenticated) {
    return <MainLayout>{children}</MainLayout>;
  }

  if (isAuthenticated && user?.onboarding_complete === false) {
    return <OnboardingLayout>{children}</OnboardingLayout>;
  }

  if (isAuthenticated && user?.onboarding_complete === true) {
    return <DashboardLayout>{children}</DashboardLayout>;
  }

  return <MainLayout>{children}</MainLayout>; // fallback
};

export default LayoutSwitcher;
