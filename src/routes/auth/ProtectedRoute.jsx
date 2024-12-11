import { Navigate, Outlet } from 'react-router-dom';
import useAuth from '@/hooks/useAuth';

const ProtectedRoute = ({ allowedRoles, children }) => {
  const { user, loading } = useAuth();

  // Show a loading state while authentication is being checked
  if (loading) {
    return <div>Loading...</div>;
  }

  // If no user is logged in, redirect to login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // If roles are specified, check if user's role is allowed
  if (allowedRoles && allowedRoles.length > 0) {
    const hasAllowedRole = allowedRoles.includes(user.role);
    
    if (!hasAllowedRole) {
      // Specific navigation based on user role
      if (user.role === 'user') {
        return <Navigate to="/lessons" replace />;
      }
      
      if (user.role === 'admin') {
        return <Navigate to="/dashboard" replace />;
      }
      
      // Fallback to login if role doesn't match specific conditions
      return <Navigate to="/login" replace />;
    }
  }



  if(children.type.name === 'Home' && user.role === 'user'){
    return <Navigate to="/lessons" replace />;
  }

  if(children.type.name === 'Home' && user.role === 'admin'){
    return <Navigate to="/dashboard" replace />;
  }
  
  

  // If all checks pass, render children or Outlet
  return children ? <>{children}</> : <Outlet />;
};

export default ProtectedRoute;