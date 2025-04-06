import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Nav, Button, Offcanvas } from 'react-bootstrap';
import { X } from 'lucide-react';

const Sidebar = ({ show, handleClose }) => {
  // Use location to determine which route is active
  const location = useLocation();
  const currentPath = location.pathname;
  
  // State for responsive sidebar
  const [isMobile, setIsMobile] = useState(false);
  
  // Check window size
  useEffect(() => {
    const checkSize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkSize();
    window.addEventListener('resize', checkSize);
    return () => window.removeEventListener('resize', checkSize);
  }, []);
  
  const mainLinks = [
    { name: 'Home', path: '/Dashboard' },
    { name: 'My Goals', path: '/goals' },
    { name: 'Fitness Planner', path: '/planner' },
    //{ name: 'AI Tool', path: '/ai-tool' }
  ];
  
  const bottomLinks = [
    { name: 'Settings', path: '/settings' },
    { name: 'About', path: '/about' },
    { name: 'Team', path: '/team' }
  ];
  
  const sidebarContent = (
    <>
      <div className="p-4 mt-4 text-center">
        <span className="text-[32px] font-bold text-white">trackfit</span>
        <span className="text-[48px] font-bold text-white">.</span>
      </div>
      
      <Nav className="flex-column px-4 flex-grow">
        {mainLinks.map((item) => {
          const isActive = (currentPath === item.path) || 
            (item.path === '/Dashboard' && currentPath === '/Dashboard') ||
            (item.path === '/planner' && currentPath === '/planner');
            
          return (
            <Nav.Item key={item.name} className="mb-2">
              <Link 
                to={item.path} 
                className={`
                  d-block py-2 px-4 no-underline text-[18px] font-medium
                  ${isActive
                    ? 'bg-white !text-black rounded-full' 
                    : 'text-white hover:bg-white hover:!text-black hover:rounded-full'}
                  transition-colors duration-300
                `}
                style={isActive ? { color: 'black' } : {}}
                onClick={isMobile ? handleClose : undefined}
              >
                {item.name}
              </Link>
            </Nav.Item>
          );
        })}
      </Nav>
      
      <Nav className="flex-column px-4 mb-8">
        {bottomLinks.map((item) => {
          const isActive = currentPath === item.path;
          
          return (
            <Nav.Item key={item.name} className="mb-2">
              <Link 
                to={item.path} 
                className={`
                  d-block py-2 px-4 no-underline text-[18px] font-medium
                  ${isActive
                    ? 'bg-white !text-black rounded-full' 
                    : 'text-white hover:bg-white hover:!text-black hover:rounded-full'}
                  transition-colors duration-300
                `}
                style={isActive ? { color: 'black' } : {}}
                onClick={isMobile ? handleClose : undefined}
              >
                {item.name}
              </Link>
            </Nav.Item>
          );
        })}
      </Nav>
    </>
  );
  
  return (
    <>
      {isMobile ? (
        // Mobile view: Offcanvas sidebar
        <Offcanvas show={show} onHide={handleClose} placement="start" style={{ backgroundColor: '#F8A13E', width: '280px', zIndex: 1050 }}>
          <Offcanvas.Header className="border-0">
            <Button variant="link" className="text-white ms-auto p-0" onClick={handleClose}>
              <X size={24} />
            </Button>
          </Offcanvas.Header>
          <Offcanvas.Body className="p-0 d-flex flex-column h-100">
            {sidebarContent}
          </Offcanvas.Body>
        </Offcanvas>
      ) : (
        // Desktop view: Fixed sidebar - explicitly set width to 256px to match Background.js
        <div className="fixed left-0 top-0 h-screen flex flex-col z-50" style={{ backgroundColor: '#F8A13E', width: '256px' }}>
          {sidebarContent}
        </div>
      )}
    </>
  );
};

export default Sidebar;