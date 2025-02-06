import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  // ดึงข้อมูล user จาก localStorage
  const user = JSON.parse(localStorage.getItem('user'));

  // ถ้าไม่มี user (ไม่ได้ login) ให้ redirect ไปหน้า login
  if (!user) {
    return <Navigate to="/login" />;
  }

  // ตรวจสอบว่ามี role property และป้องกัน error
  if (!user.role) {
    return <Navigate to="/" />;
  }

  // ถ้ามี user แต่ไม่ใช่ admin หรือ superadmin ให้ redirect ไปหน้าแรก
  const userRole = user.role.toLowerCase();
  if (userRole !== 'admin' && userRole !== 'superadmin') {
    return <Navigate to="/" />;
  }

  // ถ้าผ่านเงื่อนไขทั้งหมด จึงแสดงหน้าที่ต้องการ
  return children;
};

export default ProtectedRoute;