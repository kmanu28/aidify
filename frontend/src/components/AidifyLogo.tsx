import React from 'react';
import { Link } from 'react-router-dom';
import './AidifyLogo.css';

const AidifyLogo: React.FC = () => (
  <div className="aidify-logo-topleft">
    <Link to="/" className="aidify-logo-link">
      &lt;aidify&gt;
    </Link>
  </div>
);

export default AidifyLogo;
