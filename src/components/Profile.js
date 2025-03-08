import React, { useState, useEffect } from 'react';
import Background from './Background';
import Sidebar from './Sidebar';
import { useNavigate, useLocation } from 'react-router-dom';

const ProfilePage = () => {
  const sidebarWidth = 256;
  const navigate = useNavigate();
  const location = useLocation();
  const [previousPage, setPreviousPage] = useState('/');
  const [showDetails, setShowDetails] = useState(false);
  
  // Get the previous page from location state or default to dashboard
  useEffect(() => {
    if (location.state && location.state.from) {
      setPreviousPage(location.state.from);
    }
  }, [location]);
  
  // Profile state
  const [profileInfo, setProfileInfo] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    gender: '',
    age: '',
    height: '',
    weight: ''
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
  
  return (
    <div className="min-h-screen">
      {/* Import components */}
      <Sidebar />
      <Background sidebarWidth={sidebarWidth} />
      
      {/* Main content area */}
      <div 
        className="relative pt-24 pb-12 px-8" 
        style={{ 
          marginLeft: `${sidebarWidth}px`,
          width: `calc(100% - ${sidebarWidth}px)`,
        }}
      >
        <h1 className="text-3xl font-bold text-white mb-6">My Profile</h1>
        
        {/* Profile Card */}
        <div className="bg-white rounded-lg p-6 shadow-lg max-w-4xl mx-auto">
          {showDetails ? (
            // Profile Details View
            <div>
              <div className="flex items-center mb-6">
                <div className="w-16 h-16 bg-gray-300 rounded-full mr-4 flex-shrink-0"></div>
                <div>
                  <h2 className="text-lg">Hi,</h2>
                  <h3 className="text-xl font-bold">{profileInfo.lastName} & {profileInfo.firstName}</h3>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div>
                  <p className="text-gray-500 mb-1">First Name</p>
                  <p className="font-medium">{profileInfo.firstName}</p>
                </div>
                <div>
                  <p className="text-gray-500 mb-1">Gender</p>
                  <p className="font-medium">{profileInfo.gender}</p>
                </div>
                <div>
                  <p className="text-gray-500 mb-1">Last Name</p>
                  <p className="font-medium">{profileInfo.lastName}</p>
                </div>
                <div>
                  <p className="text-gray-500 mb-1">Age</p>
                  <p className="font-medium">{profileInfo.age}</p>
                </div>
                <div>
                  <p className="text-gray-500 mb-1">Email</p>
                  <p className="font-medium">{profileInfo.email}</p>
                </div>
                <div>
                  <p className="text-gray-500 mb-1">Height</p>
                  <p className="font-medium">{profileInfo.height} m</p>
                </div>
                <div>
                  <p className="text-gray-500 mb-1">Phone Number</p>
                  <p className="font-medium">{profileInfo.phone}</p>
                </div>
                <div>
                  <p className="text-gray-500 mb-1">Weight</p>
                  <p className="font-medium">{profileInfo.weight} lbs</p>
                </div>
              </div>
              
              <div className="flex justify-end">
                <button
                  onClick={handleBack}
                  className="px-6 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors"
                >
                  Back
                </button>
              </div>
            </div>
          ) : (
            // Profile Edit Form
            <form onSubmit={handleSubmit}>
              <div className="flex items-center mb-6">
                <div className="w-16 h-16 bg-gray-300 rounded-full mr-4 flex-shrink-0"></div>
                <div>
                  <h2 className="text-lg">Hi,</h2>
                  <h3 className="text-xl font-bold">Last & First Name</h3>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div>
                  <label htmlFor="firstName" className="sr-only">First Name</label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    placeholder="First Name"
                    value={profileInfo.firstName}
                    onChange={handleChange}
                    className="w-full border-b border-gray-300 pb-2 focus:border-blue-500 focus:outline-none"
                  />
                </div>
                
                <div>
                  <label htmlFor="gender" className="sr-only">Gender</label>
                  <select
                    id="gender"
                    name="gender"
                    value={profileInfo.gender}
                    onChange={handleChange}
                    className="w-full border-b border-gray-300 pb-2 focus:border-blue-500 focus:outline-none appearance-none"
                  >
                    <option value="">Gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                    <option value="prefer-not-to-say">Prefer not to say</option>
                  </select>
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
                    className="w-full border-b border-gray-300 pb-2 focus:border-blue-500 focus:outline-none"
                  />
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
                    className="w-full border-b border-gray-300 pb-2 focus:border-blue-500 focus:outline-none"
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
                    className="w-full border-b border-gray-300 pb-2 focus:border-blue-500 focus:outline-none"
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
                    className="w-full border-b border-gray-300 pb-2 focus:border-blue-500 focus:outline-none pr-8"
                  />
                  <span className="absolute right-0 bottom-2 text-gray-500">m</span>
                </div>
                
                <div>
                  <label htmlFor="phone" className="sr-only">Phone Number</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    placeholder="Phone Number"
                    value={profileInfo.phone}
                    onChange={handleChange}
                    className="w-full border-b border-gray-300 pb-2 focus:border-blue-500 focus:outline-none"
                  />
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
                    className="w-full border-b border-gray-300 pb-2 focus:border-blue-500 focus:outline-none pr-8"
                  />
                  <span className="absolute right-0 bottom-2 text-gray-500">lbs</span>
                </div>
              </div>
              
              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="px-6 py-2 border border-orange-500 text-orange-500 rounded-full hover:bg-orange-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-orange-500 text-white rounded-full hover:bg-orange-600 transition-colors"
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