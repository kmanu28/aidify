import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './components/HomePage';
import PostRequestPage from './components/PostRequestPage';
import ViewRequestsPage from './components/ViewRequestsPage';
// Removed HubPage import

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/post-request" element={<PostRequestPage />} />
        <Route path="/view-requests" element={<ViewRequestsPage />} />
      </Routes>
    </Router>
  );
};

export default App;