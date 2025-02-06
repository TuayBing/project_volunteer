import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';

function HeaderFooterLayout({ children }) {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Navigation */}
      <Navbar />

      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}

export default HeaderFooterLayout;