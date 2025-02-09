import { Navigate } from 'react-router-dom';
import { useAuth } from '../../component/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  
  // ถ้าไม่มี user ให้ไปหน้า login
  if (!user) {
    return <Navigate to="/login" />;
  }

  // ถ้ามี user แต่ไม่มี role หรือไม่ใช่ admin ให้ไปหน้าแรก
  const userRole = user.role?.toLowerCase();
  if (!userRole || (userRole !== 'admin' && userRole !== 'superadmin')) {
    return <Navigate to="/" />;
  }

  return children;
};

export default ProtectedRoute;