import React, { useState, useEffect } from 'react';
import AidifyLogo from './AidifyLogo';
import './ViewRequestsPage.css';

interface Request {
  _id?: string;
  name: string;
  location: string;
  service: string;
  keywords: string;
  description: string;
  phone: string;
  status?: string;
}

const ViewRequestsPage: React.FC = () => {
  const [filter, setFilter] = useState('');
  const [requests, setRequests] = useState<Request[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isConfirmingClearAll, setIsConfirmingClearAll] = useState(false);

  const fetchRequests = () => {
    setLoading(true);
    fetch('http://localhost:3000/api/requests')
      .then(res => res.json())
      .then(data => {
        setRequests(data);
        setError('');
      })
      .catch(() => setError('Failed to fetch requests.'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleAccept = async (id: string) => {
    const original = [...requests];

    setRequests(prev =>
      prev.map(req =>
        req._id === id
          ? { ...req, status: req.status === 'accepted' ? 'pending' : 'accepted' }
          : req
      )
    );

    try {
      const res = await fetch(`http://localhost:3000/api/requests/${id}/accept`, {
        method: 'PUT',
      });

      if (!res.ok) setRequests(original);
    } catch {
      setRequests(original);
    }
  };

  const handleDelete = async (id: string) => {
    const original = [...requests];
    setRequests(prev => prev.filter(req => req._id !== id));

    try {
      const res = await fetch(`http://localhost:3000/api/requests/${id}`, {
        method: 'DELETE',
      });

      if (!res.ok) setRequests(original);
    } catch {
      setRequests(original);
    }
  };

  const handleClearAll = async () => {
    const original = [...requests];
    setRequests([]);
    setIsConfirmingClearAll(false);

    try {
      const res = await fetch('http://localhost:3000/api/requests/all', {
        method: 'DELETE',
      });

      if (!res.ok) setRequests(original);
    } catch {
      setRequests(original);
    }
  };

  const filteredRequests = requests.filter(req =>
    Object.values(req).join(' ').toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div className="viewpage-root">
      <AidifyLogo />
      <div className="viewpage-title">view requests</div>

      <div className="viewpage-filter-bar">
        <input
          type="text"
          className="viewpage-filter-input"
          placeholder="Filter requests by any field…"
          value={filter}
          onChange={e => setFilter(e.target.value)}
        />
      </div>

      {error && <div className="viewpage-error">{error}</div>}

      <div className="viewpage-table-container">
        {loading && <div className="viewpage-loading">Loading requests...</div>}
        {!loading && filteredRequests.length === 0 && (
          <div className="viewpage-no-requests">No requests found.</div>
        )}

        {!loading && filteredRequests.length > 0 && (
          <table className="viewpage-table">
            <thead>
              <tr>
                <th>Index</th>
                <th>Name</th>
                <th>Location</th>
                <th>Phone</th>
                <th>Service</th>
                <th>Keywords</th>
                <th>Description</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredRequests.map((req, idx) => (
                <tr
                  key={req._id || idx}
                  className={req.status === 'accepted' ? 'viewpage-row-accepted' : ''}
                >
                  <td>{idx + 1}</td>
                  <td>{req.name}</td>
                  <td>{req.location}</td>
                  <td>{req.phone}</td>
                  <td>{req.service}</td>
                  <td>{req.keywords}</td>
                  <td className="viewpage-desc-cell">{req.description}</td>

                  <td className="viewpage-actions-cell">
                    <button
                      className={`viewpage-accept-btn ${
                        req.status === 'accepted' ? 'accepted' : ''
                      }`}
                      onClick={() => handleAccept(req._id!)}
                    >
                      {req.status === 'accepted' ? 'Accepted' : 'Accept'}
                    </button>

                    <button
                      className="viewpage-delete-btn"
                      onClick={() => handleDelete(req._id!)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {!loading && requests.length > 0 && (
        <div className="viewpage-clear-all-container">
          {!isConfirmingClearAll ? (
            <button
              className="viewpage-clear-all-btn"
              onClick={() => setIsConfirmingClearAll(true)}
            >
              Clear All Requests
            </button>
          ) : (
            <div className="viewpage-confirm-box">
              <span>Are you sure you want to delete all requests?</span>
              <button className="viewpage-confirm-btn-yes" onClick={handleClearAll}>
                Yes, Clear All
              </button>
              <button
                className="viewpage-confirm-btn-cancel"
                onClick={() => setIsConfirmingClearAll(false)}
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ViewRequestsPage;
