import React, { useState } from 'react';
import AidifyLogo from './AidifyLogo';
import './PostRequestPage.css';

// Define a character limit for the name
const MAX_NAME_LENGTH = 30;

// Define the locations array
const locations = [
  "Banashankari",
  "Rajarajeshwari Nagar",
  "Kengeri",
  "Konanakunte",
  "Malleshwaram",
  "Jayanagar",
  "JP Nagar",
  "Electronic City",
  "Whitefield",
];

const PostRequestPage: React.FC = () => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [service, setService] = useState('');
  const [keywords, setKeywords] = useState('');
  const [phone, setPhone] = useState(''); // --- ADDED PHONE STATE ---
  const [loading, setLoading] = useState(false);

  // For name length error
  const [nameError, setNameError] = useState('');
  // For submit validation error
  const [submitError, setSubmitError] = useState('');


  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Clear submit error on new input
    if (submitError) setSubmitError('');
    // Clear name length error
    if (nameError) setNameError('');

    const value = e.target.value;
    if (value.length > MAX_NAME_LENGTH) {
      setNameError(`Name cannot exceed ${MAX_NAME_LENGTH} characters.`);
      setName(value.substring(0, MAX_NAME_LENGTH));
    } else {
      setName(value);
    }
  };

  // --- ADDED PHONE HANDLER ---
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    clearSubmitError();
    const value = e.target.value;
    // Allow only numbers and limit to 10 digits
    const numericValue = value.replace(/[^0-9]/g, '');
    if (numericValue.length <= 10) {
      setPhone(numericValue);
    }
  };

  const clearSubmitError = () => {
    if (submitError) setSubmitError('');
  };

  const handleSubmit = async () => {
    // Clear previous submit errors
    setSubmitError('');

    // --- Build a dynamic error message ---
    const missingFields = [];
    if (name.trim() === '') {
      missingFields.push('Name');
    }
    if (description.trim() === '') {
      missingFields.push('Description');
    }
    if (location.trim() === '') {
      missingFields.push('Location');
    }
    if (service.trim() === '') {
      missingFields.push('Service');
    }
    // --- ADDED PHONE VALIDATION ---
    const phoneRegex = /^[0-9]{10}$/; // Simple 10-digit phone regex
    if (phone.trim() === '') {
      missingFields.push('Phone');
    } else if (!phoneRegex.test(phone.trim())) {
      setSubmitError('Please enter a valid 10-digit phone number.');
      return;
    }
    // --- END OF PHONE VALIDATION ---

    if (missingFields.length > 0) {
      // Create a specific error message
      setSubmitError(`Please fill in: ${missingFields.join(', ')}.`);
      return;
    }
    // --- End of new validation logic ---

    setLoading(true);
    // Check if keywords is empty and set it to "-" if it is
    const keywordsToSend = keywords.trim() === '' ? '-' : keywords;
    const body = { name, location, service, keywords: keywordsToSend, description, phone }; // --- ADDED PHONE TO BODY ---

    try {
      const res = await fetch('http://localhost:3000/api/requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (res.ok) {
        setName('');
        setLocation('');
        setService('');
        setKeywords('');
        setDescription('');
        setPhone(''); // --- CLEAR PHONE ON SUBMIT ---
        // We'll show a success message instead of an alert
        setSubmitError('Request submitted successfully!');
        // You might want to clear this success message after a few seconds
        setTimeout(() => setSubmitError(''), 5000);
      } else {
        setSubmitError('Error submitting request. Please try again.');
      }
    } catch (err) {
      setSubmitError('Network error. Please check your connection.');
    }
    setLoading(false);
  };

  return (
    <div className="postpage-root">
      <AidifyLogo />
      <div className="postpage-title">post a request</div>
      <div className="postpage-content">
        <div className="postpage-left">
          <div className="postpage-row">
            <span className="postpage-icon"></span>
            <select
              className="postpage-dropdown"
              value={location}
              onChange={e => {
                setLocation(e.target.value);
                clearSubmitError();
              }}
              required
            >
              <option value="" disabled>enter location</option>
              {locations.map((loc) => (
                <option key={loc} value={loc}>
                  {loc}
                </option>
              ))}
            </select>
            <span className="postpage-caret">▼</span>
          </div>
          <div className="postpage-row">
            <span className="postpage-icon"></span>
            <input
              className="postpage-dropdown"
              placeholder="enter service"
              value={service}
              onChange={e => {
                setService(e.target.value);
                clearSubmitError();
              }}
            />
          </div>
          <div className="postpage-row">
            <span className="postpage-icon"></span>
            <input
              className="postpage-dropdown"
              placeholder="enter keywords (optional)"
              value={keywords}
              onChange={e => setKeywords(e.target.value)}
            />
          </div>
          <button className="postpage-btn" onClick={handleSubmit} disabled={loading}>
            {loading ? 'Posting...' : 'post'}
          </button>
          {/* This div will show the specific error message */}
          {submitError && (
            <div className="postpage-submit-error">
              {submitError}
            </div>
          )}
        </div>
        <div className="postpage-right">
          <form className="postpage-card" autoComplete="off" onSubmit={e => e.preventDefault()}>
            <input
              className="postpage-card-name"
              type="text"
              placeholder="Name"
              value={name}
              onChange={handleNameChange} // Use the special handler
              autoComplete="off"
            />
            {/* This div will show the name length error */}
            {nameError && (
              <div className="postpage-error-message">
                {nameError}
              </div>
            )}
            <textarea
              className="postpage-card-desc"
              placeholder="Description"
              value={description}
              onChange={e => {
                setDescription(e.target.value);
                clearSubmitError();
              }}
              rows={3}
              autoComplete="off"
            />
            {/* --- ADDED PHONE INPUT FIELD --- */}
            <input
              className="postpage-card-phone"
              type="tel"
              placeholder="Phone Number"
              value={phone}
              onChange={handlePhoneChange} // Use the special handler
              autoComplete="off"
            />
          </form>
        </div>
      </div>
    </div>
  );
};

export default PostRequestPage;