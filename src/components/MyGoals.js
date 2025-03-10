import React, { useState, useEffect } from 'react';
import Background from './Background';
import Sidebar from './Sidebar';
import "../MyGoals.css"
import { useNavigate, useLocation } from 'react-router-dom';

const MyGoalsPage = () => {
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
  //----------------------------------------------
  
  const [goal, setGoal] = useState({
    type: "",
    startDateValue: "",
    endDateValue: "",
    startDateUnit: "",
    endDateUnit: "",
  });

  const handleChange = (e) => {
    setGoal({ ...goal, [e.target.name]: e.target.value });
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

  useEffect(() => {
    // Disable scrolling when the component mounts
    document.body.style.overflow = "hidden";

    // Re-enable scrolling when the component unmounts
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  const [showPopup, setShowPopup] = useState(false);

  const handleOpenPopup = () => setShowPopup(true);
  const handleClosePopup = () => setShowPopup(false);

  const goalTypes = [
    { value: "weight", label: "Weight Loss", metrics: ["Current weight vs. target weight", "BMI", "Calories burned per day/week", "Daily calorie intake", "Weight loss progress over time"] },
    { value: "muscle", label: "Muscle Gain", metrics: ["Muscle mass percentage", "Weight lifted", "Number of repetitions and sets completed", "Strength improvement", "Protein intake tracking"] },
    { value: "running", label: "Running", metrics: ["Target distance vs achieved distance", "Distance run", "Average pace", "Total time spent running", "Heart rate during run"] },
    { value: "yoga", label: "Yoga/Flexibility", metrics: ["Time spent on yoga", "Number of yoga sessions completed per day", "Specific yoga poses achieved"] },
    { value: "fitness", label: "General Fitness", metrics: ["Daily step count", "Active minutes per day", "Calories burned during active period", "Most active hour of the day"] },
    { value: "cycling", label: "Cycling Performance", metrics: ["Distance covered", "Average speed", "Calories burned"] },
    { value: "swimming", label: "Swimming Progress", metrics: ["Laps completed", "Stroke count", "Swimming time"] },
    { value: "core", label: "Core Strength and Stability", metrics: ["Plank duration", "Sit-ups/crunches completed", "Core workout sessions per week"] },
    { value: "mindfulness", label: "Mindfulness and Meditation", metrics: ["Meditation duration", "Heart rate variability", "Stress levels"] },
  ];

  const selectedGoalType = goalTypes.find(goalType => goalType.value === goal.type);

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
        <h1 className="text-3xl font-bold text-white mb-6">My Goals</h1>
        
        {/* Goals Card */}
        <div className="GD_details">
        
              <div>
                           
              </div>
                    {/* add a counter that tracks the goals in container */}
                <div>
                    <button className="addButton" onClick={handleOpenPopup}>
                        + Add Goals
                    </button>

                    {showPopup && (
                        
                        <div className="popup-overlay" onClick={handleClosePopup}>
                            <div className="popup-box" onClick={(e) => e.stopPropagation()}>
                                <h2 className="popupTitle">Add/Edit Goal</h2>
                                <form className="scrollable-form">
                                    {/* Type of Goal */}
                                    <label className="aboveType">Type of Goal</label>
                                    <select
                                      className="box"
                                      name="type"
                                      value={goal.type}
                                      onChange={handleChange}
                                    >
                                      <option value="">Select a goal type</option>
                                      {goalTypes.map((goalType) => (
                                        <option key={goalType.value} value={goalType.value}>
                                          {goalType.label}
                                        </option>
                                      ))}
                                    </select>

                                    {/* Conditionally render metrics based on selected goal type */}
                                    {selectedGoalType && selectedGoalType.metrics.map((metric, index) => (
                                      <div key={index}>
                                        <label className="aboveType">{metric}</label>
                                        <input className="box"
                                          type="text"
                                          name={`metric_${index}`}
                                          value={goal[`metric_${index}`] || ""}
                                          onChange={handleChange}
                                          placeholder={`Enter ${metric.toLowerCase()}`}
                                        />
                                      </div>
                                    ))}

                                    {/* Deadline Inputs // Start date - End date */}
                                    <label className="aboveType">Start Date</label>
                                    <div className="deadline-container">
                                        <input className="deadline-input"
                                            type="num"
                                            name="startDateValue"
                                            value={goal.startDateValue}
                                            onChange={handleChange}
                                            placeholder="Enter a value"
                                        />
                                        <div>
                                            <select className="deadlineUnit" name="startDateUnit" value={goal.startDateUnit} onChange={handleChange}>
                                              <option value="January">January</option>
                                              <option value="February">February</option>
                                              <option value="March">March</option>
                                              <option value="April">April</option>
                                              <option value="May">May</option>
                                              <option value="June">June</option>
                                              <option value="July">July</option>
                                              <option value="August">August</option>
                                              <option value="September">September</option>
                                              <option value="October">October</option>
                                              <option value="November">November</option>
                                              <option value="December">December</option>
                                            </select>
                                        </div>
                                    </div>

                                    <label className="aboveType">End date</label>
                                    <div className="deadline-container">
                                    <input className="deadline-input"
                                          type="num"
                                          name="endDateValue"
                                          value={goal.endDateValue}
                                          onChange={handleChange}
                                          placeholder="Enter a value"
                                      />
                                      <div>
                                        <select className="deadlineUnit" name="endDateUnit" value={goal.endDateUnit} onChange={handleChange}>
                                          <option value="January">January</option>
                                          <option value="February">February</option>
                                          <option value="March">March</option>
                                          <option value="April">April</option>
                                          <option value="May">May</option>
                                          <option value="June">June</option>
                                          <option value="July">July</option>
                                          <option value="August">August</option>
                                          <option value="September">September</option>
                                          <option value="October">October</option>
                                          <option value="November">November</option>
                                          <option value="December">December</option>
                                        </select>
                                      </div>
                                    </div>
                                    

                                    {/* Buttons */}
                                    <div className="popup-buttons">
                                        <button type="submit" className="submit-btn">+ Add</button>
                                        <button type="button" onClick={handleClosePopup} className="cancel-btn">Cancel</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    )}
                </div>
                
                <div className="content_requirement">
                    <table className="goalsTable">
                        <thead>
                            <tr>
                                <th>S.No.</th>
                                <th>Type of Goal</th>
                                <th>Target</th>
                                <th>Current Progress</th>
                                <th>Start Date</th>
                                <th>End Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {/* when forum is submitted update */}
                        </tbody>
                    </table>
                    
                </div>
            </div>
            

        </div>
      </div>
    
  );
};

export default MyGoalsPage;