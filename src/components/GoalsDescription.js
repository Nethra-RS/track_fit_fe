import React, { useState, useEffect } from "react";
import "../App.css";
import { ChevronLeftIcon, Edit, Trash2, Info } from "lucide-react";
import { Button } from "./ui/button";
import { Progress } from "./ui/progress";
import Sidebar from "./Sidebar";
import Background from "./Background";
import MobileHeader from "./MobileHeader";
import { useNavigate, useLocation } from "react-router-dom";

const GoalDescription = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobile, setIsMobile] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);
  
  // Get goal data from the location state
  const [goalData, setGoalData] = useState({
    type: "Lose Weight",
    currentValue: "180 lbs",
    target: "160 lbs",
    startDate: "2024-02-01",
    endDate: "2024-06-01",
    outcome: "Get fitter"
  });

  // Calculate progress percentage (for demo purposes)
  const progressPercentage = 68;
  
  // Calculate deadline in days
  const startDate = new Date(goalData.startDate);
  const endDate = new Date(goalData.endDate);
  const deadlineDays = Math.round((endDate - startDate) / (1000 * 60 * 60 * 24));
  
  useEffect(() => {
    // Get goal data from location state if available
    if (location.state && location.state.goal) {
      setGoalData(location.state.goal);
    }
  }, [location]);
  
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    handleResize(); // Initial check
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleSidebar = () => {
    setShowSidebar(!showSidebar);
  };

  // Make sure this matches the width in Sidebar.js and Background.js
  const sidebarWidth = isMobile ? 0 : 256;

  return (
    <div className="min-h-screen font-ubuntu flex relative">
      {/* Background Component */}
      <Background sidebarWidth={sidebarWidth} />
      
      {/* Mobile Header - Only visible on mobile */}
      {isMobile && <MobileHeader toggleSidebar={toggleSidebar} />}
      
      {/* Sidebar Component - Pass the show state and toggle function */}
      <Sidebar show={showSidebar} handleClose={() => setShowSidebar(false)} />

      {/* Main Content - Scrollable Content Area */}
      <div 
        className={`flex-1 overflow-auto relative z-10 px-3 px-md-4 ${isMobile ? 'mobile-adjusted-content' : ''}`}
        style={{ 
          marginLeft: isMobile ? '0' : `${sidebarWidth}px`, 
          marginTop: '64px', // This should match the navbar height
          paddingBottom: '32px',
          transition: 'margin-left 0.3s ease-in-out',
          backgroundColor: '#0A1A33'
        }}
      >
        <header className="pt-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="text-white"
              onClick={() => navigate(-1)}
            >
              <ChevronLeftIcon className="h-6 w-6" />
            </Button>
            <h2 className="text-xl font-medium text-gray-300">
              My Goals / <span className="text-white">Goal Description</span>
            </h2>
          </div>
        </header>
        
        {/* Goal Content */}
        <div className="p-2 p-md-4">
          {/* Goal Summary Card - Using same table style as MyGoals.js */}
          <div className="bg-white rounded-lg overflow-hidden">
            <h3 className="font-bold px-4 pt-3">Goal Summary</h3>
            <div className="table-responsive">
              <table className="table table-hover mb-0">
                <thead style={{ backgroundColor: '#f8f9fa' }}>
                  <tr>
                    <th scope="col" className="py-3 ps-4">S.No.</th>
                    <th scope="col" className="py-3">Type of Goal</th>
                    <th scope="col" className="py-3">Current Value</th>
                    <th scope="col" className="py-3">Target Value</th>
                    <th scope="col" className="py-3">Deadline</th>
                    <th scope="col" className="py-3 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="py-3 ps-4">1</td>
                    <td className="py-3">
                      <span style={{ color: '#007bff' }}>{goalData.type}</span>
                    </td>
                    <td className="py-3">{goalData.currentValue}</td>
                    <td className="py-3">{goalData.target}</td>
                    <td className="py-3">{deadlineDays} days</td>
                    <td className="py-3">
                      <div className="d-flex justify-content-center gap-2">
                        <button 
                          className="btn btn-light btn-sm p-1 d-flex align-items-center justify-content-center"
                          style={{ width: '32px', height: '32px' }}
                        >
                          <Edit size={16} />
                        </button>
                        <button 
                          className="btn btn-light btn-sm p-1 d-flex align-items-center justify-content-center text-danger"
                          style={{ width: '32px', height: '32px' }}
                        >
                          <Trash2 size={16} />
                        </button>
                        <button 
                          className="btn btn-light btn-sm p-1 d-flex align-items-center justify-content-center"
                          style={{ width: '32px', height: '32px' }}
                        >
                          <Info size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            
            {/* Progress bar */}
            <div className="px-4 pb-4">
              <div className="mt-3 mb-2 d-flex justify-content-between">
                <span>Progress</span>
                <span className="font-bold">{progressPercentage}%</span>
              </div>
              <Progress
                value={progressPercentage}
                className="h-4 bg-gray-300"
                indicatorClassName="bg-[#F9A03F]"
              />
            </div>
          </div>

          {/* Goal Details Grid - Responsive layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            {/* Goal Marks */}
            <div>
              <h3 className="text-xl font-medium mb-2 text-white">Goal Marks</h3>
              <div className="rounded-lg overflow-hidden">
                <div className="bg-gradient-to-br from-[#F9A03F] via-[#3CAEA3] to-[#20639B] p-4 p-md-6 h-full">
                  <p className="text-white">
                    This Box will show the user goals that correspond to the
                    goal the user has made.
                  </p>
                </div>
              </div>
            </div>

            {/* Specific Goal AI Recommendation */}
            <div>
              <h3 className="text-xl font-medium mb-2 text-white">
                Specific Goal AI Recommendation
              </h3>
              <div className="rounded-lg overflow-hidden">
                <div className="bg-gradient-to-br from-[#F9A03F] via-[#3CAEA3] to-[#20639B] p-4 p-md-6 h-full">
                  <p className="text-white">
                    This Box will contain AI recommendations based on what they
                    have inputted (i.e. what they can do to start or help with
                    the goal)
                  </p>
                </div>
              </div>
            </div>

            {/* Goal Description */}
            <div>
              <h3 className="text-xl font-medium mb-2 text-white">Goal Description</h3>
              <div className="rounded-lg overflow-hidden">
                <div className="bg-gradient-to-br from-[#F9A03F] via-[#3CAEA3] to-[#20639B] p-4 p-md-6 h-full">
                  <p className="text-white">
                    This Box will contain the description of the specific goal
                    they have clicked on or created. To provide a bit more
                    information for the user.
                  </p>
                </div>
              </div>
            </div>

            {/* Log Progress */}
            <div>
              <h3 className="text-xl font-medium mb-2 text-white">Log Progress</h3>
              <div className="rounded-lg overflow-hidden">
                <div className="bg-gradient-to-br from-[#F9A03F] via-[#3CAEA3] to-[#20639B] p-4 p-md-6 h-full">
                  <p className="text-white">
                    This Box is a forum type of box that the user will use to
                    track their progress specifically for the goal they have
                    selected. (i.e. this will be the area where they log their
                    activities that correspond to that goal)
                  </p>
                </div>
              </div>
            </div>

            {/* Time Frame */}
            <div>
              <h3 className="text-xl font-medium mb-2 text-white">Time Frame</h3>
              <div className="rounded-lg overflow-hidden">
                <div className="bg-gradient-to-br from-[#F9A03F] via-[#3CAEA3] to-[#20639B] p-4 p-md-6 h-full">
                  <p className="text-white">
                    This box will contain the time frame the user has given the
                    goal for a better look and understanding
                  </p>
                </div>
              </div>
            </div>

            {/* Specific Goal Completion */}
            <div>
              <h3 className="text-xl font-medium mb-2 text-white">
                Specific Goal Completion
              </h3>
              <div className="rounded-lg overflow-hidden">
                <div className="bg-gradient-to-br from-[#F9A03F] via-[#3CAEA3] to-[#20639B] p-4 p-md-6 h-full">
                  <p className="text-white">
                    This Box will contain a progress circle that will update
                    automatically based on the logged progress given above
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GoalDescription;