import React from "react";
import "../App.css";
import { ChevronLeftIcon } from "lucide-react";
import { Button } from "./ui/button";
import { Progress } from "./ui/progress";
import Sidebar from "./Sidebar";
import Background from "./Background";
import { useNavigate } from "react-router-dom";

const GoalDescription = () => {
  const navigate = useNavigate();
  return (
    <div className="flex h-screen">
      <Background />
      {/* Sidebar - Fixed width */}
      <div className="w-64 min-w-64 bg-[#F9A03F] text-white flex flex-col fixed h-full">
        <Sidebar />
      </div>
      {/* Main Content - Push content beside the sidebar */}
      <div className="flex-1 ml-64 bg-[#0A1A33] text-white overflow-y-auto pt-4px">
        <header className="pt-16 flex items-center justify-between">
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
        <div className="p-4">
          <div className="bg-white rounded-lg p-6 text-black">
            <div className="overflow-x-auto">
              <table className="w-full mb-4">
                <thead>
                  <tr className="text-left">
                    <th className="pb-2">S.No.</th>
                    <th className="pb-2">Type of Goal</th>
                    <th className="pb-2">Target</th>
                    <th className="pb-2">Expected Outcome</th>
                    <th className="pb-2">Deadline</th>
                    <th className="pb-2 text-right">
                      <span className="text-5xl font-bold">
                        68<span className="text-2xl">%</span>
                      </span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="py-2">1</td>
                    <td className="py-2 underline">Lose Weight</td>
                    <td className="py-2">20 lbs</td>
                    <td className="py-2">Get fitter</td>
                    <td className="py-2">4 Months</td>
                    <td className="py-2"></td>
                  </tr>
                </tbody>
              </table>
            </div>
            <Progress
              value={68}
              className="h-4 bg-gray-300"
              indicatorClassName="bg-[#F9A03F]"
            />
          </div>

          {/* Goal Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            {/* Goal Marks */}
            <div>
              <h3 className="text-xl font-medium mb-2">Goal Marks</h3>
              <div className="rounded-lg overflow-hidden">
                <div className="bg-gradient-to-br from-[#F9A03F] via-[#3CAEA3] to-[#20639B] p-6 h-full">
                  <p>
                    This Box will show the user goals that correspond to the
                    goal the user has made.
                  </p>
                </div>
              </div>
            </div>

            {/* Specific Goal AI Recommendation */}
            <div>
              <h3 className="text-xl font-medium mb-2">
                Specific Goal AI Recommendation
              </h3>
              <div className="rounded-lg overflow-hidden">
                <div className="bg-gradient-to-br from-[#F9A03F] via-[#3CAEA3] to-[#20639B] p-6 h-full">
                  <p>
                    This Box will contain AI recommendations based on what they
                    have inputted (i.e. what they can do to start or help with
                    the goal)
                  </p>
                </div>
              </div>
            </div>

            {/* Goal Description */}
            <div>
              <h3 className="text-xl font-medium mb-2">Goal Description</h3>
              <div className="rounded-lg overflow-hidden">
                <div className="bg-gradient-to-br from-[#F9A03F] via-[#3CAEA3] to-[#20639B] p-6 h-full">
                  <p>
                    This Box will contain the description of the specific goal
                    they have clicked on or created. To provide a bit more
                    information for the user.
                  </p>
                </div>
              </div>
            </div>

            {/* Log Progress */}
            <div>
              <h3 className="text-xl font-medium mb-2">Log Progress</h3>
              <div className="rounded-lg overflow-hidden">
                <div className="bg-gradient-to-br from-[#F9A03F] via-[#3CAEA3] to-[#20639B] p-6 h-full">
                  <p>
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
              <h3 className="text-xl font-medium mb-2">Time Frame</h3>
              <div className="rounded-lg overflow-hidden">
                <div className="bg-gradient-to-br from-[#F9A03F] via-[#3CAEA3] to-[#20639B] p-6 h-full">
                  <p>
                    This box will contain the time frame the user has given the
                    goal for a better look and understanding
                  </p>
                </div>
              </div>
            </div>

            {/* Specific Goal Completion */}
            <div>
              <h3 className="text-xl font-medium mb-2">
                Specific Goal Completion
              </h3>
              <div className="rounded-lg overflow-hidden">
                <div className="bg-gradient-to-br from-[#F9A03F] via-[#3CAEA3] to-[#20639B] p-6 h-full">
                  <p>
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
