import React, { useState, useEffect, useRef } from 'react';
import Background from './Background';
import Sidebar from './Sidebar';
import MobileHeader from './MobileHeader';
import { useNavigate, useLocation } from 'react-router-dom';

const ProfilePage = () => {
  const sidebarWidth = 256;
  const navigate = useNavigate();
  const location = useLocation();
  const [previousPage, setPreviousPage] = useState('/');
  const [showDetails, setShowDetails] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const fileInputRef = useRef(null);
  
  // Handle mobile detection
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  // Handle sidebar toggle for mobile
  const toggleSidebar = () => {
    setShowSidebar(!showSidebar);
  };
  
  // Get the previous page from location state or default to dashboard
  useEffect(() => {
    if (location.state && location.state.from) {
      setPreviousPage(location.state.from);
    }
  }, [location]);
  
  // Profile state - removed phone number
  const [profileInfo, setProfileInfo] = useState({
    firstName: '',
    lastName: '',
    email: '',
    gender: '',
    age: '',
    height: '',
    weight: '',
    photoUrl: null
  });
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfileInfo(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    localStorage.setItem('userProfile', JSON.stringify(profileInfo));
    // Here you would handle the form submission to update the profile in the database
    console.log('Profile update submitted:', profileInfo);
    // Show the details view after saving
    setShowDetails(true);
  };
  
  const handleBack = () => {
    navigate(previousPage);
  };
  
  const handleCancel = () => {
    // If we're showing details, go back to edit mode
    if (showDetails) {
      setShowDetails(false);
    } else {
      // Otherwise, navigate back to previous page
      handleBack();
    }
  };
  
  // Photo upload functionality
  const handlePhotoClick = () => {
    if (!showDetails) {
      fileInputRef.current.click();
    }
  };
  
  const handlePhotoChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      
      reader.onload = (event) => {
        setProfileInfo(prev => ({
          ...prev,
          photoUrl: event.target.result
        }));
      };
      
      reader.readAsDataURL(file);
    }
  };
  
  return (
    <div className="min-h-screen">
      {/* Mobile Header - only shown on mobile */}
      {isMobile && <MobileHeader toggleSidebar={toggleSidebar} />}
      
      {/* Import components */}
      <Sidebar show={showSidebar} handleClose={() => setShowSidebar(false)} />
      <Background sidebarWidth={sidebarWidth} />
      
      {/* Main content area */}
      <div 
        className={`relative pb-12 ${isMobile ? 'px-4 pt-20' : 'px-8 pt-24'}`}
        style={{ 
          marginLeft: isMobile ? '0' : `${sidebarWidth}px`,
          width: isMobile ? '100%' : `calc(100% - ${sidebarWidth}px)`,
        }}
      >
        <h1 className="text-3xl font-bold text-white mb-6">My Profile</h1>
        
        {/* Profile Card */}
        <div className="bg-white rounded-lg p-4 md:p-6 shadow-lg max-w-4xl mx-auto">
          {showDetails ? (
            // Profile Details View
            <div>
              <div className="flex items-center mb-6">
                <div className="relative w-12 h-12 md:w-16 md:h-16 rounded-full mr-4 flex-shrink-0 overflow-hidden bg-gray-300">
                  {profileInfo.photoUrl ? (
                    <img src={profileInfo.photoUrl} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-500">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                  )}
                </div>
                <div>
                  <h2 className="text-base md:text-lg">Hi,</h2>
                  <h3 className="text-lg md:text-xl font-bold">{profileInfo.lastName} & {profileInfo.firstName}</h3>
                </div>
              </div>
              
              {/* Vertical layout for all screens */}
              <div className="grid grid-cols-1 gap-4 md:gap-6 mb-6 md:mb-8">
                <div>
                  <p className="text-gray-500 mb-1 text-sm md:text-base">First Name</p>
                  <p className="font-medium text-sm md:text-base">{profileInfo.firstName}</p>
                </div>
                <div>
                  <p className="text-gray-500 mb-1 text-sm md:text-base">Last Name</p>
                  <p className="font-medium text-sm md:text-base">{profileInfo.lastName}</p>
                </div>
                <div>
                  <p className="text-gray-500 mb-1 text-sm md:text-base">Email</p>
                  <p className="font-medium text-sm md:text-base break-words">{profileInfo.email}</p>
                </div>
                <div>
                  <p className="text-gray-500 mb-1 text-sm md:text-base">Gender</p>
                  <p className="font-medium text-sm md:text-base">{profileInfo.gender}</p>
                </div>
                <div>
                  <p className="text-gray-500 mb-1 text-sm md:text-base">Age</p>
                  <p className="font-medium text-sm md:text-base">{profileInfo.age}</p>
                </div>
                <div>
                  <p className="text-gray-500 mb-1 text-sm md:text-base">Height</p>
                  <p className="font-medium text-sm md:text-base">{profileInfo.height} m</p>
                </div>
                <div>
                  <p className="text-gray-500 mb-1 text-sm md:text-base">Weight</p>
                  <p className="font-medium text-sm md:text-base">{profileInfo.weight} lbs</p>
                </div>
              </div>
              
              <div className="flex justify-end">
                <button
                  onClick={handleBack}
                  className="px-4 py-2 md:px-6 md:py-2 text-sm md:text-base bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors"
                >
                  Back
                </button>
              </div>
            </div>
          ) : (
            // Profile Edit Form
            <form onSubmit={handleSubmit}>
              <div className="flex items-center mb-6">
                <div 
                  className="relative w-12 h-12 md:w-16 md:h-16 rounded-full mr-4 flex-shrink-0 overflow-hidden bg-gray-300 cursor-pointer group"
                  onClick={handlePhotoClick}
                >
                  {profileInfo.photoUrl ? (
                    <>
                      <img src={profileInfo.photoUrl} alt="Profile" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="w-full h-full flex items-center justify-center text-gray-500">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      </div>
                      <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                      </div>
                    </>
                  )}
                  
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    className="hidden" 
                    accept="image/*" 
                    onChange={handlePhotoChange} 
                  />
                </div>
                <div>
                  <h2 className="text-base md:text-lg">Hi,</h2>
                  <h3 className="text-lg md:text-xl font-bold">Last & First Name</h3>
                </div>
              </div>
              
              {/* Vertical layout for all screens */}
              <div className="grid grid-cols-1 gap-4 md:gap-6 mb-6 md:mb-8">
                <div>
                  <label htmlFor="firstName" className="sr-only">First Name</label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    placeholder="First Name"
                    value={profileInfo.firstName}
                    onChange={handleChange}
                    className="w-full border-b border-gray-300 pb-2 focus:border-blue-500 focus:outline-none text-sm md:text-base"
                  />
                </div>
                
                <div>
                  <label htmlFor="lastName" className="sr-only">Last Name</label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    placeholder="Last Name"
                    value={profileInfo.lastName}
                    onChange={handleChange}
                    className="w-full border-b border-gray-300 pb-2 focus:border-blue-500 focus:outline-none text-sm md:text-base"
                  />
                </div>
                
                <div>
                  <label htmlFor="email" className="sr-only">Email</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    placeholder="Email"
                    value={profileInfo.email}
                    onChange={handleChange}
                    className="w-full border-b border-gray-300 pb-2 focus:border-blue-500 focus:outline-none text-sm md:text-base"
                  />
                </div>
                
                <div>
                  <label htmlFor="gender" className="sr-only">Gender</label>
                  <select
                    id="gender"
                    name="gender"
                    value={profileInfo.gender}
                    onChange={handleChange}
                    className="w-full border-b border-gray-300 pb-2 focus:border-blue-500 focus:outline-none appearance-none text-sm md:text-base"
                  >
                    <option value="">Gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                    <option value="prefer-not-to-say">Prefer not to say</option>
                  </select>
                </div>
                
                <div>
                  <label htmlFor="age" className="sr-only">Age</label>
                  <input
                    type="number"
                    id="age"
                    name="age"
                    placeholder="Age"
                    value={profileInfo.age}
                    onChange={handleChange}
                    className="w-full border-b border-gray-300 pb-2 focus:border-blue-500 focus:outline-none text-sm md:text-base"
                  />
                </div>
                
                <div className="relative">
                  <label htmlFor="height" className="sr-only">Height</label>
                  <input
                    type="text"
                    id="height"
                    name="height"
                    placeholder="Height"
                    value={profileInfo.height}
                    onChange={handleChange}
                    className="w-full border-b border-gray-300 pb-2 focus:border-blue-500 focus:outline-none pr-8 text-sm md:text-base"
                  />
                  <span className="absolute right-0 bottom-2 text-gray-500 text-sm md:text-base">m</span>
                </div>
                
                <div className="relative">
                  <label htmlFor="weight" className="sr-only">Weight</label>
                  <input
                    type="text"
                    id="weight"
                    name="weight"
                    placeholder="Weight"
                    value={profileInfo.weight}
                    onChange={handleChange}
                    className="w-full border-b border-gray-300 pb-2 focus:border-blue-500 focus:outline-none pr-8 text-sm md:text-base"
                  />
                  <span className="absolute right-0 bottom-2 text-gray-500 text-sm md:text-base">lbs</span>
                </div>
              </div>
              
              <div className="flex justify-end space-x-3 md:space-x-4">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="px-4 py-2 md:px-6 md:py-2 text-sm md:text-base border border-orange-500 text-orange-500 rounded-full hover:bg-orange-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 md:px-6 md:py-2 text-sm md:text-base bg-orange-500 text-white rounded-full hover:bg-orange-600 transition-colors"
                >
                  Save Changes
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;