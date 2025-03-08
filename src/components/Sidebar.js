import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Sidebar = () => {
  // Use location to determine which route is active
  const location = useLocation();
  const currentPath = location.pathname;

  return (
    <div className="fixed left-0 top-0 w-64 h-screen flex flex-col" style={{ backgroundColor: '#F8A13E' }}>
      <div className="p-4 mt-4 text-center">
        <span className="text-[32px] font-bold text-white">trackfit</span>
        <span className="text-[48px] font-bold text-white">.</span>
      </div>
      
      <nav className="px-4 flex-grow">
        <ul>
          {[
            { name: 'Home', path: '/' },
            { name: 'My Goals', path: '/goals' },
            { name: 'Fitness Planner', path: '/planner' },
            { name: 'AI Tool', path: '/ai-tool' }
          ].map((item) => (
            <li key={item.name}>
              <Link 
                to={item.path} 
                className={`
                  block py-2 px-4 text-white text-[18px]
                  ${(currentPath === item.path) || 
                    (item.path === '/' && currentPath === '/') ||
                    (item.path === '/planner' && currentPath === '/planner')
                    ? 'bg-white text-black rounded-full' 
                    : 'hover:bg-white hover:text-black hover:rounded-full'}
                  transition-colors duration-300
                `}
              >
                {item.name}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      
      <nav className="px-4 mb-8">
        <ul>
          {[
            { name: 'Settings', path: '/settings' },
            { name: 'About', path: '/about' },
            { name: 'Team', path: '/team' }
          ].map((item) => (
            <li key={item.name}>
              <Link 
                to={item.path} 
                className={`
                  block py-2 px-4 text-white text-[18px]
                  ${currentPath === item.path
                    ? 'bg-white text-black rounded-full' 
                    : 'hover:bg-white hover:text-black hover:rounded-full'}
                  transition-colors duration-300
                `}
              >
                {item.name}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;