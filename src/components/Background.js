import React, { useState } from 'react';
import { Bell } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const Background = ({ sidebarWidth = 256 }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const location = useLocation();

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <>
      {/* Background with Colored Circles */}
      <div 
        className="fixed inset-y-0 bg-[#071836] overflow-hidden pointer-events-none z-[-1]"
        style={{ 
          left: `${sidebarWidth}px`,
          width: `calc(100% - ${sidebarWidth}px)`, // Adjust background width
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

      {/* Top Bar */}
      <div 
        className="fixed top-0 right-0 h-16 bg-[#071836]/50 backdrop-blur-sm z-50 flex items-center justify-end px-8"
        style={{ 
          left: `${sidebarWidth}px`,
          width: `calc(100% - ${sidebarWidth}px)`, // Ensure top bar doesn't overlap
        }}
      >
        <div className="flex items-center space-x-4">
          {/* Notification Icon */}
          <Bell className="text-white" size={24} />

          {/* User Dropdown */}
          <div className="relative">
            <div 
              onClick={toggleDropdown}
              className="bg-white rounded-full px-4 py-2 flex items-center cursor-pointer"
            >
              <span className="mr-2 text-[#071836]">First, Last Name</span>
              ▼
            </div>
            
            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg">
                <div className="py-1">
                  <Link 
                    to="/profile" 
                    state={{ from: location.pathname }}
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer block"
                    onClick={() => setIsDropdownOpen(false)}
                  >
                    Profile
                  </Link>
                  <div className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                    Logout
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Background;