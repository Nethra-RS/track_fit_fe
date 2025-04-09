import React from 'react';
import{ useState, useEffect } from 'react';
import { Bell, Menu } from 'lucide-react';
import { Navbar, Container, Dropdown } from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../useAuth';

const MobileHeader = ({ toggleSidebar }) => {
  const navigate = useNavigate();
  const [userName, setUserName] = useState("");
  useEffect(() => {
      const fetchSession = async () => {
        try {
          const res = await fetch("/api/auth/session", {
            credentials: "include",
          });
          const data = await res.json();
          console.log("🧠 Session Data:", data); // 👈 log what you get
    
          if (data?.user?.name) {
            setUserName(data.user.name);
          } else {
            console.log("⚠️ Name not found in session");
          }
        } catch (err) {
          console.error("❌ Failed to fetch session:", err);
        }
      };
    
      fetchSession();
  
    }, []);
  
  const { logout } = useAuth();
    const handleLogout = () => {
      console.log("🧪 Logout button clicked");
      logout();
    };

  return (
    <Navbar 
      className="d-md-none bg-[#F8A13E] position-fixed top-0 start-0 w-100 z-40 p-0 m-0"
      style={{ 
        height: '64px',
      }}
    >
      <Container fluid className="d-flex justify-content-between align-items-center px-3 h-100">
        {/* Menu Button */}
        <button
          onClick={toggleSidebar}
          className="bg-transparent border-0 p-2 text-white"
          aria-label="Toggle menu"
        >
          <Menu size={24} />
        </button>
        
        {/* Logo */}
        <div className="text-center">
          <span className="text-2xl font-bold text-white">trackfit</span>
          <span className="text-3xl font-bold text-white">.</span>
        </div>
        
        {/* Notification and User Dropdown */}
        <div className="d-flex align-items-center">
          <button className="bg-transparent border-0 p-2 text-white">
            <Bell size={20} />
          </button>
          
          <Dropdown align="end">
            <Dropdown.Toggle 
              variant="light" 
              id="user-dropdown-mobile"
              className="rounded-pill d-flex align-items-center border-0 py-1 px-2 ms-1"
              size="sm"
            >
              <span className="text-[#071836] text-sm">{userName || "Loading..."}</span>
            </Dropdown.Toggle>

            <Dropdown.Menu align="end" className="mt-2 rounded-lg shadow-lg">
              <Dropdown.Item as={Link} to="/profile">
                Profile
              </Dropdown.Item>
              <Dropdown.Item onClick={handleLogout}>Logout</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </div>
      </Container>
    </Navbar>
  );
};
export default MobileHeader;