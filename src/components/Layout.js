import React from 'react';
import Sidebar from './Sidebar';

const Layout = ({ children }) => {
  return (
    <div className="flex min-h-screen bg-trackfit-background font-ubuntu">
      <div className="background fixed top-0 left-0 w-full h-full z-[-1]"></div>
      <Sidebar />
      <main className="flex-grow p-6 ml-64">
        {children}
      </main>
    </div>
  );
};

export default Layout;