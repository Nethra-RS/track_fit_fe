import React, { useState, useEffect } from 'react';
import Background from './Background';
import Sidebar from './Sidebar';
import { Plus } from 'lucide-react';
import { Container, Row, Col, Button, Card } from 'react-bootstrap';

const Dashboard = () => {
  const [goals, setGoals] = useState(['Goal 1', 'Goal 2', 'Goal 3']);
  const [isMobile, setIsMobile] = useState(false);
  
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    handleResize(); // Initial check
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const addGoal = () => {
    const newGoal = `Goal ${goals.length + 1}`;
    setGoals([...goals, newGoal]);
  };

  // Make sure this matches the width in Sidebar.js and Background.js
  const sidebarWidth = isMobile ? 0 : 256;

  return (
    <div className="min-h-screen font-ubuntu flex relative">
      {/* Background Component */}
      <Background sidebarWidth={sidebarWidth} />
      
      {/* Sidebar Component */}
      <Sidebar />

      {/* Scrollable Content Area */}
      <Container 
        fluid 
        className={`overflow-auto relative z-10 px-3 px-md-4 ${isMobile ? 'mobile-adjusted-content' : ''}`}
        style={{ 
          marginLeft: isMobile ? '0' : `${sidebarWidth}px`, 
          marginTop: '64px', // This should match the navbar height in Background.js
          paddingBottom: '32px',
          transition: 'margin-left 0.3s ease-in-out'
        }}
      >
        <Row className="mb-4 mt-4">
          <Col>
            <h1 className="text-3xl font-bold text-white font-ubuntu">My Dashboard</h1>
          </Col>
        </Row>
        
        {/* Section Headings - Responsive */}
        <Row className="mb-2">
          <Col xs={12} md={4}>
            <h2 className="text-xl text-white mb-3 font-ubuntu">Goals</h2>
          </Col>
          <Col xs={12} md={8}>
            <h2 className="text-xl text-white mb-3 font-ubuntu mt-4 mt-md-0">Quick Stats</h2>
          </Col>
        </Row>

        <Row>
          {/* Goals Section - Responsive */}
          <Col xs={12} md={4} className="mb-4 mb-md-0">
            <Card className="border-0 overflow-hidden" style={{
              background: 'linear-gradient(to bottom, #F8A13E, #6ECAE3, #01B1E3)',
              borderRadius: '1.5rem'
            }}>
              <Card.Body className="p-4">
                <div className="space-y-4">
                  {goals.map((goal, index) => (
                    <div
                      key={index}
                      className="bg-gray-500/50 text-white p-3 rounded-xl font-ubuntu mb-3"
                    >
                      {goal}
                    </div>
                  ))}
                </div>
                <div className="mt-3 d-flex justify-content-center">
                  <Button
                    onClick={addGoal}
                    className="rounded-circle d-flex align-items-center justify-content-center p-0"
                    style={{
                      width: '48px', 
                      height: '48px', 
                      backgroundColor: '#01B1E3',
                      border: 'none'
                    }}
                  >
                    <Plus size={24} />
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </Col>

          {/* Quick Stats - Responsive */}
          <Col xs={12} md={8}>
            <Row>
              {[ 
                { title: 'Weight Comparison', color: '#f87171' },
                { title: 'How long user worked out', color: '#93c5fd' },
                { title: 'Steps Taken', color: '#fdba74' },
                { title: 'Heart Rate Trend', color: '#86efac' },
                { title: 'Workout Streak', color: '#c084fc' },
                { title: 'Goals Completed - Consistency Check', color: '#9ca3af' }
              ].map((stat) => (
                <Col key={stat.title} xs={12} sm={6} lg={4} className="mb-3">
                  <Card
                    className="text-white font-ubuntu p-0 h-100"
                    style={{ backgroundColor: stat.color, borderRadius: '0.5rem', border: 'none' }}
                  >
                    <Card.Body className="p-3">
                      {stat.title}
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Dashboard;