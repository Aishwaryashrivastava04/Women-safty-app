import React, { useState, useEffect } from 'react';
import './feedback.css';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

function Feedback() {
  const [rating, setRating] = useState(0);
  const [feedbackText, setFeedbackText] = useState('');
  const [anonymous, setAnonymous] = useState(false);
  const [screenshot, setScreenshot] = useState(null);
  const [category, setCategory] = useState('General');
  const [sortOption, setSortOption] = useState('newest');
  const navigate = useNavigate();

  const handleStarClick = (value) => setRating(value);
  const handleSubmit = (e) => {
    e.preventDefault();
    alert('✅ Feedback submitted!');
    setRating(0);
    setFeedbackText('');
    setAnonymous(false);
    setScreenshot(null);
  };

  return (
    <motion.div className="feedback-container"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="feedback-card shadow">
        <div className="feedback-header bg-primary text-white rounded-top">
          📝 <strong>Share Your Feedback</strong>
          <p className="subtext">Your voice helps us improve women's safety.</p>
        </div>

        <form onSubmit={handleSubmit} className="p-4">
          <div className="mb-3">
            <label className="form-label fw-bold">Rate Us:</label>
            <div className="stars">
              {[1, 2, 3, 4, 5].map((i) => (
                <span
                  key={i}
                  onClick={() => handleStarClick(i)}
                  className={i <= rating ? 'star selected' : 'star'}
                >★</span>
              ))}
            </div>
          </div>

          <div className="mb-3">
            <label className="form-label fw-bold">Feedback:</label>
            <textarea
              className="form-control"
              placeholder="Write your feedback..."
              rows="3"
              value={feedbackText}
              onChange={(e) => setFeedbackText(e.target.value)}
              required
            />
          </div>

          <div className="row mb-3">
            <div className="col-md-6">
              <label className="form-label fw-bold">Screenshot (optional):</label>
              <input
                type="file"
                className="form-control"
                accept="image/*"
                onChange={(e) => setScreenshot(e.target.files[0])}
              />
            </div>
            <div className="col-md-6">
              <label className="form-label fw-bold">Feedback Category:</label>
              <select
                className="form-select"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option>General</option>
                <option>Bug</option>
                <option>Feature Request</option>
                <option>UI/UX</option>
              </select>
            </div>
          </div>

          <div className="form-check mb-3">
            <input
              className="form-check-input"
              type="checkbox"
              id="anon"
              checked={anonymous}
              onChange={() => setAnonymous(!anonymous)}
            />
            <label className="form-check-label" htmlFor="anon">
              Submit anonymously
            </label>
          </div>

          <div className="mb-4">
            <label className="form-label fw-bold">Sort Feedback By:</label>
            <select
              className="form-select"
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
            >
              <option value="newest">Newest</option>
              <option value="oldest">Oldest</option>
              <option value="high">Rating: High to Low</option>
              <option value="low">Rating: Low to High</option>
            </select>
          </div>

          <div className="d-grid gap-2">
            <button type="submit" className="btn btn-success">
              🚀 Submit Feedback
            </button>
            <button
              type="button"
              onClick={() => navigate('/dashboard')}
              className="btn btn-outline-dark"
            >
              ← Back to Dashboard
            </button>
          </div>
        </form>
      </div>
    </motion.div>
  );
}

export default Feedback;