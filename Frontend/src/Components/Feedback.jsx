import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

function Feedback() {
  const navigate = useNavigate();
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [email, setEmail] = useState('');
  const [anonymous, setAnonymous] = useState(true);
  const [submitted, setSubmitted] = useState(false);
  const [feedbackList, setFeedbackList] = useState([]);

  const [searchEmail, setSearchEmail] = useState('');
  const [filterRating, setFilterRating] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    const saved = localStorage.getItem('feedbackList');
    if (saved) setFeedbackList(JSON.parse(saved));
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    const newFeedback = {
      rating,
      comment,
      email: anonymous ? 'Anonymous' : email,
      timestamp: new Date().toLocaleString(),
    };

    const updated = [newFeedback, ...feedbackList];
    setFeedbackList(updated);
    localStorage.setItem('feedbackList', JSON.stringify(updated));

    setRating(0);
    setComment('');
    setEmail('');
    setAnonymous(true);
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 4000);
  };

  const handleDeleteAll = () => {
    if (window.confirm('Are you sure you want to delete all feedback?')) {
      setFeedbackList([]);
      localStorage.removeItem('feedbackList');
    }
  };

  const filteredFeedback = feedbackList.filter((fb) => {
    const emailMatch = fb.email.toLowerCase().includes(searchEmail.toLowerCase());
    const ratingMatch = filterRating === 'All' || fb.rating === parseInt(filterRating);
    return emailMatch && ratingMatch;
  });

  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentItems = filteredFeedback.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredFeedback.length / itemsPerPage);

  const ratingCounts = [1, 2, 3, 4, 5].map(
    (r) => feedbackList.filter((fb) => fb.rating === r).length
  );

  const chartData = {
    labels: ['1★', '2★', '3★', '4★', '5★'],
    datasets: [
      {
        label: 'Feedback Count',
        data: ratingCounts,
        backgroundColor: '#0d6efd',
        borderRadius: 6,
      },
    ],
  };

  return (
    <div className="container py-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold text-primary">📝 Feedback</h2>
        <button className="btn btn-outline-secondary" onClick={() => navigate('/dashboard')}>
          ⬅ Back
        </button>
      </div>

      <div className="row justify-content-center">
        <div className="col-xl-10 col-lg-11">
          {/* Feedback Form */}
          <div className="card shadow-lg p-4 mb-4 rounded-4 bg-light">
            {submitted && (
              <div className="alert alert-success text-center fw-bold fs-5">
                ✅ Thank you for your feedback!
              </div>
            )}

            <h4 className="mb-3">How was your experience?</h4>
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                {[1, 2, 3, 4, 5].map((star) => (
                  <span
                    key={star}
                    role="button"
                    className={`fs-2 me-2 ${star <= rating ? 'text-warning' : 'text-secondary'}`}
                    onClick={() => setRating(star)}
                  >
                    ⭐
                  </span>
                ))}
              </div>

              <div className="mb-3">
                <textarea
                  className="form-control fs-5"
                  rows="5"
                  placeholder="Write your feedback..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  required
                />
              </div>

              <div className="mb-3">
                <input
                  type="email"
                  className="form-control"
                  placeholder="Email (optional)"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={anonymous}
                />
              </div>

              <div className="form-check mb-4">
                <input
                  className="form-check-input"
                  type="checkbox"
                  checked={anonymous}
                  onChange={() => setAnonymous(!anonymous)}
                  id="anonCheck"
                />
                <label className="form-check-label" htmlFor="anonCheck">
                  Submit anonymously
                </label>
              </div>

              <button className="btn btn-primary w-100 fs-5" type="submit">
                📤 Submit Feedback
              </button>
            </form>
          </div>

          {/* Filters */}
          {feedbackList.length > 0 && (
            <div className="card shadow-sm p-3 mb-4 bg-white rounded-4">
              <div className="row g-3">
                <div className="col-md-5">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Search by email..."
                    value={searchEmail}
                    onChange={(e) => setSearchEmail(e.target.value)}
                  />
                </div>
                <div className="col-md-3">
                  <select
                    className="form-select"
                    value={filterRating}
                    onChange={(e) => setFilterRating(e.target.value)}
                  >
                    <option value="All">All Ratings</option>
                    {[5, 4, 3, 2, 1].map((r) => (
                      <option key={r} value={r}>
                        {r} Star{r > 1 && 's'}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="col-md-4 text-end">
                  <button className="btn btn-danger" onClick={handleDeleteAll}>
                    🗑️ Delete All Feedback
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Chart */}
          {feedbackList.length > 0 && (
            <div className="card mb-4 shadow-sm p-4 bg-white rounded-4">
              <h5 className="text-center mb-3 text-primary">📊 Rating Chart</h5>
              <Bar data={chartData} />
            </div>
          )}

          {/* Feedback List */}
          {currentItems.length > 0 && (
            <div className="card shadow-sm p-3 rounded-4 bg-white">
              <h5 className="mb-3">📋 Feedback List</h5>
              {currentItems.map((fb, index) => (
                <div
                  key={index}
                  className="border-bottom pb-3 mb-3"
                  style={{ borderColor: '#eaeaea' }}
                >
                  <div className="mb-1">
                    <strong>Rating:</strong>{' '}
                    {[...Array(fb.rating)].map((_, i) => (
                      <span key={i} className="text-warning">⭐</span>
                    ))}
                  </div>
                  <div className="mb-1">
                    <strong>Comment:</strong> {fb.comment}
                  </div>
                  <div className="mb-1">
                    <strong>Email:</strong> {fb.email}
                  </div>
                  <small className="text-muted">🕒 {fb.timestamp}</small>
                </div>
              ))}
            </div>
          )}

          {/* Pagination */}
          {filteredFeedback.length > itemsPerPage && (
            <nav className="mt-4">
              <ul className="pagination justify-content-center">
                {Array.from({ length: totalPages }, (_, i) => (
                  <li
                    key={i + 1}
                    className={`page-item ${currentPage === i + 1 ? 'active' : ''}`}
                  >
                    <button className="page-link" onClick={() => setCurrentPage(i + 1)}>
                      {i + 1}
                    </button>
                  </li>
                ))}
              </ul>
            </nav>
          )}
        </div>
      </div>
    </div>
  );
}

export default Feedback;