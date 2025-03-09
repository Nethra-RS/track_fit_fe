import React, { useState, useEffect } from 'react';
import { Bell } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { Container, Navbar, Nav, Dropdown } from 'react-bootstrap';

const Background = ({ sidebarWidth = 256 }) => {
  const location = useLocation();

  // Determine if sidebar is collapsed (for mobile view)
  const [isCollapsed, setIsCollapsed] = useState(window.innerWidth < 768);
  
  useEffect(() => {
    const handleResize = () => {
      setIsCollapsed(window.innerWidth < 768);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Make sure this matches the actual sidebar width in Sidebar.js (which is 256px or 16rem)
  const effectiveSidebarWidth = isCollapsed ? 0 : sidebarWidth;

  return (
    <>
      {/* Background with Colored Circles */}
      <div 
        className="fixed inset-y-0 bg-[#071836] overflow-hidden pointer-events-none z-[-1]"
        style={{ 
          left: `${effectiveSidebarWidth}px`,
          width: `calc(100% - ${effectiveSidebarWidth}px)`,
        }}
      >
        {/* Orange Circle */}
        <div 
          className="absolute top-[-150px] right-[-150px] w-[700px] h-[700px] 
          rounded-full bg-[#F8A13E] opacity-30 blur-[100px]"
        ></div>

        {/* Blue Circle */}
        <div 
          className="absolute bottom-[-150px] left-[-150px] w-[600px] h-[600px] 
          rounded-full bg-[#01B1E3] opacity-30 blur-[100px]"
        ></div>
      </div>

      {/* Top Bar - Now using React Bootstrap Navbar but with position absolute instead of fixed */}
      <Navbar 
        className="bg-[#071836]/50 backdrop-blur-sm z-30 px-md-4 position-fixed"
        style={{ 
          top: 0,
          left: `${effectiveSidebarWidth}px`,
          width: `calc(100% - ${effectiveSidebarWidth}px)`,
          paddingLeft: isCollapsed ? '60px' : '24px',
          paddingRight: '24px',
          height: '64px' // Explicitly set height to match the margin-top in Dashboard.js
        }}
      >
        <Container fluid className="d-flex justify-content-end p-0">
          <Nav className="align-items-center">
            {/* Notification Icon */}
            <Nav.Link className="text-white p-2">
              <Bell size={24} />
            </Nav.Link>

            {/* User Dropdown using React Bootstrap */}
            <Dropdown>
              <Dropdown.Toggle 
                variant="light" 
                id="user-dropdown"
                className="rounded-pill px-4 py-2 d-flex align-items-center border-0 ml-2"
              >
                <span className="mr-2 text-[#071836]">First, Last Name</span>
              </Dropdown.Toggle>

              <Dropdown.Menu align="end" className="mt-2 rounded-lg shadow-lg">
                <Dropdown.Item as={Link} to="/profile" state={{ from: location.pathname }}>
                  Profile
                </Dropdown.Item>
                <Dropdown.Item>Logout</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </Nav>
        </Container>
      </Navbar>
    </>
  );
};

export default Background;