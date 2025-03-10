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
      const [goal, setGoal] = useState({
          target: "",
          outcome: "",
          startDateValue: "",
          endDateValue: "",
          deadlineUnit: "",
      });
  
      const handleOpenPopup = () => setShowPopup(true);
      const handleClosePopup = () => setShowPopup(false);
  
  
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
                                <form>
                                    {/* Type of Goal */}
                                    <label className="aboveType">Type of Goal</label>
                                    <input className="box"
                                        type="text"
                                        name="goalType"
                                        value={goal.type}
                                        onChange={handleChange}
                                        placeholder="Choose a goal"
                                    />

                                    {/* Target Input */}
                                    <label className="aboveType">Target (Unit)</label>
                                    <input className="box"
                                        type="text"
                                        name="target"
                                        value={goal.target}
                                        onChange={handleChange}
                                        placeholder="Enter a value"
                                    />

                                    {/* Expected Outcome */}
                                    <label className="aboveType">Current Progress</label>
                                    <input className="boxOut"
                                        type="int"
                                        name="outcome"
                                        value={goal.outcome}
                                        onChange={handleChange}
                                        placeholder="Enter a value"
                                    ></input>

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
                                            <select className="deadlineUnit" value={goal.deadlineUnit} onChange={handleChange}>
                                              <option value="month">January</option>
                                              <option value="month">February</option>
                                              <option value="month">March</option>
                                              <option value="month">April</option>
                                              <option value="month">May</option>
                                              <option value="month">June</option>
                                              <option value="month">July</option>
                                              <option value="month">August</option>
                                              <option value="month">September</option>
                                              <option value="month">October</option>
                                              <option value="month">November</option>
                                              <option value="month">December</option>
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
                                        <select className="deadlineUnit" value={goal.deadlineUnit} onChange={handleChange}>
                                          <option value="month">January</option>
                                          <option value="month">February</option>
                                          <option value="month">March</option>
                                          <option value="month">April</option>
                                          <option value="month">May</option>
                                          <option value="month">June</option>
                                          <option value="month">July</option>
                                          <option value="month">August</option>
                                          <option value="month">September</option>
                                          <option value="month">October</option>
                                          <option value="month">November</option>
                                          <option value="month">December</option>
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