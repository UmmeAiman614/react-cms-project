import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';

const Layout = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen bg-pale-yellow text-deep-green">
      {/* Navbar */}
      <Navbar />

      {/* Main Content */}
      <main className="flex-1 p-6 container mx-auto">
        {children}
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Layout;
