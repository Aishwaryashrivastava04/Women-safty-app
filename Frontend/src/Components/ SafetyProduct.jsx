import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";

function SafetyProduct() {
  const navigate = useNavigate();
  const [ratings, setRatings] = useState({});
  const [kit, setKit] = useState([]);
  const [loaded, setLoaded] = useState(false);

  const products = [
    { id: 1, name: "Safety Sidekick Pepper Spray", feature: "Pepper spray with UV dye", price: 399, image: "https://m.media-amazon.com/images/I/61x5J9J3hPL._AC_UL320_.jpg", link: "https://www.amazon.in/s?k=Safety+Sidekick+Pepper+Spray" },
    { id: 2, name: "She’s Birdie Personal Alarm", feature: "130 dB alarm + strobe", price: 899, image: "https://m.media-amazon.com/images/I/71m8jKX5YkL._AC_UL320_.jpg", link: "https://www.amazon.in/s?k=She%27s+Birdie+Personal+Alarm" },
    { id: 3, name: "Sabre Red Pepper Gel", feature: "18 ft range gel", price: 749, image: "https://m.media-amazon.com/images/I/71F0L1W0KBL._AC_UL320_.jpg", link: "https://www.amazon.in/s?k=Sabre+Red+Pepper+Gel" },
    { id: 4, name: "Atomic Bear Tactical Pen", feature: "Kubotan-style pen", price: 599, image: "https://m.media-amazon.com/images/I/61gk+R1C+PL._AC_UL320_.jpg", link: "https://www.amazon.in/s?k=Atomic+Bear+Tactical+Pen" }
  ];

  useEffect(() => {
    const savedKit = JSON.parse(localStorage.getItem("safetyKit") || "[]");
    setKit(savedKit);
    setTimeout(() => setLoaded(true), 200);
  }, []);

  const handleRating = (id, value) => {
    setRatings({ ...ratings, [id]: value });
  };

  const addToKit = (product) => {
    if (kit.find(item => item.id === product.id)) return;
    const updated = [...kit, product];
    setKit(updated);
    localStorage.setItem("safetyKit", JSON.stringify(updated));
  };

  const removeFromKit = (id) => {
    const updated = kit.filter(item => item.id !== id);
    setKit(updated);
    localStorage.setItem("safetyKit", JSON.stringify(updated));
  };

  const sortedProducts = useMemo(() => {
    return [...products].sort((a, b) => (ratings[b.id] || 0) - (ratings[a.id] || 0));
  }, [ratings]);

  // Simulated multi-user rating average
  const getAverageRating = (id) => {
    const base = ratings[id] || 0;
    const simulatedUsers = 3.8 + (id * 0.2);
    return ((base + simulatedUsers) / 2).toFixed(1);
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg,#EEF2FF,#F9FAFB)",
      padding: 40,
      opacity: loaded ? 1 : 0,
      transform: loaded ? "translateY(0)" : "translateY(20px)",
      transition: "all 0.6s ease"
    }}>

      <div style={{ maxWidth: 1200, margin: "0 auto" }}>

        {/* Header */}
        <div style={{
          backdropFilter: "blur(15px)",
          WebkitBackdropFilter: "blur(15px)",
          background: "rgba(255,255,255,0.6)",
          borderRadius: 20,
          padding: 24,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          boxShadow: "0 8px 25px rgba(0,0,0,0.1)"
        }}>
          <h2>🛍️ Smart Safety Store</h2>
          <button onClick={() => navigate("/dashboard")}>← Back</button>
        </div>

        {/* Floating Cart */}
        <div style={{
          position: "fixed",
          top: 20,
          right: 30,
          background: "#5B2EFF",
          color: "white",
          padding: "10px 16px",
          borderRadius: 50,
          boxShadow: "0 6px 18px rgba(0,0,0,0.2)",
          zIndex: 999
        }}>
          🛒 {kit.length}
        </div>

        {/* Safety Kit Section */}
        <div style={{
          marginTop: 30,
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          background: "rgba(255,255,255,0.6)",
          padding: 20,
          borderRadius: 16
        }}>
          <h3>My Safety Kit ({kit.length})</h3>
          {kit.length === 0 ? (
            <p>No items added</p>
          ) : (
            kit.map(item => (
              <div key={item.id} style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                {item.name}
                <button onClick={() => removeFromKit(item.id)} style={{ color: "red" }}>Remove</button>
              </div>
            ))
          )}
        </div>

        {/* Product Grid */}
        <div style={{ marginTop: 30, display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(260px,1fr))", gap: 20 }}>
          {sortedProducts.map(product => (
            <div key={product.id} style={{
              backdropFilter: "blur(12px)",
              WebkitBackdropFilter: "blur(12px)",
              background: "rgba(255,255,255,0.7)",
              padding: 20,
              borderRadius: 18,
              boxShadow: "0 8px 25px rgba(0,0,0,0.08)",
              transition: "all 0.3s ease"
            }}>

              <a href={product.link} target="_blank" rel="noopener noreferrer">
                <img src={product.image} alt={product.name} style={{ width: "100%", borderRadius: 12, marginBottom: 10 }} />
              </a>

              <h4>{product.name}</h4>
              <p style={{ fontSize: 14, opacity: 0.8 }}>{product.feature}</p>
              <div style={{ fontWeight: "bold", color: "#10B981" }}>₹ {product.price}</div>

              {/* Rating */}
              <div>
                {[1,2,3,4,5].map(i => (
                  <span key={i} onClick={() => handleRating(product.id, i)} style={{ cursor: "pointer", color: ratings[product.id] >= i ? "#F59E0B" : "#E5E7EB" }}>⭐</span>
                ))}
              </div>

              <div style={{ marginTop: 6, fontSize: 12 }}>Avg Rating: {getAverageRating(product.id)} ⭐</div>

              <button onClick={() => addToKit(product)} style={{ marginTop: 10, width: "100%", background: "#5B2EFF", color: "white", padding: 8, border: "none", borderRadius: 8 }}>
                Add to Kit
              </button>

            </div>
          ))}
        </div>

      </div>
    </div>
  );
}

export default SafetyProduct;