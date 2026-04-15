import React from 'react';
import { useAuth } from '../../contexts/AuthContext';

const FullPageLoader = () => {
  const { isSidebarOpen } = useAuth();
  return (
    <div className={`dashboard-body-wrp show ${isSidebarOpen ? " active" : ""}`}>
      <div className="dashboard-body">
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 9999
        }}>
          <div style={{
            width: '50px',
            height: '50px',
            border: '6px solid #ccc',
            borderTop: '6px solid #3498db',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite'
          }} />
          <style>
            {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
          </style>
        </div>
      </div>
    </div>
  );
};

export default FullPageLoader;
