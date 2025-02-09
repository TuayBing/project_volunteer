import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import { useAuth } from '../../component/AuthContext';

function HeaderFooterLayout({ children }) {
 const { token } = useAuth();
 
 return (
   <div className="min-h-screen flex flex-col">
     <Navbar isAuthenticated={!!token} />
     <main className="flex-1">
       {children}
     </main>
     <Footer />
   </div>
 );
}

export default HeaderFooterLayout;