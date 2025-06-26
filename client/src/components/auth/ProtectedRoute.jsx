import { useUser } from '../../context/AuthContext';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, requiredRole }) => {
  const { dbUser, isLoading } = useUser();

  if (isLoading) return null;

  if (!dbUser) return <Navigate to="/unauthorized" replace />;

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
