import React, { useState, useEffect } from 'react';
import Background from './Background';
import Sidebar from './Sidebar';
import MobileHeader from './MobileHeader';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { FaDatabase, FaCode, FaPaintBrush, FaProjectDiagram, FaLaptopCode } from 'react-icons/fa';

const Team = () => {
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

  const teamMembers = [
    { name: "Ram Mankar", role: "Project Leader", icon: <FaProjectDiagram size={50} /> },
    { name: "Amit Reny", role: "Backend Developer", icon: <FaDatabase size={50} /> },
    { name: "Renjarla Nethra", role: "Backend Developer", icon: <FaCode size={50} /> },
    { name: "Vaishnavi Sampara", role: "Frontend Developer", icon: <FaLaptopCode size={50} /> },
    { name: "Rea Jair", role: "UI/UX Designer", icon: <FaPaintBrush size={50} /> },
    
  ];

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
            <h1 className="text-3xl font-bold text-white font-ubuntu">Our Team</h1>
          </Col>
        </Row>
        
        <Row>
          <Col xs={12}>
            <Card 
              className="border-0 overflow-hidden" 
              style={{
                background: 'linear-gradient(to bottom, #F8A13E, #6ECAE3, #01B1E3)',
                borderRadius: '1.5rem'
              }}
            >
              <Card.Body className="p-4 p-md-5">
                <h2 className="text-2xl font-bold text-white mb-4 text-center">Say Hi!</h2>
                
                <Row className="mt-4 g-4">
                  {teamMembers.map((member, index) => (
                    <Col key={index} xs={12} sm={6} md={4}>
                      <div className="bg-white/20 rounded-xl p-4 text-center h-100">
                        <div className="mb-3 text-white flex justify-center">
                          {member.icon}
                        </div>
                        <h3 className="text-xl font-bold text-white">{member.name}</h3>
                        <p className="text-white">{member.role}</p>
                      </div>
                    </Col>
                  ))}
                </Row>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Team;