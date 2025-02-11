import { Navigate } from 'react-router-dom';
import { useAuth } from '../../component/AuthContext';

const ProtectedRoute = ({ children }) => {
    const { user } = useAuth();
    
    // เช็คแค่ว่ามี user หรือไม่
    if (!user) {
        return <Navigate to="/login" />;
    }
    
    // ถ้ามี user แล้วให้เข้าถึงได้เลย
    return children;
};

export default ProtectedRoute;