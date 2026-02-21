import React from 'react';
import { useNavigate } from 'react-router-dom';
import './HomePage.css';
import doodle from '../assets/image1.gif';
import image from '../assets/image.jpeg';

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  return (
    <div className="homepage-root">
      <div className="homepage-left">
        <div className="homepage-header">
          <div className="homepage-title">&lt;aidify&gt;</div>
        </div>
        <img src={doodle} alt="Mascot doodle" className="homepage-doodle" />
        <div className="homepage-main">
          <div className="homepage-box">
            <h1 className="homepage-heading">Help Connect</h1>
            <p className="homepage-sub">
              A local platform for volunteers and those in need.
            </p>
          </div>
          <div className="homepage-buttons">
            {/* Reverted buttons back to original state */}
            <button className="btn-light" onClick={() => navigate('/view-requests')}>View Requests</button>
            <button className="btn-dark" onClick={() => navigate('/post-request')}>Post Requests</button>
          </div>
        </div>
      </div>
      <div className="homepage-image-container">
        <img src={image} alt="Joining hands" className="homepage-image" />
      </div>
    </div>
  );
};

export default HomePage;