import { useUser } from '../../context/AuthContext';
import { Navigate } from 'react-router-dom';
import PageLoader from '../PageLoader.jsx'; // you already use this

const ProtectedRoute = ({ children, requiredRole }) => {
  const { dbUser, isLoading } = useUser();

  if (isLoading) {
    return <PageLoader />; // 🌀 loading indicator instead of blank
  }

  // ✅ Ensure we’re comparing strings safely
  const userRole = dbUser.role?.toLowerCase();
  const required = requiredRole?.toLowerCase();

  if (required && userRole !== required) {
    console.warn(`Blocked: user role '${userRole}' !== required '${required}'`);
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

export default ProtectedRoute;
