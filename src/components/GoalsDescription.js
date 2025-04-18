import React, { useState, useEffect } from "react";
import "../App.css";
import { ChevronLeftIcon, Edit, Trash2, Info } from "lucide-react";
import { Button } from "./ui/button";
import { Progress } from "./ui/progress";
import Sidebar from "./Sidebar";
import Background from "./Background";
import MobileHeader from "./MobileHeader";
import { useNavigate, useParams } from "react-router-dom";
import { fetchUserGoals } from "../goalAPI";

const GoalDescription = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // goal_id from URL
  const [isMobile, setIsMobile] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);
  const [goalData, setGoalData] = useState(null);
  const [showModal, setShowModal] = useState(false);
 const handleBlockedAction = () => setShowModal(true);


  useEffect(() => {
    const loadGoal = async () => {
      const { goals } = await fetchUserGoals();
      const found = goals.find((g) => g.goal_id === id);
      setGoalData(found);
    };

    loadGoal();
  }, [id]);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleSidebar = () => setShowSidebar(!showSidebar);
  const sidebarWidth = isMobile ? 0 : 256;

  const calculateProgress = () => {
    if (!goalData || !goalData.metrics) return 0;
    const percentages = goalData.metrics.map(m => {
      const cur = parseFloat(m.current);
      const tar = parseFloat(m.target);
      if (isNaN(cur) || isNaN(tar)) return 0;
      return Math.min((cur / tar) * 100, 100);
    });
    const avg = percentages.reduce((a, b) => a + b, 0) / percentages.length;
    return Math.round(avg);
  };

  const calculateDeadline = () => {
    if (!goalData?.start_date || !goalData?.end_date) return "N/A";
    const start = new Date(goalData.start_date);
    const end = new Date(goalData.end_date);
    const diff = Math.round((end - start) / (1000 * 60 * 60 * 24));
    return isNaN(diff) ? "N/A" : `${diff} days`;
  };

  return (
    <div className="min-h-screen font-ubuntu flex relative">
      <Background sidebarWidth={sidebarWidth} />
      {isMobile && <MobileHeader toggleSidebar={toggleSidebar} />}
      <Sidebar show={showSidebar} handleClose={() => setShowSidebar(false)} />

      <div
        className={`flex-1 overflow-auto relative z-10 px-3 px-md-4 ${isMobile ? 'mobile-adjusted-content' : ''}`}
        style={{
          marginLeft: isMobile ? '0' : `${sidebarWidth}px`,
          marginTop: '64px',
          paddingBottom: '32px',
          transition: 'margin-left 0.3s ease-in-out',
          backgroundColor: '#0A1A33'
        }}
      >
        <header className="pt-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="text-white" onClick={() => navigate(-1)}>
              <ChevronLeftIcon className="h-6 w-6" />
            </Button>
            <h2 className="text-xl font-medium text-gray-300">
              My Goals / <span className="text-white">Goal Description</span>
            </h2>
          </div>
        </header>

        {goalData && (
          <div className="p-2 p-md-4">
            <div className="bg-white rounded-lg overflow-hidden">
              <h3 className="font-bold px-4 pt-3">Goal Summary</h3>
              <div className="table-responsive">
                <table className="table table-hover mb-0">
                  <thead style={{ backgroundColor: '#f8f9fa' }}>
                    <tr>
                      <th className="py-3 ps-4">S.No.</th>
                      <th className="py-3">Type of Goal</th>
                      <th className="py-3">Current Value</th>
                      <th className="py-3">Target Value</th>
                      <th className="py-3">Deadline</th>
                      <th className="py-3 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="py-3 ps-4">1</td>
                      <td className="py-3 text-primary">{goalData.goal_name}</td>
                      <td className="py-3">
                        {goalData.metrics?.map((m, idx) => (
                          <div key={idx}>{m.metric_name}: {m.current}</div>
                        ))}
                      </td>
                      <td className="py-3">
                        {goalData.metrics?.map((m, idx) => (
                          <div key={idx}>{m.metric_name}: {m.target}</div>
                        ))}
                      </td>
                      <td className="py-3">{calculateDeadline()}</td>
                      <td className="py-3">
                        <div className="d-flex justify-content-center gap-2">
                          <button className="btn btn-light btn-sm p-1" style={{ width: '32px', height: '32px' }} onClick={handleBlockedAction}>
                            <Edit size={16} />
                          </button>
                          <button className="btn btn-light btn-sm p-1 text-danger" style={{ width: '32px', height: '32px' }} onClick={handleBlockedAction}>
                            <Trash2 size={16} />
                          </button>
                          <button className="btn btn-light btn-sm p-1" style={{ width: '32px', height: '32px' }}>
                            <Info size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="px-4 pb-4">
                <div className="mt-3 mb-2 d-flex justify-content-between">
                  <span>Progress</span>
                  <span className="font-bold">{calculateProgress()}%</span>
                </div>
                <Progress value={calculateProgress()} className="h-4 bg-gray-300" indicatorClassName="bg-[#F9A03F]" />
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
          This Box will show the user goals that correspond to the goal the user has made.
        </p>
      </div>
    </div>
  </div>

  {/* Specific Goal AI Recommendation */}
  <div>
    <h3 className="text-xl font-medium mb-2 text-white">Specific Goal AI Recommendation</h3>
    <div className="rounded-lg overflow-hidden">
      <div className="bg-gradient-to-br from-[#F9A03F] via-[#3CAEA3] to-[#20639B] p-4 p-md-6 h-full">
        <p className="text-white">
          This Box will contain AI recommendations based on what they have inputted (i.e. what they can do to start or help with the goal)
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
          This Box will contain the description of the specific goal they have clicked on or created. To provide a bit more information for the user.
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
          This Box is a forum type of box that the user will use to track their progress specifically for the goal they have selected. (i.e. this will be the area where they log their activities that correspond to that goal)
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
          This box will contain the time frame the user has given the goal for a better look and understanding
        </p>
      </div>
    </div>
  </div>

  {/* Specific Goal Completion */}
  <div>
    <h3 className="text-xl font-medium mb-2 text-white">Specific Goal Completion</h3>
    <div className="rounded-lg overflow-hidden">
      <div className="bg-gradient-to-br from-[#F9A03F] via-[#3CAEA3] to-[#20639B] p-4 p-md-6 h-full">
        <p className="text-white">
          This Box will contain a progress circle that will update automatically based on the logged progress given above
        </p>
      </div>
    </div>
  </div>
</div>

            {/* Grid below remains unchanged */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              {/* All the 6 sections: Goal Marks, AI Rec, Description, Log Progress, Time Frame, Completion */}
              {/* ... Keep your boxes content here unchanged ... */}
            </div>
          </div>
        )}
      </div>
      {showModal && (
      <div
          className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center px-2"
         onClick={() => setShowModal(false)}
      >
      <div
       className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full text-center"
       onClick={(e) => e.stopPropagation()}
      >
       <h4 className="text-xl font-semibold mb-2 text-dark">Action Not Allowed</h4>
       <p className="text-gray-700 mb-4">
         You can’t edit or delete goals here. Please go to <strong>My Goals</strong> to manage your goals.
       </p>
      <div className="flex justify-center gap-3">
        <Button
          variant="outline"
          onClick={() => setShowModal(false)}
          className="rounded-pill"
        >
          Close
        </Button>
        <Button
          onClick={() => navigate("/goals")}
          className="bg-blue-600 text-white rounded-pill hover:bg-blue-700"
        >
          Go to My Goals
        </Button>
      </div>
    </div>
  </div>
)}
    </div>
  );
};

export default GoalDescription;

