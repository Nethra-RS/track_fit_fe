import React, { useState, useEffect } from 'react';
import { Bell } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Container, Navbar, Nav, Dropdown } from 'react-bootstrap';
import { useAuth } from '../useAuth';

const Background = ({ sidebarWidth = 256 }) => {
  const location = useLocation();
  const navigate = useNavigate();

  // Determine if sidebar is collapsed (for mobile view)
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const { logout } = useAuth(); 
  const handleLogout = () => {
    console.log("🧪 Logout button clicked");
    logout();
  };
  // Make sure this matches the actual sidebar width in Sidebar.js (which is 256px or 16rem)
  const effectiveSidebarWidth = isMobile ? 0 : sidebarWidth;

  return (
    <>
      {/* Background with Colored Circles */}
      <div 
        className="fixed inset-y-0 bg-[#071836] overflow-hidden pointer-events-none z-[-1]"
        style={{ 
          left: `${effectiveSidebarWidth}px`,
          width: `calc(100% - ${effectiveSidebarWidth}px)`,
          top: '0', // Set to 0 so it covers the entire height
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

      {/* Top Bar - Only visible on desktop */}
      {!isMobile && (
        <Navbar 
          className="bg-[#071836]/50 backdrop-blur-sm z-30 px-md-4 position-fixed d-none d-md-block"
          style={{ 
            top: 0,
            left: `${effectiveSidebarWidth}px`,
            width: `calc(100% - ${effectiveSidebarWidth}px)`,
            paddingLeft: '24px',
            paddingRight: '24px',
            height: '48px', // Further reduced to 48px
            marginTop: '0' // Ensure there's no margin at the top
          }}
        >
          <Container fluid className="d-flex justify-content-end p-0">
            <Nav className="align-items-center">
              {/* Notification Icon */}
              <Nav.Link className="text-white p-1"> {/* Reduced padding */}
                <Bell size={20} /> {/* Slightly smaller icon */}
              </Nav.Link>

              {/* User Dropdown using React Bootstrap */}
              <Dropdown>
                <Dropdown.Toggle 
                  variant="light" 
                  id="user-dropdown"
                  className="rounded-pill px-3 py-1 d-flex align-items-center border-0 ml-2" // Further reduced padding
                >
                  <span className="mr-2 text-[#071836] text-sm">First, Last Name</span> {/* Smaller text */}
                </Dropdown.Toggle>

                <Dropdown.Menu align="end" className="mt-1 rounded-lg shadow-lg">
                  <Dropdown.Item as={Link} to="/profile" state={{ from: location.pathname }}>
                    Profile
                  </Dropdown.Item>
                  <Dropdown.Item onClick={handleLogout}>Logout</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </Nav>
          </Container>
        </Navbar>
      )}
    </>
  );
};

export default Background;