import React, { useState, useEffect } from 'react';
import Background from './Background';
import Sidebar from './Sidebar';
import MobileHeader from './MobileHeader';
import { useNavigate, useLocation } from 'react-router-dom';
import API_BASE_URL from '../lib/api';

const ProfilePage = () => {
  const sidebarWidth = 256;
  const navigate = useNavigate();
  const location = useLocation();
  const [previousPage, setPreviousPage] = useState('/');
  const [showDetails, setShowDetails] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleSidebar = () => {
    setShowSidebar(!showSidebar);
  };

  useEffect(() => {
    if (location.state && location.state.from) {
      setPreviousPage(location.state.from);
    }
  }, [location]);

  const [profileInfo, setProfileInfo] = useState({
    firstName: '',
    lastName: '',
    email: '',
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/update-profile`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          gender: profileInfo.gender,
          age: profileInfo.age,
          height: profileInfo.height,
          weight: profileInfo.weight
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Update failed');
      setShowDetails(true);
    } catch (error) {
      console.error('❌ Error updating profile:', error);
      alert('Failed to update profile. Please try again.');
    }
  };

  const handleBack = () => {
    navigate(previousPage);
  };

  const handleCancel = () => {
    if (showDetails) setShowDetails(false);
    else handleBack();
  };

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/auth/user`, {
          credentials: 'include',
        });
        if (!res.ok) throw new Error('Failed to fetch user data');
        const data = await res.json();
        const [firstName, ...lastNameArr] = (data.name || '').split(' ');
        const lastName = lastNameArr.join(' ');
        setProfileInfo(prev => ({
          ...prev,
          firstName: firstName || '',
          lastName: lastName || '',
          email: data.email || '',
          gender: data.gender || '',
          age: data.age || '',
          height: data.height || '',
          weight: data.weight || ''
        }));
      } catch (error) {
        console.error('Error loading user info:', error);
      }
    };
    fetchUserProfile();
  }, []);

  return (
    <div className="min-h-screen">
      {isMobile && <MobileHeader toggleSidebar={toggleSidebar} />}
      <Sidebar show={showSidebar} handleClose={() => setShowSidebar(false)} />
      <Background sidebarWidth={sidebarWidth} />

      <div
        className={`relative pb-12 ${isMobile ? 'px-4 pt-20' : 'px-8 pt-24'}`}
        style={{
          marginLeft: isMobile ? '0' : `${sidebarWidth}px`,
          width: isMobile ? '100%' : `calc(100% - ${sidebarWidth}px)`,
        }}
      >
        <h1 className="text-3xl font-bold text-white mb-6">My Profile</h1>

        <div className="bg-white rounded-lg p-4 md:p-6 shadow-lg max-w-4xl mx-auto">
          {showDetails ? (
            <div>
              <div className="flex items-center mb-6">
                <div className="relative w-12 h-12 md:w-16 md:h-16 rounded-full mr-4 flex-shrink-0 overflow-hidden bg-gray-300">
                {profileInfo.gender === "male" ? (
                  <img src="/avatars/male.png" alt="Male Avatar" className="w-full h-full object-cover" />
                )
                : profileInfo.gender === "female" ? (
                  <img src="/avatars/female.png" alt="Female Avatar" className="w-full h-full object-cover" />
                ) 
                : profileInfo.gender === "other" ? (
                  <img src="/avatars/other.png" alt="Other Avatar" className="w-full h-full object-cover" />
                ) 
                : (
                <div className="w-full h-full bg-gray-300 animate-pulse" />
                )}
                </div>
                <div>
                  <h2 className="text-base md:text-lg">Hi,</h2>
                  <h3 className="text-lg md:text-xl font-bold">{profileInfo.firstName} {profileInfo.lastName}</h3>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 md:gap-6 mb-6 md:mb-8">
                <p className="text-gray-500 mb-1 text-sm md:text-base">First Name</p>
                <p className="font-medium text-sm md:text-base">{profileInfo.firstName}</p>

                <p className="text-gray-500 mb-1 text-sm md:text-base">Last Name</p>
                <p className="font-medium text-sm md:text-base">{profileInfo.lastName}</p>

                <p className="text-gray-500 mb-1 text-sm md:text-base">Email</p>
                <p className="font-medium text-sm md:text-base break-words">{profileInfo.email}</p>

                <p className="text-gray-500 mb-1 text-sm md:text-base">Gender</p>
                <p className="font-medium text-sm md:text-base">{profileInfo.gender}</p>

                <p className="text-gray-500 mb-1 text-sm md:text-base">Age</p>
                <p className="font-medium text-sm md:text-base">{profileInfo.age}</p>

                <p className="text-gray-500 mb-1 text-sm md:text-base">Height</p>
                <p className="font-medium text-sm md:text-base">{profileInfo.height} cm</p>

                <p className="text-gray-500 mb-1 text-sm md:text-base">Weight</p>
                <p className="font-medium text-sm md:text-base">{profileInfo.weight} lbs</p>
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
            <form onSubmit={handleSubmit}>
              {/* Avatar preview (based on gender) */}
              <div className="flex items-center mb-6">
                <div className="relative w-12 h-12 md:w-16 md:h-16 rounded-full mr-4 flex-shrink-0 overflow-hidden bg-gray-300">
                {profileInfo.gender === "male" ? (
                  <img src="/avatars/male.png" alt="Male Avatar" className="w-full h-full object-cover" />
                )
                : profileInfo.gender === "female" ? (
                  <img src="/avatars/female.png" alt="Female Avatar" className="w-full h-full object-cover" />
                ) 
                : profileInfo.gender === "other" ? (
                  <img src="/avatars/other.png" alt="Other Avatar" className="w-full h-full object-cover" />
                ) 
                : (
                <div className="w-full h-full bg-gray-300 animate-pulse" />
                )}
                </div>
                <div>
                  <h2 className="text-base md:text-lg">Hi,</h2>
                  <h3 className="text-lg md:text-xl font-bold">{profileInfo.firstName} {profileInfo.lastName}</h3>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 md:gap-6 mb-6 md:mb-8">
                <input type="text" name="firstName" value={profileInfo.firstName} onChange={handleChange} placeholder="First Name" />
                <input type="text" name="lastName" value={profileInfo.lastName} onChange={handleChange} placeholder="Last Name" />
                <input type="email" name="email" value={profileInfo.email} onChange={handleChange} placeholder="Email" />
                <select name="gender" value={profileInfo.gender} onChange={handleChange}>
                  <option value="">Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
                <input type="number" name="age" value={profileInfo.age} onChange={handleChange} placeholder="Age" />
                <input type="text" name="height" value={profileInfo.height} onChange={handleChange} placeholder="Height" />
                <input type="text" name="weight" value={profileInfo.weight} onChange={handleChange} placeholder="Weight" />
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