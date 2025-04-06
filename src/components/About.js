import React, { useState, useEffect } from 'react';
import Background from './Background';
import Sidebar from './Sidebar';
import MobileHeader from './MobileHeader';
import { Container, Row, Col, Card } from 'react-bootstrap';

const About = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);
  
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
            <h1 className="text-3xl font-bold text-white font-ubuntu">About Us</h1>
          </Col>
        </Row>
        
        <Row>
          <Col xs={12} md={10} lg={8} className="mx-auto">
            <Card 
              className="border-0 overflow-hidden" 
              style={{
                background: 'linear-gradient(to bottom, #F8A13E, #6ECAE3, #01B1E3)',
                borderRadius: '1.5rem'
              }}
            >
              <Card.Body className="p-4 p-md-5">
                <h2 className="text-2xl font-bold text-white mb-4">Get on track</h2>
                <p className="text-white text-lg">
                  This project/website is an AI-powered fitness tracker designed to help you monitor workouts, 
                  track progress, and receive personalized insights based on your activity and goals. 
                  Our platform analyzes your data to provide smart recommendations, optimize performance, 
                  and keep you motivated. Whether you're a beginner or a fitness enthusiast, 
                  we make tracking your health effortless and effective.
                </p>

                <div className="mt-6">
                  <h3 className="text-xl font-bold text-white mb-3">Our Mission</h3>
                  <p className="text-white">
                    At trackfit, we believe that fitness should be accessible, understandable, and personalized 
                    for everyone. Our mission is to empower individuals on their fitness journey by providing 
                    intelligent insights and a comprehensive tracking system that adapts to their unique needs.
                  </p>
                </div>

                <div className="mt-6">
                  <h3 className="text-xl font-bold text-white mb-3">Our Approach</h3>
                  <p className="text-white">
                    We combine cutting-edge AI technology with user-friendly design to create a platform that 
                    not only tracks your progress but understands it. By analyzing patterns in your workout data, 
                    our system can provide tailored recommendations that help you achieve your fitness goals 
                    more efficiently.
                  </p>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default About;