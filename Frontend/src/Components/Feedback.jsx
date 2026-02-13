import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Feedback() {
  const navigate = useNavigate();
  const [rating, setRating] = useState(0);
  const [feedbackText, setFeedbackText] = useState('');
  const [category, setCategory] = useState('General');
  const [anonymous, setAnonymous] = useState(false);
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!rating || !feedbackText.trim()) {
      setMessage('❌ Please fill all fields and select a rating');
      setTimeout(() => setMessage(''), 3000);
      return;
    }
    const feedback = { rating, feedbackText, category, anonymous, timestamp: new Date().toISOString() };
    const saved = JSON.parse(localStorage.getItem('feedbackList') || '[]');
    saved.push(feedback);
    localStorage.setItem('feedbackList', JSON.stringify(saved));
    setSubmitted(true);
    setMessage('✅ Thank you for your feedback!');
    setRating(0);
    setFeedbackText('');
    setCategory('General');
    setAnonymous(false);
    setTimeout(() => setSubmitted(false), 2000);
  };

  const styles = {
    container: {
      minHeight: '100vh',
      background: 'linear-gradient(180deg, #F8FAFF 0%, #EFF2FF 50%)',
      padding: '20px 0',
      fontFamily: "'Inter', system-ui, -apple-system"
    },
    wrapper: {
      maxWidth: '900px',
      margin: '0 auto',
      padding: '0 20px'
    },
    header: {
      background: 'linear-gradient(135deg, #5B2EFF 0%, #7C5CFF 100%)',
      color: 'white',
      padding: '24px',
      borderRadius: '20px 20px 0 0',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    },
    headerContent: {
      fontSize: '24px',
      fontWeight: '700'
    },
    backBtn: {
      background: 'rgba(255,255,255,0.2)',
      border: 'none',
      color: 'white',
      padding: '8px 16px',
      borderRadius: '8px',
      cursor: 'pointer',
      fontSize: '14px',
      transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
      fontWeight: '600'
    },
    card: {
      background: 'white',
      borderRadius: '20px',
      boxShadow: '0 8px 24px rgba(0,0,0,0.06)',
      padding: '32px 28px',
      marginBottom: '20px'
    },
    form: {
      display: 'flex',
      flexDirection: 'column',
      gap: '24px'
    },
    field: {
      display: 'flex',
      flexDirection: 'column',
      gap: '8px'
    },
    label: {
      fontSize: '14px',
      fontWeight: '600',
      color: '#1F2937',
    },
    stars: {
      display: 'flex',
      gap: '12px',
      fontSize: '32px'
    },
    star: {
      cursor: 'pointer',
      opacity: 0.3,
      transition: 'all 0.2s',
      userSelect: 'none'
    },
    starActive: {
      opacity: 1,
      color: '#F59E0B',
      transform: 'scale(1.2)'
    },
    input: {
      padding: '12px 16px',
      border: '1px solid #E5E7EB',
      borderRadius: '12px',
      fontSize: '14px',
      fontFamily: 'inherit',
      transition: 'all 0.3s',
      outline: 'none'
    },
    textarea: {
      padding: '12px 16px',
      border: '1px solid #E5E7EB',
      borderRadius: '12px',
      fontSize: '14px',
      fontFamily: 'inherit',
      minHeight: '120px',
      resize: 'vertical',
      transition: 'all 0.3s',
      outline: 'none'
    },
    select: {
      padding: '12px 16px',
      border: '1px solid #E5E7EB',
      borderRadius: '12px',
      fontSize: '14px',
      fontFamily: 'inherit',
      cursor: 'pointer',
      transition: 'all 0.3s',
      outline: 'none'
    },
    checkbox: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      cursor: 'pointer'
    },
    charCount: {
      fontSize: '12px',
      color: '#6B7280',
      marginTop: '4px'
    },
    button: {
      padding: '14px 24px',
      fontSize: '15px',
      fontWeight: '600',
      border: 'none',
      borderRadius: '12px',
      cursor: 'pointer',
      transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
      outline: 'none'
    },
    submitBtn: {
      background: 'linear-gradient(135deg, #5B2EFF 0%, #7C5CFF 100%)',
      color: 'white'
    },
    message: {
      padding: '16px 20px',
      borderRadius: '12px',
      fontSize: '14px',
      fontWeight: '600',
      marginBottom: '16px',
      animation: 'slideIn 0.3s ease'
    },
    successMsg: {
      background: '#D1FAE5',
      color: '#065F46',
      border: '1px solid #6EE7B7'
    },
    errorMsg: {
      background: '#FEE2E2',
      color: '#7F1D1D',
      border: '1px solid #FCA5A5'
    }
  };

  return (
    <div style={styles.container}>
      <style>{`
        input:focus, textarea:focus, select:focus {
          border-color: #5B2EFF !important;
          box-shadow: 0 0 0 3px rgba(91, 46, 255, 0.1) !important;
        }
        button:hover {
          transform: translateY(-2px);
          box-shadow: 0 12px 32px rgba(0,0,0,0.15);
        }
        @keyframes slideIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
      <div style={styles.wrapper}>
        <div style={styles.header}>
          <div style={styles.headerContent}>💬 Share Your Feedback</div>
          <button style={styles.backBtn} onClick={() => navigate('/dashboard')} onMouseEnter={(e) => e.target.style.background = 'rgba(255,255,255,0.3)'} onMouseLeave={(e) => e.target.style.background = 'rgba(255,255,255,0.2)'}>
            ← Back
          </button>
        </div>

        <div style={styles.card}>
          {message && <div style={{ ...styles.message, ...(message.includes('✅') ? styles.successMsg : styles.errorMsg) }}>{message}</div>}
          
          {!submitted && (
            <form style={styles.form} onSubmit={handleSubmit}>
              {/* Rating */}
              <div style={styles.field}>
                <label style={styles.label}>How would you rate SafeHere? ⭐</label>
                <div style={styles.stars}>
                  {[1, 2, 3, 4, 5].map((i) => (
                    <span
                      key={i}
                      onClick={() => setRating(i)}
                      style={{ ...styles.star, ...(rating >= i ? styles.starActive : {}) }}
                    >
                      ⭐
                    </span>
                  ))}
                </div>
              </div>

              {/* Feedback Text */}
              <div style={styles.field}>
                <label style={styles.label}>Your Feedback <span style={{color: '#EF4444'}}>*</span></label>
                <textarea
                  style={styles.textarea}
                  placeholder="Share your thoughts, suggestions, or report issues..."
                  value={feedbackText}
                  onChange={(e) => setFeedbackText(e.target.value)}
                  maxLength={500}
                />
                <div style={styles.charCount}>{feedbackText.length}/500 characters</div>
              </div>

              {/* Category */}
              <div style={styles.field}>
                <label style={styles.label}>Feedback Category 📂</label>
                <select style={styles.select} value={category} onChange={(e) => setCategory(e.target.value)}>
                  <option>General</option>
                  <option>Bug Report</option>
                  <option>Feature Request</option>
                  <option>UI/UX Improvement</option>
                  <option>Safety Concern</option>
                </select>
              </div>

              {/* Anonymous Checkbox */}
              <div style={styles.checkbox}>
                <input
                  type="checkbox"
                  id="anon"
                  checked={anonymous}
                  onChange={() => setAnonymous(!anonymous)}
                  style={{ cursor: 'pointer' }}
                />
                <label htmlFor="anon" style={{ cursor: 'pointer', fontSize: '14px', marginBottom: 0 }}>
                  Submit anonymously
                </label>
              </div>

              {/* Submit Button */}
              <button
                style={{ ...styles.button, ...styles.submitBtn }}
                type="submit"
              >
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