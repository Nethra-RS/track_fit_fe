import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import Background from './Background';
import Sidebar from './Sidebar';
import MobileHeader from './MobileHeader';
import { Plus, ChevronLeft, ChevronRight } from 'lucide-react';
import { Container, Row, Col, Button, Card, Spinner } from 'react-bootstrap';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import API_BASE_URL from '../lib/api';
import { fetchUserGoals } from '../goalAPI';

const Dashboard = () => {
  const navigate = useNavigate();
  const [goals, setGoals] = useState([]);
  const [isMobile, setIsMobile] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [stats, setStats] = useState({
    steps: 0,
    distance: 0,
    calories: 0,
    'heart points': 0
  });
  const [loading, setLoading] = useState(true);
  const [fitData, setFitData] = useState(null);
  const [currentWeekOffset, setCurrentWeekOffset] = useState(0); // 0 = current week
  const [fetchError, setFetchError] = useState(null);
  const [showProfilePrompt, setShowProfilePrompt] = useState(false);
  const [loadingGoals, setLoadingGoals] = useState(true);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    fetchAllHistoricalStats();
  }, []);
  
  useEffect(() => {
    const loadGoals = async () => {
      try {
        setLoadingGoals(true); // 🔄 Start loading
        const data = await fetchUserGoals();
        if (data?.goals?.length) {
          setGoals(data.goals.map(g => g.goal_name));
        } else {
          setGoals([]); // Important to reset if none
        }
      } catch (err) {
        console.error("Failed to load goals:", err);
      } finally {
        setLoadingGoals(false); // ✅ Stop loading
      }
    };
  
    loadGoals();
  }, []);  

  useEffect(() => {
    const checkProfileCompletion = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/auth/user`, {
          credentials: "include",
        });
        const user = await res.json();
        
        const missingFields = !user.gender || !user.age || !user.height || !user.weight;
        if (missingFields) {
          setShowProfilePrompt(true);
        }
      } catch (err) {
        console.error("Failed to check profile:", err);
      }
    };
  
    checkProfileCompletion();
  }, []);
  
  // Update current stats when week changes
  useEffect(() => {
    if (fitData) {
      updateStatsForCurrentWeek();
    }
  }, [currentWeekOffset, fitData]);

  const fetchAllHistoricalStats = async () => {
    try {
      setLoading(true);
      setFetchError(null);
      
      // Use relative URL for better compatibility across environments
      const apiUrl = `${API_BASE_URL}/api/google-fit/fetch-data`;
      console.log('Fetching data from:', apiUrl.toString());
      
      const res = await fetch(apiUrl, {
        credentials: 'include',
      });
      
      if (!res.ok) {
        const errorText = await res.text();
        console.error('API Error Response:', errorText);
        throw new Error(`Failed to fetch stats: ${res.status}`);
      }
      
      const data = await res.json();
      console.log('API Response:', data);
      
      if (!data.fit_data || !Array.isArray(data.fit_data)) {
        console.error('Invalid fit_data structure:', data);
        throw new Error('Invalid data structure returned from API');
      }
      
      // Log the first metric to understand its structure
      if (data.fit_data.length > 0) {
        console.log('Sample metric data:', data.fit_data[0]);
        console.log('Available metrics:', data.fit_data.map(item => item.name));
      } else {
        console.log('No fitness data available');
      }
      
      setFitData(data.fit_data);
    } catch (err) {
      console.error('Error fetching stats:', err);
      setFetchError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Get the days of the week for the current selected week
  const getWeekDays = () => {
    const today = new Date();
    const dayOfWeek = today.getDay();
    const startOfCurrentWeek = new Date(today);
    startOfCurrentWeek.setDate(today.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1)); // Monday as first day
    
    // Adjust for week offset
    startOfCurrentWeek.setDate(startOfCurrentWeek.getDate() + (currentWeekOffset * 7));
    
    const days = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(startOfCurrentWeek);
      date.setDate(startOfCurrentWeek.getDate() + i);
      days.push({
        dayName: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][date.getDay()],
        fullDate: date.toDateString(),
        dateObj: date,
        timestamp: date.getTime()
      });
    }
    return days;
  };

  // Update stats for the currently selected week
  const updateStatsForCurrentWeek = () => {
    if (!fitData || !Array.isArray(fitData)) {
      console.log('No fitData available or not an array:', fitData);
      return;
    }

    console.log('Processing fitData for current week, offset:', currentWeekOffset);
    
    const weekDays = getWeekDays();
    console.log('Week days:', weekDays.map(d => d.fullDate));
    const todayTimestamp = new Date().getTime();
    
    // Initialize new stats object
    const weekStats = {
      steps: 0,
      distance: 0,
      calories: 0,
      'heart points': 0
    };
    
    // For each metric, sum the values for the current week
    fitData.forEach(metric => {
      const name = metric.name;
      if (!weekStats.hasOwnProperty(name)) {
        console.log(`Skipping unknown metric: ${name}`);
        return;
      }
      
      console.log(`Processing metric: ${name}`);
      
      // Total for all days in the current week
      let weekTotal = 0;
      
      // Process each day in our week
      weekDays.forEach(day => {
        // Format date ranges for comparison
        const dayStart = new Date(day.dateObj).setHours(0, 0, 0, 0);
        const dayEnd = new Date(day.dateObj).setHours(23, 59, 59, 999);
        
        // Skip future days
        if (dayStart > todayTimestamp && currentWeekOffset >= 0) {
          return;
        }
        
        // Look for matching data points
        Object.entries(metric.metrics || {}).forEach(([dateStr, data]) => {
          const dataTimestamp = data.timestamp;
          
          if (dataTimestamp >= dayStart && dataTimestamp <= dayEnd) {
            weekTotal += data.value;
            console.log(`Found data for ${name} on ${dateStr}: ${data.value}`);
          }
        });
      });
      
      // Update the stats with the weekly total
      weekStats[name] = weekTotal;
      console.log(`Total ${name} for week: ${weekTotal}`);
    });
    
    console.log('Final week stats:', weekStats);
    setStats(weekStats);
  };

  // Get chart data for a specific metric
  const getGraphData = (name) => {
    const weekDays = getWeekDays();
    const today = new Date();
    
    // Initialize with all days of the week
    const graphData = weekDays.map(day => {
      // Check if this day is in the past or in a previous week
      const isVisible = currentWeekOffset < 0 || day.dateObj <= today;
      
      return {
        date: day.dayName,
        fullDate: day.fullDate,
        value: 0,
        isVisible // Using a more standard property name
      };
    });
    
    if (!fitData || !Array.isArray(fitData)) {
      console.log(`No fit data available for metric: ${name}`);
      return graphData;
    }
    
    // Find the matching metric
    const simpleName = name.toLowerCase()
      .replace('taken', '')
      .replace('(m)', '')
      .replace('burned', '')
      .trim();
    
    const metric = fitData.find(item => {
      const itemName = (item.name || '').toLowerCase();
      return itemName === simpleName || 
             itemName.includes(simpleName) || 
             simpleName.includes(itemName);
    });
    
    if (!metric) {
      console.log(`No matching metric found for: ${name}. Available metrics:`, 
        fitData.map(m => m.name));
      return graphData;
    }
    
    if (!metric.metrics) {
      console.log(`Metric found but has no data:`, metric);
      return graphData;
    }
    
    // Populate data values for each day in the week
    return graphData.map(day => {
      // Format date ranges for comparison
      const dayObj = new Date(day.fullDate);
      const dayStart = new Date(dayObj).setHours(0, 0, 0, 0);
      const dayEnd = new Date(dayObj).setHours(23, 59, 59, 999);
      
      // Find data for this specific day
      let dayValue = 0;
      let found = false;
      
      Object.entries(metric.metrics).forEach(([dateStr, data]) => {
        const timestamp = data.timestamp;
        if (timestamp >= dayStart && timestamp <= dayEnd) {
          dayValue = data.value;
          found = true;
        }
      });
      
      if (found) {
        console.log(`Found data for ${name} on ${day.fullDate}: ${dayValue}`);
      }
      
      return {
        ...day,
        value: Number(dayValue.toFixed ? dayValue.toFixed(2) : dayValue)

      };
    });
  };

  const handleGrantAccess = () => {
    sessionStorage.setItem('googleFitAccessAsked', 'true');
    setShowModal(false);
    // Use dynamic URL based on current origin
    window.location.href = `${API_BASE_URL}/api/google-fit/authorize`;
  };

  const handleDenyAccess = () => {
    sessionStorage.setItem('googleFitAccessAsked', 'true');
    setShowModal(false);
  };

  const addGoal = () => {
    navigate("/goals");
  };

  const toggleSidebar = () => {
    setShowSidebar(!showSidebar);
  };

  const changeWeek = (direction) => {
    setCurrentWeekOffset(prev => prev + direction);
  };

  const sidebarWidth = isMobile ? 0 : 256;

  const quickStatsItems = [
    { title: 'Steps Taken', color: '#fdba74', value: stats.steps, metricKey: 'steps' },
    { title: 'Distance (m)', color: '#f87171', value: stats.distance, metricKey: 'distance' },
    { title: 'Calories Burned', color: '#93c5fd', value: stats.calories, metricKey: 'calories' },
    { title: 'Heart Points', color: '#86efac', value: stats['heart points'], metricKey: 'heart points' }
  ];

  // Custom tooltip for the charts
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-gray-800 p-2 rounded shadow text-white">
          <p className="font-bold">{payload[0].payload.fullDate}</p>
          <p>{`${payload[0].name}: ${payload[0].value}`}</p>
        </div>
      );
    }
    return null;
  };

  // Get the current week range text display
  const getWeekRangeText = () => {
    const weekDays = getWeekDays();
    const startDate = weekDays[0].dateObj;
    const endDate = weekDays[6].dateObj;
    
    const formatDate = (date) => {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    };
    
    return `${formatDate(startDate)} - ${formatDate(endDate)}`;
  };

  // Calculate min week offset (how far back we can go based on available data)
  const getMinWeekOffset = () => {
    if (!fitData || !Array.isArray(fitData) || fitData.length === 0) return -12; // Default: 3 months
    
    let earliestTimestamp = Date.now();
    
    // Find the earliest timestamp across all metrics
    fitData.forEach(metric => {
      Object.values(metric.metrics || {}).forEach(data => {
        if (data.timestamp < earliestTimestamp) {
          earliestTimestamp = data.timestamp;
        }
      });
    });
    
    const today = new Date();
    const earliestDate = new Date(earliestTimestamp);
    const diffTime = Math.abs(today - earliestDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const diffWeeks = Math.floor(diffDays / 7);
    
    return -diffWeeks - 1; // Extra week for partial data
  };

  // Check if next week navigation should be disabled
  const isNextDisabled = currentWeekOffset >= 0;
  
  // Check if previous week navigation should be disabled
  const isPrevDisabled = currentWeekOffset <= getMinWeekOffset();

  // Retry fetching data
  const handleRetryFetch = () => {
    const lowerError = fetchError?.toLowerCase() || "";
  
    if (
      lowerError.includes("403") ||
      lowerError.includes("401") ||
      lowerError.includes("expired") ||
      lowerError.includes("invalid_grant")
    ) {
      window.location.href = `${API_BASE_URL}/api/google-fit/authorize`;
    } else {
      fetchAllHistoricalStats();
    }
  };

  return (
    <div className="min-h-screen font-ubuntu flex relative">
      <Background sidebarWidth={sidebarWidth} />
      {isMobile && <MobileHeader toggleSidebar={toggleSidebar} />}
      <Sidebar show={showSidebar} handleClose={() => setShowSidebar(false)} />

      {showProfilePrompt && (
  <div
    className="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center"
    style={{ backgroundColor: "rgba(0, 0, 0, 0.5)", zIndex: 9999 }}
  >
    <div
      className="bg-white rounded-4 shadow-lg p-4 w-75 w-md-50"
      style={{ maxWidth: "500px" }}
    >
      <h5 className="fw-bold mb-3 text-center">
        👋 Welcome! Let's get started.
      </h5>
      <p className="text-center mb-4">
        Complete your profile and connect Google Fit to get personalized insights.
      </p>
      <div className="d-flex flex-column gap-2">
        <Button variant="primary" onClick={() => navigate("/profile")}>
          Complete Profile
        </Button>
        <Button variant="outline-primary" onClick={handleGrantAccess}>
          Connect Google Fit
        </Button>
        <Button variant="outline-secondary" onClick={() => setShowProfilePrompt(false)}>
          Dismiss
        </Button>
      </div>
    </div>
  </div>
)}


      <Container
        fluid
        className={`overflow-auto relative z-10 px-3 px-md-4 ${isMobile ? 'mobile-adjusted-content' : ''}`}
        style={{
          marginLeft: isMobile ? '0' : `${sidebarWidth}px`,
          marginTop: '64px',
          paddingBottom: '32px',
          transition: 'margin-left 0.3s ease-in-out'
        }}
      >
        <Row className="mb-4 mt-4">
          <Col>
            <h1 className="text-3xl font-bold text-white font-ubuntu">My Dashboard</h1>
          </Col>
        </Row>

        <Row className="mb-2">
          <Col md={4}><h2 className="text-xl text-white mb-3 font-ubuntu">Goals</h2></Col>
          <Col md={8}>
            <div className="d-flex justify-content-between align-items-center">
              <h2 className="text-xl text-white mb-3 font-ubuntu">Quick Stats</h2>
              <div className="d-flex align-items-center text-white">
                <Button 
                  onClick={() => changeWeek(-1)} 
                  className="bg-transparent border-0"
                  aria-label="Previous week"
                  disabled={isPrevDisabled}
                >
                  <ChevronLeft size={20} color={isPrevDisabled ? "gray" : "white"} />
                </Button>
                <span className="mx-2">{getWeekRangeText()}</span>
                <Button 
                  onClick={() => changeWeek(1)} 
                  className="bg-transparent border-0"
                  disabled={isNextDisabled}
                  aria-label="Next week"
                >
                  <ChevronRight size={20} color={isNextDisabled ? "gray" : "white"} />
                </Button>
              </div>
            </div>
          </Col>
        </Row>

        <Row>
          <Col md={4} className="mb-4 mb-md-0">
          <Card className="border-0 overflow-hidden" style={{ background: 'linear-gradient(to bottom, #F8A13E, #6ECAE3, #01B1E3)', borderRadius: '1.5rem' }}>
           <Card.Body className="p-4">
              <div className="space-y-4">
              {loadingGoals ? (
              <div className="text-white text-center mb-3 font-ubuntu">
                <Spinner animation="border" variant="light" size="sm" className="me-2" />
                 Loading your goals...
              </div>
              ) : goals.length > 0 ? (
              goals.map((goal, index) => (
              <div key={index} className="bg-gray-500/50 text-white p-3 rounded-xl font-ubuntu mb-3">
                {goal}
              </div>
               ))
               ) : (
              <div className="text-white font-ubuntu text-center mb-3">No goals to display. Add goals.</div>
                )}
               </div>
               <div className="mt-3 d-flex justify-content-center">
                <Button onClick={addGoal} className="rounded-circle d-flex align-items-center justify-content-center p-0" style={{ width: '48px', height: '48px', backgroundColor: '#01B1E3', border: 'none' }}>
                  <Plus size={24} />
                </Button>
               </div>
             </Card.Body>
            </Card>
          </Col>

          <Col md={8}>
            <Row>
              {loading ? (
                <Col className="text-center text-white mb-4">
                  <Spinner animation="border" variant="light" />
                  <p className="font-ubuntu mt-2">Loading your fitness data...</p>
                </Col>
              ) : fetchError ? (
                <Col className="text-center text-white mb-4">
                  <div className="bg-red-500/50 p-4 rounded-lg">
                  <p className="font-ubuntu mb-2">
                      Oops! Unable to display Googlefit data, please retry.
                  </p>
                    <Button
                        onClick={handleRetryFetch}
                       style={{ backgroundColor: "#ffffff", color: "#dc2626", fontWeight: "bold" }}
                       className="mt-2"
                    >
                          Retry
                    </Button>

                  </div>
                </Col>
              ) : !fitData || fitData.length === 0 ? (
                <Col className="text-center text-white mb-4">
                  <div className="bg-blue-500/50 p-4 rounded-lg">
                    <p className="font-ubuntu mb-2">No fitness data available. Connect your Google Fit account to see your stats.</p>
                    <Button onClick={handleGrantAccess} className="bg-white text-blue-600 mt-2">
                      Connect Google Fit
                    </Button>
                  </div>
                </Col>
              ) : (
                quickStatsItems.map((stat) => (
                  <Col key={stat.title} sm={6} lg={6} className="mb-3">
                    <Card className="text-white font-ubuntu p-0 h-100" style={{ backgroundColor: stat.color, borderRadius: '0.5rem', border: 'none' }}>
                      <Card.Body className="p-3">
                        <div className="font-bold text-lg">{stat.title}</div>
                        <div className="text-2xl mb-2">{stat.value ? stat.value.toFixed(2) : '0'}</div>
                        <div style={{ height: '140px' }}>
                          <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={getGraphData(stat.metricKey)}>
                              <XAxis 
                                dataKey="date" 
                                fontSize={10} 
                                tick={{ fill: '#ffffff' }}
                              />
                              <YAxis fontSize={10} tick={{ fill: '#ffffff' }} />
                              <Tooltip content={<CustomTooltip />} />
                              <Bar 
                                dataKey="value" 
                                fill="#ffffff" 
                                fillOpacity={0.7}
                                isAnimationActive={false}
                              />
                            </BarChart>
                          </ResponsiveContainer>
                        </div>
                      </Card.Body>
                    </Card>
                  </Col>
                ))
              )}
            </Row>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Dashboard;