import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function Feedback() {
  const navigate = useNavigate();
  const [rating, setRating] = useState(0);
  const [feedbackText, setFeedbackText] = useState('');
  const [category, setCategory] = useState('General');
  const [anonymous, setAnonymous] = useState(false);
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [avgRating, setAvgRating] = useState(0);
  const [totalSubmissions, setTotalSubmissions] = useState(0);
  const [streak, setStreak] = useState(0);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('feedbackList') || '[]');
    const streakData = JSON.parse(localStorage.getItem('feedbackStreak') || '0');

    setTotalSubmissions(saved.length);
    setStreak(streakData);

    if (saved.length > 0) {
      const total = saved.reduce((sum, f) => sum + f.rating, 0);
      setAvgRating((total / saved.length).toFixed(1));
    }
  }, [submitted]);

  const analyzeSentiment = (text) => {
    const positiveWords = ['good','great','love','amazing','excellent','nice','awesome'];
    const negativeWords = ['bad','poor','hate','bug','issue','problem','worst'];

    const lower = text.toLowerCase();

    if (positiveWords.some(word => lower.includes(word))) {
      return '😊 Positive Feedback Detected';
    }
    if (negativeWords.some(word => lower.includes(word))) {
      return '⚠️ Improvement Needed Feedback';
    }
    return '🤖 Neutral Feedback';
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!rating || !feedbackText.trim()) {
      setMessage('❌ Please fill all fields and select a rating');
      setTimeout(() => setMessage(''), 3000);
      return;
    }

    const feedback = {
      rating,
      feedbackText,
      category,
      anonymous,
      timestamp: new Date().toISOString()
    };

    const saved = JSON.parse(localStorage.getItem('feedbackList') || '[]');
    saved.push(feedback);
    localStorage.setItem('feedbackList', JSON.stringify(saved));

    const newStreak = streak + 1;
    localStorage.setItem('feedbackStreak', JSON.stringify(newStreak));

    setSubmitted(true);
    setMessage('✅ Thank you for your feedback!');

    setTimeout(() => {
      setSubmitted(false);
      setRating(0);
      setFeedbackText('');
      setCategory('General');
      setAnonymous(false);
      setMessage('');
    }, 2500);
  };

  const progressPercent = avgRating ? (avgRating / 5) * 100 : 0;

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg,#EEF2FF,#FDF2F8)', padding: 40 }}>
      <div style={{ maxWidth: 850, margin: '0 auto' }}>

        <div style={{ background: 'linear-gradient(135deg,#5B2EFF,#7C5CFF)', color: 'white', padding: 24, borderRadius: 20, display: 'flex', justifyContent: 'space-between' }}>
          <h2>💬 Smart AI Feedback</h2>
          <button onClick={() => navigate('/dashboard')} style={{ background: 'rgba(255,255,255,0.2)', border: 'none', color: 'white', padding: '8px 14px', borderRadius: 10 }}>← Back</button>
        </div>

        {/* Badge + Streak */}
        <div style={{ marginTop: 20, background: 'white', padding: 20, borderRadius: 20 }}>
          <h4>🏆 User Status</h4>
          {totalSubmissions >= 3 && (
            <div style={{ color: '#B45309', fontWeight: 700 }}>🏆 Top Supporter Badge Earned!</div>
          )}
          <div style={{ marginTop: 8 }}>🔥 Feedback Streak: {streak}</div>
        </div>

        {/* Circular Rating */}
        <div style={{ marginTop: 20, background: 'white', padding: 20, borderRadius: 20, textAlign: 'center' }}>
          <h4>📊 Community Rating</h4>
          <div style={{ position: 'relative', width: 120, height: 120, margin: '20px auto' }}>
            <svg width="120" height="120">
              <circle cx="60" cy="60" r="50" stroke="#E5E7EB" strokeWidth="10" fill="none" />
              <circle
                cx="60"
                cy="60"
                r="50"
                stroke="#5B2EFF"
                strokeWidth="10"
                fill="none"
                strokeDasharray="314"
                strokeDashoffset={314 - (314 * progressPercent) / 100}
                strokeLinecap="round"
                style={{ transition: 'stroke-dashoffset 0.8s ease' }}
              />
            </svg>
            <div style={{ position: 'absolute', top: 40, left: 0, right: 0, fontWeight: 700 }}>
              ⭐ {avgRating || '0.0'}
            </div>
          </div>
        </div>

        {/* Form */}
        <div style={{ marginTop: 20, background: 'white', padding: 30, borderRadius: 20 }}>
          {message && <div style={{ marginBottom: 15 }}>{message}</div>}

          {!submitted && (
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

              <div>
                <label>Rate SafeHere ⭐</label>
                <div style={{ fontSize: 30 }}>
                  {[1,2,3,4,5].map(i => (
                    <span key={i} onClick={() => setRating(i)} style={{ cursor: 'pointer', color: rating >= i ? '#F59E0B' : '#E5E7EB' }}>⭐</span>
                  ))}
                </div>
              </div>

              <div>
                <label>Your Feedback</label>
                <textarea
                  value={feedbackText}
                  onChange={(e) => setFeedbackText(e.target.value)}
                  style={{ width: '100%', padding: 12, borderRadius: 12 }}
                />
                {feedbackText && (
                  <div style={{ marginTop: 6, fontWeight: 600 }}>
                    {analyzeSentiment(feedbackText)}
                  </div>
                )}
              </div>

              <div>
                <label>Category</label>
                <select value={category} onChange={(e) => setCategory(e.target.value)} style={{ width: '100%', padding: 12, borderRadius: 12 }}>
                  <option>General</option>
                  <option>Bug Report</option>
                  <option>Feature Request</option>
                  <option>UI/UX Improvement</option>
                  <option>Safety Concern</option>
                </select>
              </div>

              <label>
                <input type="checkbox" checked={anonymous} onChange={() => setAnonymous(!anonymous)} /> Submit anonymously
              </label>

              <button type="submit" style={{ background: '#5B2EFF', color: 'white', padding: 14, border: 'none', borderRadius: 12 }}>
                🚀 Submit Feedback
              </button>
            </form>
          )}
        </div>

      </div>
    </div>
  );
}

export default Feedback;