import { Navigate, Outlet } from 'react-router-dom';
import useAuth from '@/hooks/useAuth';
import ProgressWindow from '@/components/common/progress-window';
import PropTypes from 'prop-types';



const ProtectedRoute = ({ allowedRoles, children }) => {
  const { user, loading } = useAuth();

  
  if (loading) {
    return <ProgressWindow progressbar={<progress className="progress w-56"></progress>}/>
  }

 
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  
  if (allowedRoles && allowedRoles.length > 0) {
    const hasAllowedRole = allowedRoles.includes(user.role);
    
    if (!hasAllowedRole) {
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
  
  

  return children ? <>{children}</> : <Outlet />;
};

ProtectedRoute.propTypes = {
  allowedRoles: PropTypes.arrayOf(PropTypes.string),
  children: PropTypes.node,
};



export default ProtectedRoute;
