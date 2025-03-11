import React, { useState, useEffect } from 'react';
import Background from './Background';
import Sidebar from './Sidebar';
import MobileHeader from './MobileHeader';

import { Link, useLocation } from 'react-router-dom';
import { Menu } from 'lucide-react';

const SettingsPage = () => {
  const sidebarWidth = 256;
  const [activeTab, setActiveTab] = useState('account');
  const location = useLocation();
  const [isMobile, setIsMobile] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);
  
  // Check window size
  useEffect(() => {
    const savedProfile = localStorage.getItem('userProfile');
    if (savedProfile) {
      setProfileInfo(JSON.parse(savedProfile));
    }
    const checkSize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkSize();
    window.addEventListener('resize', checkSize);
    return () => window.removeEventListener('resize', checkSize);
  }, []);
  
  // Toggle sidebar for mobile view
  const toggleSidebar = () => {
    setShowSidebar(!showSidebar);
  };
  
  // Profile info (placeholders to be fetched from DB)
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
  
  // Password change state
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  // Notification settings state
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    goalReminders: true,
    achievementAlerts: true,
    weeklyReports: true
  });
  
  // Handle notification toggle
  const handleNotificationChange = (e) => {
    const { name, checked } = e.target;
    setNotifications(prev => ({
      ...prev,
      [name]: checked
    }));
  };

  // Handle tab switching
  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };
  
  // Handle password form input changes
  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordForm(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Handle password form submission
  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    // Here you would normally handle the password change logic
    console.log('Password change submitted:', passwordForm);
    // Reset form after submission
    setPasswordForm({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
    // Show success message (in a real app)
    alert('Password changed successfully!');
  };
  
  // Handle save changes
  const handleSaveChanges = () => {
    // In a real app, you would submit all changes to your backend
    alert('Changes saved successfully!');
  };
  
  return (
    <div className="min-h-screen font-ubuntu flex relative">
      {/* Import components */}
      <Sidebar show={showSidebar} handleClose={() => setShowSidebar(false)} />
      <Background sidebarWidth={sidebarWidth} />
      
      {/* Mobile Header - Only visible on mobile */}
      {isMobile && <MobileHeader toggleSidebar={toggleSidebar} />}
      
      {/* Main content area */}
      <div 
        className="overflow-auto relative z-10 px-3 px-md-4"
        style={{ 
          marginLeft: isMobile ? '0' : `${sidebarWidth}px`,
          width: isMobile ? '100%' : `calc(100% - ${sidebarWidth}px)`,
          marginTop: '64px', // Match the navbar height in Background.js
          paddingBottom: isMobile ? '80px' : '32px', // Extra padding for mobile save button
          transition: 'margin-left 0.3s ease-in-out'
        }}
      >
        <div className="mb-4 mt-4">
          <h1 className="text-3xl font-bold text-white">Settings</h1>
        </div>
        
        {/* Settings Card */}
        <div className="bg-white rounded-lg p-4 md:p-6 shadow-lg mb-6">
          {/* Tabs - Horizontal for desktop, vertical for mobile */}
          <div className={`${isMobile ? 'flex flex-col space-y-2' : 'border-b mb-6'}`}>
            <nav className={`${isMobile ? 'flex flex-col space-y-2' : 'flex space-x-8'}`} aria-label="Settings tabs">
              <button
                onClick={() => handleTabChange('account')}
                className={`
                  ${isMobile 
                    ? `p-3 rounded-lg text-left ${activeTab === 'account' ? 'bg-blue-100 text-blue-600 font-medium' : 'text-gray-700 hover:bg-gray-100'}`
                    : `pb-3 px-1 ${activeTab === 'account' ? 'border-b-2 border-blue-600 font-medium text-blue-600' : 'text-gray-500 hover:text-gray-700'}`
                  }
                `}
              >
                Account Info
              </button>
              <button
                onClick={() => handleTabChange('notifications')}
                className={`
                  ${isMobile 
                    ? `p-3 rounded-lg text-left ${activeTab === 'notifications' ? 'bg-blue-100 text-blue-600 font-medium' : 'text-gray-700 hover:bg-gray-100'}`
                    : `pb-3 px-1 ${activeTab === 'notifications' ? 'border-b-2 border-blue-600 font-medium text-blue-600' : 'text-gray-500 hover:text-gray-700'}`
                  }
                `}
              >
                Notifications
              </button>
              <button
                onClick={() => handleTabChange('help')}
                className={`
                  ${isMobile 
                    ? `p-3 rounded-lg text-left ${activeTab === 'help' ? 'bg-blue-100 text-blue-600 font-medium' : 'text-gray-700 hover:bg-gray-100'}`
                    : `pb-3 px-1 ${activeTab === 'help' ? 'border-b-2 border-blue-600 font-medium text-blue-600' : 'text-gray-500 hover:text-gray-700'}`
                  }
                `}
              >
                Help & Support
              </button>
            </nav>
          </div>
          
          <div className="space-y-4 md:space-y-8">
            {/* Account Info Section */}
            {activeTab === 'account' && (
              <section id="account-info">
                <h2 className="text-xl font-medium mb-2">Account Information</h2>
                <p className="text-gray-600 mb-4">
                  Manage your personal information and account settings.
                </p>
                
                {/* Profile Info Card - Same for both mobile and desktop */}
                <div className="bg-gray-50 p-4 md:p-6 rounded-lg mb-6">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 md:w-16 md:h-16 bg-gray-300 rounded-full flex-shrink-0 mr-4"></div>
                    <div>
                      <h3 className="text-base md:text-lg font-medium">Hi,</h3>
                      <p className="text-lg md:text-xl font-bold">{profileInfo.firstName} {profileInfo.lastName}</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-6">
                    <div>
                      <p className="text-sm text-gray-500">Email</p>
                      <p className="font-medium">{profileInfo.email}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Phone</p>
                      <p className="font-medium">{profileInfo.phone}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Gender</p>
                      <p className="font-medium">{profileInfo.gender }</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Age</p>
                      <p className="font-medium">{profileInfo.age}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Height</p>
                      <p className="font-medium">{profileInfo.height ? `${profileInfo.height} m` : ''}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Weight</p>
                      <p className="font-medium">{profileInfo.weight ? `${profileInfo.weight} lbs` : ''}</p>
                    </div>
                  </div>
                  
                  <Link 
                    to="/profile" 
                    state={{ from: location.pathname }}
                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors inline-block text-sm md:text-base"
                  >
                    Edit Profile
                  </Link>
                </div>
                
                <div className="space-y-4 md:space-y-6">
                  <div className="border-t pt-4 md:pt-6">
                    <h3 className="font-medium mb-3 md:mb-4">Account Management</h3>
                    
                    {/* Password Change Section */}
                    <div className="mb-6">
                      <h4 className="font-medium mb-3 md:mb-4">Change Password</h4>
                      
                      <form onSubmit={handlePasswordSubmit} className="bg-gray-50 p-4 rounded-md space-y-3 md:space-y-4">
                        <div>
                          <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 mb-1">
                            Current Password
                          </label>
                          <input
                            type="password"
                            id="currentPassword"
                            name="currentPassword"
                            value={passwordForm.currentPassword}
                            onChange={handlePasswordChange}
                            required
                            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-3 py-2 border"
                          />
                        </div>
                        
                        <div>
                          <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-1">
                            New Password
                          </label>
                          <input
                            type="password"
                            id="newPassword"
                            name="newPassword"
                            value={passwordForm.newPassword}
                            onChange={handlePasswordChange}
                            required
                            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-3 py-2 border"
                          />
                        </div>
                        
                        <div>
                          <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                            Confirm New Password
                          </label>
                          <input
                            type="password"
                            id="confirmPassword"
                            name="confirmPassword"
                            value={passwordForm.confirmPassword}
                            onChange={handlePasswordChange}
                            required
                            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-3 py-2 border"
                          />
                        </div>
                        
                        <div>
                          <button
                            type="submit"
                            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors text-sm md:text-base"
                          >
                            Change Password
                          </button>
                        </div>
                      </form>
                    </div>
                    
                    <div className="space-y-3 md:space-y-4">
                      
                      <button className="text-red-600 hover:text-red-800 font-medium block">
                        Delete Account
                      </button>
                      <button className="text-blue-600 hover:text-blue-800 font-medium block"
                       onClick={() => {
                        // You might want to clear any auth state here if applicable
                        // For example: localStorage.removeItem('userToken');
                        // Or dispatch a logout action if using Redux
                        
                        // Navigate to signin page with success parameter
                        window.location.href = '/signin?logoutSuccess=true';
                      }}
                      >
                        Logout
                      </button>
                    </div>
                  </div>
                </div>
              </section>
            )}
            
            {/* Notifications Section */}
            {activeTab === 'notifications' && (
              <section id="notifications">
                <h2 className="text-xl font-medium mb-2">Notifications</h2>
                <p className="text-gray-600 mb-4">
                  Customize how and when you receive updates about your fitness goals and progress.
                </p>
                
                <div className="space-y-4">
                  <div className="flex items-start">
                    <div className="flex items-center h-5">
                      <input
                        id="email-notifications"
                        name="email"
                        type="checkbox"
                        checked={notifications.email}
                        onChange={handleNotificationChange}
                        className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label htmlFor="email-notifications" className="font-medium text-gray-700">Email Notifications</label>
                      <p className="text-gray-500">Receive important updates about your goals via email.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="flex items-center h-5">
                      <input
                        id="push-notifications"
                        name="push"
                        type="checkbox"
                        checked={notifications.push}
                        onChange={handleNotificationChange}
                        className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label htmlFor="push-notifications" className="font-medium text-gray-700">Push Notifications</label>
                      <p className="text-gray-500">Get instant notifications on your device about your goals.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="flex items-center h-5">
                      <input
                        id="goal-reminders"
                        name="goalReminders"
                        type="checkbox"
                        checked={notifications.goalReminders}
                        onChange={handleNotificationChange}
                        className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label htmlFor="goal-reminders" className="font-medium text-gray-700">Goal Reminders</label>
                      <p className="text-gray-500">Be reminded about upcoming deadlines and goal check-ins.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="flex items-center h-5">
                      <input
                        id="achievement-alerts"
                        name="achievementAlerts"
                        type="checkbox"
                        checked={notifications.achievementAlerts}
                        onChange={handleNotificationChange}
                        className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label htmlFor="achievement-alerts" className="font-medium text-gray-700">Achievement Alerts</label>
                      <p className="text-gray-500">Be notified when you reach goal milestones.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="flex items-center h-5">
                      <input
                        id="weekly-reports"
                        name="weeklyReports"
                        type="checkbox"
                        checked={notifications.weeklyReports}
                        onChange={handleNotificationChange}
                        className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label htmlFor="weekly-reports" className="font-medium text-gray-700">Weekly Progress Reports</label>
                      <p className="text-gray-500">Receive a summary of your progress toward your goals each week.</p>
                    </div>
                  </div>
                </div>
                
                {!isMobile && (
                  <div className="mt-6">
                    <button 
                      onClick={handleSaveChanges}
                      className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                    >
                      Save Notification Preferences
                    </button>
                  </div>
                )}
              </section>
            )}
            
            {/* Help & Support Section */}
            {activeTab === 'help' && (
              <section id="help-support">
                <h2 className="text-xl font-medium mb-2">Help & Support</h2>
                <p className="text-gray-600 mb-4">
                  Get assistance with using TrackFit and find answers to common questions.
                </p>
                
                <div className="space-y-4 md:space-y-8">
                  {/* FAQ Link */}
                  <div className="bg-gray-50 p-4 md:p-6 rounded-lg">
                    <h3 className="font-medium mb-2">Frequently Asked Questions</h3>
                    <p className="text-gray-600 mb-3 md:mb-4">Find answers to commonly asked questions about using our platform.</p>
                    <Link to="/faqs" className="text-blue-600 hover:text-blue-800 font-medium">
                      View FAQ Page →
                    </Link>
                  </div>
                  
                  {/* Contact Support Link */}
                  <div className="bg-gray-50 p-4 md:p-6 rounded-lg">
                    <h3 className="font-medium mb-2">Contact Support</h3>
                    <p className="text-gray-600 mb-3 md:mb-4">Need additional help? Our support team is ready to assist you.</p>
                    <Link to="/contact" className="text-blue-600 hover:text-blue-800 font-medium">
                      Go to Contact Page →
                    </Link>
                  </div>
                  
                  {/* Additional Support Options */}
                  <div>
                    <h3 className="font-medium mb-3 md:mb-4">Additional Resources</h3>
                    <div className="space-y-2">
                      <Link to="/tutorials" className="block text-blue-600 hover:text-blue-800">
                        Video Tutorials
                      </Link>
                      <Link to="/guides" className="block text-blue-600 hover:text-blue-800">
                        User Guides
                      </Link>
                      <Link to="/community" className="block text-blue-600 hover:text-blue-800">
                        Community Forum
                      </Link>
                    </div>
                  </div>
                </div>
              </section>
            )}
          </div>
        </div>
        
        {/* Mobile Save Button - Fixed at bottom */}
        {isMobile && (
          <div className="fixed bottom-0 left-0 right-0 bg-white p-3 shadow-lg border-t z-20">
            <button
              onClick={handleSaveChanges}
              className="w-full bg-[#F8A13E] text-white font-medium py-3 px-4 rounded-xl"
            >
              Save Changes
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SettingsPage;