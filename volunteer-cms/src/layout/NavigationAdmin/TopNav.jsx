import React from 'react';
import { User, Bell } from 'lucide-react';
import { jwtDecode } from 'jwt-decode';

function TopNav() {
 const [user, setUser] = React.useState(null);

 React.useEffect(() => {
   const token = localStorage.getItem('token');
   if (token) {
     const decoded = jwtDecode(token);
     setUser(decoded);
   }
 }, []);

 return (
   <div className="h-16 bg-white border-b border-gray-100 flex items-center justify-between px-6">
     <div className="flex items-center gap-2">
     </div>
     <div className="flex items-center gap-6">
       <div className="flex items-center gap-2">
         <User className="w-8 h-8 text-gray-400" />
         <span className="text-gray-600 font-medium">{user?.role || 'Guest'}</span>
       </div>
     </div>
   </div>
 );
}

export default TopNav;