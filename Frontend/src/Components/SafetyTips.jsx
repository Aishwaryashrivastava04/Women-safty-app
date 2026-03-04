import React, { useState, useEffect, useRef } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

function SafetyTips() {
  const categories = ["General", "Travel", "Online", "Emergency"];
  const [activeIndex, setActiveIndex] = useState(0);
  const [completedTips, setCompletedTips] = useState(
    JSON.parse(localStorage.getItem("completedTips")) || {}
  );
  const [streak, setStreak] = useState(
    parseInt(localStorage.getItem("safetyStreak")) || 0
  );

  const touchStartX = useRef(null);

  const tipsData = {
    General: [
      "🧠 Trust your instincts. If something feels wrong, leave immediately.",
      "👀 Stay alert in public spaces and avoid distractions.",
      "🤝 Keep trusted contacts informed about your location.",
    ],
    Travel: [
      "🚕 Use verified transport services only.",
      "🗺️ Share live location with family when travelling alone.",
      "💡 Avoid poorly lit or isolated shortcuts.",
    ],
    Online: [
      "🔐 Never share personal information publicly.",
      "📱 Enable two-factor authentication on accounts.",
      "🚫 Block and report suspicious profiles immediately.",
    ],
    Emergency: [
      "📞 Memorize emergency helpline numbers.",
      "📍 Use SOS feature in danger situations.",
      "🛑 Move toward crowded/public areas if threatened.",
    ]
  };

  const activeCategory = categories[activeIndex];
  const tips = tipsData[activeCategory];

  const toggleComplete = (index) => {
    const key = `${activeCategory}-${index}`;
    const updated = { ...completedTips, [key]: !completedTips[key] };
    setCompletedTips(updated);
    localStorage.setItem("completedTips", JSON.stringify(updated));

    if (!completedTips[key]) {
      const newStreak = streak + 1;
      setStreak(newStreak);
      localStorage.setItem("safetyStreak", newStreak);
    }
  };

  const totalTips = Object.keys(tipsData).length * 3;
  const completedCount = Object.values(completedTips).filter(Boolean).length;
  const progress = Math.round((completedCount / totalTips) * 100);

  // 🎬 Smooth Slide Animation
  const slideStyle = {
    transform: `translateX(-${activeIndex * 100}%)`,
    transition: "transform 0.5s ease-in-out",
    display: "flex",
    width: `${categories.length * 100}%`
  };

  // 🎙️ AI Suggestion
  const getSuggestion = () => {
    const remaining = tips.filter((_, i) => !completedTips[`${activeCategory}-${i}`]);
    if (remaining.length > 0) {
      return `💡 Tip Suggestion: ${remaining[0]}`;
    }
    return "🎉 All tips completed in this category!";
  };

  // 📱 Swipe
  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e) => {
    if (!touchStartX.current) return;
    const diff = e.changedTouches[0].clientX - touchStartX.current;

    if (diff > 50 && activeIndex > 0) {
      setActiveIndex(activeIndex - 1);
    } else if (diff < -50 && activeIndex < categories.length - 1) {
      setActiveIndex(activeIndex + 1);
    }
  };

  return (
    <div
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #fff1f2 0%, #ffe4e6 100%)",
        padding: "40px 20px",
        overflow: "hidden"
      }}
    >
      <div className="text-center mb-4">
        <h2 style={{ fontWeight: "800", color: "#dc2626" }}>
          🔒 Women Safety Learning Center
        </h2>
        <p style={{ color: "#6b7280" }}>
          Swipe or tap categories to explore
        </p>
      </div>

      {/* 📈 Circular Progress */}
      <div className="text-center mb-4">
        <div style={{ position: "relative", width: "120px", margin: "0 auto" }}>
          <svg width="120" height="120">
            <circle cx="60" cy="60" r="50" stroke="#fee2e2" strokeWidth="10" fill="none" />
            <circle
              cx="60"
              cy="60"
              r="50"
              stroke="#dc2626"
              strokeWidth="10"
              fill="none"
              strokeDasharray={2 * Math.PI * 50}
              strokeDashoffset={(2 * Math.PI * 50) * (1 - progress / 100)}
              strokeLinecap="round"
              style={{ transition: "stroke-dashoffset 0.6s ease" }}
            />
          </svg>
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              fontWeight: "700",
              color: "#dc2626"
            }}
          >
            {progress}%
          </div>
        </div>
        <div style={{ marginTop: "10px", fontWeight: "600" }}>
          🔥 Daily Streak: {streak}
        </div>
      </div>

      {/* Category Tabs */}
      <div className="d-flex justify-content-center gap-3 mb-4">
        {categories.map((cat, i) => (
          <button
            key={cat}
            onClick={() => setActiveIndex(i)}
            style={{
              padding: "8px 16px",
              borderRadius: "20px",
              border: "none",
              fontWeight: "600",
              background: activeIndex === i ? "#dc2626" : "white",
              color: activeIndex === i ? "white" : "#374151",
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Sliding Content */}
      <div style={{ overflow: "hidden" }}>
        <div style={slideStyle}>
          {categories.map((category, idx) => (
            <div
              key={category}
              style={{
                width: "100%",
                padding: "0 10px"
              }}
            >
              <div
                style={{
                  background: "white",
                  borderRadius: "24px",
                  padding: "30px",
                  boxShadow: "0 15px 40px rgba(0,0,0,0.08)",
                }}
              >
                <h4 style={{ marginBottom: "20px", fontWeight: "700", color: "#991b1b" }}>
                  📌 {category} Safety Tips
                </h4>

                {tipsData[category].map((tip, index) => {
                  const key = `${category}-${index}`;
                  const isDone = completedTips[key];

                  return (
                    <div
                      key={index}
                      style={{
                        padding: "14px 16px",
                        marginBottom: "12px",
                        borderRadius: "14px",
                        background: isDone ? "#dcfce7" : "#fff7f7",
                        border: "1px solid #fee2e2",
                        cursor: "pointer"
                      }}
                      onClick={() => toggleComplete(index)}
                    >
                      {tip} {isDone && "🎖️"}
                    </div>
                  );
                })}

                {activeIndex === idx && (
                  <div style={{ marginTop: "15px", fontWeight: "600", color: "#b91c1c" }}>
                    {getSuggestion()}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default SafetyTips;