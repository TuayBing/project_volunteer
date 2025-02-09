import { Navigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';

const UserRoute = ({ children }) => {
  const { token } = useAuth();
  // แค่เช็ค token ถ้าไม่มีให้ไป login
  if (!token) {
    return <Navigate to="/login" />;
  }
  return children;
};

export default UserRoute;