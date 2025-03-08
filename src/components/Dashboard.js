import React, { useState } from 'react';
import Background from './Background';
import Sidebar from './Sidebar';
import { Plus } from 'lucide-react';

const Dashboard = () => {
  const [goals, setGoals] = useState(['Goal 1', 'Goal 2', 'Goal 3']);

  const addGoal = () => {
    const newGoal = `Goal ${goals.length + 1}`;
    setGoals([...goals, newGoal]);
  };

  return (
    <div className="min-h-screen font-ubuntu flex relative">
      {/* Background Component */}
      <Background />
      <Sidebar />

      {/* Scrollable Content Area */}
      <div 
        className="flex-grow overflow-auto relative z-10" 
        style={{ 
          marginLeft: '240px', 
          marginTop: '64px',
          padding: '0 32px 32px 32px'
        }}
      >
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white font-ubuntu">My Dashboard</h1>
        </div>
        
        {/* Section Headings */}
        <div className="grid grid-cols-3 gap-6">
          <h2 className="text-xl text-white mb-4 font-ubuntu col-span-1">Goals</h2>
          <h2 className="text-xl text-white mb-4 font-ubuntu col-span-2">Quick Stats</h2>
        </div>

        <div className="grid grid-cols-3 gap-6">
          {/* Goals Section */}
          <div className="col-span-1">
            <div className="bg-gradient-to-b from-[#F8A13E] via-[#6ECAE3] to-[#01B1E3] 
              rounded-3xl overflow-hidden">
              <div className="p-6">
                <div className="space-y-4">
                  {goals.map((goal, index) => (
                    <div
                      key={index}
                      className="bg-gray-500/50 text-white p-4 rounded-xl font-ubuntu"
                    >
                      {goal}
                    </div>
                  ))}
                </div>
                <div className="mt-4 flex justify-center">
                  <button
                    onClick={addGoal}
                    className="w-12 h-12 bg-[#01B1E3] text-white rounded-full flex items-center justify-center hover:bg-[#01B1E3]/80 transition-colors"
                  >
                    <Plus size={24} />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="col-span-2 grid grid-cols-3 gap-4">
            {[ 
              { title: 'Weight Comparison', color: 'bg-red-400' },
              { title: 'How long user worked out', color: 'bg-blue-300' },
              { title: 'Steps Taken', color: 'bg-orange-300' },
              { title: 'Heart Rate Trend', color: 'bg-green-400' },
              { title: 'Workout Streak', color: 'bg-purple-500' },
              { title: 'Goals Completed - Consistency Check', color: 'bg-gray-500' }
            ].map((stat) => (
              <div
                key={stat.title}
                className={`${stat.color} text-white p-4 rounded-lg font-ubuntu`}
              >
                {stat.title}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;